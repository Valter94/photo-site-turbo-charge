
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from './ImageUpload';

const PortfolioUploadCard = () => {
  const [newItem, setNewItem] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    client_name: '',
    shoot_date: '',
    is_featured: false,
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'wedding', label: 'Свадебная съемка' },
    { value: 'portrait', label: 'Портретная съемка' },
    { value: 'family', label: 'Семейная фотосессия' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'corporate', label: 'Корпоративная съемка' }
  ];

  const handleImageUpload = (url: string) => {
    setNewItem({ ...newItem, image_url: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title || !newItem.category || !newItem.image_url) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const { error } = await supabase
        .from('portfolio')
        .insert([newItem]);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Фотография добавлена в портфолио",
      });

      // Сброс формы
      setNewItem({
        title: '',
        category: '',
        description: '',
        location: '',
        client_name: '',
        shoot_date: '',
        is_featured: false,
        image_url: ''
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить фотографию",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Добавить новую фотографию</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={newItem.title}
            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
            placeholder="Название *"
            required
          />
          
          <Select
            value={newItem.category}
            onValueChange={(value) => setNewItem({...newItem, category: value})}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию *" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={newItem.description}
            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            placeholder="Описание"
            rows={3}
          />

          <Input
            value={newItem.location}
            onChange={(e) => setNewItem({...newItem, location: e.target.value})}
            placeholder="Локация"
          />

          <Input
            value={newItem.client_name}
            onChange={(e) => setNewItem({...newItem, client_name: e.target.value})}
            placeholder="Имя клиента"
          />

          <Input
            type="date"
            value={newItem.shoot_date}
            onChange={(e) => setNewItem({...newItem, shoot_date: e.target.value})}
            placeholder="Дата съемки"
          />

          <div className="flex items-center space-x-2">
            <Switch
              checked={newItem.is_featured}
              onCheckedChange={(checked) => setNewItem({...newItem, is_featured: checked})}
            />
            <label className="text-sm">Рекомендуемая</label>
          </div>

          <ImageUpload
            currentImage={newItem.image_url}
            onImageUploaded={handleImageUpload}
            folder="portfolio"
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={uploading || !newItem.title || !newItem.category || !newItem.image_url}
          >
            {uploading ? 'Добавление...' : 'Добавить в портфолио'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioUploadCard;
