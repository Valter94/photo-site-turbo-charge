
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  useEffect(() => {
    // Измерение Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      
      // Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart
        }));
      }

      // First Contentful Paint (FCP)
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({
          ...prev,
          fcp: fcpEntry.startTime
        }));
      }

      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            setMetrics(prev => ({
              ...prev,
              lcp: lastEntry.startTime
            }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
                setMetrics(prev => ({
                  ...prev,
                  cls: clsValue
                }));
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              setMetrics(prev => ({
                ...prev,
                fid: (entry as any).processingStart - entry.startTime
              }));
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Очистка наблюдателей при размонтировании
          return () => {
            lcpObserver.disconnect();
            clsObserver.disconnect();
            fidObserver.disconnect();
          };
        } catch (error) {
          console.warn('Performance Observer not supported:', error);
        }
      }
    }
  }, []);

  // Функция для отправки метрик (например, в Google Analytics)
  const sendMetrics = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== null) {
          (window as any).gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: key.toUpperCase(),
            value: Math.round(value),
            non_interaction: true,
          });
        }
      });
    }
  };

  // Оценка производительности
  const getPerformanceScore = (): 'good' | 'needs-improvement' | 'poor' => {
    const { lcp, fid, cls } = metrics;
    
    if (lcp === null || fid === null || cls === null) {
      return 'needs-improvement';
    }

    const lcpScore = lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor';
    const fidScore = fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor';
    const clsScore = cls <= 0.1 ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor';

    const scores = [lcpScore, fidScore, clsScore];
    
    if (scores.every(score => score === 'good')) return 'good';
    if (scores.some(score => score === 'poor')) return 'poor';
    return 'needs-improvement';
  };

  return {
    metrics,
    sendMetrics,
    performanceScore: getPerformanceScore()
  };
};

// Хук для мониторинга скорости интернета
export const useNetworkSpeed = () => {
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionSpeed = () => {
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setConnectionSpeed('slow');
        } else {
          setConnectionSpeed('fast');
        }
      };

      updateConnectionSpeed();
      connection.addEventListener('change', updateConnectionSpeed);

      return () => {
        connection.removeEventListener('change', updateConnectionSpeed);
      };
    }
  }, []);

  return connectionSpeed;
};

// Хук для адаптивной загрузки контента в зависимости от производительности
export const useAdaptiveLoading = () => {
  const { performanceScore } = usePerformance();
  const connectionSpeed = useNetworkSpeed();

  const shouldReduceQuality = performanceScore === 'poor' || connectionSpeed === 'slow';
  const shouldPreloadImages = performanceScore === 'good' && connectionSpeed === 'fast';
  const shouldUseWebP = performanceScore !== 'poor';

  return {
    shouldReduceQuality,
    shouldPreloadImages,
    shouldUseWebP,
    imageQuality: shouldReduceQuality ? 60 : 80,
    maxImageWidth: shouldReduceQuality ? 800 : 1200
  };
};
