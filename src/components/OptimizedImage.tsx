
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
      // переключить на fallbackUrl если есть
      if (fallbackUrl && (event.target as HTMLImageElement).src !== fallbackUrl) {
        (event.target as HTMLImageElement).src = fallbackUrl;
        console.warn('[OptimizedImage] Сработал fallbackUrl:', fallbackUrl);
      } else {
        (event.target as HTMLImageElement).src = "/placeholder.svg";
        console.warn('[OptimizedImage] fallback не помог — ставим placeholder');
      }
      // Подробнее логируем ошибку
      if (src && (src.includes('api.telegram.org/file/bot') || src.includes('supabase.co'))) {
        console.error('[OptimizedImage] ❌ Не отображается фото (Telegram/Supabase):', src);
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
    console.log('[OptimizedImage] Telegram-фото, src:', src);
  }

  const createOptimizedUrl = (
    url: string,
    format: 'webp' | 'avif' | 'jpeg' = 'webp'
  ) => {
    // Не трансформировать Telegram/Supabase ссылки!
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
        {/* Только если НЕ Supabase/Telegram — используем modern src */}
        {!(isSupabaseImage || isTelegramPhoto) && (
          <>
            <source srcSet={avifSrc} type="image/avif" />
            <source srcSet={webpSrc} type="image/webp" />
          </>
        )}
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
            <div className="text-sm">
              Изображение недоступно<br/>
              {isTelegramPhoto && (
                <span className="block text-xs mt-2 text-red-400">
                  Telegram-фото не доступны навсегда.<br/>Загрузите фото напрямую или используйте Supabase-хранилище для долговременного доступа.
                </span>
              )}
              {!isTelegramPhoto && isSupabaseImage && (
                <span className="block text-xs mt-2 text-amber-600">
                  Проверьте права на файл Supabase Storage.<br/>Файл может быть удалён или приватен.
                </span>
              )}
              {!isTelegramPhoto && !isSupabaseImage && (
                <span className="block text-xs mt-2">
                  Ошибка при загрузке изображения.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

