
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { VisuallyHidden } from "./ImageViewerVisuallyHidden";
import { ImageViewerInfoPanel } from "./ImageViewerInfoPanel";

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
    if (!isOpen) return;
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
    if (!currentImage?.image_url) return;
    try {
      const response = await fetch(currentImage.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentImage.title || 'image'}.jpg`;
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

  // Определяем, является ли изображение с бота
  const isBotImage = currentImage.image_url?.includes('supabase.co') || currentImage.image_url?.includes('ojrekbttkriwwyaupbox');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black/95">
        <DialogTitle asChild>
          <VisuallyHidden>
            {currentImage.title || "Изображение"}
          </VisuallyHidden>
        </DialogTitle>
        {currentImage.description && (
          <DialogDescription asChild>
            <VisuallyHidden>
              {currentImage.description}
            </VisuallyHidden>
          </DialogDescription>
        )}
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
            <div className="max-w-full max-h-full flex items-center justify-center">
              <OptimizedImage
                src={currentImage.image_url}
                alt={currentImage.title}
                className={`${isBotImage ? 'max-w-full max-h-full' : 'max-w-full max-h-full object-contain'}`}
                width={1200}
                height={800}
                preserveAspectRatio={true}
                priority={true}
              />
            </div>
          </div>
          <ImageViewerInfoPanel
            currentImage={currentImage}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            downloadImage={downloadImage}
            currentIndex={currentIndex}
            imagesLength={images.length}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
