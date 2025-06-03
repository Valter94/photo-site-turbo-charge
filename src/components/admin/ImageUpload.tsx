
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
  folder?: string;
}

const ImageUpload = ({ onImageUploaded, currentImage, onRemoveImage, folder = 'locations' }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Uploaded" 
            className="w-full h-48 object-cover rounded-lg"
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
    </div>
  );
};

export default ImageUpload;
