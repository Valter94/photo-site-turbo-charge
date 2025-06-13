
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  loading = 'lazy' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Image failed to load:', src);
    setImageError(true);
  };

  // Проверяем, является ли изображение из Supabase Storage
  const isSupabaseImage = src?.includes('supabase.co') || src?.includes('ojrekbttkriwwyaupbox');
  
  // Создаем WebP версию только для внешних изображений
  const webpSrc = !isSupabaseImage && src?.includes('unsplash.com') 
    ? `${src}&fm=webp&q=80` 
    : src;

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

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-rose-400 rounded-full animate-spin"></div>
        </div>
      )}
      
      {isSupabaseImage ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
          />
        </picture>
      )}

      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Изображение недоступно</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
