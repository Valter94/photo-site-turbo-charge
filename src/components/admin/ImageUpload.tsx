
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Link, CheckCircle, AlertCircle } from 'lucide-react';
import { useImageUploader } from './useImageUploader';
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [descStatus, setDescStatus] = useState<"idle" | "generating" | "success" | "fail">("idle");

  const {
    uploading,
    error,
    aiDescription,
    aiLoading,
    aiError,
    handleFileUpload,
    handleUrlSubmit,
    handleAIDescribe,
    setError
  } = useImageUploader({ 
    onImageUploaded, 
    folder, 
    currentImage, 
    onImageDescribed, 
    fileInputRef, 
    urlInput, 
    setUrlInput, 
    setDescStatus 
  });

  const handleRemoveImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
      setError && setError(null);
    }
  };

  const getStatusIcon = () => {
    if (uploading) return <Upload className="h-8 w-8 text-blue-500 animate-spin" />;
    if (currentImage) return <CheckCircle className="h-8 w-8 text-green-500" />;
    if (error) return <AlertCircle className="h-8 w-8 text-red-500" />;
    return <Upload className="h-8 w-8 text-gray-400" />;
  };

  const getStatusText = () => {
    if (uploading) return 'Загрузка...';
    if (currentImage) return 'Изображение загружено';
    if (error) return 'Ошибка загрузки';
    return 'Загрузить изображение';
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
        currentImage ? 'border-green-300 bg-green-50' : 
        error ? 'border-red-300 bg-red-50' :
        uploading ? 'border-blue-300 bg-blue-50' :
        'border-gray-300 hover:border-gray-400'
      }`}>
        <div className="text-center">
          {getStatusIcon()}
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {getStatusText()}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {currentImage ? 'Можете заменить или удалить изображение' : 
             'Перетащите файл или выберите способ загрузки'}
          </p>
        </div>

        {currentImage && (
          <>
            <ImageUploadPreview 
              currentImage={currentImage} 
              onRemoveImage={handleRemoveImage} 
            />
            <ImageUploadAIDesc
              onGenerate={handleAIDescribe}
              aiLoading={aiLoading}
              descStatus={descStatus}
              aiDescription={aiDescription}
            />
          </>
        )}

        {!currentImage && (
          <div className="mt-6 space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setUploadMode('file')}
                variant={uploadMode === 'file' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Загрузить файл
              </Button>
              <Button
                type="button"
                onClick={() => setUploadMode('url')}
                variant={uploadMode === 'url' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                disabled={uploading}
              >
                <Link className="h-4 w-4 mr-2" />
                Вставить URL
              </Button>
            </div>

            {uploadMode === 'file' ? (
              <ImageUploadFilePicker 
                uploading={uploading} 
                onUpload={handleFileUpload}
                ref={fileInputRef}
              />
            ) : (
              <ImageUploadUrlInput
                value={urlInput}
                onChange={setUrlInput}
                onSubmit={handleUrlSubmit}
                disabled={uploading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
