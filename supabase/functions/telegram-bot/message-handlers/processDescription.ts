import { UserSession } from '../types.ts'

export const processDescription = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, supabase, validators, menuHandlers } = deps
  let session = getSession(userId)
  const text = message.text || ''

  if (!session) {
    await telegramAPI.sendMessage(chatId, '❓ Сессия не найдена. Начните заново:', menuHandlers.getMainMenu())
    return
  }

  if (!validators.isValidDescription(text)) {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Описание должно быть от 10 до 500 символов.</b>\nПопробуйте еще раз:`,
      { inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]] }
    )
    return
  }

  session.data.description = validators.sanitizeText(text)

  // Добавляем фото в портфолио (Тип: portfolio)
  if (session.type === 'portfolio') {
    // Добавление записи в таблицу portfolio
    const { data, error } = await supabase
      .from('portfolio')
      .insert([{
        title: session.data.title,
        category: session.data.category || 'other',
        description: session.data.description,
        image_url: session.data.photo_file_id,
        created_at: new Date().toISOString(),
        // можно добавить client_name, location, tags и т.д.
      }]);

    if (error) {
      await telegramAPI.sendMessage(
        chatId,
        `❌ <b>Ошибка при добавлении фото:</b> ${error.message}`,
        menuHandlers.getMainMenu()
      )
      return
    }

    // Завершаем сессию
    deps.deleteSession(userId);

    await telegramAPI.sendMessage(
      chatId,
      `✅ <b>Фотография добавлена в портфолио!</b>\nСпасибо!`,
      menuHandlers.getMainMenu()
    )
    return;
  }

  // Если сценарий — локация (можно расширить по аналогии)
  if (session.type === 'location') {
    // Добавление записи в таблицу locations
    const { data, error } = await supabase
      .from('locations')
      .insert([{
        title: session.data.title,
        description: session.data.description,
        image_url: session.data.photo_file_id,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      await telegramAPI.sendMessage(
        chatId,
        `❌ <b>Ошибка при добавлении локации:</b> ${error.message}`,
        menuHandlers.getMainMenu()
      )
      return
    }

    // Завершаем сессию
    deps.deleteSession(userId);

    await telegramAPI.sendMessage(
      chatId,
      `✅ <b>Локация добавлена!</b>\nСпасибо!`,
      menuHandlers.getMainMenu()
    )
    return;
  }
}
