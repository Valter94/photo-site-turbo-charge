import React, { useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wand2, 
  Image, 
  Scissors, 
  Palette, 
  Zap, 
  RefreshCw,
  Download,
  Eye,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProcessingOptions {
  intensity: number;
  format: 'jpg' | 'png' | 'webp';
  quality: number;
}

const AIPhotoStudio = () => {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [styleImage, setStyleImage] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<string>('');
  const [options, setOptions] = useState<ProcessingOptions>({
    intensity: 0.5,
    format: 'jpg',
    quality: 90
  });

  const operations = [
    { id: 'background-remove', name: 'Удаление фона', icon: Scissors, description: 'AI удаление фона' },
    { id: 'style-transfer', name: 'Копирование стиля', icon: Palette, description: 'Перенос стиля с другого фото' },
    { id: 'upscale', name: 'Увеличение качества', icon: Zap, description: 'AI upscaling' },
    { id: 'enhance', name: 'Улучшение', icon: Sparkles, description: 'Общее улучшение качества' },
    { id: 'perspective-correct', name: 'Коррекция перспективы', icon: RefreshCw, description: 'Исправление геометрии' }
  ];

  const handleProcessImage = async (operation: string) => {
    if (!selectedImage) {
      toast.error('Выберите изображение для обработки');
      return;
    }

    if (operation === 'style-transfer' && !styleImage) {
      toast.error('Выберите эталонное изображение для копирования стиля');
      return;
    }

    setProcessing(true);
    setProcessedResult('');

    try {
      console.log('🎨 Starting AI photo processing...');
      
      const { data, error } = await supabase.functions.invoke('ai-photo-processing', {
        body: {
          imageUrl: selectedImage,
          operation,
          styleImageUrl: styleImage,
          options
        }
      });

      if (error) throw error;

      if (data?.success) {
        setProcessedResult(data.processedUrl);
        toast.success('Обработка завершена успешно!');
        console.log('✅ Processing completed:', data.processedUrl);
      } else {
        throw new Error('Processing failed');
      }
    } catch (error) {
      console.error('❌ Processing error:', error);
      toast.error(`Ошибка обработки: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Файл загружен!');
    } catch (error) {
      toast.error('Ошибка загрузки файла');
    }
  };

  if (portfolioLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Загрузка портфолио...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6" />
            AI Студия обработки фото
          </h2>
          <p className="text-muted-foreground">
            Профессиональная обработка фотографий с помощью искусственного интеллекта
          </p>
        </div>
      </div>

      <Tabs defaultValue="process" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="process">Обработка</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
          <TabsTrigger value="results">Результаты</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-6">
          {/* Image Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Выбор изображения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {portfolio?.map((item) => (
                  <div
                    key={item.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === item.image_url 
                        ? 'border-primary shadow-lg' 
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedImage(item.image_url)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-24 object-cover"
                    />
                    {selectedImage === item.image_url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {selectedImage && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Выбрано изображение: {selectedImage.split('/').pop()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Operations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Операции</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {operations.map((op) => {
                  const IconComponent = op.icon;
                  return (
                    <div
                      key={op.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{op.name}</h4>
                          <p className="text-sm text-muted-foreground">{op.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleProcessImage(op.id)}
                        disabled={processing || !selectedImage}
                        variant="outline"
                        size="sm"
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Применить'
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Style Transfer */}
          <Card>
            <CardHeader>
              <CardTitle>Эталонное изображение для копирования стиля</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {portfolio?.slice(0, 12).map((item) => (
                    <div
                      key={item.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        styleImage === item.image_url 
                          ? 'border-secondary shadow-lg' 
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                      onClick={() => setStyleImage(item.image_url)}
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-16 object-cover"
                      />
                      {styleImage === item.image_url && (
                        <Badge className="absolute top-1 right-1 text-xs">Стиль</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Параметры обработки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Интенсивность обработки</Label>
                <Slider
                  value={[options.intensity]}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, intensity: value[0] }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">Текущее значение: {options.intensity}</p>
              </div>

              <div className="space-y-2">
                <Label>Формат выходного файла</Label>
                <Select
                  value={options.format}
                  onValueChange={(value: 'jpg' | 'png' | 'webp') => 
                    setOptions(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpg">JPEG (лучшее сжатие)</SelectItem>
                    <SelectItem value="png">PNG (с прозрачностью)</SelectItem>
                    <SelectItem value="webp">WebP (современный формат)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Качество ({options.quality}%)</Label>
                <Slider
                  value={[options.quality]}
                  onValueChange={(value) => setOptions(prev => ({ ...prev, quality: value[0] }))}
                  min={50}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {processedResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Результат обработки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Оригинал</h4>
                    <img
                      src={selectedImage}
                      alt="Original"
                      className="w-full rounded-lg border"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">После обработки</h4>
                    <img
                      src={processedResult}
                      alt="Processed"
                      className="w-full rounded-lg border"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleDownload(processedResult, `processed-${Date.now()}.${options.format}`)}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Скачать результат
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                Выберите изображение и примените одну из AI операций для получения результата.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPhotoStudio;