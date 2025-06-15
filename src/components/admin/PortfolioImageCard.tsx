import React from 'react';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X } from 'lucide-react';
import { usePortfolioActions } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';
import OptimizedImage from '@/components/OptimizedImage';

interface PortfolioImageCardProps {
  item: any;
}

const PortfolioImageCard = ({ item }: PortfolioImageCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [itemForm, setItemForm] = useState(item);
  const { updatePortfolio, deletePortfolio } = usePortfolioActions();
  const { toast } = useToast();

  const categories = [
    { value: 'wedding', label: 'Свадебная съемка' },
    { value: 'portrait', label: 'Портретная съемка' },
    { value: 'family', label: 'Семейная фотосессия' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'corporate', label: 'Корпоративная съемка' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setItemForm(item);
  };

  const handleSave = async () => {
    try {
      await updatePortfolio.mutateAsync(itemForm);
      toast({
        title: "Успешно",
        description: "Фотография обновлена",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить фотографию",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту фотографию?')) return;
    
    try {
      await deletePortfolio.mutateAsync(item.id);
      toast({
        title: "Успешно",
        description: "Фотография удалена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить фотографию",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setItemForm({ ...itemForm, image_url: url });
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Input
              value={itemForm.title || ''}
              onChange={(e) => setItemForm({...itemForm, title: e.target.value})}
              placeholder="Название"
            />
            
            <Select
              value={itemForm.category}
              onValueChange={(value) => setItemForm({...itemForm, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
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
              value={itemForm.description || ''}
              onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
              placeholder="Описание"
              rows={3}
            />

            <Input
              value={itemForm.location || ''}
              onChange={(e) => setItemForm({...itemForm, location: e.target.value})}
              placeholder="Локация"
            />

            <Input
              value={itemForm.client_name || ''}
              onChange={(e) => setItemForm({...itemForm, client_name: e.target.value})}
              placeholder="Имя клиента"
            />

            <Input
              type="date"
              value={itemForm.shoot_date || ''}
              onChange={(e) => setItemForm({...itemForm, shoot_date: e.target.value})}
            />

            <div className="flex items-center space-x-2">
              <Switch
                checked={itemForm.is_featured || false}
                onCheckedChange={(checked) => setItemForm({...itemForm, is_featured: checked})}
              />
              <label className="text-sm">Рекомендуемая</label>
            </div>

            <ImageUpload
              currentImage={itemForm.image_url}
              onImageUploaded={handleImageUpload}
              folder="portfolio"
            />

            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={updatePortfolio.isPending}>
                <Save className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <OptimizedImage
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {item.is_featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500">
            Рекомендуемая
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{item.title}</h4>
            <div className="flex gap-1">
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                size="sm"
                disabled={deletePortfolio.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Badge variant="secondary">
            {categories.find(c => c.value === item.category)?.label || item.category}
          </Badge>
          
          {item.description && (
            <p className="text-sm text-gray-600">{item.description}</p>
          )}
          
          {item.location && (
            <p className="text-sm text-gray-500">📍 {item.location}</p>
          )}
          
          {item.client_name && (
            <p className="text-sm text-gray-500">👤 {item.client_name}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioImageCard;
