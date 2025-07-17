
export const processDescription = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, deleteSession, menuHandlers, portfolioHandlers, locationsHandlers } = deps
  const description = message.text?.trim()
  let session = getSession(userId)

  console.log('[processDescription] Начало обработки описания:', { description, session });

  if (!session || session.step !== 'waiting_description') {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Сейчас описание не требуется.</b>\n\nНачните с главного меню:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  if (!description || description.length < 10 || description.length > 500) {
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Некорректное описание</b>\n\nОписание должно быть от 10 до 500 символов.\nТекущая длина: ${description?.length || 0}\n\nПопробуйте еще раз:`,
      {
        inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
      }
    )
    return
  }

  session.data.description = description

  try {
    let result;
    
    if (session.action_type === 'add_portfolio') {
      // Добавляем в портфолио
      result = await portfolioHandlers.addPortfolioItem(session.data)
    } else if (session.action_type === 'add_location') {
      // Добавляем локацию
      result = await locationsHandlers.addLocation(session.data)
    } else {
      throw new Error('Неизвестный тип действия')
    }

    // Очищаем сессию после успешного добавления
    deleteSession(userId)

    await telegramAPI.sendMessage(chatId, result.text, result.keyboard)
    
    console.log('[processDescription] Успешно добавлено:', session.action_type);

  } catch (error) {
    console.error('[processDescription] Ошибка:', error);
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Ошибка при сохранении</b>\n\nПопробуйте еще раз или обратитесь к администратору.`,
      menuHandlers.getMainMenu()
    )
  }
}
