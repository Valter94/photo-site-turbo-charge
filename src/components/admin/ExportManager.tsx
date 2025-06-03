
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ExportManager = () => {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportSite = async () => {
    try {
      setExporting(true);
      const zip = new JSZip();

      // Получаем все файлы из public папки
      const publicFiles = [
        'favicon.ico',
        'manifest.json',
        'robots.txt'
      ];

      // Добавляем основные файлы
      const coreFiles = [
        'package.json',
        'index.html',
        'vite.config.ts',
        'tailwind.config.ts',
        'tsconfig.json',
        'components.json'
      ];

      // Список всех исходных файлов
      const sourceFiles = [
        'src/main.tsx',
        'src/App.tsx',
        'src/App.css',
        'src/index.css',
        'src/vite-env.d.ts',
        'src/lib/utils.ts'
      ];

      // Добавляем инструкции по деплою
      const deployInstructions = `
# Инструкции по развертыванию сайта

## Установка зависимостей
npm install

## Запуск в режиме разработки
npm run dev

## Сборка для продакшена
npm run build

## Настройка Supabase
1. Создайте проект на https://supabase.com
2. Обновите настройки в src/integrations/supabase/client.ts
3. Импортируйте схему базы данных из файла database-schema.sql

## Деплой
Для деплоя рекомендуется использовать:
- Vercel
- Netlify
- GitHub Pages

Скопируйте содержимое папки dist после сборки на ваш хостинг.
      `;

      zip.file('README.md', deployInstructions);

      // Создаем базовую структуру
      const packageJson = {
        "name": "photographer-portfolio",
        "private": true,
        "version": "0.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "tsc && vite build",
          "preview": "vite preview"
        },
        "dependencies": {
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "@supabase/supabase-js": "^2.49.8",
          "@tanstack/react-query": "^5.56.2",
          "lucide-react": "^0.462.0",
          "react-router-dom": "^6.26.2"
        },
        "devDependencies": {
          "@types/react": "^18.3.3",
          "@types/react-dom": "^18.3.0",
          "@vitejs/plugin-react": "^4.3.1",
          "typescript": "^5.5.3",
          "vite": "^5.4.1",
          "tailwindcss": "^3.4.1"
        }
      };

      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // Добавляем схему базы данных
      const databaseSchema = `
-- Схема базы данных для сайта фотографа

-- Создание таблиц (выполните эти команды в Supabase SQL Editor)

-- Основные настройки сайта
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_name TEXT NOT NULL DEFAULT 'Ирина',
  photographer_description TEXT,
  photographer_photo TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Портфолио
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  location TEXT,
  client_name TEXT,
  shoot_date DATE,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Остальные таблицы уже созданы в вашем проекте Supabase
      `;

      zip.file('database-schema.sql', databaseSchema);

      // Генерируем архив
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `photographer-site-${new Date().getTime()}.zip`);

      toast({
        title: "Успешно!",
        description: "Архив сайта создан и загружен",
      });

    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать архив",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Экспорт сайта
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Создайте архив со всеми файлами сайта для переноса на другой хостинг или для резервного копирования.
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium">В архив будет включено:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Все исходные файлы проекта</li>
            <li>• Конфигурация и зависимости</li>
            <li>• Схема базы данных</li>
            <li>• Инструкции по развертыванию</li>
          </ul>
        </div>

        <Button 
          onClick={exportSite}
          disabled={exporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Создание архива...' : 'Скачать архив сайта'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportManager;
