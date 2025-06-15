
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { UserSession } from './types.ts'

// Сессия считается истекшей, если не обновлялась 30 минут
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Получает сессию пользователя из базы данных.
 */
export const getSession = async (supabase: SupabaseClient, userId: number): Promise<UserSession | undefined> => {
  const { data, error } = await supabase
    .from('telegram_sessions')
    .select('session_data, updated_at')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // Игнорируем ошибку "не найдено строк"
    console.error(`[DBSession] Ошибка при получении сессии для ${userId}:`, error);
    return undefined;
  }

  if (!data) {
    return undefined;
  }

  // Проверяем, не истекла ли сессия по времени
  const sessionAge = Date.now() - new Date(data.updated_at).getTime();
  if (sessionAge > SESSION_TIMEOUT_MS) {
    console.log(`[DBSession] Сессия для пользователя ${userId} истекла. Удаляем.`);
    await deleteSession(supabase, userId);
    return undefined;
  }

  return data.session_data as UserSession;
};

/**
 * Сохраняет (или обновляет) сессию пользователя в базе данных.
 */
export const setSession = async (supabase: SupabaseClient, userId: number, session: UserSession): Promise<void> => {
  const newSessionData = {
    ...session,
    created_at: session.created_at || Date.now(), // Устанавливаем время создания, если его нет
  };

  const { error } = await supabase
    .from('telegram_sessions')
    .upsert({
        user_id: userId,
        session_data: newSessionData,
        updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error(`[DBSession] Ошибка при сохранении сессии для ${userId}:`, error);
    throw new Error(`Не удалось сохранить сессию: ${error.message}`);
  }
};

/**
 * Удаляет сессию пользователя из базы данных.
 */
export const deleteSession = async (supabase: SupabaseClient, userId: number): Promise<void> => {
  const { error } = await supabase
    .from('telegram_sessions')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error(`[DBSession] Ошибка при удалении сессии для ${userId}:`, error);
  }
};

/**
 * Удаляет все старые сессии из базы данных.
 */
export const cleanOldSessions = async (supabase: SupabaseClient) => {
  const thirtyMinutesAgo = new Date(Date.now() - SESSION_TIMEOUT_MS).toISOString();
  
  const { error, count } = await supabase
    .from('telegram_sessions')
    .delete({ count: 'exact' })
    .lt('updated_at', thirtyMinutesAgo);

  if (error) {
    console.error('[DBSession] Ошибка при очистке старых сессий:', error);
  } else if (count && count > 0) {
    console.log(`[DBSession] 🧹 Удалено ${count} старых сессий.`);
  }
};
