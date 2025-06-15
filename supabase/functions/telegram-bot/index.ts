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
  type: 'portfolio' | 'location' | 'pricing' | 'service'
  created_at: number
}

// Храним сессии пользователей в памяти с таймстампами
const userSessions = new Map<number, UserSession>()

// Очищаем старые сессии (старше 30 минут)
const cleanOldSessions = () => {
  const now = Date.now()
  const thirtyMinutes = 30 * 60 * 1000
  
  for (const [userId, session] of userSessions.entries()) {
    if (now - session.created_at > thirtyMinutes) {
      userSessions.delete(userId)
      console.log(`🧹 Удалена старая сессия для пользователя ${userId}`)
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Очищаем старые сессии при каждом запросе
    cleanOldSessions()

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

      // Основные действия
      if (data?.startsWith('add_')) {
        const type = data.split('_')[1] as 'portfolio' | 'location'
        userSessions.set(userId, {
          step: 'waiting_photo',
          data: {},
          type: type,
          created_at: Date.now()
        })
        
        console.log(`📝 Создана сессия для пользователя ${userId}:`, type)
        
        await editMessage(
          `📸 <b>Шаг 1: Отправьте фото</b>\n\n` +
          `${type === 'portfolio' ? '🎨 Добавляем в портфолио' : '📍 Добавляем локацию'}\n\n` +
          `Просто отправьте фото, которое хотите добавить.`
        )
      }
      // Управление ценами
      else if (data === 'manage_pricing') {
        try {
          const { data: pricingData, error } = await supabase
            .from('pricing')
            .select('*')
            .eq('is_active', true)
            .order('price', { ascending: true })

          if (error) throw error

          let priceList = `💰 <b>Управление ценами</b>\n\n`
          if (pricingData && pricingData.length > 0) {
            pricingData.forEach((item, index) => {
              priceList += `${index + 1}. <b>${item.service_type}</b>\n`
              priceList += `   💵 ${item.price} руб.\n`
              priceList += `   ⏰ ${item.duration_hours} ч.\n\n`
            })
          } else {
            priceList += `Цены не настроены\n\n`
          }

          await editMessage(priceList, {
            inline_keyboard: [
              [
                { text: '✏️ Изменить цену', callback_data: 'edit_pricing' },
                { text: '➕ Добавить тариф', callback_data: 'add_pricing' }
              ],
              [{ text: '🔙 Назад', callback_data: 'main_menu' }]
            ]
          })
        } catch (error) {
          console.error('❌ Ошибка получения цен:', error)
          await editMessage('❌ <b>Ошибка получения списка цен</b>')
        }
      }
      // Управление услугами
      else if (data === 'manage_services') {
        try {
          const { data: servicesData, error } = await supabase
            .from('additional_services')
            .select('*')
            .eq('is_active', true)
            .order('name')

          if (error) throw error

          let servicesList = `🛠 <b>Управление услугами</b>\n\n`
          if (servicesData && servicesData.length > 0) {
            servicesData.forEach((item, index) => {
              servicesList += `${index + 1}. <b>${item.name}</b>\n`
              servicesList += `   💵 ${item.price || 0} руб.\n`
              servicesList += `   📝 ${item.description || 'Без описания'}\n\n`
            })
          } else {
            servicesList += `Дополнительные услуги не настроены\n\n`
          }

          await editMessage(servicesList, {
            inline_keyboard: [
              [
                { text: '✏️ Изменить услугу', callback_data: 'edit_service' },
                { text: '➕ Добавить услугу', callback_data: 'add_service' }
              ],
              [{ text: '🔙 Назад', callback_data: 'main_menu' }]
            ]
          })
        } catch (error) {
          console.error('❌ Ошибка получения услуг:', error)
          await editMessage('❌ <b>Ошибка получения списка услуг</b>')
        }
      }
      // Управление локациями
      else if (data === 'manage_locations') {
        try {
          const { data: locationsData, error } = await supabase
            .from('photoshoot_locations')
            .select('*')
            .order('name')

          if (error) throw error

          let locationsList = `📍 <b>Управление локациями</b>\n\n`
          if (locationsData && locationsData.length > 0) {
            locationsData.forEach((item, index) => {
              locationsList += `${index + 1}. <b>${item.name}</b>\n`
              locationsList += `   📝 ${item.description.substring(0, 50)}...\n\n`
            })
          } else {
            locationsList += `Локации не добавлены\n\n`
          }

          await editMessage(locationsList, {
            inline_keyboard: [
              [
                { text: '✏️ Изменить локацию', callback_data: 'edit_location' },
                { text: '➕ Добавить локацию', callback_data: 'add_location' }
              ],
              [{ text: '🔙 Назад', callback_data: 'main_menu' }]
            ]
          })
        } catch (error) {
          console.error('❌ Ошибка получения локаций:', error)
          await editMessage('❌ <b>Ошибка получения списка локаций</b>')
        }
      }
      // Добавление нового тарифа
      else if (data === 'add_pricing') {
        userSessions.set(userId, {
          step: 'waiting_service_type',
          data: {},
          type: 'pricing',
          created_at: Date.now()
        })
        
        await editMessage(
          `💰 <b>Добавление нового тарифа</b>\n\n` +
          `Выберите тип услуги:`,
          {
            inline_keyboard: [
              [
                { text: '💒 Свадьба', callback_data: 'pricing_type_wedding' },
                { text: '💕 Love Story', callback_data: 'pricing_type_lovestory' }
              ],
              [
                { text: '👤 Портрет', callback_data: 'pricing_type_portrait' },
                { text: '👨‍👩‍👧‍👦 Семья', callback_data: 'pricing_type_family' }
              ],
              [
                { text: '🏢 Корпоратив', callback_data: 'pricing_type_corporate' }
              ],
              [{ text: '❌ Отмена', callback_data: 'cancel' }]
            ]
          }
        )
      }
      // Выбор типа услуги для тарифа
      else if (data?.startsWith('pricing_type_')) {
        const session = userSessions.get(userId)
        if (session && session.type === 'pricing') {
          const serviceType = data.replace('pricing_type_', '')
          session.data.service_type = serviceType
          session.step = 'waiting_price'
          userSessions.set(userId, session)
          
          await editMessage(
            `💰 <b>Новый тариф: ${serviceType}</b>\n\n` +
            `Введите цену в рублях (например: 15000):`
          )
        }
      }
      // Добавление новой услуги
      else if (data === 'add_service') {
        userSessions.set(userId, {
          step: 'waiting_service_name',
          data: {},
          type: 'service',
          created_at: Date.now()
        })
        
        await editMessage(
          `🛠 <b>Добавление новой услуги</b>\n\n` +
          `Введите название услуги:`
        )
      }
      // Выбор категории портфолио
      else if (data?.startsWith('cat_')) {
        const session = userSessions.get(userId)
        if (session && session.step === 'choosing_category') {
          const category = data.replace('cat_', '')
          session.data.category = category
          session.step = 'waiting_description'
          userSessions.set(userId, session)
          
          console.log(`📝 Обновлена сессия пользователя ${userId}: выбрана категория ${category}`)
          
          await editMessage(
            `📝 <b>Шаг 3: Описание</b>\n\n` +
            `✅ Категория: <b>${category}</b>\n` +
            `🖼 Название: <b>${session.data.title}</b>\n\n` +
            `Теперь отправьте описание для фото:`
          )
        }
      }
      // Главное меню
      else if (data === 'main_menu' || data === 'start') {
        await editMessage(
          `🤖 <b>Главное меню</b>\n\n` +
          `Выберите действие:`,
          {
            inline_keyboard: [
              [
                { text: '📸 Добавить в портфолио', callback_data: 'add_portfolio' },
                { text: '📍 Добавить локацию', callback_data: 'add_location' }
              ],
              [
                { text: '💰 Управление ценами', callback_data: 'manage_pricing' },
                { text: '🛠 Управление услугами', callback_data: 'manage_services' }
              ],
              [
                { text: '🏛 Управление локациями', callback_data: 'manage_locations' }
              ],
              [
                { text: '📊 Статистика', callback_data: 'stats' },
                { text: '❓ Помощь', callback_data: 'help' }
              ]
            ]
          }
        )
      }
      else if (data === 'cancel') {
        userSessions.delete(userId)
        console.log(`❌ Отменена сессия пользователя ${userId}`)
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
            `🕐 Обновлено: ${new Date().toLocaleString('ru-RU')}`,
            {
              inline_keyboard: [
                [{ text: '🔙 Назад', callback_data: 'main_menu' }]
              ]
            }
          )
        } catch (error) {
          console.error('❌ Ошибка получения статистики:', error)
          await editMessage('❌ <b>Ошибка получения статистики</b>')
        }
      } else if (data === 'help') {
        await editMessage(
          `📋 <b>Доступные функции:</b>\n\n` +
          `🎮 <b>Контент:</b>\n` +
          `• Добавление фото в портфолио\n` +
          `• Добавление новых локаций\n\n` +
          `💰 <b>Цены и услуги:</b>\n` +
          `• Управление тарифами\n` +
          `• Добавление дополнительных услуг\n\n` +
          `🏛 <b>Локации:</b>\n` +
          `• Редактирование существующих\n` +
          `• Добавление новых мест\n\n` +
          `📊 <b>Аналитика:</b>\n` +
          `• Статистика сайта\n` +
          `• Отчеты по активности`,
          {
            inline_keyboard: [
              [{ text: '🔙 Назад', callback_data: 'main_menu' }]
            ]
          }
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
            `🤖 <b>Добро пожаловать в расширенную панель управления!</b>\n\n` +
            `Теперь вы можете управлять всем сайтом через бота:`,
            {
              inline_keyboard: [
                [
                  { text: '📸 Добавить в портфолио', callback_data: 'add_portfolio' },
                  { text: '📍 Добавить локацию', callback_data: 'add_location' }
                ],
                [
                  { text: '💰 Управление ценами', callback_data: 'manage_pricing' },
                  { text: '🛠 Управление услугами', callback_data: 'manage_services' }
                ],
                [
                  { text: '🏛 Управление локациями', callback_data: 'manage_locations' }
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
      console.log(`🔍 Проверка сессии для пользователя ${userId}:`, session ? `${session.type} - ${session.step}` : 'нет сессии')
      
      if (photo && photo.length > 0) {
        if (session && session.step === 'waiting_photo') {
          // Сохраняем фото
          const largestPhoto = photo[photo.length - 1]
          session.data.photo_file_id = largestPhoto.file_id
          session.step = 'waiting_title'
          userSessions.set(userId, session)
          
          console.log(`📸 Сохранено фото для пользователя ${userId}: ${largestPhoto.file_id}`)
          
          await sendMessage(
            `✅ <b>Фото получено!</b>\n\n` +
            `📝 <b>Шаг 2: Название</b>\n\n` +
            `Отправьте название для этого ${session.type === 'portfolio' ? 'фото' : 'места'}:`
          )
        } else {
          console.log(`❓ Фото получено без активной сессии от пользователя ${userId}`)
          await sendMessage(
            `❓ <b>Чтобы добавить фото, начните с команды /start</b>\n\n` +
            `Выберите "📸 Добавить в портфолио" или "📍 Добавить локацию", а затем отправьте фото.`,
            {
              inline_keyboard: [
                [
                  { text: '🚀 Открыть меню', callback_data: 'start' }
                ]
              ]
            }
          )
        }
        return new Response('OK', { headers: corsHeaders })
      }

      if (!session && !text.startsWith('/')) {
        await sendMessage(
          `👋 <b>Добро пожаловать в панель управления сайтом!</b>\n\n` +
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
      if (session) {
        // Обработка названия
        if (session.step === 'waiting_title') {
          session.data.title = text
          
          if (session.type === 'portfolio') {
            session.step = 'choosing_category'
            userSessions.set(userId, session)
            
            console.log(`📝 Получено название для портфолио от пользователя ${userId}: ${text}`)
            
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
            
            console.log(`📝 Получено название для локации от пользователя ${userId}: ${text}`)
            
            await sendMessage(
              `📝 <b>Шаг 3: Описание локации</b>\n\n` +
              `📍 Название: <b>${text}</b>\n\n` +
              `Отправьте описание места (адрес, особенности, лучшее время для съемки):`
            )
          }
        }
        // Обработка цены для тарифа
        else if (session.step === 'waiting_price' && session.type === 'pricing') {
          const price = parseInt(text)
          if (isNaN(price)) {
            await sendMessage('❌ Пожалуйста, введите корректную цену числом (например: 15000)')
            return new Response('OK', { headers: corsHeaders })
          }
          
          session.data.price = price
          session.step = 'waiting_duration'
          userSessions.set(userId, session)
          
          await sendMessage(
            `💰 <b>Цена установлена: ${price} руб.</b>\n\n` +
            `Теперь введите продолжительность в часах (например: 2):`
          )
        }
        // Обработка продолжительности
        else if (session.step === 'waiting_duration' && session.type === 'pricing') {
          const duration = parseInt(text)
          if (isNaN(duration)) {
            await sendMessage('❌ Пожалуйста, введите корректное количество часов (например: 2)')
            return new Response('OK', { headers: corsHeaders })
          }
          
          session.data.duration_hours = duration
          session.step = 'waiting_photos_count'
          userSessions.set(userId, session)
          
          await sendMessage(
            `⏰ <b>Продолжительность: ${duration} ч.</b>\n\n` +
            `Введите количество фотографий (например: "30-40 обработанных фото"):`
          )
        }
        // Обработка количества фото
        else if (session.step === 'waiting_photos_count' && session.type === 'pricing') {
          session.data.photos_count = text
          
          // Сохраняем тариф в базу
          try {
            const { error } = await supabase
              .from('pricing')
              .insert({
                service_type: session.data.service_type,
                price: session.data.price,
                duration_hours: session.data.duration_hours,
                photos_count: session.data.photos_count,
                features: ['Консультация по образу', 'Обработка фотографий', 'Онлайн-галерея'],
                is_active: true
              })

            if (error) throw error

            await sendMessage(
              `✅ <b>Новый тариф добавлен!</b>\n\n` +
              `📋 Тип: ${session.data.service_type}\n` +
              `💵 Цена: ${session.data.price} руб.\n` +
              `⏰ Время: ${session.data.duration_hours} ч.\n` +
              `📸 Фото: ${session.data.photos_count}\n\n` +
              `Тариф активирован на сайте!`
            )
          } catch (error) {
            console.error('❌ Ошибка добавления тарифа:', error)
            await sendMessage('❌ Ошибка при сохранении тарифа')
          }
          
          userSessions.delete(userId)
        }
        // Обработка названия услуги
        else if (session.step === 'waiting_service_name' && session.type === 'service') {
          session.data.name = text
          session.step = 'waiting_service_price'
          userSessions.set(userId, session)
          
          await sendMessage(
            `🛠 <b>Услуга: ${text}</b>\n\n` +
            `Введите цену услуги в рублях (например: 3000):`
          )
        }
        // Обработка цены услуги
        else if (session.step === 'waiting_service_price' && session.type === 'service') {
          const price = parseInt(text)
          if (isNaN(price)) {
            await sendMessage('❌ Пожалуйста, введите корректную цену числом (например: 3000)')
            return new Response('OK', { headers: corsHeaders })
          }
          
          session.data.price = price
          session.step = 'waiting_service_description'
          userSessions.set(userId, session)
          
          await sendMessage(
            `💵 <b>Цена установлена: ${price} руб.</b>\n\n` +
            `Введите описание услуги:`
          )
        }
        // Обработка описания услуги
        else if (session.step === 'waiting_service_description' && session.type === 'service') {
          session.data.description = text
          
          // Сохраняем услугу в базу
          try {
            const { error } = await supabase
              .from('additional_services')
              .insert({
                name: session.data.name,
                price: session.data.price,
                description: session.data.description,
                is_active: true
              })

            if (error) throw error

            await sendMessage(
              `✅ <b>Новая услуга добавлена!</b>\n\n` +
              `🛠 Название: ${session.data.name}\n` +
              `💵 Цена: ${session.data.price} руб.\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `Услуга активирована на сайте!`
            )
          } catch (error) {
            console.error('❌ Ошибка добавления услуги:', error)
            await sendMessage('❌ Ошибка при сохранении услуги')
          }
          
          userSessions.delete(userId)
        }
        // Обработка описания
        else if (session.step === 'waiting_description') {
          session.data.description = text
          
          console.log(`📝 Получено описание от пользователя ${userId}: ${text}`)
          
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

              console.log(`✅ Добавлено в портфолио от пользователя ${userId}`)

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

              console.log(`✅ Добавлена локация от пользователя ${userId}`)

              await sendMessage(
                `✅ <b>Локация успешно добавлена!</b>\n\n` +
                `📍 Название: ${session.data.title}\n` +
                `📝 Описание: ${session.data.description}\n\n` +
                `🌐 Локация появится на сайте через несколько минут.`
              )
            }
            
            userSessions.delete(userId)
            console.log(`🗑️ Удалена сессия пользователя ${userId} после успешного завершения`)
            
          } catch (error) {
            console.error('❌ Ошибка обработки:', error)
            await sendMessage(`❌ Ошибка при сохранении: ${error.message}`)
            userSessions.delete(userId)
          }
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
