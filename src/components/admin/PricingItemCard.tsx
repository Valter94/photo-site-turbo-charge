
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X, Clock, Camera } from 'lucide-react';
import { useUpdatePricing, useDeletePricing } from '@/hooks/usePricing';
import { useToast } from '@/hooks/use-toast';

interface PricingItemCardProps {
  item: any;
  serviceTypes: Array<{ value: string; label: string }>;
  formatPrice: (price: number) => string;
}

const PricingItemCard = ({ item, serviceTypes, formatPrice }: PricingItemCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const updatePricing = useUpdatePricing();
  const deletePricing = useDeletePricing();
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      ...item,
      features: Array.isArray(item.features) ? item.features.join('\n') : 
                typeof item.features === 'string' ? item.features : 
                JSON.stringify(item.features || []).replace(/[\[\]"]/g, '').replace(/,/g, '\n')
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...editForm,
        price: parseInt(editForm.price) || 0,
        duration_hours: parseInt(editForm.duration_hours) || 0,
        features: editForm.features ? editForm.features.split('\n').filter((f: string) => f.trim()) : []
      };
      
      await updatePricing.mutateAsync(dataToSave);

      toast({
        title: "Успешно",
        description: "Тариф обновлен",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить тариф",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот тариф?')) return;
    
    try {
      await deletePricing.mutateAsync(item.id);
      toast({
        title: "Успешно",
        description: "Тариф удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить тариф",
        variant: "destructive"
      });
    }
  };

  const getServiceTypeLabel = (value: string) => {
    return serviceTypes.find(t => t.value === value)?.label || value;
  };

  const renderFeatures = (features: any) => {
    if (!features) return null;
    
    const featuresArray = Array.isArray(features) ? features : 
                         typeof features === 'string' ? [features] :
                         Object.values(features);
    
    return featuresArray.map((feature: string, index: number) => (
      <li key={index} className="text-sm text-gray-600">✓ {feature}</li>
    ));
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="space-y-4">
            <Select
              value={editForm.service_type}
              onValueChange={(value) => setEditForm({...editForm, service_type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип услуги" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                placeholder="Цена (руб)"
              />
              <Input
                type="number"
                value={editForm.duration_hours || ''}
                onChange={(e) => setEditForm({...editForm, duration_hours: e.target.value})}
                placeholder="Часы"
              />
            </div>
            
            <Input
              value={editForm.photos_count || ''}
              onChange={(e) => setEditForm({...editForm, photos_count: e.target.value})}
              placeholder="Количество фото"
            />
            
            <Textarea
              value={editForm.features || ''}
              onChange={(e) => setEditForm({...editForm, features: e.target.value})}
              placeholder="Особенности (каждая с новой строки)"
              rows={4}
            />
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm({...editForm, is_active: checked})}
              />
              <label className="text-sm">Активный тариф</label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                size="sm" 
                disabled={updatePricing.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Сохранить
              </Button>
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="outline" 
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Отмена
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-lg text-gray-900">
              {getServiceTypeLabel(item.service_type)}
            </h4>
            <Badge variant={item.is_active ? "default" : "secondary"}>
              {item.is_active ? "Активный" : "Неактивный"}
            </Badge>
          </div>
          
          <div className="text-3xl font-bold text-rose-600">
            {formatPrice(item.price || 0)}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {item.duration_hours} ч
            </div>
            {item.photos_count && (
              <div className="flex items-center">
                <Camera className="h-4 w-4 mr-1" />
                {item.photos_count}
              </div>
            )}
          </div>
          
          {item.features && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Особенности:</p>
              <ul className="space-y-1">
                {renderFeatures(item.features)}
              </ul>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleEdit} 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Изменить
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="destructive" 
              size="sm"
              disabled={deletePricing.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingItemCard;
