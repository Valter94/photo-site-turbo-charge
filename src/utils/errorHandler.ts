
// Утилита для автоматического исправления ошибок
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCount = 0;
  private maxErrors = 10;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Обработка ошибок изображений
  handleImageError = (event: Event, fallbackUrl?: string) => {
    const img = event.target as HTMLImageElement;
    if (!img.dataset.errorHandled) {
      img.dataset.errorHandled = 'true';
      
      // Список запасных изображений
      const fallbacks = [
        fallbackUrl,
        'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop&auto=format&q=50',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=50',
        'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Изображение+недоступно'
      ].filter(Boolean);

      const currentIndex = parseInt(img.dataset.fallbackIndex || '0');
      if (currentIndex < fallbacks.length - 1) {
        img.dataset.fallbackIndex = (currentIndex + 1).toString();
        img.src = fallbacks[currentIndex + 1] as string;
      }
    }
  };

  // Обработка ошибок сети
  handleNetworkError = async (error: any, retryFn?: () => Promise<any>) => {
    console.error('Network Error:', error);
    
    if (this.errorCount < this.maxErrors && retryFn) {
      this.errorCount++;
      console.log(`Retry attempt ${this.errorCount}/${this.maxErrors}`);
      
      // Экспоненциальная задержка
      const delay = Math.min(1000 * Math.pow(2, this.errorCount - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        return await retryFn();
      } catch (retryError) {
        return this.handleNetworkError(retryError, retryFn);
      }
    }
    
    throw error;
  };

  // Сброс счетчика ошибок
  resetErrorCount = () => {
    this.errorCount = 0;
  };

  // Валидация файлов
  validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Неподдерживаемый формат файла. Разрешены: JPG, PNG, WebP, GIF';
    }

    if (file.size > maxSize) {
      return 'Файл слишком большой. Максимальный размер: 10MB';
    }

    if (file.size === 0) {
      return 'Файл поврежден или пуст';
    }

    return null;
  };

  // Валидация URL
  validateImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const hasImageExtension = imageExtensions.some(ext => 
        urlObj.pathname.toLowerCase().endsWith(ext)
      );
      
      // Разрешаем известные домены изображений
      const allowedDomains = ['unsplash.com', 'supabase.co', 'githubusercontent.com'];
      const isAllowedDomain = allowedDomains.some(domain => 
        urlObj.hostname.includes(domain)
      );

      return hasImageExtension || isAllowedDomain;
    } catch {
      return false;
    }
  };
}

export const errorHandler = ErrorHandler.getInstance();
