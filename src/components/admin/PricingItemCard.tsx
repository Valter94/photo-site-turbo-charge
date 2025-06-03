
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X } from 'lucide-react';
import { useUpdatePricing, useDeletePricing } from '@/hooks/usePricing';
import { useToast } from '@/hooks/use-toast';

interface PricingItemCardProps {
  item: any;
  serviceTypes: Array<{ value: string; label: string }>;
}

const PricingItemCard = ({ item, serviceTypes }: PricingItemCardProps) => {
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

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Select
              value={editForm.service_type}
              onValueChange={(value) => setEditForm({...editForm, service_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value)})}
              placeholder="Цена"
            />
            <Input
              type="number"
              value={editForm.duration_hours}
              onChange={(e) => setEditForm({...editForm, duration_hours: parseInt(e.target.value)})}
              placeholder="Часы"
            />
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
              <label className="text-sm">Активный</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={updatePricing.isPending}>
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
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h4 className="font-medium">
            {serviceTypes.find(t => t.value === item.service_type)?.label}
          </h4>
          <p className="text-2xl font-bold text-rose-400">{item.price?.toLocaleString()} ₽</p>
          <p className="text-sm text-gray-600">{item.duration_hours} часов</p>
          <p className="text-sm text-gray-600">{item.photos_count}</p>
          <div className="flex justify-between items-center">
            <Badge variant={item.is_active ? "default" : "secondary"}>
              {item.is_active ? "Активный" : "Неактивный"}
            </Badge>
            <div className="flex gap-1">
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4" />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingItemCard;
