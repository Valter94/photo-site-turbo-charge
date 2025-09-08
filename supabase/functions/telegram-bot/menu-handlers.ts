
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createMenuHandlers = (supabase: SupabaseClient) => {
  const getMainMenu = () => {
    return {
      text: `🏠 <b>Главное меню управления сайтом</b>\n\n` +
            `Добро пожаловать в центр управления вашим фотосайтом!\n\n` +
            `Выберите раздел для управления:\n\n` +
            `🎨 <b>Портфолио</b> - Управление фотографиями\n` +
            `📍 <b>Локации</b> - Места для фотосессий\n` +
            `💰 <b>Цены</b> - Пакеты услуг и тарифы\n` +
            `⭐ <b>Отзывы</b> - Модерация отзывов клиентов\n` +
            `📊 <b>Аналитика</b> - Статистика сайта\n` +
            `⚡ <b>Быстрые действия</b> - Часто используемые функции\n` +
            `🤖 <b>AI обработка</b> - Улучшение фотографий с помощью ИИ\n` +
            `📚 <b>Обучение</b> - Инструкции по использованию`,
      keyboard: {
        inline_keyboard: [
          [
            { text: '🎨 Портфолио', callback_data: 'portfolio_management' },
            { text: '📍 Локации', callback_data: 'manage_locations' }
          ],
          [
            { text: '💰 Цены', callback_data: 'pricing_management' },
            { text: '⭐ Отзывы', callback_data: 'reviews_management' }
          ],
          [
            { text: '📊 Аналитика', callback_data: 'site_analytics' },
            { text: '⚡ Быстрые действия', callback_data: 'quick_actions' }
          ],
          [
            { text: '🤖 AI обработка', callback_data: 'ai_photo_processing' },
            { text: '📚 Обучение', callback_data: 'tutorial_menu' }
          ],
          [
            { text: '⚙️ Настройки', callback_data: 'settings_menu' },
            { text: 'ℹ️ О боте', callback_data: 'about_bot' }
          ]
        ]
      }
    };
  };

  const getCategoryKeyboard = () => {
    return {
      text: "📂 Выберите категорию:",
      keyboard: {
        inline_keyboard: [
          [
            { text: '💒 Свадьба', callback_data: 'category_wedding' },
            { text: '💕 Love Story', callback_data: 'category_lovestory' }
          ],
          [
            { text: '👤 Портрет', callback_data: 'category_portrait' },
            { text: '👨‍👩‍👧‍👦 Семья', callback_data: 'category_family' }
          ],
          [
            { text: '🏢 Корпоратив', callback_data: 'category_corporate' }
          ],
          [
            { text: '❌ Отмена', callback_data: 'cancel' }
          ]
        ]
      }
    }
  }

  const getStats = async () => {
    try {
      const [portfolioResult, bookingsResult, reviewsResult, locationsResult] = await Promise.all([
        supabase.from('portfolio').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('photoshoot_locations').select('*', { count: 'exact', head: true })
      ])

      return {
        text: `📊 <b>Статистика сайта:</b>\n\n` +
              `📸 Фото в портфолио: <b>${portfolioResult.count || 0}</b>\n` +
              `📝 Заявок на съемку: <b>${bookingsResult.count || 0}</b>\n` +
              `⭐ Отзывов: <b>${reviewsResult.count || 0}</b>\n` +
              `📍 Локаций: <b>${locationsResult.count || 0}</b>\n\n` +
              `🕐 Обновлено: ${new Date().toLocaleString('ru-RU')}`,
        keyboard: {
          inline_keyboard: [
            [{ text: '🔙 Назад', callback_data: 'main_menu' }]
          ]
        }
      }
    } catch (error) {
      throw new Error('Ошибка получения статистики: ' + error.message)
    }
  }

  const getAboutBot = () => {
    return {
      text: `ℹ️ <b>О боте управления сайтом</b>\n\n` +
            `🤖 <b>Версия:</b> 2.0 Enhanced\n` +
            `🎯 <b>Возможности:</b>\n` +
            `   • Управление портфолио\n` +
            `   • Добавление локаций\n` +
            `   • Настройка цен и услуг\n` +
            `   • Модерация отзывов\n` +
            `   • AI обработка фотографий\n` +
            `   • Аналитика и статистика\n` +
            `   • Быстрые действия\n\n` +
            `🔄 <b>Автоматические функции:</b>\n` +
            `   • Синхронизация с сайтом\n` +
            `   • Оптимизация изображений\n` +
            `   • Резервное копирование\n\n` +
            `⚡ Бот работает 24/7 и мгновенно обновляет ваш сайт!`,
      keyboard: {
      inline_keyboard: [
        [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
      ]
      }
    };
  };

  return { getMainMenu, getCategoryKeyboard, getStats, getAboutBot };
}
