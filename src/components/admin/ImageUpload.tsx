
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Link, Image as ImageIcon } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
  folder?: string;
}

const ImageUpload = ({ onImageUploaded, currentImage, onRemoveImage, folder = 'portfolio' }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const { uploadFile, uploading } = useFileUpload();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл изображения",
        variant: "destructive"
      });
      return;
    }

    // Проверка размера файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Starting file upload:', file.name, 'Size:', file.size);
      const url = await uploadFile(file, folder);
      console.log('Upload successful, URL:', url);
      onImageUploaded(url);
      
      // Очищаем input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Попробуйте выбрать другой файл или проверьте подключение к интернету",
        variant: "destructive"
      });
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите URL изображения",
        variant: "destructive"
      });
      return;
    }

    // Простая проверка валидности URL
    try {
      new URL(urlInput.trim());
    } catch {
      toast({
        title: "Ошибка",
        description: "Введите корректный URL",
        variant: "destructive"
      });
      return;
    }

    onImageUploaded(urlInput.trim());
    setUrlInput('');
    toast({
      title: "Успешно",
      description: "Изображение добавлено по URL",
    });
  };

  const handleRemoveImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  return (
    <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div className="text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Загрузить изображение</h3>
        <p className="text-sm text-gray-500">Выберите файл или вставьте URL</p>
      </div>

      {currentImage && (
        <div className="relative group">
          <img 
            src={currentImage} 
            alt="Загруженное изображение" 
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              console.error('Image load error:', e);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop&auto=format&q=50';
            }}
          />
          {onRemoveImage && (
            <Button
              onClick={handleRemoveImage}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">Нажмите X чтобы удалить</span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={() => setUploadMode('file')}
            variant={uploadMode === 'file' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Загрузить файл
          </Button>
          <Button
            onClick={() => setUploadMode('url')}
            variant={uploadMode === 'url' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            <Link className="h-4 w-4 mr-2" />
            Вставить URL
          </Button>
        </div>

        {uploadMode === 'file' ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Загрузка...' : 'Выбрать файл с компьютера'}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Поддерживаемые форматы: JPG, PNG, WebP, GIF (до 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button 
              onClick={handleUrlSubmit} 
              disabled={!urlInput.trim()}
              className="w-full"
            >
              <Link className="h-4 w-4 mr-2" />
              Добавить по URL
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
