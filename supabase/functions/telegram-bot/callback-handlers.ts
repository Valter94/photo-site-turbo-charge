
import { createLogger } from './logger.ts'

const logger = createLogger('CallbackHandlers')

export const createCallbackHandlers = (deps: any) => {
  return async function handleCallback({ callbackQuery, chatId, userId, messageId }: any) {
    const { telegramAPI, menuHandlers, portfolioHandlers, locationsHandlers, getSession, setSession, deleteSession } = deps
    const callbackData = callbackQuery.data

    console.log('[CallbackHandlers] Обработка callback:', callbackData)

    try {
      // Отвечаем на callback query
      await deps.telegramAPI.answerCallback(callbackQuery.id)

      // Обработка главного меню
      if (callbackData === 'main_menu') {
        const mainMenu = menuHandlers.getMainMenu()
        await telegramAPI.editMessage(chatId, messageId, mainMenu.text, mainMenu.keyboard)
        return
      }

      // Управление портфолио
      if (callbackData === 'manage_portfolio') {
        const portfolioList = await portfolioHandlers.getPortfolioList()
        await telegramAPI.editMessage(chatId, messageId, portfolioList.text, portfolioList.keyboard)
        return
      }

      // Добавление фото в портфолио
      if (callbackData === 'add_portfolio') {
        const session = {
          step: 'waiting_photo',
          action_type: 'add_portfolio',
          data: {},
          created_at: new Date().toISOString()
        }
        setSession(userId, session)
        
        await telegramAPI.editMessage(
          chatId,
          messageId,
          `📸 <b>Добавление фото в портфолио</b>\n\n` +
          `<b>Шаг 1: Отправьте фото</b>\n` +
          `📤 Пришлите фотографию, которую хотите добавить в портфолио.\n\n` +
          `💡 <i>Фото будет автоматически сохранено и станет доступно на сайте</i>`,
          {
            inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
          }
        )
        return
      }

      // Выбор категории для портфолио
      if (callbackData.startsWith('category_')) {
        const session = getSession(userId)
        if (!session || session.step !== 'waiting_category') {
          await telegramAPI.editMessage(chatId, messageId, '❌ Сессия истекла. Начните заново.', menuHandlers.getMainMenu().keyboard)
          return
        }

        const categoryMap = {
          'category_wedding': 'wedding',
          'category_portrait': 'portrait',
          'category_family': 'family',
          'category_lovestory': 'lovestory',
          'category_corporate': 'corporate',
          'category_maternity': 'maternity'
        }

        const categoryLabels = {
          'wedding': 'Свадебная съемка',
          'portrait': 'Портретная съемка',
          'family': 'Семейная фотосессия',
          'lovestory': 'Love Story',
          'corporate': 'Корпоративная съемка',
          'maternity': 'Материнство'
        }

        const category = categoryMap[callbackData as keyof typeof categoryMap]
        session.data.category = category
        session.step = 'waiting_description'
        setSession(userId, session)

        await telegramAPI.editMessage(
          chatId,
          messageId,
          `✅ <b>Категория выбрана:</b> ${categoryLabels[category as keyof typeof categoryLabels]}\n\n` +
          `<b>Шаг 4: Введите описание</b>\n` +
          `📝 Опишите фотографию (10–500 символов):`,
          {
            inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
          }
        )
        return
      }

      // Добавление локации
      if (callbackData === 'add_location') {
        const session = {
          step: 'waiting_photo',
          action_type: 'add_location',
          data: {},
          created_at: new Date().toISOString()
        }
        setSession(userId, session)
        
        await telegramAPI.editMessage(
          chatId,
          messageId,
          `📍 <b>Добавление локации</b>\n\n` +
          `<b>Шаг 1: Отправьте фото</b>\n` +
          `📤 Пришлите фотографию локации для фотосессии.\n\n` +
          `💡 <i>Фото будет сохранено и станет доступно в разделе локаций</i>`,
          {
            inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
          }
        )
        return
      }

      // Удаление фотографий
      if (callbackData === 'delete_portfolio') {
        const deleteList = await portfolioHandlers.getDeleteList()
        await telegramAPI.editMessage(chatId, messageId, deleteList.text, deleteList.keyboard)
        return
      }

      if (callbackData.startsWith('delete_photo_')) {
        const photoId = callbackData.replace('delete_photo_', '')
        const photoInfo = await portfolioHandlers.getPhotoInfo(photoId)
        await telegramAPI.editMessage(chatId, messageId, photoInfo.text, photoInfo.keyboard)
        return
      }

      if (callbackData.startsWith('confirm_delete_')) {
        const photoId = callbackData.replace('confirm_delete_', '')
        const result = await portfolioHandlers.deletePhoto(photoId)
        await telegramAPI.editMessage(chatId, messageId, result.text, result.keyboard)
        return
      }

      // Статистика
      if (callbackData === 'stats') {
        const stats = await menuHandlers.getStats()
        await telegramAPI.editMessage(chatId, messageId, stats.text, stats.keyboard)
        return
      }

      // Отмена
      if (callbackData === 'cancel') {
        deleteSession(userId)
        const mainMenu = menuHandlers.getMainMenu()
        await telegramAPI.editMessage(chatId, messageId, '❌ Действие отменено.\n\n' + mainMenu.text, mainMenu.keyboard)
        return
      }

      // Неизвестный callback
      console.log('[CallbackHandlers] Неизвестный callback:', callbackData)
      await telegramAPI.editMessage(chatId, messageId, '❌ Неизвестная команда.', menuHandlers.getMainMenu().keyboard)

    } catch (error) {
      logger.error('Error handling callback', error)
      await telegramAPI.sendMessage(chatId, '❌ Произошла ошибка. Попробуйте снова.')
    }
  }
}
