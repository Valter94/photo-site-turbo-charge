
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

      // Добавляем инструкции по деплою
      const deployInstructions = `
# Инструкции по развертыванию сайта фотографа

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
4. Создайте storage bucket для изображений

## Деплой
Для деплоя рекомендуется использовать:
- Vercel
- Netlify
- GitHub Pages

Скопируйте содержимое папки dist после сборки на ваш хостинг.
      `;

      zip.file('README.md', deployInstructions);

      // Создаем базовую структуру package.json
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
          "react-router-dom": "^6.26.2",
          "@radix-ui/react-tabs": "^1.1.0",
          "@radix-ui/react-dialog": "^1.1.2",
          "class-variance-authority": "^0.7.1",
          "clsx": "^2.1.1",
          "tailwind-merge": "^2.5.2"
        },
        "devDependencies": {
          "@types/react": "^18.3.3",
          "@types/react-dom": "^18.3.0",
          "@vitejs/plugin-react": "^4.3.1",
          "typescript": "^5.5.3",
          "vite": "^5.4.1",
          "tailwindcss": "^3.4.1",
          "autoprefixer": "^10.4.0",
          "postcss": "^8.4.0"
        }
      };

      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // Добавляем схему базы данных
      const databaseSchema = `
-- Схема базы данных для сайта фотографа

-- Создание storage bucket для изображений
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Политики для bucket images
CREATE POLICY "Public read access for images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images');

-- Создание таблиц
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

CREATE TABLE IF NOT EXISTS location_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photoshoot_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  address TEXT,
  best_time TEXT,
  indoor BOOLEAN DEFAULT false,
  category_id UUID REFERENCES location_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка начальных данных
INSERT INTO location_categories (name, description) VALUES
('Городские', 'Локации в городской среде'),
('Природные', 'Локации на природе'),
('Студийные', 'Крытые студийные пространства');
      `;

      zip.file('database-schema.sql', databaseSchema);

      // Создаем конфигурационные файлы
      const viteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
      `;

      zip.file('vite.config.ts', viteConfig);

      const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
      `;

      zip.file('tailwind.config.js', tailwindConfig);

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
            <li>• Конфигурация проекта</li>
            <li>• Схема базы данных</li>
            <li>• Инструкции по развертыванию</li>
            <li>• Настройки Supabase</li>
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
