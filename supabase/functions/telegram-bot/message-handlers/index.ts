
// Главный messageHandler для Telegram, делегирует в зависимости от входящего сообщения
import { processStart } from './processStart.ts'
import { processPhoto } from './processPhoto.ts'
import { processTitle } from './processTitle.ts'
import { processDescription } from './processDescription.ts'
import { processFallback } from './processFallback.ts'

export const createMessageHandlers = (deps: any) => {
  return async function handleMessage({ message, chatId, userId }: any) {
    const text = message.text || ''
    const photo = message.photo

    if (text.startsWith('/start')) {
      console.log('Получена команда /start');
      return processStart(deps, { chatId })
    }

    if (text.startsWith('/stats')) {
      const result = await deps.menuHandlers.getStats()
      await deps.telegramAPI.sendMessage(chatId, result.text)
      return
    }

    if (photo && photo.length > 0) {
      console.log('Получено фото, передаём в processPhoto');
      return processPhoto(deps, { message, chatId, userId })
    }

    const session = deps.getSession(userId)
    if (session) {
      switch (session.step) {
        case 'waiting_title':
          return processTitle(deps, { message, chatId, userId })
        case 'waiting_description':
          return processDescription(deps, { message, chatId, userId })
        default:
          return processFallback(deps, { message, chatId, userId })
      }
    } else if (!text.startsWith('/')) {
      return processFallback(deps, { message, chatId, userId })
    }
  }
}
