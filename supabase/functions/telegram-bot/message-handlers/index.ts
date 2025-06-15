
// Главный messageHandler для Telegram, делегирует в зависимости от входящего сообщения
import { processStart } from './processStart.ts'
import { processPhoto } from './processPhoto.ts'
import { processTitle } from './processTitle.ts'
import { processDescription } from './processDescription.ts'
import { processFallback } from './processFallback.ts'

export const createMessageHandlers = (deps: any) => {
  return async function handleMessage({ message, chatId, userId }: any) {
    try {
      const text = message.text || ''
      const photo = message.photo

      console.log('[TelegramBot] handleMessage START', { chatId, userId, text: text?.slice?.(0, 32), hasPhoto: !!photo });

      if (text.startsWith('/start')) {
        console.log('Получена команда /start. Передаём в processStart');
        await processStart(deps, { chatId });
        return;
      }

      if (text.startsWith('/stats')) {
        const result = await deps.menuHandlers.getStats();
        await deps.telegramAPI.sendMessage(chatId, result.text);
        return;
      }

      if (photo && photo.length > 0) {
        console.log('Получено фото, передаём в processPhoto');
        await processPhoto(deps, { message, chatId, userId });
        return;
      }

      const session = deps.getSession(userId);
      if (session) {
        console.log('[TelegramBot] Обнаружена сессия пользователя:', session.step);
        switch (session.step) {
          case 'waiting_title':
            await processTitle(deps, { message, chatId, userId });
            return;
          case 'waiting_description':
            await processDescription(deps, { message, chatId, userId });
            return;
          default:
            console.log('[TelegramBot] Неучтённый step сессии:', session.step);
            await processFallback(deps, { message, chatId, userId });
            return;
        }
      } else if (!text.startsWith('/')) {
        // Сообщение не команда, нет сессии — показываем главное меню
        console.log('[TelegramBot] Не команда и нет сессии, вызывается processFallback');
        await processFallback(deps, { message, chatId, userId });
        return;
      } else {
        // Лишний случай — неизвестная команда
        console.log('[TelegramBot] Неизвестная команда:', text);
        await deps.telegramAPI.sendMessage(
          chatId,
          `❓ Неизвестная команда. Нажмите /start для главного меню.`
        );
      }
    } catch (error) {
      console.error('[TelegramBot] handleMessage Uncaught error:', error, { chatId, userId });
      try {
        await deps.telegramAPI.sendMessage(
          chatId,
          '❌ Произошла ошибка. Попробуйте снова или обратитесь к администратору.'
        );
      } catch (e2) {
        console.error('Ошибка при отправке error-message в handleMessage', e2);
      }
    }
  }
}
