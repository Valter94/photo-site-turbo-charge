
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Image, Sparkles, Palette, Camera, Sun, Vintage, Upload, Download, Settings, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const PhotoRetouchManager = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const { toast } = useToast();

  const filters = [
    { 
      id: 'auto', 
      name: '✨ Автокоррекция', 
      icon: Wand2,
      description: 'Автоматическая коррекция яркости, контраста и цвета'
    },
    { 
      id: 'portrait', 
      name: '👤 Портретная ретушь', 
      icon: Camera,
      description: 'Сглаживание кожи и улучшение портретов'
    },
    { 
      id: 'landscape', 
      name: '🌅 Пейзажный', 
      icon: Sun,
      description: 'Усиление контраста неба и природы'
    },
    { 
      id: 'artistic', 
      name: '🎨 Художественный', 
      icon: Palette,
      description: 'Креативная обработка с мягкими тонами'
    },
    { 
      id: 'vintage', 
      name: '📷 Винтажный', 
      icon: Vintage,
      description: 'Пленочный эффект с теплыми тонами'
    },
    { 
      id: 'vibrant', 
      name: '🌈 Яркие цвета', 
      icon: Sparkles,
      description: 'Повышенная насыщенность и контраст'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 10) {
      toast({
        title: "Слишком много файлов",
        description: "Максимум 10 фотографий за раз",
        variant: "destructive"
      });
      return;
    }
    setSelectedFiles(files);
  };

  const processPhotos = async () => {
    if (!selectedFilter || selectedFiles.length === 0) {
      toast({
        title: "Выберите фильтр и фото",
        description: "Необходимо выбрать фильтр и загрузить фотографии",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    
    try {
      // Симуляция обработки
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Обработка завершена!",
        description: `Обработано ${selectedFiles.length} фотографий с фильтром "${filters.find(f => f.id === selectedFilter)?.name}"`,
      });
      
      // Здесь должна быть реальная логика обработки
      setSelectedFiles([]);
      setSelectedFilter('');
      
    } catch (error) {
      toast({
        title: "Ошибка обработки",
        description: "Не удалось обработать фотографии",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setSelectedFilter('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wand2 className="w-6 h-6 text-purple-500" />
              <CardTitle>Ретушь и обработка фотографий</CardTitle>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Settings className="w-3 h-3" />
              <span>AI обработка</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Загрузка файлов */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Загрузка фотографий</h3>
              {selectedFiles.length > 0 && (
                <Button onClick={clearFiles} variant="outline" size="sm">
                  Очистить
                </Button>
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="text-lg font-medium text-gray-700 mb-2">
                  Перетащите фото сюда или нажмите для выбора
                </div>
                <div className="text-sm text-gray-500">
                  Поддерживаются JPG, PNG, WebP (до 10 файлов, макс. 50MB каждый)
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Выбрано файлов: {selectedFiles.length}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded text-xs truncate">
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Выбор фильтра */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Выбор фильтра</h3>
            
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип обработки" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {filters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <SelectItem key={filter.id} value={filter.id}>
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{filter.name}</div>
                          <div className="text-xs text-gray-500">{filter.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {selectedFilter && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>{filters.find(f => f.id === selectedFilter)?.name}:</strong>{' '}
                  {filters.find(f => f.id === selectedFilter)?.description}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Кнопки действий */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button 
              onClick={processPhotos}
              disabled={processing || !selectedFilter || selectedFiles.length === 0}
              className="flex-1"
            >
              {processing ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  Обрабатываю...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Обработать фото
                </>
              )}
            </Button>
            
            <Button variant="outline" disabled={processing}>
              <Download className="w-4 h-4 mr-2" />
              Скачать результат
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Информационная карточка */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Советы по обработке</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div>• <strong>Автокоррекция</strong> - лучший выбор для быстрой обработки любых фото</div>
            <div>• <strong>Портретная ретушь</strong> - специально для фотографий людей</div>
            <div>• <strong>Пейзажный фильтр</strong> - подчеркивает красоту природы и архитектуры</div>
            <div>• <strong>Художественный</strong> - создает атмосферные и стильные фотографии</div>
            <div>• <strong>Винтажный</strong> - имитирует пленочную фотографию</div>
            <div>• <strong>Яркие цвета</strong> - делает фото более насыщенными и контрастными</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoRetouchManager;
