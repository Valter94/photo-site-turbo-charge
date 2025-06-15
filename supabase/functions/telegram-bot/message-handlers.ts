import { createLogger } from './logger.ts'
import { getSession, setSession, deleteSession } from './enhanced-session-manager.ts'

export const createMessageHandlers = (deps: any) => {
  const { telegramAPI, supabase, menuHandlers, portfolioHandlers, locationsHandlers, botMonitor, validators, botToken } = deps
  const logger = createLogger('MessageHandlers')

  return async function handleMessage({ message, chatId, userId }: any) {
    const text = message.text || ''
    const photo = message.photo

    logger.info('Message received', { hasText: !!text, hasPhoto: !!photo, userId })

    // --- Обработка /start ---
    if (text.startsWith('/start')) {
      await telegramAPI.sendMessage(
        chatId,
        `🤖 <b>Добро пожаловать!</b>\n\nВы можете добавить фото в портфолио или локацию пошагово 👇`,
        menuHandlers.getMainMenu()
      )
      return
    }

    // --- /stats ---
    if (text.startsWith('/stats')) {
      try {
        const result = await menuHandlers.getStats()
        await telegramAPI.sendMessage(chatId, result.text)
      } catch (error) {
        logger.error('Error getting stats', error)
        await telegramAPI.sendMessage(chatId, '❌ <b>Ошибка получения статистики</b>')
      }
      return
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
        // user отправил фото без сессии — объясняем
        await telegramAPI.sendMessage(
          chatId,
          `📸 <b>Чтобы добавить фото, начните с меню 👇</b>\n\n` +
          `1️⃣ Нажмите "📸 Добавить в портфолио" или "📍 Добавить локацию"\n` +
          `2️⃣ Затем отправьте фото.\n\n` +
          `Выберите действие:`,
          menuHandlers.getMainMenu()
        )
        return
      }

      // --- Вот здесь сохраняем шаг ---
      if (session.step !== 'waiting_photo') {
        await telegramAPI.sendMessage(
          chatId,
          `❌ <b>Сейчас фото не требуется.</b>\n\nСледуйте инструкции или начните заново:`,
          menuHandlers.getMainMenu()
        )
        return
      }

      // Сохраняем файл и переходим к названию
      const largestPhoto = photo[photo.length - 1]
      session.data.photo_file_id = largestPhoto.file_id
      session.step = 'waiting_title'
      setSession(userId, session)

      logger.info('Photo saved to session', { userId, fileId: largestPhoto.file_id })

      await telegramAPI.sendMessage(
        chatId,
        `✅ <b>Фото получено!</b>\n\n<b>Шаг 2: Введите название</b>\nОтправьте название (3-100 символов):`,
        {
          inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
        }
      )
      return
    }

    // --- Текст в рамках сессии ---
    let session = getSession(userId)

    if (!session && !text.startsWith('/')) {
      await telegramAPI.sendMessage(
        chatId,
        `👋 <b>Выберите действие из меню:</b>`,
        menuHandlers.getMainMenu()
      )
      return
    }

    if (session) {
      try {
        // --- Шаг: название ---
        if (session.step === 'waiting_title') {
          if (!validators.isValidTitle(text)) {
            await telegramAPI.sendMessage(
              chatId,
              `❌ <b>Название должно быть от 3 до 100 символов.</b>\nПожалуйста, попробуйте еще раз:`,
              { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
            )
            return
          }
          session.data.title = validators.sanitizeText(text)
          if (session.type === 'portfolio') {
            session.step = 'choosing_category'
            setSession(userId, session)
            await telegramAPI.sendMessage(
              chatId,
              `📝 <b>Шаг 3: Выберите категорию</b>\n🖼 <b>${session.data.title}</b>\n\nВыберите категорию кнопкой:`,
              {
                inline_keyboard: [
                  [
                    { text: '💒 Свадебная фотосессия', callback_data: 'portfolio_cat_wedding' },
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
            session.step = 'waiting_description'
            setSession(userId, session)
            await telegramAPI.sendMessage(
              chatId,
              `📝 <b>Шаг 3: Введите описание локации</b>\n📍 <b>${session.data.title}</b>\nОтправьте описание (10-500 символов):`,
              { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
            )
          }
          return
        }

        // --- Для портфолио: после выбора категории шаг меняется на waiting_description через callback ---
        // --- Шаг: описание ---
        if (session.step === 'waiting_description') {
          if (!validators.isValidDescription(text)) {
            await telegramAPI.sendMessage(
              chatId,
              `❌ <b>Описание от 10 до 500 символов.</b>\nПопробуйте еще раз:`,
              { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
            )
            return
          }
          session.data.description = validators.sanitizeText(text)
          // --- Загрузка фото и сохранение данных (как раньше) ---
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

            // Переопределяем categoryNames на русский:
            const categoryNames: { [key: string]: string } = {
              'wedding': 'Свадебная фотосессия',
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
              `🌐 Фото появится на сайте через несколько минут.\n\n` +
              `➕ <b>Хотите добавить еще?</b>\nВыберите действие или снова воспользуйтесь кнопкой ниже.`,
              {
                inline_keyboard: [
                  [
                    { text: '➕ Добавить еще', callback_data: 'add_portfolio' },
                    { text: '🏠 Главное меню', callback_data: 'main_menu' }
                  ]
                ]
              }
            )
          } else {
            // Для локации
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
              `✅ <b>Локация успешно добавлена!</b>\n\n` +
              `📍 Название: ${session.data.title}\n` +
              `📝 Описание: ${session.data.description}\n\n` +
              `🌐 Локация появится на сайте через несколько минут.\n\n` +
              `➕ <b>Хотите добавить локацию?</b>`,
              {
                inline_keyboard: [
                  [
                    { text: '➕ Добавить локацию', callback_data: 'add_location' },
                    { text: '🏠 Главное меню', callback_data: 'main_menu' }
                  ]
                ]
              }
            )
          }

          deleteSession(userId)
          await botMonitor.logBotActivity(userId, `${session.type}_added`, true)
          return
        }
      } catch (error) {
        logger.error('Session processing error', error)
        await telegramAPI.sendMessage(
          chatId,
          `❌ <b>Ошибка при сохранении:</b>\n${error.message}\n\nПопробуйте еще раз или начните заново:`,
          menuHandlers.getMainMenu()
        )
        deleteSession(userId)
        await botMonitor.logBotActivity(userId, `${session.type}_add_error`, false, { error: error.message })
        return
      }
    }
  }
}
