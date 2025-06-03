
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Save, X } from 'lucide-react';
import { useLocationActions } from '@/hooks/useLocationActions';
import { useLocationCategories } from '@/hooks/useLocations';
import ImageUpload from './ImageUpload';

interface LocationCardProps {
  location: any;
}

const LocationCard = ({ location }: LocationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [locationForm, setLocationForm] = useState(location);
  const { updateLocation, deleteLocation } = useLocationActions();
  const { data: categories } = useLocationCategories();

  const handleEdit = () => {
    setIsEditing(true);
    setLocationForm(location);
  };

  const handleSave = async () => {
    try {
      await updateLocation.mutateAsync(locationForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту локацию?')) return;
    
    try {
      await deleteLocation.mutateAsync(location.id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleImageUpload = (url: string) => {
    setLocationForm({ ...locationForm, image_url: url });
  };

  const handleRemoveImage = () => {
    setLocationForm({ ...locationForm, image_url: null });
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              value={locationForm.name || ''}
              onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
              placeholder="Название локации"
            />
            
            <Textarea
              value={locationForm.description || ''}
              onChange={(e) => setLocationForm({...locationForm, description: e.target.value})}
              placeholder="Описание"
              rows={3}
            />

            <Select
              value={locationForm.category_id}
              onValueChange={(value) => setLocationForm({...locationForm, category_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
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
              value={locationForm.address || ''}
              onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
              placeholder="Адрес"
            />

            <Input
              value={locationForm.best_time || ''}
              onChange={(e) => setLocationForm({...locationForm, best_time: e.target.value})}
              placeholder="Лучшее время для съемки"
            />

            <div className="flex items-center space-x-2">
              <Switch
                checked={locationForm.indoor || false}
                onCheckedChange={(checked) => setLocationForm({...locationForm, indoor: checked})}
              />
              <label className="text-sm">Закрытое помещение</label>
            </div>

            <ImageUpload
              currentImage={locationForm.image_url}
              onImageUploaded={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              folder="locations"
            />

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={updateLocation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {location.image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={location.image_url} 
            alt={location.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">{location.name}</h4>
            <div className="flex gap-1">
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                size="sm"
                disabled={deleteLocation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">{location.description}</p>
          
          {location.address && (
            <p className="text-sm text-gray-500">📍 {location.address}</p>
          )}
          
          {location.best_time && (
            <p className="text-sm text-gray-500">⏰ {location.best_time}</p>
          )}
          
          <div className="flex gap-2 flex-wrap">
            {location.location_categories && (
              <Badge variant="secondary">
                {location.location_categories.name}
              </Badge>
            )}
            {location.indoor && (
              <Badge variant="outline">Закрытое помещение</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
