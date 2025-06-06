
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
import { useLocationCategories } from '@/hooks/useLocations';
import ImageUpload from './ImageUpload';

const LocationUploadCard = () => {
  const { data: categories } = useLocationCategories();
  const [newLocation, setNewLocation] = useState({
    name: '',
    description: '',
    category_id: '',
    address: '',
    best_time: '',
    indoor: false,
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (url: string) => {
    setNewLocation({ ...newLocation, image_url: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLocation.name || !newLocation.description || !newLocation.category_id) {
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
        .from('photoshoot_locations')
        .insert([newLocation]);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Локация добавлена",
      });

      // Сброс формы
      setNewLocation({
        name: '',
        description: '',
        category_id: '',
        address: '',
        best_time: '',
        indoor: false,
        image_url: ''
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить локацию",
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
          <span>Добавить новую локацию</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={newLocation.name}
            onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
            placeholder="Название локации *"
            required
          />
          
          <Textarea
            value={newLocation.description}
            onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
            placeholder="Описание *"
            rows={3}
            required
          />

          <Select
            value={newLocation.category_id}
            onValueChange={(value) => setNewLocation({...newLocation, category_id: value})}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию *" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={newLocation.address}
            onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
            placeholder="Адрес"
          />

          <Input
            value={newLocation.best_time}
            onChange={(e) => setNewLocation({...newLocation, best_time: e.target.value})}
            placeholder="Лучшее время для съемки"
          />

          <div className="flex items-center space-x-2">
            <Switch
              checked={newLocation.indoor}
              onCheckedChange={(checked) => setNewLocation({...newLocation, indoor: checked})}
            />
            <label className="text-sm">Закрытое помещение</label>
          </div>

          <ImageUpload
            currentImage={newLocation.image_url}
            onImageUploaded={handleImageUpload}
            folder="locations"
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={uploading || !newLocation.name || !newLocation.description || !newLocation.category_id}
          >
            {uploading ? 'Добавление...' : 'Добавить локацию'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationUploadCard;
