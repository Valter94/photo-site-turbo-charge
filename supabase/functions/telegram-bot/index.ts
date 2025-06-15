
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { TelegramUpdate } from './types.ts'
import { cleanOldSessions, getSession, setSession, deleteSession } from './session-manager.ts'
import { createTelegramAPI } from './telegram-api.ts'
import { createMenuHandlers } from './menu-handlers.ts'
import { createPortfolioHandlers } from './portfolio-handlers.ts'
import { createPricingHandlers } from './pricing-handlers.ts'
import { createServicesHandlers } from './services-handlers.ts'
import { createLocationsHandlers } from './locations-handlers.ts'
import { createTutorialHandlers } from './tutorial-handlers.ts'
import { createPhotoProcessingHandlers } from './photo-processing-handlers.ts'
import { createScreenshotService } from './screenshot-service.ts'
import { ensureStorageBucket } from './storage-setup.ts'
import { createLogger } from './logger.ts'
import { createBotMonitor } from './bot-monitor.ts'
import { createCacheManager } from './cache-manager.ts'
import { validators } from './validators.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logger = createLogger('TelegramBot')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    cleanOldSessions()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')

    if (!supabaseUrl || !supabaseServiceKey || !botToken) {
      logger.error('Missing environment variables')
      return new Response('Configuration error', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const botMonitor = createBotMonitor(supabase)
    const cache = createCacheManager()
    
    await ensureStorageBucket(supabase)
    
    const telegramAPI = createTelegramAPI(botToken)
    const screenshotService = createScreenshotService()
    const menuHandlers = createMenuHandlers(supabase)
    const portfolioHandlers = createPortfolioHandlers(supabase)
    const pricingHandlers = createPricingHandlers(supabase)
    const servicesHandlers = createServicesHandlers(supabase)
    const locationsHandlers = createLocationsHandlers(supabase)
    const tutorialHandlers = createTutorialHandlers(supabase, telegramAPI)
    const photoProcessingHandlers = createPhotoProcessingHandlers(supabase)

    let update: TelegramUpdate
    try {
      update = await req.json()
    } catch (error) {
      logger.error('JSON parsing error', error)
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders })
    }

    logger.info('Update received', update)

    const message = update.message
    const callbackQuery = update.callback_query

    let chatId: number
    let userId: number
    let messageId: number | undefined

    if (message) {
      chatId = message.chat.id
      userId = message.from.id
    } else if (callbackQuery) {
      chatId = callbackQuery.message.chat.id
      userId = callbackQuery.from.id
      messageId = callbackQuery.message.message_id
    } else {
      return new Response('OK', { headers: corsHeaders })
    }

    // Обработка callback'ов
    if (callbackQuery) {
      await telegramAPI.answerCallback(callbackQuery.id)
      const data = callbackQuery.data
      logger.info('Processing callback', { data, userId })

      await botMonitor.logBotActivity(userId, `callback:${data}`, true)

      // Основные действия добавления
      if (data?.startsWith('add_')) {
        deleteSession(userId)
        
        const type = data.split('_')[1] as 'portfolio' | 'location'
        setSession(userId, {
          step: 'waiting_photo',
          data: {},
          type: type,
          created_at: Date.now()
        })
        
        logger.info('Session created for add action', { userId, type })
        
        await telegramAPI.editMessage(
          chatId,
          messageId!,
          `📸 <b>Шаг 1: Отправьте фото</b>\n\n` +
          `${type === 'portfolio' ? '🎨 Добавляем в портфолио' : '📍 Добавляем локацию'}\n\n` +
          `Просто отправьте фото, которое хотите добавить.`,
          {
            inline_keyboard: [
              [{ text: '❌ Отмена', callback_data: 'cancel' }]
            ]
          }
        )
      }
      // Выбор категории портфолио
      else if (data?.startsWith('portfolio_cat_')) {
        const session = getSession(userId)
        logger.info('Category selection', { userId, sessionExists: !!session, data })
        
        if (session && session.type === 'portfolio' && session.step === 'choosing_category') {
          const categoryMap: { [key: string]: string } = {
            'wedding': 'Свадьба',
            'lovestory': 'Love Story', 
            'portrait': 'Портрет',
            'family': 'Семья',
            'corporate': 'Корпоратив',
            'maternity': 'Материнство'
          }
          
          const category = data.replace('portfolio_cat_', '')
          session.data.category = category
          session.step = 'waiting_description'
          setSession(userId, session)
          
          logger.info('Category selected', { userId, category })
          
          await telegramAPI.editMessage(
            chatId,
            messageId!,
            `📝 <b>Шаг 3: Описание</b>\n\n` +
            `✅ Категория: <b>${categoryMap[category] || category}</b>\n` +
            `🖼 Название: <b>${session.data.title}</b>\n\n` +
            `Теперь отправьте описание для фото (10-500 символов):`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        } else {
          logger.warn('Invalid session for category selection', { userId, session })
          await telegramAPI.editMessage(chatId, messageId!, '❌ Ошибка сессии. Начните заново:', menuHandlers.getMainMenu())
        }
      }
      // Управление портфолио
      else if (data === 'manage_portfolio') {
        try {
          const result = await portfolioHandlers.getPortfolioList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting portfolio', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения портфолио</b>')
        }
      }
      // Удаление фото из портфолио
      else if (data === 'delete_portfolio') {
        try {
          const result = await portfolioHandlers.getDeleteList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting delete list', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка фото</b>')
        }
      }
      // Подтверждение удаления фото
      else if (data?.startsWith('delete_photo_')) {
        const photoId = data.replace('delete_photo_', '')
        try {
          const result = await portfolioHandlers.getPhotoInfo(photoId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting photo info', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения информации о фото</b>')
        }
      }
      // Окончательное удаление фото
      else if (data?.startsWith('confirm_delete_')) {
        const photoId = data.replace('confirm_delete_', '')
        try {
          const result = await portfolioHandlers.deletePhoto(photoId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error deleting photo', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка при удалении фото</b>')
        }
      }
      // Управление локациями
      else if (data === 'manage_locations') {
        try {
          const result = await locationsHandlers.getLocationsList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting locations', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения локаций</b>')
        }
      }
      // Изменение фото локации
      else if (data === 'change_location_photo') {
        try {
          const result = await locationsHandlers.getLocationChangePhotoList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting location photo list', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка локаций</b>')
        }
      }
      // Выбор локации для изменения фото
      else if (data?.startsWith('change_photo_')) {
        const locationId = data.replace('change_photo_', '')
        deleteSession(userId)
        setSession(userId, {
          step: 'waiting_new_photo',
          data: { locationId },
          type: 'location',
          created_at: Date.now()
        })
        
        await telegramAPI.editMessage(
          chatId,
          messageId!,
          `📸 <b>Изменение фото локации</b>\n\nОтправьте новое фото:`,
          {
            inline_keyboard: [
              [{ text: '❌ Отмена', callback_data: 'manage_locations' }]
            ]
          }
        )
      }
      // Удаление локации
      else if (data === 'delete_location') {
        try {
          const result = await locationsHandlers.getDeleteLocationList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting delete location list', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка локаций</b>')
        }
      }
      // Подтверждение удаления локации
      else if (data?.startsWith('delete_location_')) {
        const locationId = data.replace('delete_location_', '')
        try {
          const result = await locationsHandlers.getLocationInfo(locationId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting location info', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения информации о локации</b>')
        }
      }
      // Окончательное удаление локации
      else if (data?.startsWith('confirm_delete_location_')) {
        const locationId = data.replace('confirm_delete_location_', '')
        try {
          const result = await locationsHandlers.deleteLocation(locationId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error deleting location', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка при удалении локации</b>')
        }
      }
      // Управление ценами
      else if (data === 'manage_pricing') {
        try {
          const result = await pricingHandlers.getPricingList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting pricing', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения цен</b>')
        }
      }
      // Редактирование цен
      else if (data === 'edit_pricing') {
        try {
          const result = await pricingHandlers.getEditPricingList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting edit pricing list', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка тарифов</b>')
        }
      }
      // Редактирование конкретной цены
      else if (data?.startsWith('edit_price_')) {
        const priceId = data.replace('edit_price_', '')
        try {
          const result = await pricingHandlers.handlePriceEdit(priceId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting price edit info', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения информации о тарифе</b>')
        }
      }
      // Главное меню
      else if (data === 'main_menu' || data === 'start') {
        await telegramAPI.editMessage(
          chatId,
          messageId!,
          `🤖 <b>Главное меню</b>\n\nВыберите действие:`,
          menuHandlers.getMainMenu()
        )
      }
      // Статистика
      else if (data === 'stats') {
        try {
          const result = await menuHandlers.getStats()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          logger.error('Error getting stats', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения статистики</b>')
        }
      }
      // Отмена операции
      else if (data === 'cancel') {
        deleteSession(userId)
        await telegramAPI.editMessage(
          chatId, 
          messageId!, 
          '❌ <b>Операция отменена</b>\n\nВыберите действие:', 
          menuHandlers.getMainMenu()
        )
      }
      
      return new Response('OK', { headers: corsHeaders })
    }

    // Обработка сообщений
    if (message) {
      const text = message.text || ''
      const photo = message.photo
      const caption = message.caption || ''

      logger.info('Message received', { hasText: !!text, hasPhoto: !!photo, userId })

      // Команда /start
      if (text.startsWith('/start')) {
        await telegramAPI.sendMessage(
          chatId,
          `🤖 <b>Добро пожаловать!</b>\n\nУправляйте контентом сайта через бота:`,
          menuHandlers.getMainMenu()
        )
        return new Response('OK', { headers: corsHeaders })
      }

      // Команда /stats
      if (text.startsWith('/stats')) {
        try {
          const result = await menuHandlers.getStats()
          await telegramAPI.sendMessage(chatId, result.text)
        } catch (error) {
          logger.error('Error getting stats', error)
          await telegramAPI.sendMessage(chatId, '❌ <b>Ошибка получения статистики</b>')
        }
        return new Response('OK', { headers: corsHeaders })
      }

      // Обработка фото
      if (photo && photo.length > 0) {
        const session = getSession(userId)
        logger.info('Photo received', { userId, sessionExists: !!session, sessionType: session?.type, sessionStep: session?.step })
        
        if (session && session.step === 'waiting_photo') {
          const largestPhoto = photo[photo.length - 1]
          session.data.photo_file_id = largestPhoto.file_id
          session.step = 'waiting_title'
          setSession(userId, session)
          
          logger.info('Photo saved, asking for title', { userId, fileId: largestPhoto.file_id })
          
          await telegramAPI.sendMessage(
            chatId,
            `✅ <b>Фото получено!</b>\n\n` +
            `📝 <b>Шаг 2: Название</b>\n\n` +
            `Отправьте название (3-100 символов):`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        }
        else if (session && session.step === 'waiting_new_photo' && session.type === 'location') {
          const largestPhoto = photo[photo.length - 1]
          try {
            const result = await locationsHandlers.updateLocationPhoto(session.data.locationId, largestPhoto.file_id, botToken, supabase)
            await telegramAPI.sendMessage(chatId, result.text, result.keyboard)
            deleteSession(userId)
          } catch (error) {
            logger.error('Error updating location photo', error)
            await telegramAPI.sendMessage(chatId, `❌ <b>Ошибка изменения фото</b>\n\n${error.message}`)
            deleteSession(userId)
          }
        }
        else {
          await telegramAPI.sendMessage(
            chatId,
            `❓ <b>Для добавления фото используйте меню</b>\n\nВыберите "📸 Добавить в портфолио" или "📍 Добавить локацию":`,
            menuHandlers.getMainMenu()
          )
        }
        return new Response('OK', { headers: corsHeaders })
      }

      // Обработка текста
      const session = getSession(userId)
      
      if (!session && !text.startsWith('/')) {
        await telegramAPI.sendMessage(
          chatId,
          `👋 <b>Добро пожаловать!</b>\n\nВыберите действие:`,
          menuHandlers.getMainMenu()
        )
        return new Response('OK', { headers: corsHeaders })
      }

      // Ожидание названия
      if (session && session.step === 'waiting_title') {
        if (!validators.isValidTitle(text)) {
          await telegramAPI.sendMessage(
            chatId,
            `❌ <b>Неверное название</b>\n\nНазвание должно быть от 3 до 100 символов:`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
          return new Response('OK', { headers: corsHeaders })
        }

        session.data.title = validators.sanitizeText(text)
        
        if (session.type === 'portfolio') {
          session.step = 'choosing_category'
          setSession(userId, session)
          
          await telegramAPI.sendMessage(
            chatId,
            `📝 <b>Шаг 3: Категория</b>\n\n` +
            `🖼 Название: <b>${session.data.title}</b>\n\n` +
            `Выберите категорию:`,
            {
              inline_keyboard: [
                [
                  { text: '💒 Свадебная', callback_data: 'portfolio_cat_wedding' },
                  { text: '💕 Love Story', callback_data: 'portfolio_cat_lovestory' }
                ],
                [
                  { text: '👤 Портретная', callback_data: 'portfolio_cat_portrait' },
                  { text: '👨‍👩‍👧‍👦 Семейная', callback_data: 'portfolio_cat_family' }
                ],
                [
                  { text: '🏢 Корпоративная', callback_data: 'portfolio_cat_corporate' },
                  { text: '🤱 Материнство', callback_data: 'portfolio_cat_maternity' }
                ],
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        } else {
          session.step = 'waiting_description'
          setSession(userId, session)
          
          await telegramAPI.sendMessage(
            chatId,
            `📝 <b>Шаг 3: Описание локации</b>\n\n` +
            `📍 Название: <b>${session.data.title}</b>\n\n` +
            `Отправьте описание (10-500 символов):`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        }
      }

      // Ожидание описания
      if (session && session.step === 'waiting_description') {
        if (!validators.isValidDescription(text)) {
          await telegramAPI.sendMessage(
            chatId,
            `❌ <b>Неверное описание</b>\n\nОписание должно быть от 10 до 500 символов:`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
          return new Response('OK', { headers: corsHeaders })
        }

        session.data.description = validators.sanitizeText(text)
        
        try {
          await telegramAPI.sendMessage(chatId, `⏳ <b>Обрабатываем...</b>\n\nЗагружаем фото и сохраняем данные...`)

          // Получение и загрузка файла
          const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${session.data.photo_file_id}`)
          const fileData = await fileResponse.json()
          
          if (!fileData.ok) {
            throw new Error('Не удалось получить файл из Telegram')
          }

          const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
          const imageResponse = await fetch(fileUrl)
          const imageBlob = await imageResponse.blob()
          
          const fileName = `telegram-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
          const storagePath = session.type === 'portfolio' ? `portfolio/${fileName}` : `locations/${fileName}`
          
          // Загрузка в Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(storagePath, imageBlob, {
              contentType: 'image/jpeg',
              cacheControl: '3600'
            })

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(storagePath)

          const imageUrl = urlData.publicUrl

          if (session.type === 'portfolio') {
            // Добавление в портфолио
            const { error: insertError } = await supabase
              .from('portfolio')
              .insert({
                title: session.data.title,
                category: session.data.category,
                description: session.data.description,
                image_url: imageUrl,
                is_featured: false
              })

            if (insertError) throw insertError

            const categoryNames: { [key: string]: string } = {
              'wedding': 'Свадьба',
              'lovestory': 'Love Story',
              'portrait': 'Портрет',
              'family': 'Семья',
              'corporate': 'Корпоратив',
              'maternity': 'Материнство'
            }

            await telegramAPI.sendMessage(
              chatId,
              `✅ <b>Фото добавлено в портфолио!</b>\n\n` +
              `📷 Название: ${session.data.title}\n` +
              `🏷 Категория: ${categoryNames[session.data.category] || session.data.category}\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `🌐 Фото появится на сайте через несколько минут.`,
              menuHandlers.getMainMenu()
            )
          } else {
            // Добавление локации
            const { error: insertError } = await supabase
              .from('photoshoot_locations')
              .insert({
                name: session.data.title,
                description: session.data.description,
                image_url: imageUrl,
                category_id: '00000000-0000-0000-0000-000000000001'
              })

            if (insertError) throw insertError

            await telegramAPI.sendMessage(
              chatId,
              `✅ <b>Локация добавлена!</b>\n\n` +
              `📍 Название: ${session.data.title}\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `🌐 Локация появится на сайте через несколько минут.`,
              menuHandlers.getMainMenu()
            )
          }
          
          deleteSession(userId)
          await botMonitor.logBotActivity(userId, `${session.type}_added`, true)
          
        } catch (error) {
          logger.error('Error processing upload', error)
          await telegramAPI.sendMessage(
            chatId, 
            `❌ <b>Ошибка при сохранении</b>\n\n${error.message}\n\nПопробуйте еще раз:`,
            menuHandlers.getMainMenu()
          )
          deleteSession(userId)
          await botMonitor.logBotActivity(userId, `${session.type}_add_error`, false, { error: error.message })
        }
      }
    }

    return new Response('OK', { headers: corsHeaders })
  } catch (error) {
    logger.error('Critical error', error)
    return new Response(`Error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
