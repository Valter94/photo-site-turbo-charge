
import { useCallback, useEffect, useRef } from 'react';

// Debounce hook для оптимизации частых вызовов
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
};

// Throttle hook для ограничения частоты вызовов
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  const throttledCallback = useCallback((...args: any[]) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);

  return throttledCallback as T;
};

// Предзагрузка изображений
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(url => 
      new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load ${url}`));
        img.src = url;
      })
    )
  );
};

// Оптимизация рендеринга списков
export const useVirtualization = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const bufferCount = Math.floor(visibleCount / 2);
  
  return {
    visibleCount: visibleCount + bufferCount * 2,
    getVisibleItems: (scrollTop: number) => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferCount);
      const endIndex = Math.min(items.length, startIndex + visibleCount + bufferCount * 2);
      
      return {
        startIndex,
        endIndex,
        items: items.slice(startIndex, endIndex)
      };
    }
  };
};

// Мониторинг производительности
export const performanceMonitor = {
  measureRender: (componentName: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`🎯 ${componentName} рендер: ${(end - start).toFixed(2)}ms`);
  },

  measureAsync: async (operationName: string, fn: () => Promise<any>) => {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      console.log(`⚡ ${operationName}: ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`❌ ${operationName} ошибка за ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  },

  memoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
};

// Кэширование для компонентов
const cache = new Map();

export const memoizeComponent = <T>(
  key: string,
  factory: () => T,
  ttl: number = 5 * 60 * 1000 // 5 минут
): T => {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.value;
  }
  
  const value = factory();
  cache.set(key, { value, timestamp: Date.now() });
  
  return value;
};

// Очистка кэша при размонтировании
export const useCacheCleanup = () => {
  useEffect(() => {
    return () => {
      // Очищаем устаревший кэш при размонтировании
      const now = Date.now();
      const ttl = 5 * 60 * 1000;
      
      for (const [key, cached] of cache.entries()) {
        if (now - cached.timestamp > ttl) {
          cache.delete(key);
        }
      }
    };
  }, []);
};
