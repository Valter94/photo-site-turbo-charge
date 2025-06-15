
export const createTelegramAPI = (botToken: string) => {
  const sendMessage = async (chatId: number, text: string, keyboard?: any) => {
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

  const editMessage = async (chatId: number, messageId: number, text: string, keyboard?: any) => {
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

  const answerCallback = async (callbackQueryId: string, text?: string) => {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text: text || ''
        })
      })
    } catch (error) {
      console.error('❌ Ошибка ответа на callback:', error)
    }
  }

  return { sendMessage, editMessage, answerCallback }
}
