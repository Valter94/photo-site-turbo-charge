
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sendTelegramMessage } from "@/utils/telegram";
import { MessageSquare, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn('localStorage access denied - settings will not persist');
    }
  }
};

const TelegramSettings = () => {
  const [botToken, setBotToken] = useState(safeLocalStorage.getItem('TELEGRAM_BOT_TOKEN') || '');
  const [chatId1, setChatId1] = useState(safeLocalStorage.getItem('TELEGRAM_CHAT_ID_1') || '');
  const [chatId2, setChatId2] = useState(safeLocalStorage.getItem('TELEGRAM_CHAT_ID_2') || '');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Проверим подключение при загрузке
    const token = safeLocalStorage.getItem('TELEGRAM_BOT_TOKEN');
    const chat1 = safeLocalStorage.getItem('TELEGRAM_CHAT_ID_1');
    setIsConnected(!!(token && chat1));
    
    // Устанавливаем глобальную переменную
    if (token) {
      (window as any).TELEGRAM_BOT_TOKEN = token;
    }
  }, []);

  const saveSettings = () => {
    safeLocalStorage.setItem('TELEGRAM_BOT_TOKEN', botToken.trim());
    safeLocalStorage.setItem('TELEGRAM_CHAT_ID_1', chatId1.trim());
    safeLocalStorage.setItem('TELEGRAM_CHAT_ID_2', chatId2.trim());
    (window as any).TELEGRAM_BOT_TOKEN = botToken.trim();
    
    setIsConnected(!!(botToken.trim() && chatId1.trim()));
    
    toast({ 
      title: "Сохранено", 
      description: "Настройки Telegram сохранены и активированы" 
    });
  };

  const testConnection = async () => {
    if (!botToken.trim() || !chatId1.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните Bot Token и Chat ID 1",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendTelegramMessage(
        `🔧 <b>Тестовое сообщение от админ-панели</b>\n\n` +
        `✅ Telegram уведомления настроены успешно!\n` +
        `📅 ${new Date().toLocaleString('ru-RU')}\n\n` +
        `Теперь вы будете получать уведомления о:` +
        `\n• 👁 Посещениях сайта` +
        `\n• 📝 Новых заявках` +
        `\n• ❌ Ошибках на сайте` +
        `\n• 📊 Важных событиях`, 
        [chatId1.trim()]
      );
      toast({
        title: "Успешно!",
        description: "Тестовое сообщение отправлено в Telegram. Проверьте свой чат!"
      });
    } catch (error) {
      console.error('Telegram test error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Проверьте Bot Token и Chat ID",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <CardTitle>Telegram уведомления</CardTitle>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center space-x-1">
              {isConnected ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Подключено</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>Не настроено</span>
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Куда приходят сообщения:</strong> Уведомления будут отправляться в Telegram чаты, 
              которые вы укажете ниже. Это может быть ваш личный чат или группа.
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h4 className="font-medium text-blue-900 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Пошаговая инструкция:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>
                Перейдите к боту 
                <a href="https://t.me/BotFather" target="_blank" className="text-blue-600 underline ml-1">
                  @BotFather
                </a> в Telegram
              </li>
              <li>Отправьте команду <code className="bg-blue-200 px-1 rounded">/newbot</code></li>
              <li>Следуйте инструкциям и создайте бота</li>
              <li>Скопируйте полученный Bot Token</li>
              <li>
                Перейдите к боту 
                <a href="https://t.me/getmyid_bot" target="_blank" className="text-blue-600 underline ml-1">
                  @getmyid_bot
                </a>
              </li>
              <li>Отправьте <code className="bg-blue-200 px-1 rounded">/start</code> и получите ваш Chat ID</li>
              <li>Вставьте Bot Token и Chat ID в поля ниже</li>
              <li>Нажмите "Тест" для проверки</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Bot Token 
                <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="123456789:ABCdef1234ghIkl-zyx57W2v1u123ew11" 
                value={botToken} 
                onChange={e => setBotToken(e.target.value)} 
                type="password"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Токен должен содержать цифры, двоеточие и буквы/символы
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Chat ID 1 (основной) 
                <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="123456789 или -987654321" 
                value={chatId1} 
                onChange={e => setChatId1(e.target.value)} 
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Положительное число для личного чата, отрицательное для группы
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Chat ID 2 (дополнительный)
              </label>
              <Input 
                placeholder="Опционально для второго получателя" 
                value={chatId2} 
                onChange={e => setChatId2(e.target.value)} 
                className="font-mono"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={saveSettings} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Сохранить настройки
            </Button>
            <Button 
              onClick={testConnection} 
              variant="outline" 
              disabled={!botToken.trim() || !chatId1.trim() || isLoading}
            >
              {isLoading ? 'Отправка...' : 'Тест'}
            </Button>
          </div>

          {isConnected && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Уведомления активны!</strong> Вы будете получать сообщения о посещениях сайта, 
                новых заявках и ошибках в настроенные чаты.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">📱 Какие уведомления вы получите:</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>👁 <strong>Посещения:</strong> когда кто-то заходит на сайт</li>
            <li>📝 <strong>Заявки:</strong> новые запросы на фотосессию</li>
            <li>⭐ <strong>Отзывы:</strong> новые отзывы от клиентов</li>
            <li>❌ <strong>Ошибки:</strong> технические проблемы на сайте</li>
            <li>📊 <strong>Статистика:</strong> еженедельные отчеты</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramSettings;
