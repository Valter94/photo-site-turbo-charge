
export const sendTelegramMessage = async (
  message: string,
  chatIds: string[] = []
) => {
  const botToken = (window as any).TELEGRAM_BOT_TOKEN || localStorage.getItem('TELEGRAM_BOT_TOKEN');
  
  if (!botToken) {
    console.warn('🤖 TELEGRAM_BOT_TOKEN не задан! Уведомления не будут отправлены.');
    return;
  }

  // Если chatIds не переданы, берем из localStorage
  if (chatIds.length === 0) {
    const savedChatIds = [
      localStorage.getItem('TELEGRAM_CHAT_ID_1'),
      localStorage.getItem('TELEGRAM_CHAT_ID_2')
    ].filter(Boolean) as string[];
    
    chatIds = savedChatIds;
  }

  if (chatIds.length === 0) {
    console.warn('📨 Chat ID не настроены! Уведомления не будут отправлены.');
    return;
  }

  console.log(`📤 Отправляю сообщение в ${chatIds.length} чатов:`, message);

  const promises = chatIds.map(async (chatId) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      console.log(`✅ Сообщение отправлено в чат ${chatId}`);
      return true;
    } catch (error) {
      console.error(`❌ Ошибка отправки в чат ${chatId}:`, error);
      return false;
    }
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('❌ Ошибка при отправке Telegram уведомлений:', error);
  }
};
