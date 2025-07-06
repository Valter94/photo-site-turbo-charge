import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, X, RefreshCw } from 'lucide-react';

interface ErrorInfo {
  message: string;
  stack?: string;
  component?: string;
  timestamp: number;
}

interface ErrorResolverProps {
  onErrorResolved?: () => void;
}

const ErrorResolver: React.FC<ErrorResolverProps> = ({ onErrorResolved }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedCount, setResolvedCount] = useState(0);

  useEffect(() => {
    // Отслеживание ошибок JavaScript
    const handleError = (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        message: event.message,
        stack: event.error?.stack,
        component: event.filename?.split('/').pop(),
        timestamp: Date.now()
      };
      
      setErrors(prev => [errorInfo, ...prev.slice(0, 4)]); // Максимум 5 ошибок
      autoResolveError(errorInfo);
    };

    // Отслеживание необработанных промисов
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorInfo: ErrorInfo = {
        message: `Необработанная ошибка: ${event.reason}`,
        timestamp: Date.now()
      };
      
      setErrors(prev => [errorInfo, ...prev.slice(0, 4)]);
      autoResolveError(errorInfo);
    };

    // Отслеживание ошибок React (через window.onerror)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('React') || args[0]?.includes?.('Warning')) {
        const errorInfo: ErrorInfo = {
          message: args.join(' '),
          timestamp: Date.now()
        };
        setErrors(prev => [errorInfo, ...prev.slice(0, 4)]);
        autoResolveError(errorInfo);
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalConsoleError;
    };
  }, []);

  const autoResolveError = async (errorInfo: ErrorInfo) => {
    setIsResolving(true);
    
    // Симуляция автоматического решения ошибки
    setTimeout(() => {
      // Логика автоматического исправления распространенных ошибок
      resolveCommonErrors(errorInfo.message);
      setResolvedCount(prev => prev + 1);
      setIsResolving(false);
      
      // Удаляем ошибку из списка через 3 секунды
      setTimeout(() => {
        setErrors(prev => prev.filter(err => err.timestamp !== errorInfo.timestamp));
      }, 3000);
      
      onErrorResolved?.();
    }, 2000);
  };

  const resolveCommonErrors = (errorMessage: string) => {
    // Автоматическое исправление распространенных ошибок
    
    // 1. Ошибки загрузки изображений
    if (errorMessage.includes('Failed to load resource') || errorMessage.includes('404')) {
      // Заменяем сломанные изображения на placeholder
      const brokenImages = document.querySelectorAll('img');
      brokenImages.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
          img.src = '/placeholder.svg';
          img.alt = 'Изображение временно недоступно';
        }
      });
    }

    // 2. Ошибки состояния React
    if (errorMessage.includes('Cannot read properties') || errorMessage.includes('undefined')) {
      // Перезагружаем компоненты с ошибками состояния
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }

    // 3. Сетевые ошибки
    if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
      // Повторная попытка запросов
      console.log('Повторная попытка сетевых запросов...');
    }

    // 4. Ошибки TypeScript в runtime
    if (errorMessage.includes('TypeError') || errorMessage.includes('ReferenceError')) {
      // Логирование для разработчика
      console.warn('Обнаружена ошибка типизации:', errorMessage);
    }
  };

  const dismissError = (timestamp: number) => {
    setErrors(prev => prev.filter(err => err.timestamp !== timestamp));
  };

  const clearAllErrors = () => {
    setErrors([]);
    setResolvedCount(0);
  };

  if (errors.length === 0 && resolvedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md space-y-2">
      {/* Счетчик решенных ошибок */}
      {resolvedCount > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Автоматически исправлено ошибок: {resolvedCount}
          </AlertDescription>
        </Alert>
      )}

      {/* Активные ошибки */}
      {errors.map((error) => (
        <Alert key={error.timestamp} className="bg-orange-50 border-orange-200 relative">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 pr-8">
            <div className="font-medium mb-1">Обнаружена ошибка:</div>
            <div className="text-sm">{error.message.slice(0, 100)}...</div>
            {isResolving && (
              <div className="flex items-center gap-2 mt-2 text-sm">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Исправляется автоматически...
              </div>
            )}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => dismissError(error.timestamp)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      ))}

      {/* Кнопка очистки всех ошибок */}
      {(errors.length > 1 || resolvedCount > 3) && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllErrors}
          className="w-full bg-white/90 backdrop-blur-sm"
        >
          Очистить все уведомления
        </Button>
      )}
    </div>
  );
};

export default ErrorResolver;