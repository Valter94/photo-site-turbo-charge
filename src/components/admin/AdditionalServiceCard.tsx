
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X, Plus } from 'lucide-react';
import { useAdditionalServices } from '@/hooks/useAdditionalServices';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdditionalServiceCardProps {
  service: any;
  formatPrice: (price: number) => string;
}

const AdditionalServiceCard = ({ service, formatPrice }: AdditionalServiceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(service);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(service);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('additional_services')
        .update({
          name: editForm.name,
          description: editForm.description,
          price: parseInt(editForm.price) || 0,
          is_active: editForm.is_active
        })
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Услуга обновлена",
      });

      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить услугу",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('additional_services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Услуга удалена",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить услугу",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-green-200">
        <CardContent className="p-4">
          <div className="space-y-4">
            <Input
              value={editForm.name || ''}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              placeholder="Название услуги"
            />
            
            <Textarea
              value={editForm.description || ''}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              placeholder="Описание услуги"
              rows={3}
            />
            
            <Input
              type="number"
              value={editForm.price || ''}
              onChange={(e) => setEditForm({...editForm, price: e.target.value})}
              placeholder="Цена (руб)"
            />
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm({...editForm, is_active: checked})}
              />
              <label className="text-sm">Активная услуга</label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                size="sm" 
                disabled={isUpdating}
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
              {service.name}
            </h4>
            <Badge variant={service.is_active ? "default" : "secondary"}>
              {service.is_active ? "Активная" : "Неактивная"}
            </Badge>
          </div>
          
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(service.price || 0)}
          </div>
          
          {service.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {service.description}
            </p>
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
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalServiceCard;
