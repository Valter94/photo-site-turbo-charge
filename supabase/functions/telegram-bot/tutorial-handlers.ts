
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createTutorialHandlers = (supabase: SupabaseClient, telegramAPI: any) => {
  const sendTutorialVideo = async (chatId: number) => {
    const tutorialText = `
🎥 <b>Видео-инструкции по управлению сайтом</b>

📚 <b>Полное руководство по всем возможностям:</b>

🎨 <b>1. Управление портфолио</b>
• Как добавлять фото через бот
• Выбор категорий и описаний
• Удаление и редактирование фотографий

💰 <b>2. Управление ценами</b>
• Настройка тарифов через админ-панель
• Редактирование существующих цен
• Добавление новых услуг

📍 <b>3. Локации для съемки</b>
• Добавление новых мест
• Описание особенностей локаций
• Управление через админ-панель

👥 <b>4. Работа с клиентами</b>
• Обработка заявок на бронирование
• CRM система для клиентов
• Статистика и аналитика

📊 <b>5. SEO и аналитика</b>
• Google Analytics настройка
• Яндекс.Метрика подключение
• Оптимизация для поисковиков

🔧 <b>6. Telegram бот</b>
• Команды для управления
• Добавление контента
• Получение статистики

🔗 <b>Полезные ссылки:</b>
• <a href="https://docs.lovable.dev/user-guides/quickstart">Быстрый старт</a>
• <a href="https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO">YouTube плейлист</a>
• <a href="https://docs.lovable.dev/">Полная документация</a>

⭐ <b>Что умеет ваш сайт:</b>
✅ Автоматическая галерея портфолио
✅ Система онлайн-бронирования (без времени)
✅ Управление ценами и услугами
✅ База локаций для съемки
✅ Отзывы и рейтинги клиентов
✅ CRM система для управления клиентами
✅ SEO оптимизация и аналитика
✅ Адаптивный дизайн для всех устройств
✅ Telegram бот для управления

🚀 <b>Как начать работу:</b>
1. Отправьте /start для главного меню
2. Добавьте первые фото через "📸 Добавить в портфолио"
3. Настройте цены в админ-панели сайта
4. Добавьте локации через "📍 Добавить локацию"
5. Проверьте настройки аналитики

💡 <b>Совет:</b> Закрепите это сообщение (📌) для быстрого доступа к инструкциям!

❓ <b>Нужна помощь?</b> Отправьте /help в любое время.
    `

    try {
      const result = await telegramAPI.sendMessage(chatId, tutorialText, {
        inline_keyboard: [
          [
            { text: '📸 Добавить фото', callback_data: 'add_portfolio' },
            { text: '📍 Добавить локацию', callback_data: 'add_location' }
          ],
          [
            { text: '💰 Управление ценами', callback_data: 'manage_pricing' },
            { text: '📊 Статистика', callback_data: 'stats' }
          ],
          [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
        ]
      })
      
      // Автоматически закрепляем сообщение с инструкциями
      if (result.ok) {
        try {
          await fetch(`https://api.telegram.org/bot${Deno.env.get('TELEGRAM_BOT_TOKEN')}/pinChatMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: result.result.message_id,
              disable_notification: true
            })
          })
          console.log('📌 Сообщение с инструкциями закреплено')
        } catch (pinError) {
          console.warn('⚠️ Не удалось закрепить сообщение:', pinError)
        }
      }
      
      return true
    } catch (error) {
      console.error('❌ Ошибка отправки видео-инструкций:', error)
      return false
    }
  }

  return { sendTutorialVideo }
}
