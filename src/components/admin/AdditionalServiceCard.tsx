
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X } from 'lucide-react';
import { useUpdateAdditionalService, useDeleteAdditionalService } from '@/hooks/useAdditionalServices';
import { useToast } from '@/hooks/use-toast';

interface AdditionalServiceCardProps {
  service: any;
}

const AdditionalServiceCard = ({ service }: AdditionalServiceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [serviceForm, setServiceForm] = useState<any>({});
  const updateService = useUpdateAdditionalService();
  const deleteService = useDeleteAdditionalService();
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setServiceForm(service);
  };

  const handleSave = async () => {
    try {
      await updateService.mutateAsync(serviceForm);
      toast({
        title: "Успешно",
        description: "Услуга обновлена",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить услугу",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return;
    
    try {
      await deleteService.mutateAsync(service.id);
      toast({
        title: "Успешно",
        description: "Услуга удалена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить услугу",
        variant: "destructive"
      });
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Input
              value={serviceForm.name}
              onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
              placeholder="Название услуги"
            />
            <Textarea
              value={serviceForm.description || ''}
              onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
              placeholder="Описание"
              rows={3}
            />
            <Input
              type="number"
              value={serviceForm.price || ''}
              onChange={(e) => setServiceForm({...serviceForm, price: parseInt(e.target.value)})}
              placeholder="Цена"
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={serviceForm.is_active}
                onCheckedChange={(checked) => setServiceForm({...serviceForm, is_active: checked})}
              />
              <label className="text-sm">Активная</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={updateService.isPending}>
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
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{service.name}</h4>
            <p className="font-bold text-rose-400">{service.price?.toLocaleString()} ₽</p>
          </div>
          <p className="text-sm text-gray-600">{service.description}</p>
          <div className="flex justify-between items-center">
            <Badge variant={service.is_active ? "default" : "secondary"}>
              {service.is_active ? "Активная" : "Неактивная"}
            </Badge>
            <div className="flex gap-1">
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                size="sm"
                disabled={deleteService.isPending}
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

export default AdditionalServiceCard;
