
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createTutorialHandlers = (supabase: SupabaseClient, telegramAPI: any) => {
  const sendTutorialVideo = async (chatId: number) => {
    const tutorialText = `
🎥 <b>Видео-инструкции по использованию сайта</b>

📚 <b>Полное руководство:</b>
1. Как добавлять фото в портфолио
2. Управление ценами и услугами  
3. Добавление локаций для съемки
4. Работа с заявками клиентов
5. Настройка контактной информации

🔗 <b>Ссылки на обучающие материалы:</b>
• <a href="https://docs.lovable.dev/user-guides/quickstart">Быстрый старт</a>
• <a href="https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO">YouTube плейлист</a>
• <a href="https://docs.lovable.dev/">Полная документация</a>

⭐ <b>Основные возможности сайта:</b>
✅ Автоматическая галерея портфолио
✅ Система онлайн-бронирования
✅ Управление ценами и услугами
✅ Отзывы клиентов
✅ Адаптивный дизайн
✅ SEO оптимизация

💡 <b>Подсказка:</b> Закрепите это сообщение для быстрого доступа!
    `

    try {
      const result = await telegramAPI.sendMessage(chatId, tutorialText, {
        inline_keyboard: [
          [{ text: '🔙 Вернуться в меню', callback_data: 'main_menu' }]
        ]
      })
      
      // Закрепляем сообщение
      if (result.ok) {
        await fetch(`https://api.telegram.org/bot${Deno.env.get('TELEGRAM_BOT_TOKEN')}/pinChatMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: result.result.message_id
          })
        })
      }
      
      return true
    } catch (error) {
      console.error('❌ Ошибка отправки видео-инструкций:', error)
      return false
    }
  }

  return { sendTutorialVideo }
}
