
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, Download, Heart } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface ImageViewerProps {
  images: Array<{
    id: string;
    title: string;
    image_url: string;
    category: string;
    description?: string;
    location?: string;
    client_name?: string;
    shoot_date?: string;
    is_featured?: boolean;
  }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer = ({ images, initialIndex, isOpen, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') goToPrevious();
    if (event.key === 'ArrowRight') goToNext();
    if (event.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const downloadImage = async () => {
    try {
      const response = await fetch(currentImage.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentImage.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
    }
  };

  const getCategoryName = (category: string) => {
    const names = {
      wedding: 'Свадьба',
      lovestory: 'Love Story',
      portrait: 'Портрет',
      family: 'Семейная съемка',
      corporate: 'Корпоративная съемка'
    };
    return names[category as keyof typeof names] || category;
  };

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Кнопка закрытия */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Навигационные кнопки */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Основное изображение */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <OptimizedImage
              src={currentImage.image_url}
              alt={currentImage.title}
              className="max-w-full max-h-full object-contain"
              width={1200}
              height={800}
            />
          </div>

          {/* Информационная панель */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{currentImage.title}</h3>
                    <Badge className="bg-white/20 text-white">
                      {getCategoryName(currentImage.category)}
                    </Badge>
                    {currentImage.is_featured && (
                      <Badge className="bg-rose-400 text-white">
                        Рекомендуем
                      </Badge>
                    )}
                  </div>
                  
                  {currentImage.description && (
                    <p className="text-gray-300 mb-2">{currentImage.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {currentImage.location && (
                      <span>📍 {currentImage.location}</span>
                    )}
                    {currentImage.client_name && (
                      <span>👤 {currentImage.client_name}</span>
                    )}
                    {currentImage.shoot_date && (
                      <span>📅 {new Date(currentImage.shoot_date).toLocaleDateString('ru-RU')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={downloadImage}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Счетчик изображений */}
              {images.length > 1 && (
                <div className="text-center text-sm text-gray-400">
                  {currentIndex + 1} из {images.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
