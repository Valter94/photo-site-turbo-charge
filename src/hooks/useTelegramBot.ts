
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTelegramBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setupWebhook = async () => {
    try {
      setIsLoading(true);
      
      // Get bot token from Supabase secrets or localStorage
      let botToken = localStorage.getItem('TELEGRAM_BOT_TOKEN');
      
      // If no local token, use default bot token from Supabase secrets
      if (!botToken) {
        // Use the bot token that's configured in Supabase secrets
        console.log('Bot token not found in localStorage');
      }
      
      if (!botToken) {
        throw new Error('Bot Token не настроен. Проверьте настройки Telegram в админ панели.');
      }

      // URL для webhook (Edge Function)
      const webhookUrl = `https://ojrekbttkriwwyaupbox.supabase.co/functions/v1/telegram-bot`;

      console.log('Настраиваем webhook:', { webhookUrl, botToken: botToken.substring(0, 10) + '...' });

      // First delete existing webhook
      await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);

      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
          drop_pending_updates: true
        })
      });

      const result = await response.json();
      console.log('Результат настройки webhook:', result);
      
      if (result.ok) {
        // Проверяем статус webhook
        const statusResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
        const statusResult = await statusResponse.json();
        console.log('Статус webhook:', statusResult);
        
        toast({
          title: "Успешно!",
          description: "Telegram бот активирован и готов к работе",
        });
        return true;
      } else {
        throw new Error(result.description || 'Ошибка настройки webhook');
      }
    } catch (error: any) {
      console.error('Ошибка настройки бота:', error);
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendInstructions = async () => {
    try {
      const botToken = localStorage.getItem('TELEGRAM_BOT_TOKEN');
      const chatId = localStorage.getItem('TELEGRAM_CHAT_ID_1');
      
      if (!botToken || !chatId) {
        throw new Error('Bot Token или Chat ID не настроены');
      }

      const instructions = `
🤖 <b>Ваш бот активирован!</b>

🎮 <b>Новый интерфейс с кнопками:</b>
• Отправьте /start для главного меню
• Выбирайте действия кнопками
• Пошаговое добавление контента

📸 <b>Как добавить фото:</b>
1. /start → выберите "Добавить в портфолио"
2. Отправьте фото
3. Введите название
4. Выберите категорию кнопкой
5. Добавьте описание

📍 <b>Как добавить локацию:</b>
1. /start → выберите "Добавить локацию"  
2. Отправьте фото места
3. Введите название
4. Добавьте описание

📊 <b>Другие команды:</b>
/stats - статистика сайта
/help - помощь

✨ Теперь всё стало намного проще!
      `;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: instructions,
          parse_mode: 'HTML'
        })
      });

      toast({
        title: "Инструкции отправлены",
        description: "Проверьте ваш Telegram чат",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const testBot = async () => {
    try {
      setIsLoading(true);
      const botToken = localStorage.getItem('TELEGRAM_BOT_TOKEN');
      
      if (!botToken) {
        throw new Error('Bot Token не настроен');
      }

      // Проверяем статус бота
      const botResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const botResult = await botResponse.json();
      
      if (!botResult.ok) {
        throw new Error('Неверный Bot Token');
      }

      // Проверяем webhook
      const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const webhookResult = await webhookResponse.json();
      
      console.log('Информация о боте:', botResult.result);
      console.log('Информация о webhook:', webhookResult.result);
      
      toast({
        title: "Диагностика завершена",
        description: `Бот: ${botResult.result.username}. Проверьте консоль для деталей.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Ошибка тестирования:', error);
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setupWebhook,
    sendInstructions,
    testBot,
    isLoading
  };
};
