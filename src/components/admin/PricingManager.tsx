
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Save, X, Plus } from 'lucide-react';
import { usePricing, useUpdatePricing, useDeletePricing } from '@/hooks/usePricing';
import { useAdditionalServices, useUpdateAdditionalService, useDeleteAdditionalService } from '@/hooks/useAdditionalServices';
import { useToast } from '@/hooks/use-toast';

const PricingManager = () => {
  const { data: pricing } = usePricing();
  const { data: additionalServices } = useAdditionalServices();
  const updatePricing = useUpdatePricing();
  const deletePricing = useDeletePricing();
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
    { value: 'family', label: 'Семейная фотосессия' },
    { value: 'corporate', label: 'Корпоративная съемка' }
  ];

  const handleEdit = (item: any) => {
    setEditingId(item.id);
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

      setEditingId(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить тариф",
        variant: "destructive"
      });
    }
  };

  const handleAddPricing = async () => {
    try {
      const newPricing = {
        service_type: 'portrait',
        price: 5000,
        duration_hours: 1,
        photos_count: '20-30 обработанных фотографий',
        features: ['Консультация по образу', 'Обработка фотографий', 'Онлайн-галерея'],
        is_active: true
      };

      await updatePricing.mutateAsync(newPricing);
      toast({
        title: "Успешно",
        description: "Новый тариф добавлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить тариф",
        variant: "destructive"
      });
    }
  };

  const handleDeletePricing = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот тариф?')) return;
    
    try {
      await deletePricing.mutateAsync(id);
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Основные тарифы</h3>
          <Button onClick={handleAddPricing}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить тариф
          </Button>
        </div>
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
                    <div className="flex justify-between items-center">
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Активный" : "Неактивный"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button onClick={() => handleEdit(item)} variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeletePricing(item.id)} 
                          variant="destructive" 
                          size="sm"
                          disabled={deletePricing.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                      <Button onClick={handleSaveService} size="sm" disabled={updateService.isPending}>
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
                    <div className="flex justify-between items-center">
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Активная" : "Неактивная"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button onClick={() => handleEditService(service)} variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteService(service.id)} 
                          variant="destructive" 
                          size="sm"
                          disabled={deleteService.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
