
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTelegramBot } from "@/hooks/useTelegramBot";
import { Bot, CheckCircle, AlertCircle, Send } from 'lucide-react';

const TelegramBotManager = () => {
  const { setupWebhook, sendInstructions, isLoading } = useTelegramBot();

  const botToken = localStorage.getItem('TELEGRAM_BOT_TOKEN');
  const chatId = localStorage.getItem('TELEGRAM_CHAT_ID_1');
  const isConfigured = !!(botToken && chatId);

  const handleActivateBot = async () => {
    const success = await setupWebhook();
    if (success) {
      // Отправляем инструкции после успешной активации
      await sendInstructions();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-blue-500" />
            <CardTitle>Telegram Бот для управления контентом</CardTitle>
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
              <strong>Сначала настройте Telegram:</strong> Перейдите в раздел "Telegram" и 
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
                Отправить инструкции
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-blue-900">🤖 Что умеет бот:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>/add_portfolio</strong> - добавить фото в портфолио</li>
            <li><strong>/add_location</strong> - добавить фото локации</li>
            <li><strong>/stats</strong> - показать статистику сайта</li>
            <li><strong>/help</strong> - список всех команд</li>
          </ul>
          
          <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-400">
            <p className="text-sm text-gray-700">
              <strong>Формат для добавления фото:</strong><br/>
              Отправьте фото с подписью: <code>Название|Категория|Описание</code>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramBotManager;
