import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createEnhancedManagementHandlers = (supabase: SupabaseClient) => {
  
  // ===================
  // PORTFOLIO MANAGEMENT
  // ===================
  
  const getPortfolioManagement = async () => {
    const { data: portfolioData, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }

    let portfolioText = `🎨 <b>Управление портфолио</b>\n\n`;
    
    if (portfolioData && portfolioData.length > 0) {
      portfolioText += `<i>Всего фотографий: ${portfolioData.length}</i>\n\n`;
      
      portfolioData.slice(0, 10).forEach((item, index) => {
        const featured = item.is_featured ? '⭐' : '';
        const category = item.category || 'Без категории';
        
        portfolioText += `${index + 1}. ${featured} <b>${item.title}</b>\n`;
        portfolioText += `   📂 <i>${category}</i>\n`;
        portfolioText += `   📅 ${item.shoot_date ? new Date(item.shoot_date).toLocaleDateString('ru-RU') : 'Дата не указана'}\n`;
        portfolioText += `   👤 ${item.client_name || 'Клиент не указан'}\n`;
        portfolioText += `   📍 ${item.location || 'Локация не указана'}\n\n`;
      });
    } else {
      portfolioText += `📭 <i>Портфолио пока пустое</i>\n\n`;
    }

    return {
      text: portfolioText,
      keyboard: {
        inline_keyboard: [
          [
            { text: '📸 Добавить фото', callback_data: 'add_portfolio_photo' },
            { text: '⭐ Сделать избранным', callback_data: 'set_featured_photo' }
          ],
          [
            { text: '✏️ Редактировать', callback_data: 'edit_portfolio' },
            { text: '🗑️ Удалить фото', callback_data: 'delete_portfolio' }
          ],
          [
            { text: '🎨 AI обработка', callback_data: 'ai_photo_processing' },
            { text: '📊 Статистика', callback_data: 'portfolio_stats' }
          ],
          [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    };
  };

  // ===================
  // PRICING MANAGEMENT
  // ===================
  
  const getPricingManagement = async () => {
    const { data: pricingData, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching pricing:', error);
      throw error;
    }

    let pricingText = `💰 <b>Управление ценами</b>\n\n`;
    
    if (pricingData && pricingData.length > 0) {
      pricingText += `<i>Активных пакетов: ${pricingData.length}</i>\n\n`;
      
      pricingData.forEach((item, index) => {
        const price = new Intl.NumberFormat('ru-RU').format(item.price);
        
        pricingText += `${index + 1}. <b>${item.service_type}</b>\n`;
        pricingText += `   💵 ${price} ₽\n`;
        pricingText += `   ⏰ ${item.duration_hours} час${item.duration_hours > 1 ? 'а' : ''}\n`;
        pricingText += `   📸 ${item.photos_count || 'Количество не указано'}\n`;
        pricingText += `   📍 ${item.locations_count || 'Локации не указаны'}\n\n`;
      });
    } else {
      pricingText += `📭 <i>Пакеты услуг не настроены</i>\n\n`;
    }

    return {
      text: pricingText,
      keyboard: {
        inline_keyboard: [
          [
            { text: '➕ Добавить пакет', callback_data: 'add_pricing_package' },
            { text: '✏️ Изменить цену', callback_data: 'edit_pricing' }
          ],
          [
            { text: '🔄 Активировать/деактивировать', callback_data: 'toggle_pricing' },
            { text: '🗑️ Удалить пакет', callback_data: 'delete_pricing' }
          ],
          [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    };
  };

  // ===================
  // REVIEWS MANAGEMENT
  // ===================
  
  const getReviewsManagement = async () => {
    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(15);

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    const approvedCount = reviewsData?.filter(r => r.is_approved).length || 0;
    const pendingCount = reviewsData?.filter(r => !r.is_approved).length || 0;

    let reviewsText = `⭐ <b>Управление отзывами</b>\n\n`;
    reviewsText += `✅ Одобрено: ${approvedCount}\n`;
    reviewsText += `⏳ На модерации: ${pendingCount}\n\n`;
    
    if (reviewsData && reviewsData.length > 0) {
      reviewsData.slice(0, 8).forEach((review, index) => {
        const status = review.is_approved ? '✅' : '⏳';
        const stars = '⭐'.repeat(review.rating);
        
        reviewsText += `${index + 1}. ${status} <b>${review.name}</b> ${stars}\n`;
        reviewsText += `   📧 ${review.email}\n`;
        reviewsText += `   📝 ${review.comment.substring(0, 50)}${review.comment.length > 50 ? '...' : ''}\n`;
        reviewsText += `   📅 ${new Date(review.created_at).toLocaleDateString('ru-RU')}\n\n`;
      });
    } else {
      reviewsText += `📭 <i>Отзывы пока отсутствуют</i>\n\n`;
    }

    return {
      text: reviewsText,
      keyboard: {
        inline_keyboard: [
          [
            { text: '✅ Модерация отзывов', callback_data: 'moderate_reviews' },
            { text: '📊 Статистика отзывов', callback_data: 'reviews_stats' }
          ],
          [
            { text: '🗑️ Удалить отзыв', callback_data: 'delete_review' },
            { text: '⭐ Отвечать на отзывы', callback_data: 'reply_to_reviews' }
          ],
          [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    };
  };

  // ===================
  // SITE ANALYTICS
  // ===================
  
  const getSiteAnalytics = async () => {
    // Получаем статистику с сайта
    const [portfolioCount, locationsCount, reviewsCount, pricingCount] = await Promise.all([
      supabase.from('portfolio').select('id', { count: 'exact' }),
      supabase.from('photoshoot_locations').select('id', { count: 'exact' }),
      supabase.from('reviews').select('id', { count: 'exact' }).eq('is_approved', true),
      supabase.from('pricing').select('id', { count: 'exact' }).eq('is_active', true)
    ]);

    let analyticsText = `📊 <b>Аналитика сайта</b>\n\n`;
    analyticsText += `🎨 Фотографий в портфолио: ${portfolioCount.count || 0}\n`;
    analyticsText += `📍 Локаций для съемки: ${locationsCount.count || 0}\n`;
    analyticsText += `⭐ Одобренных отзывов: ${reviewsCount.count || 0}\n`;
    analyticsText += `💰 Активных пакетов услуг: ${pricingCount.count || 0}\n\n`;

    // Получаем последние обновления
    const { data: recentActivity, error } = await supabase
      .from('portfolio')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error && recentActivity && recentActivity.length > 0) {
      analyticsText += `📈 <b>Последние обновления:</b>\n`;
      recentActivity.forEach((item, index) => {
        const date = new Date(item.created_at).toLocaleDateString('ru-RU');
        analyticsText += `${index + 1}. ${item.title} - ${date}\n`;
      });
      analyticsText += `\n`;
    }

    return {
      text: analyticsText,
      keyboard: {
        inline_keyboard: [
          [
            { text: '📈 Детальная статистика', callback_data: 'detailed_analytics' },
            { text: '💾 Экспорт данных', callback_data: 'export_data' }
          ],
          [
            { text: '🔄 Обновить', callback_data: 'site_analytics' },
            { text: '🔙 Главное меню', callback_data: 'main_menu' }
          ]
        ]
      }
    };
  };

  // ===================
  // AI PHOTO PROCESSING
  // ===================
  
  const getAIPhotoMenu = async () => {
    return {
      text: `🤖 <b>AI Обработка фотографий</b>\n\n` +
            `Выберите тип обработки для ваших фотографий:\n\n` +
            `🖼️ <b>Удаление фона</b> - Автоматическое удаление фона с помощью AI\n` +
            `🎨 <b>Копирование стиля</b> - Перенос стиля с одной фотографии на другую\n` +
            `⚡ <b>Улучшение качества</b> - AI upscaling и улучшение резкости\n` +
            `✨ <b>Автоулучшение</b> - Комплексная обработка для улучшения фото\n` +
            `📐 <b>Коррекция перспективы</b> - Исправление геометрических искажений\n\n` +
            `Просто отправьте фотографию и выберите тип обработки!`,
      keyboard: {
        inline_keyboard: [
          [
            { text: '🖼️ Удалить фон', callback_data: 'ai_remove_background' },
            { text: '🎨 Копировать стиль', callback_data: 'ai_style_transfer' }
          ],
          [
            { text: '⚡ Улучшить качество', callback_data: 'ai_upscale' },
            { text: '✨ Автоулучшение', callback_data: 'ai_enhance' }
          ],
          [
            { text: '📐 Коррекция', callback_data: 'ai_perspective' },
            { text: '📋 История обработки', callback_data: 'ai_history' }
          ],
          [{ text: '🔙 Назад', callback_data: 'portfolio_management' }]
        ]
      }
    };
  };

  // ===================
  // QUICK ACTIONS
  // ===================
  
  const getQuickActions = async () => {
    return {
      text: `⚡ <b>Быстрые действия</b>\n\n` +
            `Часто используемые функции для управления сайтом:\n\n` +
            `📸 Добавить фото в портфолио\n` +
            `📍 Добавить новую локацию\n` +
            `💰 Обновить цены\n` +
            `⭐ Проверить новые отзывы\n` +
            `📊 Посмотреть статистику\n` +
            `🤖 AI обработка фотографий`,
      keyboard: {
        inline_keyboard: [
          [
            { text: '📸 + Фото', callback_data: 'quick_add_photo' },
            { text: '📍 + Локация', callback_data: 'quick_add_location' }
          ],
          [
            { text: '💰 Цены', callback_data: 'pricing_management' },
            { text: '⭐ Отзывы', callback_data: 'reviews_management' }
          ],
          [
            { text: '📊 Статистика', callback_data: 'site_analytics' },
            { text: '🤖 AI обработка', callback_data: 'ai_photo_processing' }
          ],
          [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    };
  };

  return {
    getPortfolioManagement,
    getPricingManagement,
    getReviewsManagement,
    getSiteAnalytics,
    getAIPhotoMenu,
    getQuickActions
  };
};