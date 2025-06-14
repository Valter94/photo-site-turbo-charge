
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTelegramBot } from "@/hooks/useTelegramBot";
import { Bot, CheckCircle, AlertCircle, Send, Wrench } from 'lucide-react';

const TelegramBotManager = () => {
  const { setupWebhook, sendInstructions, testBot, isLoading } = useTelegramBot();

  const botToken = localStorage.getItem('TELEGRAM_BOT_TOKEN');
  const chatId = localStorage.getItem('TELEGRAM_CHAT_ID_1');
  const isConfigured = !!(botToken && chatId);

  const handleActivateBot = async () => {
    console.log('🤖 Активируем бота...');
    const success = await setupWebhook();
    if (success) {
      console.log('✅ Бот активирован, отправляем инструкции');
      await sendInstructions();
    }
  };

  const handleTestBot = async () => {
    console.log('🔧 Тестируем бота...');
    await testBot();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-blue-500" />
            <CardTitle>Telegram Бот (Улучшенная версия)</CardTitle>
          </div>
          <Badge variant={isConfigured ? "default" : "secondary"} className="flex items-center space-x-1">
            {isConfigured ? (
              <>
                <CheckCircle className="w-3 h-3" />
                <span>Настроен</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" />
                <span>Не настроен</span>
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConfigured ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Сначала настройте Telegram:</strong> Перейдите в раздел выше и 
              введите Bot Token и Chat ID, затем вернитесь сюда для активации бота.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Telegram настроен!</strong> Теперь активируйте бота для управления контентом сайта.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button 
                onClick={handleActivateBot}
                disabled={isLoading}
                className="flex-1"
              >
                <Bot className="w-4 h-4 mr-2" />
                {isLoading ? 'Активация...' : 'Активировать бота'}
              </Button>
              
              <Button 
                onClick={sendInstructions}
                variant="outline"
                disabled={isLoading}
              >
                <Send className="w-4 h-4 mr-2" />
                Инструкции
              </Button>
              
              <Button 
                onClick={handleTestBot}
                variant="outline"
                disabled={isLoading}
              >
                <Wrench className="w-4 h-4 mr-2" />
                Тест
              </Button>
            </div>
          </div>
        )}

        <div className="bg-green-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-green-900">🎉 Новые возможности:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li><strong>🎮 Кнопочный интерфейс</strong> - никаких команд!</li>
            <li><strong>📝 Пошаговое добавление</strong> - бот спросит всё по порядку</li>
            <li><strong>🎯 Выбор категорий кнопками</strong> - не нужно запоминать названия</li>
            <li><strong>📊 Реальная статистика</strong> - точные данные с сайта</li>
          </ul>
          
          <div className="mt-3 p-3 bg-white rounded border-l-4 border-green-400">
            <p className="text-sm text-gray-700">
              <strong>Как использовать:</strong><br/>
              1. Отправьте боту <code>/start</code><br/>
              2. Выберите действие кнопкой<br/>
              3. Следуйте инструкциям пошагово
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramBotManager;
