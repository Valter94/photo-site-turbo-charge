
export const processTitle = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, menuHandlers } = deps
  const title = message.text?.trim()
  let session = getSession(userId)

  console.log('[processTitle] Начало обработки названия:', { title, session });

  if (!session || session.step !== 'waiting_title') {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Сейчас название не требуется.</b>\n\nНачните с главного меню:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  if (!title || title.length < 3 || title.length > 100) {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Некорректное название</b>\n\nНазвание должно быть от 3 до 100 символов.\nТекущая длина: ${title?.length || 0}\n\nПопробуйте еще раз:`,
      {
        inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
      }
    )
    return
  }

  session.data = session.data || {}
  session.data.title = title

  if (session.action_type === 'add_portfolio') {
    session.step = 'waiting_category'
    setSession(userId, session)

    const categoryKeyboard = {
      inline_keyboard: [
        [
          { text: '💒 Свадебная съемка', callback_data: 'category_wedding' },
          { text: '👤 Портретная съемка', callback_data: 'category_portrait' }
        ],
        [
          { text: '👨‍👩‍👧‍👦 Семейная фотосессия', callback_data: 'category_family' },
          { text: '💕 Love Story', callback_data: 'category_lovestory' }
        ],
        [
          { text: '🏢 Корпоративная съемка', callback_data: 'category_corporate' },
          { text: '🤱 Материнство', callback_data: 'category_maternity' }
        ],
        [{ text: '❌ Отмена', callback_data: 'cancel' }]
      ]
    }

    await telegramAPI.sendMessage(
      chatId,
      `✅ <b>Название принято:</b> "${title}"\n\n<b>Шаг 3: Выберите категорию</b>`,
      categoryKeyboard
    )
  } else if (session.action_type === 'add_location') {
    session.step = 'waiting_description'
    setSession(userId, session)

    await telegramAPI.sendMessage(
      chatId,
      `✅ <b>Название принято:</b> "${title}"\n\n<b>Шаг 3: Введите описание</b>\nОпишите локацию (10–500 символов):`,
      {
        inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
      }
    )
  }

  console.log('[processTitle] Название обработано, session:', session);
}
