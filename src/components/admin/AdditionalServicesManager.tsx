
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X, Plus, DollarSign } from 'lucide-react';
import { useAdditionalServices, useUpdateAdditionalService, useDeleteAdditionalService } from '@/hooks/useAdditionalServices';
import { useToast } from '@/hooks/use-toast';

const AdditionalServicesManager = () => {
  const { data: services } = useAdditionalServices();
  const updateService = useUpdateAdditionalService();
  const deleteService = useDeleteAdditionalService();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { toast } = useToast();

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  const handleSave = async () => {
    try {
      await updateService.mutateAsync(editForm);
      toast({
        title: "Успешно",
        description: "Услуга обновлена",
      });
      setEditingId(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить услугу",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return;
    
    try {
      await deleteService.mutateAsync(id);
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

  const handleAddNew = async () => {
    try {
      const newService = {
        name: 'Новая услуга',
        description: 'Описание новой услуги',
        price: 1000,
        is_active: true
      };

      await updateService.mutateAsync(newService);
      toast({
        title: "Успешно",
        description: "Новая услуга добавлена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить услугу",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Дополнительные услуги</h3>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить услугу
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services?.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge variant={service.is_active ? "default" : "secondary"}>
                  {service.is_active ? "Активна" : "Неактивна"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === service.id ? (
                <div className="space-y-4">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Название услуги"
                  />
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Описание услуги"
                    rows={3}
                  />
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value)})}
                    placeholder="Цена"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editForm.is_active}
                      onCheckedChange={(checked) => setEditForm({...editForm, is_active: checked})}
                    />
                    <label className="text-sm">Активна</label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" disabled={updateService.isPending}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-lg">{service.price?.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-end gap-1">
                    <Button onClick={() => handleEdit(service)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDelete(service.id)} 
                      variant="destructive" 
                      size="sm"
                      disabled={deleteService.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdditionalServicesManager;
