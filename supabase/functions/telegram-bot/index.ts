
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
    from: { id: number, username?: string }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN не настроен')
    }

    const update: TelegramUpdate = await req.json()
    const message = update.message

    if (!message) {
      return new Response('OK', { headers: corsHeaders })
    }

    const chatId = message.chat.id
    const userId = message.from.id
    const text = message.text || ''
    const photo = message.photo
    const caption = message.caption || ''

    console.log('Получено сообщение:', { chatId, userId, text, hasPhoto: !!photo })

    // Проверяем авторизацию пользователя
    const authorizedUsers = [chatId] // Можно расширить список авторизованных пользователей

    const sendMessage = async (text: string) => {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      })
    }

    // Команды бота
    if (text.startsWith('/start')) {
      await sendMessage(
        `🤖 <b>Добро пожаловать в управление сайтом!</b>\n\n` +
        `📸 <b>Доступные команды:</b>\n` +
        `/help - список команд\n` +
        `/add_portfolio - добавить фото в портфолио\n` +
        `/add_location - добавить фото локации\n` +
        `/stats - статистика сайта\n\n` +
        `💡 <b>Как добавить фото:</b>\n` +
        `1. Отправьте команду /add_portfolio или /add_location\n` +
        `2. Отправьте фото с подписью в формате:\n` +
        `   Название|Категория|Описание\n` +
        `3. Фото будет автоматически добавлено на сайт`
      )
      return new Response('OK', { headers: corsHeaders })
    }

    if (text.startsWith('/help')) {
      await sendMessage(
        `📋 <b>Список команд:</b>\n\n` +
        `📸 <b>Управление контентом:</b>\n` +
        `/add_portfolio - добавить в портфолио\n` +
        `/add_location - добавить локацию\n` +
        `/stats - показать статистику\n\n` +
        `💾 <b>Формат для добавления фото:</b>\n` +
        `Отправьте фото с подписью:\n` +
        `<code>Название|Категория|Описание</code>\n\n` +
        `🎯 <b>Категории портфолио:</b>\n` +
        `wedding, lovestory, portrait, family, corporate\n\n` +
        `📍 <b>Для локаций укажите:</b>\n` +
        `Название|Адрес|Лучшее время для съемки`
      )
      return new Response('OK', { headers: corsHeaders })
    }

    if (text.startsWith('/stats')) {
      // Получаем реальную статистику
      const { data: portfolioCount } = await supabase
        .from('portfolio')
        .select('id', { count: 'exact' })

      const { data: bookingsCount } = await supabase
        .from('bookings')
        .select('id', { count: 'exact' })

      const { data: reviewsCount } = await supabase
        .from('reviews')
        .select('id', { count: 'exact' })

      const { data: locationsCount } = await supabase
        .from('photoshoot_locations')
        .select('id', { count: 'exact' })

      await sendMessage(
        `📊 <b>Реальная статистика сайта:</b>\n\n` +
        `📸 Фото в портфолио: <b>${portfolioCount?.length || 0}</b>\n` +
        `📝 Заявок на съемку: <b>${bookingsCount?.length || 0}</b>\n` +
        `⭐ Отзывов: <b>${reviewsCount?.length || 0}</b>\n` +
        `📍 Локаций для съемки: <b>${locationsCount?.length || 0}</b>\n\n` +
        `🕐 Обновлено: ${new Date().toLocaleString('ru-RU')}`
      )
      return new Response('OK', { headers: corsHeaders })
    }

    // Обработка фото
    if (photo && photo.length > 0) {
      const largestPhoto = photo[photo.length - 1] // Берем самое большое фото
      
      try {
        // Получаем URL файла
        const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${largestPhoto.file_id}`)
        const fileData = await fileResponse.json()
        
        if (!fileData.ok) {
          throw new Error('Не удалось получить файл')
        }

        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
        
        // Скачиваем файл
        const imageResponse = await fetch(fileUrl)
        const imageBlob = await imageResponse.blob()
        
        // Генерируем имя файла
        const fileName = `telegram-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
        
        // Загружаем в Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`portfolio/${fileName}`, imageBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600'
          })

        if (uploadError) {
          throw uploadError
        }

        // Получаем публичный URL
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`portfolio/${fileName}`)

        const imageUrl = urlData.publicUrl

        // Парсим подпись
        const parts = caption.split('|').map(p => p.trim())
        
        if (parts.length >= 3) {
          const [title, category, description] = parts
          
          // Добавляем в портфолио
          const { error: insertError } = await supabase
            .from('portfolio')
            .insert({
              title,
              category: category.toLowerCase(),
              description,
              image_url: imageUrl,
              is_featured: false
            })

          if (insertError) {
            throw insertError
          }

          await sendMessage(
            `✅ <b>Фото успешно добавлено в портфолио!</b>\n\n` +
            `📷 Название: ${title}\n` +
            `🏷 Категория: ${category}\n` +
            `📝 Описание: ${description}\n\n` +
            `🌐 Фото появится на сайте в течение минуты`
          )
        } else {
          await sendMessage(
            `❌ <b>Неправильный формат подписи!</b>\n\n` +
            `Используйте: <code>Название|Категория|Описание</code>\n\n` +
            `Пример: <code>Свадьба Анны и Ивана|wedding|Прекрасная церемония в парке</code>`
          )
        }
      } catch (error) {
        console.error('Ошибка обработки фото:', error)
        await sendMessage(`❌ Ошибка при загрузке фото: ${error.message}`)
      }
    }

    return new Response('OK', { headers: corsHeaders })
  } catch (error) {
    console.error('Ошибка в Telegram боте:', error)
    return new Response('Error', { status: 500, headers: corsHeaders })
  }
})
