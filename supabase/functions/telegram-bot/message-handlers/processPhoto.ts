
export const processPhoto = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, menuHandlers } = deps
  const photo = message.photo
  let session = getSession(userId)

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

  if (session.step !== 'waiting_photo') {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Сейчас фото не требуется.</b>\n\nСледуйте инструкции или начните заново:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  const largestPhoto = photo[photo.length - 1]
  session.data.photo_file_id = largestPhoto.file_id
  session.step = 'waiting_title'
  setSession(userId, session)

  await telegramAPI.sendMessage(
    chatId,
    `✅ <b>Фото получено!</b>\n\n<b>Шаг 2: Введите название</b>\nОтправьте название (3-100 символов):`,
    {
      inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
    }
  )
}
