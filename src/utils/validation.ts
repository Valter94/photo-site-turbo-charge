import { z } from 'zod';

// Validation schemas
export const emailSchema = z.string().email("Неверный формат email");

export const passwordSchema = z.string()
  .min(8, "Пароль должен содержать минимум 8 символов")
  .regex(/[A-Za-z]/, "Пароль должен содержать буквы")
  .regex(/[0-9]/, "Пароль должен содержать цифры");

export const nameSchema = z.string()
  .min(2, "Имя должно содержать минимум 2 символа")
  .max(50, "Имя не должно превышать 50 символов")
  .regex(/^[а-яё\w\s-]+$/ui, "Имя содержит недопустимые символы");

export const phoneSchema = z.string()
  .regex(/^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/, "Неверный формат телефона");

export const textSchema = z.string()
  .min(1, "Поле не может быть пустым")
  .max(1000, "Текст не должен превышать 1000 символов");

export const urlSchema = z.string().url("Неверный формат URL");

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

export const sanitizeHtml = (html: string): string => {
  // Allow only basic formatting tags
  const allowedTags = /<\/?(?:b|i|u|em|strong|p|br|h[1-6])\b[^>]*>/gi;
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<(?!\/?(b|i|u|em|strong|p|br|h[1-6])\b)[^>]+>/gi, '');
};

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const key = identifier;
  
  const record = rateLimitStore.get(key);
  
  if (!record || now - record.lastReset > windowMs) {
    rateLimitStore.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// File validation
export const validateFile = (file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;
    
    // Check file size
    if (file.size > maxSize) {
      resolve({ valid: false, error: `Файл превышает максимальный размер ${maxSize / (1024 * 1024)}MB` });
      return;
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      resolve({ valid: false, error: `Недопустимый тип файла. Разрешены: ${allowedTypes.join(', ')}` });
      return;
    }
    
    // Check image dimensions if specified
    if (options.maxWidth || options.maxHeight) {
      const img = new Image();
      img.onload = () => {
        if (options.maxWidth && img.width > options.maxWidth) {
          resolve({ valid: false, error: `Ширина изображения превышает ${options.maxWidth}px` });
          return;
        }
        if (options.maxHeight && img.height > options.maxHeight) {
          resolve({ valid: false, error: `Высота изображения превышает ${options.maxHeight}px` });
          return;
        }
        resolve({ valid: true });
      };
      img.onerror = () => resolve({ valid: false, error: 'Поврежденное изображение' });
      img.src = URL.createObjectURL(file);
    } else {
      resolve({ valid: true });
    }
  });
};

// Security headers for forms
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};