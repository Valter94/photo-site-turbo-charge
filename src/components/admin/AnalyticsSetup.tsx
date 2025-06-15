
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AnalyticsSetup = () => {
  const [gaId, setGaId] = useState('');
  const [ymId, setYmId] = useState('');
  const [copied, setCopied] = useState('');
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
    toast({
      title: "Скопировано!",
      description: "Код скопирован в буфер обмена",
    });
  };

  const gaCode = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId || 'GA_MEASUREMENT_ID'}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaId || 'GA_MEASUREMENT_ID'}');
</script>`;

  const ymCode = `<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(${ymId || 'YANDEX_COUNTER_ID'}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${ymId || 'YANDEX_COUNTER_ID'}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Настройка аналитики</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Система аналитики уже интегрирована в сайт. Вам нужно только получить идентификаторы 
              от Google Analytics и Яндекс.Метрики и заменить их в коде компонента Analytics.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="google">Google Analytics</TabsTrigger>
              <TabsTrigger value="yandex">Яндекс.Метрика</TabsTrigger>
            </TabsList>

            <TabsContent value="google" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input
                    id="ga-id"
                    placeholder="G-XXXXXXXXXX"
                    value={gaId}
                    onChange={(e) => setGaId(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Найдите ваш Measurement ID в Google Analytics 4
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Инструкция по получению Google Analytics ID:</Label>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Перейдите на <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">analytics.google.com</a></li>
                    <li>Создайте новый аккаунт или выберите существующий</li>
                    <li>Добавьте новое свойство для вашего сайта</li>
                    <li>Скопируйте Measurement ID (начинается с G-)</li>
                    <li>Замените 'G-XXXXXXXXXX' в файле src/components/Analytics.tsx на ваш ID</li>
                  </ol>
                </div>

                <div>
                  <Label>Код для ручной установки (если нужно):</Label>
                  <div className="relative mt-2">
                    <Textarea
                      value={gaCode}
                      readOnly
                      rows={8}
                      className="font-mono text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(gaCode, 'ga')}
                    >
                      {copied === 'ga' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yandex" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ym-id">Яндекс.Метрика ID</Label>
                  <Input
                    id="ym-id"
                    placeholder="12345678"
                    value={ymId}
                    onChange={(e) => setYmId(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Номер счетчика из Яндекс.Метрики
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Инструкция по получению Яндекс.Метрика ID:</Label>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Перейдите на <a href="https://metrika.yandex.ru" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">metrika.yandex.ru</a></li>
                    <li>Войдите в аккаунт или зарегистрируйтесь</li>
                    <li>Добавьте новый счетчик для вашего сайта</li>
                    <li>Скопируйте номер счетчика (только цифры)</li>
                    <li>Замените 'XXXXXXXX' в файле src/components/Analytics.tsx на ваш номер</li>
                  </ol>
                </div>

                <div>
                  <Label>Код для ручной установки (если нужно):</Label>
                  <div className="relative mt-2">
                    <Textarea
                      value={ymCode}
                      readOnly
                      rows={12}
                      className="font-mono text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(ymCode, 'ym')}
                    >
                      {copied === 'ym' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <AlertDescription>
              <strong>Важно:</strong> После получения идентификаторов, отредактируйте файл 
              <code className="mx-1 px-2 py-1 bg-gray-100 rounded">src/components/Analytics.tsx</code> 
              и замените значения переменных GA_TRACKING_ID и YM_COUNTER_ID на ваши реальные идентификаторы.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Отслеживаемые события</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Автоматически отслеживается:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Просмотры страниц</li>
                <li>• Клики по кнопкам</li>
                <li>• Переходы по ссылкам</li>
                <li>• Отправка форм бронирования</li>
                <li>• Просмотр портфолио</li>
                <li>• Клики по телефону</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Настраиваемые цели:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Конверсия бронирований</li>
                <li>• Время на сайте</li>
                <li>• Глубина просмотра</li>
                <li>• Источники трафика</li>
                <li>• Популярные страницы</li>
                <li>• Мобильный трафик</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSetup;
