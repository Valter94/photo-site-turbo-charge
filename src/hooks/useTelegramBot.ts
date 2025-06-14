
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTelegramBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setupWebhook = async () => {
    try {
      setIsLoading(true);
      
      const botToken = localStorage.getItem('TELEGRAM_BOT_TOKEN');
      if (!botToken) {
        throw new Error('Bot Token не настроен');
      }

      // URL для webhook (Edge Function)
      const webhookUrl = `https://ojrekbttkriwwyaupbox.supabase.co/functions/v1/telegram-bot`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message']
        })
      });

      const result = await response.json();
      
      if (result.ok) {
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
🤖 <b>Ваш бот для управления сайтом активирован!</b>

📸 <b>Как добавить фото в портфолио:</b>
1. Отправьте команду /add_portfolio
2. Отправьте фото с подписью в формате:
   <code>Название|Категория|Описание</code>

🎯 <b>Доступные категории:</b>
• wedding - свадебная съемка
• lovestory - love story
• portrait - портретная съемка  
• family - семейная съемка
• corporate - корпоративная съемка

📝 <b>Пример:</b>
<code>Свадьба Анны и Ивана|wedding|Прекрасная церемония в парке Сокольники</code>

📊 <b>Другие команды:</b>
/stats - статистика сайта
/help - список всех команд

✅ Теперь вы можете управлять сайтом прямо из Telegram!
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

  return {
    setupWebhook,
    sendInstructions,
    isLoading
  };
};
