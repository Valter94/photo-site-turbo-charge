
export const processDescription = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, deleteSession, validators, supabase, botToken, botMonitor, menuHandlers } = deps
  let session = getSession(userId)
  const text = message.text || ''

  if (!session) {
    await telegramAPI.sendMessage(chatId, '❓ Сессия не найдена. Начните заново:', menuHandlers.getMainMenu())
    return
  }

  if (!validators.isValidDescription(text)) {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Описание от 10 до 500 символов.</b>\nПопробуйте еще раз:`,
      { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
    )
    return
  }
  session.data.description = validators.sanitizeText(text)

  try {
    // Получаем файл с Telegram API
    const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${session.data.photo_file_id}`)
    const fileData = await fileResponse.json()
    if (!fileData.ok) throw new Error(`Не удалось получить файл: ${fileData.description}`)

    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
    const imageResponse = await fetch(fileUrl)
    if (!imageResponse.ok) throw new Error(`Не удалось скачать файл: HTTP ${imageResponse.status}`)
    const imageBlob = await imageResponse.blob()
    const fileName = `${session.type}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
    const storagePath = session.type === 'portfolio' ? `portfolio/${fileName}` : `locations/${fileName}`

    // Загрузка в Supabase Storage
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

    // Вставка в БД и отправка сообщения
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
  } catch (error) {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Ошибка при сохранении:</b>\n${error.message}\n\nПопробуйте еще раз или начните заново:`,
      menuHandlers.getMainMenu()
    )
    deleteSession(userId)
    await botMonitor.logBotActivity(userId, `${session.type}_add_error`, false, { error: error.message })
  }
}
