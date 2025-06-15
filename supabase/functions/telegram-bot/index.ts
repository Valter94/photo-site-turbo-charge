import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { TelegramUpdate } from './types.ts'
import { createTelegramAPI } from './telegram-api.ts'
import { createMenuHandlers } from './menu-handlers.ts'
import { createEnhancedPortfolioHandlers } from './enhanced-portfolio-handlers.ts'
import { createLocationsHandlers } from './locations-handlers.ts'
import { getSession, setSession, deleteSession, cleanOldSessions } from './enhanced-session-manager.ts'
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
    
    // Ensure storage bucket exists
    const ensureStorageBucket = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets()
        const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
        
        if (!imagesBucket) {
          const { error } = await supabase.storage.createBucket('images', { public: true })
          if (error) logger.warn('Failed to create storage bucket', error)
          else logger.info('Created images storage bucket')
        }
      } catch (error) {
        logger.warn('Storage bucket check failed', error)
      }
    }
    
    await ensureStorageBucket()
    
    const telegramAPI = createTelegramAPI(botToken)
    const menuHandlers = createMenuHandlers(supabase)
    const portfolioHandlers = createEnhancedPortfolioHandlers(supabase)
    const locationsHandlers = createLocationsHandlers(supabase)

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

    // --- CALLBACKS (главное меню и "добавить" обработка) ---
    if (callbackQuery) {
      await telegramAPI.answerCallback(callbackQuery.id)
      const data = callbackQuery.data
      logger.info('Processing callback', { data, userId })

      try {
        await botMonitor.logBotActivity(userId, `callback:${data}`, true)

        // "Добавить" — создаём чёткую сессию
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

          const typeText = type === 'portfolio' ? '🎨 Добавляем в портфолио' : '📍 Добавляем локацию'
          await telegramAPI.editMessage(
            chatId,
            messageId!,
            `📸 <b>Шаг 1: Отправьте фото</b>\n\n${typeText}\n\nОтправьте фото, которое хотите добавить.`,
            {
              inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
            }
          )
        }
        // Категория портфолио (после ввода названия)
        else if (data?.startsWith('portfolio_cat_')) {
          const session = getSession(userId)
          if (session && session.type === 'portfolio' && session.step === 'choosing_category') {
            const categoryMap: { [key: string]: string } = {
              'wedding': 'Свадьба',
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
              messageId!,
              `📝 <b>Шаг 3: Описание</b>\n\n` +
              `✅ Категория: <b>${categoryMap[category] || category}</b>\n` +
              `🖼 Название: <b>${session.data.title}</b>\n\n` +
              `Отправьте описание (10-500 символов):`,
              {
                inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
              }
            )
          } else {
            await telegramAPI.editMessage(chatId, messageId!, '❌ Ошибка сессии. Начните заново:', menuHandlers.getMainMenu())
          }
        }
        // Portfolio management
        else if (data === 'manage_portfolio') {
          const result = await portfolioHandlers.getPortfolioList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        else if (data === 'delete_portfolio') {
          const result = await portfolioHandlers.getDeleteList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        else if (data?.startsWith('delete_photo_')) {
          const photoId = data.replace('delete_photo_', '')
          const result = await portfolioHandlers.getPhotoInfo(photoId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        else if (data?.startsWith('confirm_delete_')) {
          const photoId = data.replace('confirm_delete_', '')
          const result = await portfolioHandlers.deletePhoto(photoId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        // Location management - FIXED
        else if (data === 'manage_locations') {
          const result = await locationsHandlers.getLocationsList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        else if (data === 'delete_location') {
          const result = await locationsHandlers.getDeleteLocationList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        else if (data?.startsWith('delete_location_')) {
          const locationId = data.replace('delete_location_', '')
          const result = await locationsHandlers.getLocationInfo(locationId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        else if (data?.startsWith('confirm_delete_location_')) {
          const locationId = data.replace('confirm_delete_location_', '')
          const result = await locationsHandlers.deleteLocation(locationId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        else if (data === 'change_location_photo') {
          const result = await locationsHandlers.getLocationChangePhotoList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        // Main menu
        else if (data === 'main_menu' || data === 'start') {
          await telegramAPI.editMessage(
            chatId,
            messageId!,
            `🤖 <b>Главное меню</b>\n\nВыберите действие:`,
            menuHandlers.getMainMenu()
          )
        }
        // Stats
        else if (data === 'stats') {
          const result = await menuHandlers.getStats()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        }
        // Help - FIXED
        else if (data === 'help') {
          await telegramAPI.editMessage(
            chatId,
            messageId!,
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
            messageId!, 
            '❌ <b>Операция отменена</b>\n\nВыберите действие:', 
            menuHandlers.getMainMenu()
          )
        }
        // Fallback for unhandled callbacks
        else {
          logger.warn('Unhandled callback', { data })
          await telegramAPI.editMessage(
            chatId,
            messageId!,
            '❓ <b>Неизвестная команда</b>\n\nВыберите действие:',
            menuHandlers.getMainMenu()
          )
        }
      } catch (error) {
        logger.error('Callback processing error', error)
        await telegramAPI.editMessage(
          chatId,
          messageId!,
          '❌ <b>Произошла ошибка</b>\n\nПопробуйте еще раз:',
          menuHandlers.getMainMenu()
        )
      }
      return new Response('OK', { headers: corsHeaders })
    }

    // --- HANDLE MESSAGES (фото и текст) ---
    if (message) {
      const text = message.text || ''
      const photo = message.photo

      logger.info('Message received', { hasText: !!text, hasPhoto: !!photo, userId })

      // --- /start
      if (text.startsWith('/start')) {
        await telegramAPI.sendMessage(
          chatId,
          `🤖 <b>Добро пожаловать!</b>\n\nУправляйте контентом сайта через бота:`,
          menuHandlers.getMainMenu()
        )
        return new Response('OK', { headers: corsHeaders })
      }

      // --- /stats
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

      // --- ФОТО (CRITICAL FIX+ДРУЖЕЛЮБНОСТЬ+ПРОВЕРКА ШАГОВ) ---
      if (photo && photo.length > 0) {
        let session = getSession(userId)

        logger.info('Photo received', {
          userId,
          sessionExists: !!session,
          sessionType: session?.type,
          sessionStep: session?.step
        })

        if (!session) {
          // user отправил фото без сессии — подскажем начать с меню
          await telegramAPI.sendMessage(
            chatId,
            `📸 <b>Чтобы добавить фото, воспользуйтесь меню:</b>\n\n` +
            `1️⃣ Нажмите "📸 Добавить в портфолио" или "📍 Добавить локацию"\n` +
            `2️⃣ Затем отправьте фото сюда 👆\n\n` +
            `Выберите действие:`,
            menuHandlers.getMainMenu()
          )
          return new Response('OK', { headers: corsHeaders })
        }

        // Приняты только на этапе ожидания фото:
        if (session.step !== 'waiting_photo') {
          await telegramAPI.sendMessage(
            chatId,
            `❌ <b>Сейчас не требуется фото.</b>\n\nСледуйте инструкции. Если вы хотите начать заново — выберите действие в меню:`,
            menuHandlers.getMainMenu()
          )
          return new Response('OK', { headers: corsHeaders })
        }

        // Всё ок, двигаем дальше
        const largestPhoto = photo[photo.length - 1]
        session.data.photo_file_id = largestPhoto.file_id
        session.step = 'waiting_title'
        setSession(userId, session)

        logger.info('Photo saved to session', { userId, fileId: largestPhoto.file_id })

        await telegramAPI.sendMessage(
          chatId,
          `✅ <b>Фото принято!</b>\n\n` +
          `📝 <b>Шаг 2: Введите название</b>\n\n` +
          `Пожалуйста, отправьте название (3-100 символов):`,
          {
            inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
          }
        )
        return new Response('OK', { headers: corsHeaders })
      }

      // --- ОБРАБОТКА ТЕКСТА В РАМКАХ СЕССИИ ---
      let session = getSession(userId)

      if (!session && !text.startsWith('/')) {
        await telegramAPI.sendMessage(
          chatId,
          `👋 <b>Добро пожаловать!</b>\n\nВыберите действие:`,
          menuHandlers.getMainMenu()
        )
        return new Response('OK', { headers: corsHeaders })
      }

      if (session) {
        try {
          // Ожидание название фото/локации
          if (session.step === 'waiting_title') {
            if (!validators.isValidTitle(text)) {
              await telegramAPI.sendMessage(
                chatId,
                `❌ <b>Некорректное название</b>\n\nНазвание должно быть от 3 до 100 символов:`,
                { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
              )
              return new Response('OK', { headers: corsHeaders })
            }

            session.data.title = validators.sanitizeText(text)

            if (session.type === 'portfolio') {
              session.step = 'choosing_category'
              setSession(userId, session)

              await telegramAPI.sendMessage(
                chatId,
                `📝 <b>Шаг 3: Выберите категорию</b>\n\n` +
                `🖼 <b>${session.data.title}</b>\n\n` +
                `Выберите категорию (кнопкой):`,
                {
                  inline_keyboard: [
                    [
                      { text: '💒 Свадьба', callback_data: 'portfolio_cat_wedding' },
                      { text: '💕 Love Story', callback_data: 'portfolio_cat_lovestory' }
                    ],
                    [
                      { text: '👤 Портрет', callback_data: 'portfolio_cat_portrait' },
                      { text: '👨‍👩‍👧‍👦 Семья', callback_data: 'portfolio_cat_family' }
                    ],
                    [
                      { text: '🎉 Мероприятие', callback_data: 'portfolio_cat_event' }
                    ],
                    [{ text: '❌ Отмена', callback_data: 'cancel' }]
                  ]
                }
              )
            } else {
              // Для локации: сразу описание
              session.step = 'waiting_description'
              setSession(userId, session)
              await telegramAPI.sendMessage(
                chatId,
                `📝 <b>Шаг 3: Введите описание локации</b>\n\n` +
                `📍 <b>${session.data.title}</b>\n\n` +
                `Пожалуйста, отправьте описание (10-500 символов):`,
                { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
              )
            }
            return new Response('OK', { headers: corsHeaders })
          }

          // Ожидание описания (и публикация)
          if (session.step === 'waiting_description') {
            if (!validators.isValidDescription(text)) {
              await telegramAPI.sendMessage(
                chatId,
                `❌ <b>Некорректное описание</b>\n\nОписание должно быть от 10 до 500 символов:`,
                { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
              )
              return new Response('OK', { headers: corsHeaders })
            }
            session.data.description = validators.sanitizeText(text)

            await telegramAPI.sendMessage(chatId, `⏳ <b>Обработка...</b>`, null)
            if (!session.data.photo_file_id) {
              throw new Error('Не найден файл фото в сессии.')
            }

            // Получаем и загружаем фото на Storage
            const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${session.data.photo_file_id}`)
            const fileData = await fileResponse.json()
            if (!fileData.ok) throw new Error(`Не удалось получить файл: ${fileData.description}`)

            const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
            const imageResponse = await fetch(fileUrl)
            if (!imageResponse.ok) throw new Error(`Не удалось скачать файл: HTTP ${imageResponse.status}`)
            const imageBlob = await imageResponse.blob()
            const fileName = `${session.type}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
            const storagePath = session.type === 'portfolio' ? `portfolio/${fileName}` : `locations/${fileName}`

            // Загружаем в Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('images')
              .upload(storagePath, imageBlob, {
                contentType: 'image/jpeg',
                cacheControl: '3600'
              })

            if (uploadError) throw new Error(`Ошибка загрузки: ${uploadError.message}`)

            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(storagePath)
            const imageUrl = urlData.publicUrl

            // Сохраняем в базу
            if (session.type === 'portfolio') {
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
            return new Response('OK', { headers: corsHeaders })
          }
        } catch (error) {
          logger.error('Session processing error', error)
          await telegramAPI.sendMessage(
            chatId,
            `❌ <b>Ошибка при сохранении</b>\n\n${error.message}\n\nПопробуйте еще раз:`,
            menuHandlers.getMainMenu()
          )
          deleteSession(userId)
          await botMonitor.logBotActivity(userId, `${session.type}_add_error`, false, { error: error.message })
          return new Response('OK', { headers: corsHeaders })
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
