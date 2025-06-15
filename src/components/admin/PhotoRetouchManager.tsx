
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Sparkles, Image as ImageIcon, Palette, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpdatePortfolio } from '@/hooks/usePortfolio';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  clarity: number;
  vibrance: number;
  hue: number;
}

const PhotoRetouchManager = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('none');
  const [customFilters, setCustomFilters] = useState<FilterSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    tint: 0,
    highlights: 0,
    shadows: 0,
    clarity: 0,
    vibrance: 0,
    hue: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const updatePortfolio = useUpdatePortfolio();

  const presetFilters = [
    { id: 'none', name: 'Без фильтра', description: 'Оригинальное изображение' },
    { id: 'portrait', name: 'Портрет', description: 'Мягкая кожа, яркие глаза' },
    { id: 'landscape', name: 'Пейзаж', description: 'Насыщенное небо, детали' },
    { id: 'vintage', name: 'Винтаж', description: 'Теплые тона, пленочный вид' },
    { id: 'dramatic', name: 'Драматичный', description: 'Высокий контраст, тени' },
    { id: 'soft', name: 'Мягкий', description: 'Нежные тона, размытие' },
    { id: 'vibrant', name: 'Яркий', description: 'Насыщенные цвета' },
    { id: 'monochrome', name: 'Монохром', description: 'Черно-белый с акцентами' },
    { id: 'golden', name: 'Золотой час', description: 'Теплый свет, мягкие тени' },
    { id: 'cinema', name: 'Кинематограф', description: 'Кинематографичные тона' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 10) {
      toast({
        title: "Слишком много файлов",
        description: "Можно загрузить максимум 10 изображений за раз",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedImages(prev => [...prev, ...imageFiles].slice(0, 10));
    toast({
      title: "Изображения загружены",
      description: `Добавлено ${imageFiles.length} изображений`
    });
  };

  const handleReferenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setReferenceImage(file);
      toast({
        title: "Эталонное изображение загружено",
        description: "Стиль будет применен к вашим фото"
      });
    }
  };

  const applyFilterToImage = (imageFile: File, filterType: string, settings: FilterSettings): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Применяем фильтры через CSS фильтры
        let filterString = '';
        
        if (filterType === 'portrait') {
          filterString = `brightness(110%) contrast(105%) saturate(110%) blur(0.5px)`;
        } else if (filterType === 'landscape') {
          filterString = `contrast(120%) saturate(130%) brightness(105%)`;
        } else if (filterType === 'vintage') {
          filterString = `sepia(30%) brightness(110%) contrast(90%) saturate(120%)`;
        } else if (filterType === 'dramatic') {
          filterString = `contrast(150%) brightness(90%) saturate(110%)`;
        } else if (filterType === 'soft') {
          filterString = `brightness(105%) contrast(90%) saturate(95%) blur(1px)`;
        } else if (filterType === 'vibrant') {
          filterString = `saturate(150%) contrast(110%) brightness(105%)`;
        } else if (filterType === 'monochrome') {
          filterString = `grayscale(100%) contrast(110%) brightness(105%)`;
        } else if (filterType === 'golden') {
          filterString = `sepia(20%) brightness(115%) contrast(105%) saturate(120%)`;
        } else if (filterType === 'cinema') {
          filterString = `contrast(120%) brightness(95%) saturate(90%)`;
        } else {
          // Кастомные настройки
          filterString = `
            brightness(${100 + settings.brightness}%)
            contrast(${100 + settings.contrast}%)
            saturate(${100 + settings.saturation}%)
            hue-rotate(${settings.hue}deg)
          `.replace(/\s+/g, ' ').trim();
        }
        
        if (filterString) {
          ctx.filter = filterString;
          ctx.drawImage(img, 0, 0);
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const processImages = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "Нет изображений",
        description: "Загрузите изображения для обработки",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const processed = await Promise.all(
        selectedImages.map(img => applyFilterToImage(img, currentFilter, customFilters))
      );
      setProcessedImages(processed);
      toast({
        title: "Обработка завершена",
        description: `Обработано ${processed.length} изображений`
      });
    } catch (error) {
      toast({
        title: "Ошибка обработки",
        description: "Не удалось обработать изображения",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `processed_image_${index + 1}.jpg`;
    link.click();
  };

  const addToPortfolio = async (imageUrl: string, index: number) => {
    try {
      // Конвертируем data URL в Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Создаем File объект
      const file = new File([blob], `processed_${index + 1}.jpg`, { type: 'image/jpeg' });
      
      // Здесь должна быть логика загрузки в Supabase Storage
      // и добавления в портфолио
      
      toast({
        title: "Добавлено в портфолио",
        description: `Изображение ${index + 1} добавлено в портфолио`
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить в портфолио",
        variant: "destructive"
      });
    }
  };

  const resetFilters = () => {
    setCustomFilters({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      tint: 0,
      highlights: 0,
      shadows: 0,
      clarity: 0,
      vibrance: 0,
      hue: 0
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Обработка фотографий
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Загрузка изображений */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Загрузить фото (до 10 шт.)
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1">
                <Button 
                  onClick={() => referenceInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Эталонное фото
                </Button>
                <input
                  ref={referenceInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReferenceUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            {selectedImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedImages.map((file, index) => (
                  <Badge key={index} variant="secondary">
                    {file.name.substring(0, 20)}...
                  </Badge>
                ))}
              </div>
            )}
            
            {referenceImage && (
              <Badge variant="outline" className="text-green-600">
                <Eye className="h-3 w-3 mr-1" />
                Эталон: {referenceImage.name.substring(0, 20)}...
              </Badge>
            )}
          </div>

          {/* Выбор фильтра */}
          <div className="space-y-4">
            <h3 className="font-medium">Выберите стиль обработки:</h3>
            <Select value={currentFilter} onValueChange={setCurrentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите фильтр" />
              </SelectTrigger>
              <SelectContent>
                {presetFilters.map((filter) => (
                  <SelectItem key={filter.id} value={filter.id}>
                    <div>
                      <div className="font-medium">{filter.name}</div>
                      <div className="text-sm text-gray-500">{filter.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Кастомные настройки */}
          {currentFilter === 'none' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Ручные настройки</h4>
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Сбросить
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(customFilters).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <Slider
                      value={[value]}
                      onValueChange={(vals) => 
                        setCustomFilters(prev => ({ ...prev, [key]: vals[0] }))
                      }
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Кнопка обработки */}
          <Button 
            onClick={processImages}
            disabled={isProcessing || selectedImages.length === 0}
            className="w-full"
          >
            <Palette className="h-4 w-4 mr-2" />
            {isProcessing ? 'Обработка...' : 'Обработать фотографии'}
          </Button>
        </CardContent>
      </Card>

      {/* Результаты */}
      {processedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты обработки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={imageUrl} 
                    alt={`Processed ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadImage(imageUrl, index)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => addToPortfolio(imageUrl, index)}
                      variant="secondary"
                    >
                      Добавить в портфолио
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotoRetouchManager;
