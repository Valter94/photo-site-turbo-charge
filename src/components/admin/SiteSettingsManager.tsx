
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const SiteSettingsManager = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [form, setForm] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast({
        title: "Успешно",
        description: "Настройки сайта обновлены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Информация о фотографе</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Имя фотографа</label>
            <Input
              value={form.photographer_name || ''}
              onChange={(e) => setForm({...form, photographer_name: e.target.value})}
              placeholder="Ирина"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Описание</label>
            <Textarea
              value={form.photographer_description || ''}
              onChange={(e) => setForm({...form, photographer_description: e.target.value})}
              placeholder="Расскажите о себе..."
              rows={4}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Фото профиля (URL)</label>
            <Input
              value={form.photographer_photo || ''}
              onChange={(e) => setForm({...form, photographer_photo: e.target.value})}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Главный экран</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Заголовок</label>
            <Input
              value={form.hero_title || ''}
              onChange={(e) => setForm({...form, hero_title: e.target.value})}
              placeholder="Создаем незабываемые моменты"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Подзаголовок</label>
            <Input
              value={form.hero_subtitle || ''}
              onChange={(e) => setForm({...form, hero_subtitle: e.target.value})}
              placeholder="Профессиональная фотосъемка в Москве и области"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Контактная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Телефон</label>
            <Input
              value={form.contact_phone || ''}
              onChange={(e) => setForm({...form, contact_phone: e.target.value})}
              placeholder="+7 (925) 506-24-27"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={form.contact_email || ''}
              onChange={(e) => setForm({...form, contact_email: e.target.value})}
              placeholder="Bagreshevafoto@gmail.com"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Адрес</label>
            <Input
              value={form.contact_address || ''}
              onChange={(e) => setForm({...form, contact_address: e.target.value})}
              placeholder="Москва, Россия"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
