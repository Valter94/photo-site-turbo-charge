
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link } from 'lucide-react';
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
  } = useImageUploader({ onImageUploaded, folder, currentImage, onImageDescribed, fileInputRef, urlInput, setUrlInput, setDescStatus });

  const handleRemoveImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
      setError && setError(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={`border-2 border-dashed rounded-lg p-6 transition-all ${
        currentImage ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
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
