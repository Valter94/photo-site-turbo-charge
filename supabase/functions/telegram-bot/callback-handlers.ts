import { createBotMonitor } from './bot-monitor.ts'
import { createLogger } from './logger.ts'
import { getSession, setSession, deleteSession } from './enhanced-session-manager.ts'

export const createCallbackHandlers = (deps: any) => {
  const { telegramAPI, supabase, menuHandlers, portfolioHandlers, locationsHandlers, botMonitor } = deps
  const logger = createLogger('CallbackHandlers')

  return async function handleCallbackQuery({ callbackQuery, chatId, userId, messageId }: any) {
    await telegramAPI.answerCallback(callbackQuery.id)
    const data = callbackQuery.data

    logger.info('Processing callback', { data, userId })

    try {
      await botMonitor.logBotActivity(userId, `callback:${data}`, true)

      // --- Стандартные callback...
      if (data?.startsWith('add_')) {
        deleteSession(userId)
        const type = data.split('_')[1] as 'portfolio' | 'location'
        setSession(userId, {
          step: 'waiting_photo',
          data: {},
          type,
          created_at: Date.now()
        })

        const typeText = type === 'portfolio'
          ? '🎨 Добавляем в портфолио'
          : '📍 Добавляем локацию'

        await telegramAPI.editMessage(
          chatId,
          messageId,
          `📸 <b>Шаг 1: Отправьте фото</b>\n\n${typeText}\n\nПожалуйста, прикрепите фото, которое хотите добавить.`,
          {
            inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
          }
        )
        return
      }

      // --- Категория портфолио (после названия) ---
      else if (data?.startsWith('portfolio_cat_')) {
        const session = getSession(userId)
        if (session && session.type === 'portfolio' && session.step === 'choosing_category') {
          const categoryMap: { [key: string]: string } = {
            'wedding': 'Свадебная фотосессия',
            'lovestory': 'Love Story',
            'portrait': 'Портрет',
            'family': 'Семья',
            'event': 'Мероприятие'
          }
          const category = data.replace('portfolio_cat_', '')
          session.data.category = category
          session.step = 'waiting_description'
          setSession(userId, session)
          await telegramAPI.editMessage(
            chatId,
            messageId,
            `📝 <b>Шаг 3: Описание</b>\n\n` +
            `✅ Категория: <b>${categoryMap[category] || category}</b>\n` +
            `🖼 Название: <b>${session.data.title}</b>\n\n` +
            `Отправьте описание (10-500 символов):`,
            {
              inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
            }
          )
          return
        } else {
          deleteSession(userId)
          await telegramAPI.editMessage(chatId, messageId, '❌ Ошибка сессии. Начните заново:', menuHandlers.getMainMenu())
          return
        }
      }

      // Portfolio management
      else if (data === 'manage_portfolio') {
        const result = await portfolioHandlers.getPortfolioList()
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      else if (data === 'delete_portfolio') {
        const result = await portfolioHandlers.getDeleteList()
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      else if (data?.startsWith('delete_photo_')) {
        const photoId = data.replace('delete_photo_', '')
        const result = await portfolioHandlers.getPhotoInfo(photoId)
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      else if (data?.startsWith('confirm_delete_')) {
        const photoId = data.replace('confirm_delete_', '')
        const result = await portfolioHandlers.deletePhoto(photoId)
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      // Location management - FIXED
      else if (data === 'manage_locations') {
        const result = await locationsHandlers.getLocationsList()
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      else if (data === 'delete_location') {
        const result = await locationsHandlers.getDeleteLocationList()
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      else if (data?.startsWith('delete_location_')) {
        const locationId = data.replace('delete_location_', '')
        const result = await locationsHandlers.getLocationInfo(locationId)
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      else if (data?.startsWith('confirm_delete_location_')) {
        const locationId = data.replace('confirm_delete_location_', '')
        const result = await locationsHandlers.deleteLocation(locationId)
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      else if (data === 'change_location_photo') {
        const result = await locationsHandlers.getLocationChangePhotoList()
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      // Main menu
      else if (data === 'main_menu' || data === 'start') {
        await telegramAPI.editMessage(
          chatId,
          messageId,
          `🤖 <b>Главное меню</b>\n\nВыберите действие:`,
          menuHandlers.getMainMenu()
        )
      }
      // Stats
      else if (data === 'stats') {
        const result = await menuHandlers.getStats()
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
      }
      // Help - FIXED
      else if (data === 'help') {
        await telegramAPI.editMessage(
          chatId,
          messageId,
          `❓ <b>Помощь по боту</b>\n\n` +
          `🤖 <b>Как использовать:</b>\n\n` +
          `📸 <b>Добавить фото в портфолио:</b>\n` +
          `1. "Добавить в портфолио"\n` +
          `2. Отправьте фото\n` +
          `3. Введите название\n` +
          `4. Выберите категорию\n` +
          `5. Добавьте описание\n\n` +
          `📍 <b>Добавить локацию:</b>\n` +
          `1. "Добавить локацию"\n` +
          `2. Отправьте фото места\n` +
          `3. Введите название\n` +
          `4. Добавьте описание\n\n` +
          `🗑 <b>Удалить:</b>\n` +
          `Используйте соответствующие разделы управления\n\n` +
          `💡 <b>Совет:</b> Всегда используйте кнопки!`,
          {
            inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]]
          }
        )
      }
      // Cancel
      else if (data === 'cancel') {
        deleteSession(userId)
        await telegramAPI.editMessage(
          chatId,
          messageId,
          '❌ <b>Операция отменена</b>\n\nВыберите действие:',
          menuHandlers.getMainMenu()
        )
      }
      // Fallback for unhandled callbacks
      else {
        logger.warn('Unhandled callback', { data })
        await telegramAPI.editMessage(
          chatId,
          messageId,
          '❓ <b>Неизвестная команда</b>\n\nВыберите действие:',
          menuHandlers.getMainMenu()
        )
      }
    } catch (error) {
      logger.error('Callback processing error', error)
      await telegramAPI.editMessage(
        chatId,
        messageId,
        '❌ <b>Произошла ошибка</b>\n\nПопробуйте еще раз:',
        menuHandlers.getMainMenu()
      )
    }
  }
}
