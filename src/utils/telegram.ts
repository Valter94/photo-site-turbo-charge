
export const sendTelegramMessage = async (
  message: string,
  chatIds: string[] = []
) => {
  const botToken = (window as any).TELEGRAM_BOT_TOKEN || localStorage.getItem('TELEGRAM_BOT_TOKEN')
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN не задан!');
    return;
  }
  for (const chatId of chatIds) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
      })
    });
  }
};
