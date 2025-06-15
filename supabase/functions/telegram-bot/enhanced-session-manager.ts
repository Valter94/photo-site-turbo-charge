
import { UserSession } from './types.ts'

// Улучшенное управление сессиями с автоочисткой и валидацией
const userSessions = new Map<number, UserSession>();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 минут
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Очистка каждые 5 минут

// Автоматическая очистка старых сессий
let cleanupTimer: number | null = null;

const startCleanupTimer = () => {
  if (cleanupTimer) return;
  
  cleanupTimer = setInterval(() => {
    cleanOldSessions();
  }, CLEANUP_INTERVAL);
};

const stopCleanupTimer = () => {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
};

export const cleanOldSessions = () => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [userId, session] of userSessions.entries()) {
    if (now - session.created_at > SESSION_TIMEOUT) {
      userSessions.delete(userId);
      cleaned++;
      console.log(`🧹 Удалена старая сессия пользователя ${userId}`);
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Очищено ${cleaned} старых сессий`);
  }
};

export const getSession = (userId: number): UserSession | undefined => {
  const session = userSessions.get(userId);
  
  if (!session) return undefined;
  
  // Проверяем, не истекла ли сессия
  if (Date.now() - session.created_at > SESSION_TIMEOUT) {
    userSessions.delete(userId);
    console.log(`⏰ Сессия пользователя ${userId} истекла`);
    return undefined;
  }
  
  return session;
};

export const setSession = (userId: number, session: UserSession): void => {
  session.created_at = Date.now();
  userSessions.set(userId, session);
  console.log(`💾 Сессия обновлена для пользователя ${userId}, шаг: ${session.step}`);
  
  // Запускаем таймер очистки если еще не запущен
  startCleanupTimer();
};

export const deleteSession = (userId: number): void => {
  const deleted = userSessions.delete(userId);
  if (deleted) {
    console.log(`🗑️ Сессия удалена для пользователя ${userId}`);
  }
  
  // Останавливаем таймер если нет активных сессий
  if (userSessions.size === 0) {
    stopCleanupTimer();
  }
};

export const updateSessionStep = (userId: number, step: string, data?: any): boolean => {
  const session = getSession(userId);
  if (!session) return false;
  
  session.step = step;
  if (data) {
    session.data = { ...session.data, ...data };
  }
  
  setSession(userId, session);
  return true;
};

export const getSessionStats = () => {
  return {
    totalSessions: userSessions.size,
    activeSessions: Array.from(userSessions.entries()).filter(([_, session]) => 
      Date.now() - session.created_at < SESSION_TIMEOUT
    ).length
  };
};

// Graceful shutdown
addEventListener('beforeunload', () => {
  stopCleanupTimer();
  console.log('🛑 Менеджер сессий остановлен');
});
