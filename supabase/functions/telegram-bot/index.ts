import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUpdate {
  message?: {
    chat: { id: number }
    text?: string
    photo?: Array<{ file_id: string, file_size: number }>
    caption?: string
    from: { id: number, username?: string, first_name?: string }
  }
  callback_query?: {
    id: string
    from: { id: number, username?: string, first_name?: string }
    message: { chat: { id: number }, message_id: number }
    data: string
  }
}

interface UserSession {
  step: string
  data: any
  type: 'portfolio' | 'location'
}

// Храним сессии пользователей в памяти
const userSessions = new Map<number, UserSession>()

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Проверяем наличие всех необходимых переменных окружения
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')

    console.log('🔍 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasBotToken: !!botToken,
      supabaseUrl: supabaseUrl,
      botTokenStart: botToken ? botToken.substring(0, 10) + '...' : 'none'
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return new Response('Server configuration error', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    if (!botToken) {
      console.error('❌ TELEGRAM_BOT_TOKEN не настроен в секретах Supabase')
      return new Response('Bot token not configured', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
      console.log('⚠️ Получено обновление без message или callback_query')
      return new Response('OK', { headers: corsHeaders })
    }

    const sendMessage = async (text: string, keyboard?: any) => {
      const payload: any = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }
      
      if (keyboard) {
        payload.reply_markup = keyboard
      }

      console.log('📤 Отправляем сообщение:', payload)
      
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        const result = await response.json()
        console.log('📨 Результат отправки:', result)
        
        if (!result.ok) {
          console.error('❌ Ошибка Telegram API:', result)
        }
        
        return result
      } catch (error) {
        console.error('❌ Ошибка отправки сообщения:', error)
        throw error
      }
    }

    const editMessage = async (text: string, keyboard?: any) => {
      if (!messageId) return
      
      const payload: any = {
        chat_id: chatId,
        message_id: messageId,
        text: text,
        parse_mode: 'HTML'
      }
      
      if (keyboard) {
        payload.reply_markup = keyboard
      }

      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        const result = await response.json()
        console.log('✏️ Результат редактирования:', result)
        return result
      } catch (error) {
        console.error('❌ Ошибка редактирования сообщения:', error)
      }
    }

    const answerCallback = async (text?: string) => {
      if (!callbackQuery) return
      
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: text || ''
          })
        })
      } catch (error) {
        console.error('❌ Ошибка ответа на callback:', error)
      }
    }

    // Обработка callback'ов от кнопок
    if (callbackQuery) {
      await answerCallback()
      const data = callbackQuery.data
      console.log('🔔 Получен callback:', data)

      if (data?.startsWith('add_')) {
        const type = data.split('_')[1] as 'portfolio' | 'location'
        userSessions.set(userId, {
          step: 'waiting_photo',
          data: {},
          type: type
        })
        
        await editMessage(
          `📸 <b>Шаг 1: Отправьте фото</b>\n\n` +
          `${type === 'portfolio' ? '🎨 Добавляем в портфолио' : '📍 Добавляем локацию'}\n\n` +
          `Просто отправьте фото, которое хотите добавить.`
        )
      } else if (data?.startsWith('cat_')) {
        const session = userSessions.get(userId)
        if (session && session.step === 'choosing_category') {
          const category = data.replace('cat_', '')
          session.data.category = category
          session.step = 'waiting_description'
          userSessions.set(userId, session)
          
          await editMessage(
            `📝 <b>Шаг 3: Описание</b>\n\n` +
            `✅ Категория: <b>${category}</b>\n` +
            `🖼 Название: <b>${session.data.title}</b>\n\n` +
            `Теперь отправьте описание для фото:`
          )
        }
      } else if (data === 'cancel') {
        userSessions.delete(userId)
        await editMessage('❌ <b>Операция отменена</b>')
      } else if (data === 'stats') {
        try {
          const { count: portfolioCount } = await supabase
            .from('portfolio')
            .select('*', { count: 'exact', head: true })

          const { count: bookingsCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })

          const { count: reviewsCount } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })

          const { count: locationsCount } = await supabase
            .from('photoshoot_locations')
            .select('*', { count: 'exact', head: true })

          await editMessage(
            `📊 <b>Статистика сайта:</b>\n\n` +
            `📸 Фото в портфолио: <b>${portfolioCount || 0}</b>\n` +
            `📝 Заявок на съемку: <b>${bookingsCount || 0}</b>\n` +
            `⭐ Отзывов: <b>${reviewsCount || 0}</b>\n` +
            `📍 Локаций: <b>${locationsCount || 0}</b>\n\n` +
            `🕐 Обновлено: ${new Date().toLocaleString('ru-RU')}`
          )
        } catch (error) {
          console.error('❌ Ошибка получения статистики:', error)
          await editMessage('❌ <b>Ошибка получения статистики</b>')
        }
      } else if (data === 'help') {
        await editMessage(
          `📋 <b>Доступные функции:</b>\n\n` +
          `🎮 <b>Главное меню:</b>\n` +
          `Нажмите /start для открытия меню\n\n` +
          `📸 <b>Как добавить контент:</b>\n` +
          `1. Выберите действие кнопкой\n` +
          `2. Отправьте фото\n` +
          `3. Введите название\n` +
          `4. Выберите категорию (для портфолио)\n` +
          `5. Добавьте описание\n\n` +
          `✨ Все просто и пошагово!`
        )
      }
      
      return new Response('OK', { headers: corsHeaders })
    }

    // Обработка текстовых сообщений
    if (message) {
      const text = message.text || ''
      const photo = message.photo
      const caption = message.caption || ''

      console.log('💬 Обрабатываем сообщение:', { text, hasPhoto: !!photo, caption })

      // Команды
      if (text.startsWith('/start')) {
        console.log('🚀 Обрабатываем команду /start')
        
        try {
          await sendMessage(
            `🤖 <b>Добро пожаловать!</b>\n\n` +
            `Этот бот поможет вам управлять сайтом. Выберите действие:`,
            {
              inline_keyboard: [
                [
                  { text: '📸 Добавить в портфолио', callback_data: 'add_portfolio' },
                  { text: '📍 Добавить локацию', callback_data: 'add_location' }
                ],
                [
                  { text: '📊 Статистика', callback_data: 'stats' },
                  { text: '❓ Помощь', callback_data: 'help' }
                ]
              ]
            }
          )
        } catch (error) {
          console.error('❌ Ошибка отправки приветственного сообщения:', error)
        }
        
        return new Response('OK', { headers: corsHeaders })
      }

      if (text.startsWith('/help')) {
        await sendMessage(
          `📋 <b>Доступные команды:</b>\n\n` +
          `🎮 <b>Основные функции:</b>\n` +
          `/start - главное меню\n` +
          `/stats - статистика сайта\n\n` +
          `📸 <b>Как добавить контент:</b>\n` +
          `1. Нажмите на кнопку в меню\n` +
          `2. Отправьте фото\n` +
          `3. Выберите категорию из списка\n` +
          `4. Добавьте описание\n\n` +
          `✨ Все просто и пошагово!`
        )
        return new Response('OK', { headers: corsHeaders })
      }

      if (text.startsWith('/stats')) {
        try {
          const { count: portfolioCount } = await supabase
            .from('portfolio')
            .select('*', { count: 'exact', head: true })

          const { count: bookingsCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })

          const { count: reviewsCount } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })

          const { count: locationsCount } = await supabase
            .from('photoshoot_locations')
            .select('*', { count: 'exact', head: true })

          await sendMessage(
            `📊 <b>Статистика сайта:</b>\n\n` +
            `📸 Фото в портфолио: <b>${portfolioCount || 0}</b>\n` +
            `📝 Заявок на съемку: <b>${bookingsCount || 0}</b>\n` +
            `⭐ Отзывов: <b>${reviewsCount || 0}</b>\n` +
            `📍 Локаций: <b>${locationsCount || 0}</b>\n\n` +
            `🕐 Обновлено: ${new Date().toLocaleString('ru-RU')}`
          )
        } catch (error) {
          console.error('❌ Ошибка получения статистики:', error)
          await sendMessage('❌ <b>Ошибка получения статистики</b>')
        }
        return new Response('OK', { headers: corsHeaders })
      }

      // Обработка сессий пользователя
      const session = userSessions.get(userId)
      
      if (photo && photo.length > 0) {
        if (session && session.step === 'waiting_photo') {
          // Сохраняем фото
          const largestPhoto = photo[photo.length - 1]
          session.data.photo_file_id = largestPhoto.file_id
          session.step = 'waiting_title'
          userSessions.set(userId, session)
          
          await sendMessage(
            `✅ <b>Фото получено!</b>\n\n` +
            `📝 <b>Шаг 2: Название</b>\n\n` +
            `Отправьте название для этого ${session.type === 'portfolio' ? 'фото' : 'места'}:`
          )
        } else {
          await sendMessage(
            `❓ <b>Не понимаю, что делать с фото</b>\n\n` +
            `Сначала выберите действие из меню /start`
          )
        }
        return new Response('OK', { headers: corsHeaders })
      }

      if (!session) {
        await sendMessage(
          `👋 <b>Привет!</b>\n\n` +
          `Для начала работы нажмите /start или выберите действие:`,
          {
            inline_keyboard: [
              [
                { text: '🚀 Начать', callback_data: 'start' }
              ]
            ]
          }
        )
        return new Response('OK', { headers: corsHeaders })
      }

      // Обработка текста в зависимости от шага
      if (session.step === 'waiting_title') {
        session.data.title = text
        
        if (session.type === 'portfolio') {
          session.step = 'choosing_category'
          userSessions.set(userId, session)
          
          await sendMessage(
            `📝 <b>Шаг 3: Выберите категорию</b>\n\n` +
            `🖼 Название: <b>${text}</b>\n\n` +
            `Выберите подходящую категорию:`,
            {
              inline_keyboard: [
                [
                  { text: '💒 Свадьба', callback_data: 'cat_wedding' },
                  { text: '💕 Love Story', callback_data: 'cat_lovestory' }
                ],
                [
                  { text: '👤 Портрет', callback_data: 'cat_portrait' },
                  { text: '👨‍👩‍👧‍👦 Семья', callback_data: 'cat_family' }
                ],
                [
                  { text: '🏢 Корпоратив', callback_data: 'cat_corporate' }
                ],
                [
                  { text: '❌ Отмена', callback_data: 'cancel' }
                ]
              ]
            }
          )
        } else {
          // Для локации сразу переходим к описанию
          session.step = 'waiting_description'
          userSessions.set(userId, session)
          
          await sendMessage(
            `📝 <b>Шаг 3: Описание локации</b>\n\n` +
            `📍 Название: <b>${text}</b>\n\n` +
            `Отправьте описание места (адрес, особенности, лучшее время для съемки):`
          )
        }
      } else if (session.step === 'waiting_description') {
        session.data.description = text
        
        // Теперь обрабатываем фото и сохраняем в базу
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

            await sendMessage(
              `✅ <b>Фото успешно добавлено в портфолио!</b>\n\n` +
              `📷 Название: ${session.data.title}\n` +
              `🏷 Категория: ${session.data.category}\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `🌐 Фото появится на сайте через несколько минут.`
            )
          } else {
            // Добавляем локацию
            const { error: insertError } = await supabase
              .from('photoshoot_locations')
              .insert({
                name: session.data.title,
                description: session.data.description,
                image_url: imageUrl,
                category_id: '00000000-0000-0000-0000-000000000001' // Дефолтная категория
              })

            if (insertError) {
              throw insertError
            }

            await sendMessage(
              `✅ <b>Локация успешно добавлена!</b>\n\n` +
              `📍 Название: ${session.data.title}\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `🌐 Локация появится на сайте через несколько минут.`
            )
          }
          
          userSessions.delete(userId)
          
        } catch (error) {
          console.error('❌ Ошибка обработки:', error)
          await sendMessage(`❌ Ошибка при сохранении: ${error.message}`)
          userSessions.delete(userId)
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
