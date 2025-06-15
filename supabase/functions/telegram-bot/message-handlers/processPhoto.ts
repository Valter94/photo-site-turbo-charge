
export const processPhoto = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, menuHandlers } = deps
  const photo = message.photo
  let session = getSession(userId)

  // Логирование состояния сессии для диагностики
  console.log('[processPhoto] Состояние сессии до:', session);

  if (!session) {
    await telegramAPI.sendMessage(
      chatId,
      `📸 <b>Чтобы добавить фото, начните с меню 👇</b>\n\n`+
      `1️⃣ Нажмите "📸 Добавить в портфолио" или "📍 Добавить локацию"\n` +
      `2️⃣ Затем отправьте фото.\n\n` +
      `Выберите действие:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  // Дополнительная защита: корректно восстановить step, если пользователь был на шаге photo
  if (session.step !== 'waiting_photo') {
    console.log(`[processPhoto] Фото получено не на своем step: session.step=${session.step}`);
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Сейчас фото не требуется.</b>\n\nСледуйте инструкции или начните заново:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  // Обработка добавления фото в сессию
  const largestPhoto = photo[photo.length - 1]
  session.data = session.data || {};
  session.data.photo_file_id = largestPhoto.file_id
  session.step = 'waiting_title' // Переключаем step на "ввод названия"
  setSession(userId, session)

  // Логирование для диагностики
  console.log('[processPhoto] Сессия после добавления фото:', session);

  await telegramAPI.sendMessage(
    chatId,
    `✅ <b>Фото получено!</b>\n\n<b>Шаг 2: Введите название</b>\nОтправьте название (3-100 символов):`,
    {
      inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
    }
  )
}
