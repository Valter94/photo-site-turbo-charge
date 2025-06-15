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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
      console.error('❌ Missing environment variables')
      return new Response('Configuration error', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const telegramAPI = createTelegramAPI(botToken)
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
      console.error('❌ Ошибка парсинга JSON:', error)
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders })
    }

    console.log('📨 Получено обновление:', JSON.stringify(update, null, 2))

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
      console.log('🔔 Получен callback:', data)

      // Обработка фотографий
      if (data === 'process_photos') {
        try {
          const result = photoProcessingHandlers.getProcessingMenu()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения меню обработки:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения меню обработки</b>')
        }
      }
      // Выбор фильтра для обработки
      else if (data?.startsWith('filter_')) {
        const filterType = data.replace('filter_', '')
        deleteSession(userId)
        setSession(userId, {
          step: 'waiting_photos_for_processing',
          data: { filterType },
          type: 'photo_processing',
          created_at: Date.now()
        })
        
        try {
          const result = photoProcessingHandlers.startPhotoProcessing(filterType)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка начала обработки:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка запуска обработки</b>')
        }
      }
      // Пакетная обработка
      else if (data === 'batch_process') {
        deleteSession(userId)
        setSession(userId, {
          step: 'waiting_batch_photos',
          data: { photos: [] },
          type: 'batch_processing',
          created_at: Date.now()
        })
        
        await telegramAPI.editMessage(
          chatId,
          messageId!,
          `📁 <b>Пакетная обработка</b>\n\n` +
          `📸 Отправьте до 10 фотографий одним сообщением или по очереди\n` +
          `После загрузки всех фото выберите фильтр для обработки.`,
          {
            inline_keyboard: [
              [{ text: '✅ Завершить загрузку', callback_data: 'finish_upload' }],
              [{ text: '❌ Отмена', callback_data: 'cancel' }]
            ]
          }
        )
      }

      // Основные действия добавления
      if (data?.startsWith('add_')) {
        // Удаляем предыдущую сессию перед созданием новой
        deleteSession(userId)
        
        const type = data.split('_')[1] as 'portfolio' | 'location'
        setSession(userId, {
          step: 'waiting_photo',
          data: {},
          type: type,
          created_at: Date.now()
        })
        
        console.log(`📝 Создана НОВАЯ сессия для пользователя ${userId}:`, type)
        
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
      // Управление ценами
      else if (data === 'manage_pricing') {
        try {
          const result = await pricingHandlers.getPricingList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения цен:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка цен</b>')
        }
      }
      // Редактирование цен - список
      else if (data === 'edit_pricing') {
        try {
          const result = await pricingHandlers.getEditPricingList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения списка для редактирования:', error)
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
          console.error('❌ Ошибка получения информации о тарифе:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения информации о тарифе</b>')
        }
      }
      // Управление услугами
      else if (data === 'manage_services') {
        try {
          const result = await servicesHandlers.getServicesList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения услуг:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка услуг</b>')
        }
      }
      // Управление локациями
      else if (data === 'manage_locations') {
        try {
          const result = await locationsHandlers.getLocationsList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения локаций:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка локаций</b>')
        }
      }
      // Видео-инструкции и помощь
      else if (data === 'help' || data === 'video_instructions') {
        await tutorialHandlers.sendTutorialVideo(chatId)
      }
      // Управление портфолио
      else if (data === 'manage_portfolio') {
        try {
          const result = await portfolioHandlers.getPortfolioList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения портфолио:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка фотографий</b>')
        }
      }
      // Удаление фото из портфолио
      else if (data === 'delete_portfolio') {
        try {
          const result = await portfolioHandlers.getDeleteList()
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения списка для удаления:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения списка фотографий</b>')
        }
      }
      // Подтверждение удаления фото
      else if (data?.startsWith('delete_photo_')) {
        const photoId = data.replace('delete_photo_', '')
        
        try {
          const result = await portfolioHandlers.getPhotoInfo(photoId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка получения информации о фото:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения информации о фотографии</b>')
        }
      }
      // Окончательное удаление фото
      else if (data?.startsWith('confirm_delete_')) {
        const photoId = data.replace('confirm_delete_', '')
        
        try {
          const result = await portfolioHandlers.deletePhoto(photoId)
          await telegramAPI.editMessage(chatId, messageId!, result.text, result.keyboard)
        } catch (error) {
          console.error('❌ Ошибка удаления фото:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка при удалении фотографии</b>')
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
          console.error('❌ Ошибка получения статистики:', error)
          await telegramAPI.editMessage(chatId, messageId!, '❌ <b>Ошибка получения статистики</b>')
        }
      }
      // Отмена операции
      else if (data === 'cancel') {
        deleteSession(userId)
        console.log(`❌ Отменена сессия пользователя ${userId}`)
        await telegramAPI.editMessage(
          chatId, 
          messageId!, 
          '❌ <b>Операция отменена</b>\n\nВыберите действие:', 
          menuHandlers.getMainMenu()
        )
      }
      // Выбор категории портфолио
      else if (data?.startsWith('cat_')) {
        const session = getSession(userId)
        if (session && session.step === 'choosing_category') {
          const categoryMap: { [key: string]: string } = {
            'wedding': 'Свадьба',
            'lovestory': 'Love Story',
            'portrait': 'Портрет',
            'family': 'Семья',
            'corporate': 'Корпоратив'
          }
          
          const category = data.replace('cat_', '')
          session.data.category = category
          session.step = 'waiting_description'
          setSession(userId, session)
          
          console.log(`📝 Обновлена сессия пользователя ${userId}: выбрана категория ${category}`)
          
          await telegramAPI.editMessage(
            chatId,
            messageId!,
            `📝 <b>Шаг 3: Описание</b>\n\n` +
            `✅ Категория: <b>${categoryMap[category] || category}</b>\n` +
            `🖼 Название: <b>${session.data.title}</b>\n\n` +
            `Теперь отправьте описание для фото:`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        }
      }
      
      return new Response('OK', { headers: corsHeaders })
    }

    // Обработка текстовых сообщений и команд
    if (message) {
      const text = message.text || ''
      const photo = message.photo
      const caption = message.caption || ''

      console.log('💬 Обрабатываем сообщение:', { text, hasPhoto: !!photo, caption })

      // Команда /start
      if (text.startsWith('/start')) {
        console.log('🚀 Обрабатываем команду /start')
        
        try {
          await telegramAPI.sendMessage(
            chatId,
            `🤖 <b>Добро пожаловать в панель управления сайтом!</b>\n\n` +
            `Управляйте всем контентом через удобный интерфейс:`,
            menuHandlers.getMainMenu()
          )
        } catch (error) {
          console.error('❌ Ошибка отправки приветственного сообщения:', error)
        }
        
        return new Response('OK', { headers: corsHeaders })
      }

      // Команда /help - отправляем видео инструкции
      if (text.startsWith('/help')) {
        await tutorialHandlers.sendTutorialVideo(chatId)
        return new Response('OK', { headers: corsHeaders })
      }

      // Команда /stats
      if (text.startsWith('/stats')) {
        try {
          const result = await menuHandlers.getStats()
          await telegramAPI.sendMessage(chatId, result.text)
        } catch (error) {
          console.error('❌ Ошибка получения статистики:', error)
          await telegramAPI.sendMessage(chatId, '❌ <b>Ошибка получения статистики</b>')
        }
        return new Response('OK', { headers: corsHeaders })
      }

      // Обработка фото
      if (photo && photo.length > 0) {
        const session = getSession(userId)
        if (session && session.step === 'waiting_photo') {
          const largestPhoto = photo[photo.length - 1]
          session.data.photo_file_id = largestPhoto.file_id
          session.step = 'waiting_title'
          setSession(userId, session)
          
          console.log(`📸 Сохранено фото для пользователя ${userId}: ${largestPhoto.file_id}`)
          
          await telegramAPI.sendMessage(
            chatId,
            `✅ <b>Фото получено!</b>\n\n` +
            `📝 <b>Шаг 2: Название</b>\n\n` +
            `Отправьте название для этого ${session.type === 'portfolio' ? 'фото' : 'места'}:`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        } else if (session && session.type === 'photo_processing' && session.step === 'waiting_photos_for_processing') {
          const largestPhoto = photo[photo.length - 1]
          session.data.photos = session.data.photos || []
          session.data.photos.push({
            file_id: largestPhoto.file_id,
            caption: caption
          })
          
          setSession(userId, session)
          
          await telegramAPI.sendMessage(
            chatId,
            `✅ <b>Фото получено! (${session.data.photos.length}/10)</b>\n\n` +
            `🎨 Фильтр: ${photoProcessingHandlers.getFilterDescription(session.data.filterType).split('\n')[0]}\n\n` +
            `Отправьте еще фото или нажмите "Обработать":`,
            {
              inline_keyboard: [
                [{ text: '🎨 Обработать сейчас', callback_data: 'start_processing' }],
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        }
        else if (session && session.type === 'batch_processing' && session.step === 'waiting_batch_photos') {
          const largestPhoto = photo[photo.length - 1]
          session.data.photos = session.data.photos || []
          session.data.photos.push({
            file_id: largestPhoto.file_id,
            caption: caption
          })
          
          setSession(userId, session)
          
          await telegramAPI.sendMessage(
            chatId,
            `📁 <b>Фото добавлено в пакет! (${session.data.photos.length}/10)</b>\n\n` +
            `Отправьте еще фото или завершите загрузку для выбора фильтра.`,
            {
              inline_keyboard: [
                [{ text: '✅ Завершить загрузку', callback_data: 'finish_upload' }],
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        } else {
          console.log(`❓ Фото получено без активной сессии от пользователя ${userId}`)
          await telegramAPI.sendMessage(
            chatId,
            `❓ <b>Чтобы добавить фото, используйте меню</b>\n\n` +
            `Выберите "📸 Добавить в портфолио" или "📍 Добавить локацию":`,
            menuHandlers.getMainMenu()
          )
        }
        return new Response('OK', { headers: corsHeaders })
      }

      // Обработка сессий пользователя
      const session = getSession(userId)
      console.log(`🔍 Проверка сессии для пользователя ${userId}:`, session ? `${session.type} - ${session.step}` : 'нет сессии')
      
      if (!session && !text.startsWith('/')) {
        await telegramAPI.sendMessage(
          chatId,
          `👋 <b>Добро пожаловать!</b>\n\n` +
          `Выберите действие для управления сайтом:`,
          menuHandlers.getMainMenu()
        )
        return new Response('OK', { headers: corsHeaders })
      }

      // Обработка названия в сессии
      if (session && session.step === 'waiting_title') {
        session.data.title = text
        
        if (session.type === 'portfolio') {
          session.step = 'choosing_category'
          setSession(userId, session)
          
          console.log(`📝 Получено название для портфолио от пользователя ${userId}: ${text}`)
          
          await telegramAPI.sendMessage(
            chatId,
            `📝 <b>Шаг 3: Выберите категорию</b>\n\n` +
            `🖼 Название: <b>${text}</b>\n\n` +
            `Выберите подходящую категорию:`,
            menuHandlers.getCategoryKeyboard()
          )
        } else {
          // Для локации сразу переходим к описанию
          session.step = 'waiting_description'
          setSession(userId, session)
          
          console.log(`📝 Получено название для локации от пользователя ${userId}: ${text}`)
          
          await telegramAPI.sendMessage(
            chatId,
            `📝 <b>Шаг 3: Описание локации</b>\n\n` +
            `📍 Название: <b>${text}</b>\n\n` +
            `Отправьте описание места (адрес, особенности, лучшее время для съемки):`,
            {
              inline_keyboard: [
                [{ text: '❌ Отмена', callback_data: 'cancel' }]
              ]
            }
          )
        }
      }

      // Обработка описания в сессии
      if (session && session.step === 'waiting_description') {
        session.data.description = text
        
        console.log(`📝 Получено описание от пользователя ${userId}: ${text}`)
        
        // Обрабатываем фото и сохраняем в базу
        try {
          const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${session.data.photo_file_id}`)
          const fileData = await fileResponse.json()
          
          if (!fileData.ok) {
            throw new Error('Не удалось получить файл')
          }

          const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
          const imageResponse = await fetch(fileUrl)
          const imageBlob = await imageResponse.blob()
          
          const fileName = `telegram-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
          const storagePath = session.type === 'portfolio' ? `portfolio/${fileName}` : `locations/${fileName}`
          
          // Загружаем в Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(storagePath, imageBlob, {
              contentType: 'image/jpeg',
              cacheControl: '3600'
            })

          if (uploadError) {
            throw uploadError
          }

          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(storagePath)

          const imageUrl = urlData.publicUrl

          if (session.type === 'portfolio') {
            // Добавляем в портфолио
            const { error: insertError } = await supabase
              .from('portfolio')
              .insert({
                title: session.data.title,
                category: session.data.category,
                description: session.data.description,
                image_url: imageUrl,
                is_featured: false
              })

            if (insertError) {
              throw insertError
            }

            const categoryNames: { [key: string]: string } = {
              'wedding': 'Свадьба',
              'lovestory': 'Love Story',
              'portrait': 'Портрет',
              'family': 'Семья',
              'corporate': 'Корпоратив'
            }

            console.log(`✅ Добавлено в портфолио от пользователя ${userId}`)

            await telegramAPI.sendMessage(
              chatId,
              `✅ <b>Фото успешно добавлено в портфолио!</b>\n\n` +
              `📷 Название: ${session.data.title}\n` +
              `🏷 Категория: ${categoryNames[session.data.category] || session.data.category}\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `🌐 Фото появится на сайте через несколько минут.`,
              menuHandlers.getMainMenu()
            )
          } else {
            // Добавляем локацию
            const { error: insertError } = await supabase
              .from('photoshoot_locations')
              .insert({
                name: session.data.title,
                description: session.data.description,
                image_url: imageUrl,
                category_id: '00000000-0000-0000-0000-000000000001'
              })

            if (insertError) {
              throw insertError
            }

            console.log(`✅ Добавлена локация от пользователя ${userId}`)

            await telegramAPI.sendMessage(
              chatId,
              `✅ <b>Локация успешно добавлена!</b>\n\n` +
              `📍 Название: ${session.data.title}\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `🌐 Локация появится на сайте через несколько минут.`,
              menuHandlers.getMainMenu()
            )
          }
          
          deleteSession(userId)
          console.log(`🗑️ Удалена сессия пользователя ${userId} после успешного завершения`)
          
        } catch (error) {
          console.error('❌ Ошибка обработки:', error)
          await telegramAPI.sendMessage(
            chatId, 
            `❌ Ошибка при сохранении: ${error.message}`,
            menuHandlers.getMainMenu()
          )
          deleteSession(userId)
        }
      }
    }

    return new Response('OK', { headers: corsHeaders })
  } catch (error) {
    console.error('💥 Ошибка в Telegram боте:', error)
    return new Response(`Error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
