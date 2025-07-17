
import React, { forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface ImageUploadFilePickerProps {
  uploading: boolean;
  onUpload: (file: File) => void;
}

export const ImageUploadFilePicker = forwardRef<HTMLInputElement, ImageUploadFilePickerProps>(
  ({ uploading, onUpload }, ref) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
      }
    };

    const handleButtonClick = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.click();
      }
    };

    return (
      <div className="space-y-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Загрузка...' : 'Выбрать файл'}
        </Button>
        <p className="text-xs text-gray-500 text-center">
          Поддерживаются: JPG, PNG, GIF до 10MB
        </p>
      </div>
    );
  }
);

ImageUploadFilePicker.displayName = 'ImageUploadFilePicker';
