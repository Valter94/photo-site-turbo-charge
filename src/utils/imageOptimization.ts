
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

  // Для Unsplash изображений
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

  // Для локальных изображений - возвращаем оригинальный URL
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
 * Ленивая загрузка изображений с Intersection Observer
 */
export const setupLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const dataSrc = img.getAttribute('data-src');
          
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Находим все изображения с data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
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
 * Компрессия изображений на клиенте (для загрузки пользователями)
 */
export const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Определяем размеры для сжатия
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Рисуем и сжимаем
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/jpeg',
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};
