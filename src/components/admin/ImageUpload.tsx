import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Link, Image as ImageIcon, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useImageDescriptionAI } from '@/hooks/useImageDescriptionAI';
import { ImageUploadFilePicker } from "./ImageUploadFilePicker";
import { ImageUploadUrlInput } from "./ImageUploadUrlInput";
import { ImageUploadAIDesc } from "./ImageUploadAIDesc";
import { ImageUploadPreview } from "./ImageUploadPreview";

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
          <ImageUploadPreview currentImage={currentImage} onRemoveImage={handleRemoveImage} />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {currentImage ? 'Изображение загружено' : 'Загрузить изображение'}
          </h3>
          <p className="text-sm text-gray-500">
            {currentImage ? 'Можете заменить или удалить' : 'Перетащите файл или выберите способ загрузки'}
          </p>
        </div>
        {/* AI tools */}
        {!!currentImage && (
          <ImageUploadAIDesc 
            onGenerate={handleAIDescribe}
            aiLoading={aiLoading}
            descStatus={descStatus}
            aiDescription={aiDescription}
          />
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
            <ImageUploadFilePicker uploading={uploading} onUpload={handleFileUpload} />
          ) : (
            <ImageUploadUrlInput
              value={urlInput}
              onChange={setUrlInput}
              onSubmit={handleUrlSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
