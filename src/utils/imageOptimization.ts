
// Утилиты для оптимизации изображений

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'crop' | 'fill' | 'cover' | 'contain';
}

/**
 * Генерирует оптимизированный URL для изображения
 */
export const getOptimizedImageUrl = (src: string, options: ImageOptions = {}): string => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'webp',
    fit = 'crop'
  } = options;

  // Проверяем источник изображения
  const isTelegramPhoto = src.includes('api.telegram.org/file/bot');
  const isSupabaseImage = src.includes('supabase.co') || src.includes('ojrekbttkriwwyaupbox');

  // Для Telegram и Supabase возвращаем оригинальный URL
  if (isTelegramPhoto || isSupabaseImage) {
    return src;
  }

  // Для Unsplash изображений применяем оптимизацию
  if (src.includes('unsplash.com')) {
    const params = new URLSearchParams();
    params.append('w', width.toString());
    params.append('h', height.toString());
    params.append('fit', fit);
    params.append('q', quality.toString());
    if (format === 'webp') {
      params.append('fm', 'webp');
    }
    
    return `${src}&${params.toString()}`;
  }

  return src;
};

/**
 * Создает srcset для responsive изображений
 */
export const generateSrcSet = (src: string, sizes: number[] = [400, 800, 1200]): string => {
  return sizes.map(size => {
    const optimizedUrl = getOptimizedImageUrl(src, { width: size });
    return `${optimizedUrl} ${size}w`;
  }).join(', ');
};

/**
 * Генерирует WebP и fallback версии изображения
 */
export const getImageSources = (src: string, options: ImageOptions = {}) => {
  return {
    webp: getOptimizedImageUrl(src, { ...options, format: 'webp' }),
    fallback: getOptimizedImageUrl(src, { ...options, format: 'jpeg' })
  };
};

/**
 * Предзагрузка критических изображений
 */
export const preloadImage = (src: string, options: ImageOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const optimizedSrc = getOptimizedImageUrl(src, options);
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${optimizedSrc}`));
    img.src = optimizedSrc;
  });
};

/**
 * Проверка доступности изображения
 */
export const checkImageAvailability = async (src: string): Promise<boolean> => {
  try {
    const response = await fetch(src, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Определение поддержки WebP браузером
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Получение размеров изображения
 */
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));  
    };
    img.src = src;
  });
};
