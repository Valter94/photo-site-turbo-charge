
import React, { useState, useCallback, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fallbackUrl?: string;
  priority?: boolean;
  preserveAspectRatio?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  fallbackUrl,
  priority = false,
  preserveAspectRatio = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setCurrentSrc(src);
    setImageDimensions(null);
  }, [src]);

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    console.log('Image failed to load:', currentSrc);
    setImageError(true);
    
    // Попробуем fallback URL, если есть
    if (fallbackUrl && currentSrc !== fallbackUrl) {
      console.log('Trying fallback URL:', fallbackUrl);
      setCurrentSrc(fallbackUrl);
      setImageError(false);
      return;
    }
    
    // Иначе используем placeholder
    setCurrentSrc("/placeholder.svg");
  }, [fallbackUrl, currentSrc]);

  if (!src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-sm">Нет изображения</div>
        </div>
      </div>
    );
  }

  const isTelegramPhoto = src.includes('api.telegram.org/file/bot') || src.startsWith('https://api.telegram.org/file/bot');
  const isSupabaseImage = src.includes('supabase.co') || src.includes('ojrekbttkriwwyaupbox');

  const createOptimizedUrl = (url: string, format: 'webp' | 'avif' | 'jpeg' = 'webp') => {
    // Для Telegram и Supabase изображений возвращаем оригинальный URL без изменений
    if (isTelegramPhoto || isSupabaseImage) return url;
    
    if (url?.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('fit', 'crop');
      params.append('q', '90'); // Увеличиваем качество
      if (format !== 'jpeg') params.append('fm', format);
      return `${url}&${params.toString()}`;
    }
    
    return url;
  };

  const webpSrc = createOptimizedUrl(src, 'webp');
  const avifSrc = createOptimizedUrl(src, 'avif');

  // Определяем стили для изображения в зависимости от источника
  const getImageStyles = () => {
    let baseStyles = 'transition-opacity duration-300';
    
    if (imageLoaded) {
      baseStyles += ' opacity-100';
    } else {
      baseStyles += ' opacity-0';
    }

    // Для изображений с бота сохраняем пропорции и предотвращаем обрезание
    if (isTelegramPhoto || isSupabaseImage) {
      if (preserveAspectRatio) {
        baseStyles += ' w-full h-auto object-contain';
      } else {
        baseStyles += ' w-full h-full object-cover';
      }
    } else {
      baseStyles += ' w-full h-full object-cover';
    }

    return baseStyles;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
        </div>
      )}
      
      <picture>
        {!isTelegramPhoto && !isSupabaseImage && (
          <>
            <source srcSet={avifSrc} type="image/avif" />
            <source srcSet={webpSrc} type="image/webp" />
          </>
        )}
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={getImageStyles()}
          style={{
            aspectRatio: width && height && preserveAspectRatio ? `${width}/${height}` : 'auto',
            maxWidth: '100%',
            height: preserveAspectRatio ? 'auto' : undefined,
          }}
        />
      </picture>
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center p-4">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm mb-2">Изображение недоступно</div>
            {isTelegramPhoto && (
              <div className="text-xs text-red-500">
                Временная ссылка из Telegram
              </div>
            )}
          </div>
        </div>
      )}
      
      {isSupabaseImage && imageLoaded && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs p-1 text-center">
          ✅ Сохранено постоянно
        </div>
      )}

      {/* Показываем размеры изображения для отладки */}
      {imageDimensions && (isTelegramPhoto || isSupabaseImage) && (
        <div className="absolute top-0 left-0 bg-black/60 text-white text-xs p-1 rounded-br">
          {imageDimensions.width}×{imageDimensions.height}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
