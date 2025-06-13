
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Link } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
  folder?: string;
}

const ImageUpload = ({ onImageUploaded, currentImage, onRemoveImage, folder = 'locations' }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const { uploadFile, uploading } = useFileUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, folder);
      onImageUploaded(url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageUploaded(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Uploaded" 
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              console.error('Image load error:', e);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          {onRemoveImage && (
            <Button
              onClick={onRemoveImage}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={() => setUploadMode('file')}
            variant={uploadMode === 'file' ? 'default' : 'outline'}
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Файл
          </Button>
          <Button
            onClick={() => setUploadMode('url')}
            variant={uploadMode === 'url' ? 'default' : 'outline'}
            size="sm"
          >
            <Link className="h-4 w-4 mr-2" />
            URL
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
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Загрузка...' : 'Загрузить изображение'}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Введите URL изображения"
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
              Добавить
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
