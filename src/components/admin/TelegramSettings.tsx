
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { sendTelegramMessage } from "@/utils/telegram";

const TelegramSettings = () => {
  const [botToken, setBotToken] = useState(localStorage.getItem('TELEGRAM_BOT_TOKEN') || '');
  const [chatId1, setChatId1] = useState(localStorage.getItem('TELEGRAM_CHAT_ID_1') || '');
  const [chatId2, setChatId2] = useState(localStorage.getItem('TELEGRAM_CHAT_ID_2') || '');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Проверим подключение при загрузке
    const token = localStorage.getItem('TELEGRAM_BOT_TOKEN');
    const chat1 = localStorage.getItem('TELEGRAM_CHAT_ID_1');
    setIsConnected(!!(token && chat1));
    
    // Устанавливаем глобальную переменную
    if (token) {
      (window as any).TELEGRAM_BOT_TOKEN = token;
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('TELEGRAM_BOT_TOKEN', botToken.trim());
    localStorage.setItem('TELEGRAM_CHAT_ID_1', chatId1.trim());
    localStorage.setItem('TELEGRAM_CHAT_ID_2', chatId2.trim());
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

    try {
      await sendTelegramMessage(
        "🔧 Тестовое сообщение от админ-панели фотографа Ирины", 
        [chatId1.trim()]
      );
      toast({
        title: "Успешно!",
        description: "Тестовое сообщение отправлено в Telegram"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Проверьте настройки",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Telegram уведомления</CardTitle>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Подключено" : "Не настроено"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-2">📋 Инструкция по настройке:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Создайте бота в <a href="https://t.me/BotFather" target="_blank" className="text-blue-600 underline">@BotFather</a></li>
            <li>Скопируйте Bot Token</li>
            <li>Получите Chat ID в <a href="https://t.me/getmyid_bot" target="_blank" className="text-blue-600 underline">@getmyid_bot</a></li>
            <li>Сохраните настройки и протестируйте</li>
          </ol>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Bot Token</label>
            <Input 
              placeholder="123456789:AA..." 
              value={botToken} 
              onChange={e => setBotToken(e.target.value)} 
              type="password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Chat ID 1 (основной)</label>
            <Input 
              placeholder="89262563550 или -12345678" 
              value={chatId1} 
              onChange={e => setChatId1(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Chat ID 2 (дополнительный)</label>
            <Input 
              placeholder="Опционально" 
              value={chatId2} 
              onChange={e => setChatId2(e.target.value)} 
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={saveSettings} className="flex-1">
            Сохранить настройки
          </Button>
          <Button onClick={testConnection} variant="outline">
            Тест
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramSettings;
