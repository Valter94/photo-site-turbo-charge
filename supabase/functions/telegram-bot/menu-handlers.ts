
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createMenuHandlers = (supabase: SupabaseClient) => {
  const getMainMenu = () => ({
    inline_keyboard: [
      [
        { text: '📸 Добавить в портфолио', callback_data: 'add_portfolio' },
        { text: '📍 Добавить локацию', callback_data: 'add_location' }
      ],
      [
        { text: '🎨 Управление портфолио', callback_data: 'manage_portfolio' },
        { text: '💰 Управление ценами', callback_data: 'manage_pricing' }
      ],
      [
        { text: '🛠 Управление услугами', callback_data: 'manage_services' },
        { text: '🏛 Управление локациями', callback_data: 'manage_locations' }
      ],
      [
        { text: '📊 Статистика', callback_data: 'stats' },
        { text: '❓ Помощь', callback_data: 'help' }
      ]
    ]
  })

  const getCategoryKeyboard = () => ({
    inline_keyboard: [
      [
        { text: '💒 Свадьба', callback_data: 'cat_wedding' },
        { text: '💕 Love Story', callback_data: 'cat_lovestory' }
      ],
      [
        { text: '👤 Портрет', callback_data: 'cat_portrait' },
        { text: '👨‍👩‍👧‍👦 Семья', callback_data: 'cat_family' }
      ],
      [
        { text: '🏢 Корпоратив', callback_data: 'cat_corporate' }
      ],
      [
        { text: '❌ Отмена', callback_data: 'cancel' }
      ]
    ]
  })

  const getStats = async () => {
    const { count: portfolioCount } = await supabase
      .from('portfolio')
      .select('*', { count: 'exact', head: true })

    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    const { count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })

    const { count: locationsCount } = await supabase
      .from('photoshoot_locations')
      .select('*', { count: 'exact', head: true })

    return {
      text: `📊 <b>Статистика сайта:</b>\n\n` +
            `📸 Фото в портфолио: <b>${portfolioCount || 0}</b>\n` +
            `📝 Заявок на съемку: <b>${bookingsCount || 0}</b>\n` +
            `⭐ Отзывов: <b>${reviewsCount || 0}</b>\n` +
            `📍 Локаций: <b>${locationsCount || 0}</b>\n\n` +
            `🕐 Обновлено: ${new Date().toLocaleString('ru-RU')}`,
      keyboard: {
        inline_keyboard: [
          [{ text: '🔙 Назад', callback_data: 'main_menu' }]
        ]
      }
    }
  }

  return { getMainMenu, getCategoryKeyboard, getStats }
}
