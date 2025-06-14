
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const TelegramSettings = () => {
  const [botToken, setBotToken] = useState(localStorage.getItem('TELEGRAM_BOT_TOKEN') || '');
  const [chatId1, setChatId1] = useState(localStorage.getItem('TELEGRAM_CHAT_ID_1') || '');
  const [chatId2, setChatId2] = useState(localStorage.getItem('TELEGRAM_CHAT_ID_2') || '');
  const { toast } = useToast();

  const saveSettings = () => {
    localStorage.setItem('TELEGRAM_BOT_TOKEN', botToken.trim());
    localStorage.setItem('TELEGRAM_CHAT_ID_1', chatId1.trim());
    localStorage.setItem('TELEGRAM_CHAT_ID_2', chatId2.trim());
    (window as any).TELEGRAM_BOT_TOKEN = botToken.trim();
    toast({ title: "Сохранено", description: "Настройки Telegram сохранены" });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Telegram уведомления</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm text-gray-500">Для работы интеграции нужен <b>bot token</b> (получить в @BotFather) и chat_id получателей.<br /> Для получения chat_id: напишите боту и перейдите на сайт <a href="https://t.me/getmyid_bot" target="_blank" className="text-blue-600 underline">t.me/getmyid_bot</a>, либо попросите у разработчика.</div>
        <Input placeholder="Bot Token (например, 123456789:AA...)" value={botToken} onChange={e => setBotToken(e.target.value)} className="mb-2"/>
        <Input placeholder="Chat ID 1 (например, 89262563550 или -12345678)" value={chatId1} onChange={e => setChatId1(e.target.value)} className="mb-2"/>
        <Input placeholder="Chat ID 2" value={chatId2} onChange={e => setChatId2(e.target.value)} className="mb-2"/>
        <Button onClick={saveSettings}>Сохранить</Button>
      </CardContent>
    </Card>
  );
};
export default TelegramSettings;
