
export const processTitle = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, validators, menuHandlers } = deps
  let session = getSession(userId)
  const text = message.text || ''

  if (!session) {
    await telegramAPI.sendMessage(chatId, '❓ Сессия не найдена. Начните заново:', menuHandlers.getMainMenu())
    return
  }

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
}
