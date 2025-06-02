
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Save, X, Plus } from 'lucide-react';
import { usePricing } from '@/hooks/usePricing';
import { useAdditionalServices, useUpdateAdditionalService, useDeleteAdditionalService } from '@/hooks/useAdditionalServices';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PricingManager = () => {
  const { data: pricing, refetch: refetchPricing } = usePricing();
  const { data: additionalServices, refetch: refetchServices } = useAdditionalServices();
  const updateService = useUpdateAdditionalService();
  const deleteService = useDeleteAdditionalService();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<any>({});
  const { toast } = useToast();

  const serviceTypes = [
    { value: 'wedding_preparations', label: 'Утренние сборы' },
    { value: 'wedding_ceremony', label: 'Церемония и банкет' },
    { value: 'wedding_full_day', label: 'Полный свадебный день' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'portrait', label: 'Портретная съемка' },
    { value: 'family', label: 'Семейная фотосессия' }
  ];

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('pricing')
        .update(editForm)
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Тариф обновлен",
      });

      setEditingId(null);
      refetchPricing();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить тариф",
        variant: "destructive"
      });
    }
  };

  const handleEditService = (service: any) => {
    setEditingServiceId(service.id);
    setServiceForm(service);
  };

  const handleSaveService = async () => {
    try {
      await updateService.mutateAsync(serviceForm);
      toast({
        title: "Успешно",
        description: "Услуга обновлена",
      });
      setEditingServiceId(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить услугу",
        variant: "destructive"
      });
    }
  };

  const handleDeleteService = async (id: string) => {
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

  const handleAddService = async () => {
    try {
      const newService = {
        name: 'Новая услуга',
        description: 'Описание услуги',
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
    <div className="space-y-8">
      {/* Основные тарифы */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Основные тарифы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricing?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                {editingId === item.id ? (
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
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {serviceTypes.find(t => t.value === item.service_type)?.label}
                    </h4>
                    <p className="text-2xl font-bold text-rose-400">{item.price?.toLocaleString()} ₽</p>
                    <p className="text-sm text-gray-600">{item.duration_hours} часов</p>
                    <p className="text-sm text-gray-600">{item.photos_count}</p>
                    <div className="flex justify-end">
                      <Button onClick={() => handleEdit(item)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Дополнительные услуги */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Дополнительные услуги</h3>
          <Button onClick={handleAddService}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить услугу
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalServices?.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4">
                {editingServiceId === service.id ? (
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
                    />
                    <Input
                      type="number"
                      value={serviceForm.price || ''}
                      onChange={(e) => setServiceForm({...serviceForm, price: parseInt(e.target.value)})}
                      placeholder="Цена"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveService} size="sm">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => setEditingServiceId(null)} variant="outline" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="font-bold text-rose-400">{service.price?.toLocaleString()} ₽</p>
                    </div>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <div className="flex justify-end gap-1">
                      <Button onClick={() => handleEditService(service)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteService(service.id)} variant="destructive" size="sm">
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
    </div>
  );
};

export default PricingManager;
