import { useState, useEffect } from 'react';
import { sendTelegramMessage } from "@/utils/telegram";
import { AnalyticsData, Recommendation } from '@/types/analytics';
import { 
  safeLocalStorage,
  getOrCreateSessionId, 
  getDeviceInfo, 
  getStoredPageViews, 
  getStoredErrors 
} from '@/utils/storageUtils';
import { trackError } from '@/utils/errorHandler';
import { generateRecommendations } from '@/utils/recommendationsGenerator';

export const useSiteAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    deviceTypes: [],
    errors: []
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Новый флаг: exclude analytics (например, если в localStorage стоит "analytics_exclude" = "true")
  const isExcluded = (() => {
    try {
      return localStorage.getItem('analytics_exclude') === 'true';
    } catch {
      return false;
    }
  })();

  // Отслеживание посещений страниц
  const trackPageView = (path: string) => {
    if (isExcluded) return; // Игнорировать текущий ПК

    const sessionId = getOrCreateSessionId();
    const deviceInfo = getDeviceInfo();
    
    // Сохраняем данные о посещении
    const pageView = {
      session_id: sessionId,
      page_path: path,
      timestamp: new Date().toISOString(),
      device_type: deviceInfo.type,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      screen_resolution: `${screen.width}x${screen.height}`
    };

    // В реальном проекте здесь была бы отправка в базу данных
    safeLocalStorage.setItem('page_views', JSON.stringify([
      ...getStoredPageViews(),
      pageView
    ]));

    updateAnalytics();
  };

  // Список chat_id для Telegram (из localStorage, можно редактировать в TelegramSettings)
  const getChatIds = () => {
    return [
      safeLocalStorage.getItem('TELEGRAM_CHAT_ID_1'),
      safeLocalStorage.getItem('TELEGRAM_CHAT_ID_2')
    ].filter(Boolean) as string[];
  };

  // Отправка важных событий в Telegram
  const notifyTelegram = (msg: string) => {
    const chatIds = getChatIds();
    if (chatIds.length > 0) {
      sendTelegramMessage(msg, chatIds);
    }
  };

  // Обновление аналитики
  const updateAnalytics = () => {
    const pageViews = getStoredPageViews();
    const errors = getStoredErrors();
    
    // Отправляем уведомление только если есть настроенные чаты
    const chatIds = getChatIds();
    if (chatIds.length > 0) {
      notifyTelegram(
        `👁 Кто-то посетил страницу: <b>${window.location.pathname}</b>\n`+
        `Всего просмотров: <b>${pageViews.length}</b>`
      );
    }
    
    // Подсчет уникальных посетителей
    const uniqueSessions = new Set(pageViews.map(pv => pv.session_id)).size;
    
    // Подсчет типов устройств
    const deviceTypes = pageViews.reduce((acc, pv) => {
      const existing = acc.find(d => d.type === pv.device_type);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ type: pv.device_type, count: 1 });
      }
      return acc;
    }, [] as Array<{ type: string; count: number }>);

    // Топ страниц
    const topPages = pageViews.reduce((acc, pv) => {
      const existing = acc.find(p => p.path === pv.page_path);
      if (existing) {
        existing.views++;
      } else {
        acc.push({ path: pv.page_path, views: 1 });
      }
      return acc;
    }, [] as Array<{ path: string; views: number }>)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

    // Группировка ошибок
    const groupedErrors = errors.reduce((acc, error) => {
      const existing = acc.find(e => e.message === error.message);
      if (existing) {
        existing.count++;
        if (new Date(error.timestamp) > existing.lastOccurred) {
          existing.lastOccurred = new Date(error.timestamp);
        }
      } else {
        acc.push({
          message: error.message,
          count: 1,
          lastOccurred: new Date(error.timestamp)
        });
      }
      return acc;
    }, [] as Array<{ message: string; count: number; lastOccurred: Date }>);

    setAnalytics({
      pageViews: pageViews.length,
      uniqueVisitors: uniqueSessions,
      bounceRate: Math.round(Math.random() * 30 + 40), // Симуляция
      avgSessionDuration: Math.round(Math.random() * 300 + 120), // Симуляция в секундах
      topPages,
      deviceTypes,
      errors: groupedErrors
    });
  };

  // Доп: функция очистки статистики (только для админки)
  const resetAnalytics = () => {
    safeLocalStorage.setItem('page_views', JSON.stringify([]));
    safeLocalStorage.setItem('errors', JSON.stringify([]));
    setAnalytics({
      pageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      topPages: [],
      deviceTypes: [],
      errors: [],
    });
    setRecommendations([]);
  };

  // Инициализация
  useEffect(() => {
    // Отслеживание текущей страницы
    trackPageView(window.location.pathname);
    
    // Обработчик ошибок
    const errorHandler = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, updateAnalytics);
    };

    // Обработчик необработанных промисов
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`), undefined, updateAnalytics);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    // Обновление аналитики при загрузке
    updateAnalytics();
    setIsLoading(false);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, []);

  // Обновление рекомендаций при изменении аналитики
  useEffect(() => {
    setRecommendations(generateRecommendations(analytics));
  }, [analytics]);

  return {
    analytics,
    recommendations,
    isLoading,
    trackPageView,
    trackError: (error: Error, errorInfo?: any) => trackError(error, errorInfo, updateAnalytics),
    updateAnalytics,
    resetAnalytics // новый метод
  };
};
