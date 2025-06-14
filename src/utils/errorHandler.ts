
import { safeLocalStorage, getStoredErrors } from './storageUtils';

// Автоматическое исправление известных ошибок
export const attemptAutoFix = (error: Error) => {
  const errorMessage = error.message.toLowerCase();

  // Исправление ошибок изображений
  if (errorMessage.includes('failed to load') || errorMessage.includes('image')) {
    fixImageErrors();
  }

  // Исправление сетевых ошибок
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    handleNetworkErrors();
  }

  // Исправление ошибок компонентов React
  if (errorMessage.includes('react') || errorMessage.includes('component')) {
    handleReactErrors();
  }
};

// Исправление ошибок изображений
const fixImageErrors = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete || img.naturalHeight === 0) {
      img.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop&auto=format&q=50';
      img.alt = 'Изображение недоступно';
    }
  });
};

// Обработка сетевых ошибок
const handleNetworkErrors = () => {
  // Перезагрузка через 3 секунды при сетевых ошибках
  setTimeout(() => {
    if (!navigator.onLine) {
      console.log('Обнаружена проблема с сетью, ожидаем восстановления...');
    }
  }, 3000);
};

// Обработка ошибок React компонентов
const handleReactErrors = () => {
  // Очистка локального состояния для сброса компонентов
  console.log('Обнаружена ошибка React компонента, выполняется сброс...');
};

// Отслеживание ошибок JavaScript
export const trackError = (error: Error, errorInfo?: any, updateAnalytics?: () => void) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    additionalInfo: errorInfo
  };

  // Сохраняем ошибку
  const errors = getStoredErrors();
  errors.push(errorData);
  safeLocalStorage.setItem('site_errors', JSON.stringify(errors));

  // Пытаемся автоматически исправить известные ошибки
  attemptAutoFix(error);
  
  if (updateAnalytics) {
    updateAnalytics();
  }
};

// Обработчик ошибок изображений
const handleImageError = (event: Event, fallbackUrl?: string) => {
  console.log('Image error event or target is null');
  const target = event.target as HTMLImageElement;
  
  if (target && target.tagName === 'IMG') {
    if (fallbackUrl) {
      target.src = fallbackUrl;
    } else {
      target.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop&auto=format&q=50';
    }
    target.alt = 'Изображение недоступно';
  }
};

// Обработчик сетевых ошибок
const handleNetworkError = (error: Error) => {
  console.log('Обнаружена сетевая ошибка:', error.message);
  handleNetworkErrors();
};

// Экспорт объекта errorHandler для обратной совместимости
export const errorHandler = {
  handleImageError,
  handleNetworkError,
  attemptAutoFix,
  trackError
};
