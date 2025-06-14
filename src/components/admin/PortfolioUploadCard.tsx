
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';
import { useCreatePortfolio } from '@/hooks/usePortfolio';
import ImageUpload from './ImageUpload';

const PortfolioUploadCard = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    client_name: '',
    shoot_date: '',
    image_url: '',
    is_featured: false
  });

  const createPortfolio = useCreatePortfolio();

  const categories = [
    { value: 'wedding', label: 'Свадебная съемка' },
    { value: 'portrait', label: 'Портретная съемка' },
    { value: 'family', label: 'Семейная фотосессия' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'corporate', label: 'Корпоративная съемка' },
    { value: 'maternity', label: 'Материнство' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.image_url) {
      return;
    }

    try {
      await createPortfolio.mutateAsync(formData);
      
      // Сброс формы
      setFormData({
        title: '',
        category: '',
        description: '',
        location: '',
        client_name: '',
        shoot_date: '',
        image_url: '',
        is_featured: false
      });
    } catch (error) {
      console.error('Error creating portfolio item:', error);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Добавить новую фотографию
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Название фотографии"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
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
            placeholder="Описание фотографии"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <Input
            placeholder="Локация съемки"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Input
            placeholder="Имя клиента"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
          />

          <Input
            type="date"
            placeholder="Дата съемки"
            value={formData.shoot_date}
            onChange={(e) => setFormData({ ...formData, shoot_date: e.target.value })}
          />

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
            <label className="text-sm font-medium">Рекомендуемая фотография</label>
          </div>

          <ImageUpload
            currentImage={formData.image_url}
            onImageUploaded={handleImageUpload}
            folder="portfolio"
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={createPortfolio.isPending || !formData.title || !formData.category || !formData.image_url}
          >
            {createPortfolio.isPending ? 'Добавление...' : 'Добавить в портфолио'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioUploadCard;
