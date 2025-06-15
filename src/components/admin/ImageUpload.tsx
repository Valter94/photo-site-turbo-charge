import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Link, Image as ImageIcon, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useImageDescriptionAI } from '@/hooks/useImageDescriptionAI';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
  folder?: string;
  onImageDescribed?: (desc: string) => void;
}

const ImageUpload = ({
  onImageUploaded,
  currentImage,
  onRemoveImage,
  folder = 'portfolio',
  onImageDescribed
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadFile, uploading } = useFileUpload();
  const { toast } = useToast();
  const { generateDescription, loading: aiLoading, error: aiError } = useImageDescriptionAI();
  const [aiDescription, setAIDescription] = useState<string | null>(null);
  const [descStatus, setDescStatus] = useState<"idle" | "generating" | "success" | "fail">("idle");

  const validateFile = (file: File): string | null => {
    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Неподдерживаемый формат файла. Разрешены: JPG, PNG, WebP, GIF';
    }

    // Проверка размера файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'Размер файла не должен превышать 10MB';
    }

    // Проверка на пустой файл
    if (file.size === 0) {
      return 'Файл поврежден или пуст';
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast({
        title: "Ошибка файла",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Начинаем загрузку файла:', file.name, 'Размер:', file.size, 'Тип:', file.type);
      const url = await uploadFile(file, folder);
      console.log('Загрузка успешна, URL:', url);
      onImageUploaded(url);
      setError(null);
      
      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Успешно!",
        description: "Изображение успешно загружено",
      });
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);
      const errorMessage = error?.message || 'Не удалось загрузить файл';
      setError(errorMessage);
      toast({
        title: "Ошибка загрузки",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    setDragActive(active);
  };

  const handleUrlSubmit = () => {
    setError(null);
    
    if (!urlInput.trim()) {
      const error = "Введите URL изображения";
      setError(error);
      toast({
        title: "Ошибка",
        description: error,
        variant: "destructive"
      });
      return;
    }

    // Проверка валидности URL
    try {
      const url = new URL(urlInput.trim());
      
      // Проверяем, что это изображение по расширению
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const hasImageExtension = imageExtensions.some(ext => 
        url.pathname.toLowerCase().endsWith(ext)
      );
      
      if (!hasImageExtension && !url.hostname.includes('unsplash') && !url.hostname.includes('supabase')) {
        throw new Error('URL не ведет к изображению');
      }
      
      onImageUploaded(urlInput.trim());
      setUrlInput('');
      setError(null);
      
      toast({
        title: "Успешно!",
        description: "Изображение добавлено по URL",
      });
    } catch (err) {
      const error = "Введите корректный URL изображения";
      setError(error);
      toast({
        title: "Ошибка",
        description: error,
        variant: "destructive"
      });
    }
  };

  const handleRemoveImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
      setError(null);
    }
  };

  const handleAIDescribe = async () => {
    if (!currentImage) return;
    setDescStatus("generating");
    setAIDescription(null);
    const desc = await generateDescription(currentImage);
    if (desc) {
      setAIDescription(desc);
      setDescStatus("success");
      if (onImageDescribed) onImageDescribed(desc);
      toast({
        title: "AI Описание готово",
        description: "Вы можете использовать его или изменить вручную",
        variant: "default"
      });
    } else {
      setDescStatus("fail");
      setAIDescription(null);
      toast({
        title: "Ошибка AI описания",
        description: aiError || "Не удалось сгенерировать описание",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={`border-2 border-dashed rounded-lg p-6 transition-all ${
        dragActive 
          ? 'border-purple-400 bg-purple-50' 
          : currentImage 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
      }`}>
        <div className="text-center">
          {currentImage ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
          ) : (
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {currentImage ? 'Изображение загружено' : 'Загрузить изображение'}
          </h3>
          <p className="text-sm text-gray-500">
            {currentImage ? 'Можете заменить или удалить' : 'Перетащите файл или выберите способ загрузки'}
          </p>
        </div>

        {currentImage && (
          <div className="relative group mt-4">
            <img 
              src={currentImage} 
              alt="Загруженное изображение" 
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                console.error('Ошибка загрузки изображения:', e);
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
            {/* AI описание */}
            <div className="mt-3 flex flex-col items-stretch gap-2">
              <Button
                type="button"
                onClick={handleAIDescribe}
                className="w-full flex items-center justify-center gap-2"
                disabled={aiLoading || descStatus === "generating"}
                variant="outline"
              >
                <Sparkles className="w-4 h-4" />
                {descStatus === "generating" ? "Генерация описания..." : "Сгенерировать описание с помощью ИИ"}
              </Button>
              {aiDescription && (
                <div className="bg-gray-50 rounded p-2 mt-1 text-gray-700 text-sm border">
                  <span className="font-semibold">AI: </span>
                  {aiDescription}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-4 mt-4">
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
              <div
                className={`border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {dragActive 
                      ? 'Отпустите файл здесь' 
                      : 'Перетащите файл сюда или нажмите для выбора'
                    }
                  </p>
                </div>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full mt-2"
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
    </div>
  );
};

export default ImageUpload;
