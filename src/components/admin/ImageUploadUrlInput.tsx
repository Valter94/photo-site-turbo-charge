
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'lucide-react';

interface ImageUploadUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const ImageUploadUrlInput: React.FC<ImageUploadUrlInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="https://example.com/image.jpg"
        disabled={disabled}
      />
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        className="w-full"
      >
        <Link className="h-4 w-4 mr-2" />
        {disabled ? 'Загрузка...' : 'Добавить по URL'}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        Вставьте ссылку на изображение из интернета
      </p>
    </form>
  );
};
