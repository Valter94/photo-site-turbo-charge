
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Sparkles, RotateCcw, Palette, Sun, Contrast, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useUpdatePortfolio } from '@/hooks/usePortfolio';

const PhotoRetouchManager = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    shadows: 0,
    highlights: 0,
    temperature: 0,
    vibrance: 0
  });
  const [retouchSettings, setRetouchSettings] = useState({
    skinSmoothing: 30,
    eyeEnhancement: 20,
    whiteningTeeth: 15,
    removeRedEye: false,
    backgroundBlur: 0
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();
  const updatePortfolio = useUpdatePortfolio();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setProcessedImage(result);
        resetFilters();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFilters = () => {
    setFilters({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      shadows: 0,
      highlights: 0,
      temperature: 0,
      vibrance: 0
    });
  };

  const applyFilters = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply CSS filters
      const filterString = [
        `brightness(${100 + filters.brightness}%)`,
        `contrast(${100 + filters.contrast}%)`,
        `saturate(${100 + filters.saturation}%)`,
        `sepia(${Math.abs(filters.temperature) * 0.3}%)`,
        `hue-rotate(${filters.temperature * 2}deg)`
      ].join(' ');

      ctx!.filter = filterString;
      ctx!.drawImage(img, 0, 0);
      
      const processedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setProcessedImage(processedDataUrl);
    };

    img.src = originalImage;
  };

  const applyAutoRetouch = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      // Simulate AI retouching process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Apply basic improvements
      setFilters({
        brightness: 10,
        contrast: 15,
        saturation: 20,
        exposure: 5,
        shadows: 10,
        highlights: -5,
        temperature: 5,
        vibrance: 15
      });
      
      applyFilters();
      
      toast({
        title: "Ретушь завершена!",
        description: "Фотография автоматически обработана",
      });
    } catch (error) {
      toast({
        title: "Ошибка обработки",
        description: "Не удалось обработать фотографию",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToPortfolio = async () => {
    if (!processedImage) return;

    try {
      // Convert base64 to blob
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const file = new File([blob], `retouched_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Upload to storage
      const imageUrl = await uploadFile(file, 'portfolio');
      
      // Add to portfolio
      const portfolioItem = {
        title: `Обработанное фото ${new Date().toLocaleDateString()}`,
        category: 'portrait',
        image_url: imageUrl,
        description: 'Профессиональная ретушь',
        is_featured: false
      };

      await updatePortfolio.mutateAsync(portfolioItem);
      
      toast({
        title: "Успешно!",
        description: "Фотография добавлена в портфолио",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить в портфолио",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `retouched_photo_${Date.now()}.jpg`;
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Ретушь фотографий
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!originalImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Загрузите фотографию для ретуши
              </h3>
              <p className="text-gray-500 mb-4">
                Поддерживаемые форматы: JPG, PNG, WebP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Выбрать файл
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original and Processed Images */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">Оригинал</Badge>
                    <div className="relative border rounded-lg overflow-hidden">
                      <img 
                        src={originalImage} 
                        alt="Оригинал" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Badge variant="secondary" className="mb-2">После обработки</Badge>
                    <div className="relative border rounded-lg overflow-hidden">
                      <img 
                        src={processedImage || originalImage} 
                        alt="Обработанное" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={applyAutoRetouch} 
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Обработка...' : 'Авто-ретушь'}
                  </Button>
                  <Button onClick={resetFilters} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Основные</TabsTrigger>
                    <TabsTrigger value="advanced">Ретушь</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Яркость</label>
                        <Slider
                          value={[filters.brightness]}
                          onValueChange={(value) => {
                            setFilters({...filters, brightness: value[0]});
                            setTimeout(applyFilters, 100);
                          }}
                          min={-100}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Контраст</label>
                        <Slider
                          value={[filters.contrast]}
                          onValueChange={(value) => {
                            setFilters({...filters, contrast: value[0]});
                            setTimeout(applyFilters, 100);
                          }}
                          min={-100}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Насыщенность</label>
                        <Slider
                          value={[filters.saturation]}
                          onValueChange={(value) => {
                            setFilters({...filters, saturation: value[0]});
                            setTimeout(applyFilters, 100);
                          }}
                          min={-100}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Температура</label>
                        <Slider
                          value={[filters.temperature]}
                          onValueChange={(value) => {
                            setFilters({...filters, temperature: value[0]});
                            setTimeout(applyFilters, 100);
                          }}
                          min={-100}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Сглаживание кожи</label>
                        <Slider
                          value={[retouchSettings.skinSmoothing]}
                          onValueChange={(value) => 
                            setRetouchSettings({...retouchSettings, skinSmoothing: value[0]})
                          }
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Усиление глаз</label>
                        <Slider
                          value={[retouchSettings.eyeEnhancement]}
                          onValueChange={(value) => 
                            setRetouchSettings({...retouchSettings, eyeEnhancement: value[0]})
                          }
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Отбеливание зубов</label>
                        <Slider
                          value={[retouchSettings.whiteningTeeth]}
                          onValueChange={(value) => 
                            setRetouchSettings({...retouchSettings, whiteningTeeth: value[0]})
                          }
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Размытие фона</label>
                        <Slider
                          value={[retouchSettings.backgroundBlur]}
                          onValueChange={(value) => 
                            setRetouchSettings({...retouchSettings, backgroundBlur: value[0]})
                          }
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4">
                  <Button onClick={saveToPortfolio} className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    В портфолио
                  </Button>
                  <Button onClick={downloadImage} variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoRetouchManager;
