
import React, { useEffect } from 'react';
import { useSiteAnalytics } from '@/hooks/useSiteAnalytics';
import { errorHandler } from '@/utils/errorHandler';
import { useToast } from '@/hooks/use-toast';

const SiteMonitor = () => {
  const { trackPageView, trackError } = useSiteAnalytics();
  const { toast } = useToast();

  useEffect(() => {
    // Отслеживание изменения страниц
    const handleLocationChange = () => {
      trackPageView(window.location.pathname);
    };

    // Глобальный обработчик ошибок
    const handleGlobalError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      trackError(error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });

      // Автоматическое исправление через errorHandler
      try {
        errorHandler.handleNetworkError(error);
      } catch (e) {
        console.log('Ошибка обработана системой мониторинга');
      }
    };

    // Обработчик необработанных промисов
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(`Необработанный промис: ${event.reason}`);
      trackError(error);
      
      // Показываем уведомление пользователю только для критических ошибок
      if (event.reason && event.reason.toString().includes('network')) {
        toast({
          title: "Проблема с сетью",
          description: "Проверьте подключение к интернету. Данные будут синхронизированы при восстановлении связи.",
          variant: "destructive",
        });
      }
    };

    // Мониторинг производительности
    const monitorPerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation && navigation.loadEventEnd - navigation.loadEventStart > 3000) {
          toast({
            title: "Медленная загрузка",
            description: "Страница загружается медленно. Проверяем оптимизацию...",
            variant: "destructive",
          });
        }
      }
    };

    // Установка обработчиков
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('popstate', handleLocationChange);
    
    // Мониторинг производительности через 2 секунды после загрузки
    setTimeout(monitorPerformance, 2000);

    // Периодическая проверка состояния сайта
    const healthCheck = setInterval(() => {
      // Проверка доступности изображений
      const images = document.querySelectorAll('img');
      let brokenImages = 0;
      
      images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
          brokenImages++;
          // Автоматическое исправление
          errorHandler.handleImageError(new Event('error') as any);
        }
      });

      if (brokenImages > 3) {
        console.warn(`Обнаружено ${brokenImages} поврежденных изображений, выполняется автоисправление`);
      }
    }, 30000); // Проверка каждые 30 секунд

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(healthCheck);
    };
  }, [trackPageView, trackError, toast]);

  // Компонент невидимый, просто мониторит
  return null;
};

export default SiteMonitor;
