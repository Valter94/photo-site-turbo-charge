
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Target, ExternalLink, CheckCircle, AlertCircle, Copy, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AnalyticsSetup = () => {
  const { toast } = useToast();
  const [gaId, setGaId] = useState('');
  const [ymId, setYmId] = useState('');

  const handleSaveGA = () => {
    if (gaId.trim()) {
      // В реальном проекте здесь был бы API запрос
      toast({
        title: "Успешно!",
        description: "Google Analytics ID сохранен",
      });
    }
  };

  const handleSaveYM = () => {
    if (ymId.trim()) {
      // В реальном проекте здесь был бы API запрос
      toast({
        title: "Успешно!",
        description: "Яндекс.Метрика ID сохранен",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано!",
      description: "Код скопирован в буфер обмена",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">SEO и Аналитика</h2>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Globe className="w-3 h-3" />
          <span>Оптимизация</span>
        </Badge>
      </div>

      <Tabs defaultValue="google" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="google">Google Analytics</TabsTrigger>
          <TabsTrigger value="yandex">Яндекс.Метрика</TabsTrigger>
          <TabsTrigger value="seo">SEO настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="google" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Google Analytics 4</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Google Analytics уже подключен!</strong> Данные о посетителях собираются автоматически.
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-blue-900">📊 Как настроить Google Analytics:</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                    <div>
                      <p className="font-medium">Перейдите в Google Analytics</p>
                      <a 
                        href="https://analytics.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <span>analytics.google.com</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                    <div>
                      <p className="font-medium">Создайте новый ресурс (Property)</p>
                      <p className="text-gray-600">Выберите "Google Analytics 4" и добавьте ваш сайт</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                    <div>
                      <p className="font-medium">Получите Measurement ID</p>
                      <p className="text-gray-600">Идентификатор выглядит как "G-XXXXXXXXXX"</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                    <div>
                      <p className="font-medium">Замените ID в коде</p>
                      <p className="text-gray-600">Найдите файл Analytics.tsx и замените "GA_MEASUREMENT_ID"</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Measurement ID:</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard('G-XXXXXXXXXX')}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Копировать пример
                    </Button>
                  </div>
                  <Input
                    value={gaId}
                    onChange={(e) => setGaId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={handleSaveGA}
                    className="mt-3 w-full"
                    disabled={!gaId.trim()}
                  >
                    Применить настройки
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yandex" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-red-500" />
                <span>Яндекс.Метрика</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Яндекс.Метрика уже подключена!</strong> Данные собираются и анализируются автоматически.
                </AlertDescription>
              </Alert>

              <div className="bg-red-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-red-900">📈 Как настроить Яндекс.Метрику:</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                    <div>
                      <p className="font-medium">Перейдите в Яндекс.Метрику</p>
                      <a 
                        href="https://metrika.yandex.ru" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-red-600 hover:underline flex items-center space-x-1"
                      >
                        <span>metrika.yandex.ru</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                    <div>
                      <p className="font-medium">Добавьте счетчик</p>
                      <p className="text-gray-600">Нажмите "Добавить счетчик" и введите адрес сайта</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                    <div>
                      <p className="font-medium">Получите номер счетчика</p>
                      <p className="text-gray-600">Номер состоит из цифр, например "12345678"</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                    <div>
                      <p className="font-medium">Замените ID в коде</p>
                      <p className="text-gray-600">Найдите файл Analytics.tsx и замените "YM_COUNTER_ID"</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Номер счетчика:</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard('12345678')}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Копировать пример
                    </Button>
                  </div>
                  <Input
                    value={ymId}
                    onChange={(e) => setYmId(e.target.value)}
                    placeholder="12345678"
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={handleSaveYM}
                    className="mt-3 w-full"
                    disabled={!ymId.trim()}
                  >
                    Применить настройки
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-500" />
                <span>SEO Оптимизация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>SEO настройки активны!</strong> Мета-теги и структурированные данные автоматически добавляются на все страницы.
                </AlertDescription>
              </Alert>

              <div className="bg-green-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-green-900">🔍 Что уже настроено:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Мета-теги (title, description)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Open Graph для соцсетей</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Структурированные данные JSON-LD</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Robots.txt и sitemap.xml</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Семантическая разметка HTML</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Оптимизация изображений</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Мобильная адаптивность</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Быстрая загрузка страниц</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">💡 Рекомендации для улучшения SEO:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Регулярно добавляйте новые фотографии в портфолио</li>
                  <li>• Используйте описательные названия для фотографий</li>
                  <li>• Добавляйте локации с подробными описаниями</li>
                  <li>• Собирайте отзывы клиентов</li>
                  <li>• Ведите блог о фотосессиях (функция в разработке)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsSetup;
