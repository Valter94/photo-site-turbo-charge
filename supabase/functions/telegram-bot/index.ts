
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { TelegramUpdate } from './types.ts'
import { createTelegramAPI } from './telegram-api.ts'
import { createMenuHandlers } from './menu-handlers.ts'
import { createEnhancedPortfolioHandlers } from './enhanced-portfolio-handlers.ts'
import { getSession, setSession, deleteSession, cleanOldSessions } from './enhanced-session-manager.ts'
import { createLogger } from './logger.ts'
import { createBotMonitor } from './bot-monitor.ts'
import { createCacheManager } from './cache-manager.ts'
import { validators } from './validators.ts'
import { progressTracker } from './progress-tracker.ts'

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
    // Периодическая очистка сессий
    cleanOldSessions();
    
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
    
    // Создание bucket для хранения изображений если не существует
    const ensureStorageBucket = async (supabase) => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets()
        const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
        
        if (!imagesBucket) {
          const { error } = await supabase.storage.createBucket('images', { public: true })
          if (error) {
            logger.warn('Failed to create storage bucket', error)
          } else {
            logger.info('Created images storage bucket')
          }
        }
      } catch (error) {
        logger.warn('Storage bucket check failed', error)
      }
    }
    
    await ensureStorageBucket(supabase)
    
    const telegramAPI = createTelegramAPI(botToken)
    
    // Создаем обработчики с использованием зависимостей
    const menuHandlers = createMenuHandlers(supabase)
    const portfolioHandlers = createEnhancedPortfolioHandlers(supabase)
    
    // Создаем пустые обработчики для других функций
    const pricingHandlers = {
      getPricingList: () => ({ text: '💰 <b>Управление ценами временно недоступно</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } }),
      getEditPricingList: () => ({ text: '💰 <b>Редактирование цен временно недоступно</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } }),
      handlePriceEdit: () => ({ text: '💰 <b>Редактирование цены временно недоступно</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } })
    }
    
    const servicesHandlers = {
      getServicesList: () => ({ text: '🛠 <b>Управление услугами временно недоступно</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } })
    }
    
    const locationsHandlers = {
      getLocationsList: () => ({ text: '📍 <b>Управление локациями временно недоступно</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } }),
      getLocationChangePhotoList: () => ({ text: '📸 <b>Изменение фото локаций временно недоступно</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } }),
      updateLocationPhoto: () => ({ text: '📸 <b>Обновление фото временно недоступно</b>' }),
      getDeleteLocationList: () => ({ text: '🗑 <b>Удаление локаций временно недоступно</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } }),
      getLocationInfo: () => ({ text: '📍 <b>Информация о локации временно недоступна</b>', keyboard: { inline_keyboard: [[{ text: '🏠 Главное меню', callback_data: 'main_menu' }]] } }),
      deleteLocation: () => ({ text: '🗑 <b>Удаление локации временно недоступно</b>' })
    }

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
      // Выбор категории портфолио (убрали newborn и corporate)
      else if (data?.startsWith('portfolio_cat_')) {
        const session = getSession(userId)
        logger.info('Category selection', { userId, sessionExists: !!session, data })
        
        if (session && session.type === 'portfolio' && session.step === 'choosing_category') {
          const categoryMap: { [key: string]: string } = {
            'wedding': 'Свадьба',
            'lovestory': 'Love Story', 
            'portrait': 'Портрет',
            'family': 'Семья',
            'maternity': 'Материнство',
            'event': 'Мероприятие'
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
      // Помощь - ИСПРАВЛЕНО: добавляем обработку помощи
      else if (data === 'help') {
        await telegramAPI.editMessage(
          chatId,
          messageId!,
          `❓ <b>Помощь по боту</b>\n\n` +
          `🤖 <b>Как использовать бота:</b>\n\n` +
          `📸 <b>Добавить фото:</b>\n` +
          `1. Выберите "Добавить в портфолио"\n` +
          `2. Отправьте фото\n` +
          `3. Введите название\n` +
          `4. Выберите категорию\n` +
          `5. Добавьте описание\n\n` +
          `📍 <b>Добавить локацию:</b>\n` +
          `1. Выберите "Добавить локацию"\n` +
          `2. Отправьте фото места\n` +
          `3. Введите название\n` +
          `4. Добавьте описание\n\n` +
          `🗑 <b>Удалить фото:</b>\n` +
          `1. "Управление портфолио"\n` +
          `2. "Удалить фото"\n` +
          `3. Выберите фото для удаления\n\n` +
          `💡 <b>Совет:</b> Всегда используйте кнопки для навигации!`,
          {
            inline_keyboard: [
              [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
          }
        )
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
        logger.info('Photo received', { 
          userId, 
          sessionExists: !!session, 
          sessionType: session?.type, 
          sessionStep: session?.step,
          photoCount: photo.length
        })
        
        if (session && session.step === 'waiting_photo') {
          const largestPhoto = photo[photo.length - 1]
          session.data.photo_file_id = largestPhoto.file_id
          session.step = 'waiting_title'
          setSession(userId, session)
          
          logger.info('Photo saved to session, requesting title', { userId, fileId: largestPhoto.file_id })
          
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
        else {
          logger.info('Photo received without active session or wrong step')
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
          
          logger.info('Title saved, showing category selection', { userId, title: session.data.title })
          
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
                  { text: '🤱 Материнство', callback_data: 'portfolio_cat_maternity' },
                  { text: '🎉 Мероприятие', callback_data: 'portfolio_cat_event' }
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

          // Проверяем наличие file_id
          if (!session.data.photo_file_id) {
            throw new Error('Файл фото не найден в сессии')
          }

          logger.info('Processing photo upload', { 
            userId, 
            fileId: session.data.photo_file_id,
            type: session.type,
            title: session.data.title
          })

          // Получение и загрузка файла из Telegram
          const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${session.data.photo_file_id}`)
          const fileData = await fileResponse.json()
          
          if (!fileData.ok) {
            logger.error('Failed to get file from Telegram', fileData)
            throw new Error(`Не удалось получить файл из Telegram: ${fileData.description}`)
          }

          const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
          logger.info('Downloading file from Telegram', { fileUrl })
          
          const imageResponse = await fetch(fileUrl)
          if (!imageResponse.ok) {
            throw new Error(`Не удалось скачать файл: HTTP ${imageResponse.status}`)
          }
          
          const imageBlob = await imageResponse.blob()
          logger.info('File downloaded', { size: imageBlob.size, type: imageBlob.type })
          
          const fileName = `telegram-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
          const storagePath = session.type === 'portfolio' ? `portfolio/${fileName}` : `locations/${fileName}`
          
          // Загрузка в Supabase Storage
          logger.info('Uploading to Supabase Storage', { storagePath })
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(storagePath, imageBlob, {
              contentType: 'image/jpeg',
              cacheControl: '3600'
            })

          if (uploadError) {
            logger.error('Supabase upload error', uploadError)
            throw new Error(`Ошибка загрузки в хранилище: ${uploadError.message}`)
          }

          logger.info('File uploaded successfully', uploadData)

          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(storagePath)

          const imageUrl = urlData.publicUrl
          logger.info('Got public URL', { imageUrl })

          if (session.type === 'portfolio') {
            // Добавление в портфолио
            const portfolioData = {
              title: session.data.title,
              category: session.data.category,
              description: session.data.description,
              image_url: imageUrl,
              is_featured: false
            }
            
            logger.info('Inserting portfolio data', portfolioData)
            const { error: insertError } = await supabase
              .from('portfolio')
              .insert(portfolioData)

            if (insertError) {
              logger.error('Portfolio insert error', insertError)
              throw new Error(`Ошибка сохранения в портфолио: ${insertError.message}`)
            }

            const categoryNames: { [key: string]: string } = {
              'wedding': 'Свадьба',
              'lovestory': 'Love Story',
              'portrait': 'Портрет',
              'family': 'Семья',
              'maternity': 'Материнство',
              'event': 'Мероприятие'
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
            const locationData = {
              name: session.data.title,
              description: session.data.description,
              image_url: imageUrl,
              category_id: '00000000-0000-0000-0000-000000000001'
            }
            
            logger.info('Inserting location data', locationData)
            const { error: insertError } = await supabase
              .from('photoshoot_locations')
              .insert(locationData)

            if (insertError) {
              logger.error('Location insert error', insertError)
              throw new Error(`Ошибка сохранения локации: ${insertError.message}`)
            }

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
