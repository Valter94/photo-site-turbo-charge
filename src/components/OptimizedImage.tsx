
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
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setImageError(true);
      if (fallbackUrl) {
        (event.target as HTMLImageElement).src = fallbackUrl;
      }
      // Подробно логируем ошибку для Telegram фото
      if (src && (src.includes('api.telegram.org/file/bot') || src.includes('supabase.co'))) {
        console.error('[OptimizedImage] ❌ Элемент с src не загрузился:', src);
      }
    },
    [fallbackUrl, src]
  );

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

  const isSupabaseImage = src.includes('supabase.co') || src.includes('ojrekbttkriwwyaupbox');
  const isTelegramPhoto =
    src.startsWith('https://api.telegram.org/file/bot') ||
    src.includes('api.telegram.org/file/bot');

  if (isTelegramPhoto) {
    console.log('[OptimizedImage] 🟠 Telegram-фото:', src);
  }

  const createOptimizedUrl = (
    url: string,
    format: 'webp' | 'avif' | 'jpeg' = 'webp'
  ) => {
    if (isSupabaseImage || isTelegramPhoto) return url;
    if (url?.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('fit', 'crop');
      params.append('q', '80');
      if (format !== 'jpeg') params.append('fm', format);
      return `${url}&${params.toString()}`;
    }
    return url;
  };

  const webpSrc = createOptimizedUrl(src, 'webp');
  const avifSrc = createOptimizedUrl(src, 'avif');
  const jpegSrc = createOptimizedUrl(src, 'jpeg');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
        </div>
      )}
      <picture>
        {!(isSupabaseImage || isTelegramPhoto) && (
          <>
            <source srcSet={avifSrc} type="image/avif" />
            <source srcSet={webpSrc} type="image/webp" />
          </>
        )}
        {/* Telegram/Storage/Unsplash — обычное изображение */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </picture>
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Изображение недоступно</div>
            {/* Подсказка для Telegram фото */}
            {isTelegramPhoto && (
              <div className="text-xs mt-2 text-red-400">
                Telegram ссылки часто недоступны, загрузите фото на сайт напрямую.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
