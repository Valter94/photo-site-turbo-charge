
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Save, X, Plus, Upload } from 'lucide-react';
import { usePortfolio, useUpdatePortfolio, useDeletePortfolio } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';

const PortfolioManager = () => {
  const { data: portfolio, refetch } = usePortfolio();
  const updatePortfolio = useUpdatePortfolio();
  const deletePortfolio = useDeletePortfolio();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { toast } = useToast();

  const categories = [
    { value: 'wedding', label: 'Свадьба' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'portrait', label: 'Портрет' },
    { value: 'family', label: 'Семейная съемка' },
    { value: 'corporate', label: 'Корпоративная съемка' }
  ];

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : ''
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...editForm,
        tags: editForm.tags ? editForm.tags.split(',').map((tag: string) => tag.trim()) : []
      };
      
      await updatePortfolio.mutateAsync(dataToSave);
      
      toast({
        title: "Успешно",
        description: "Фотография обновлена",
      });

      setEditingId(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить фотографию",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту фотографию?')) return;
    
    try {
      await deletePortfolio.mutateAsync(id);
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

  const handleAddNew = async () => {
    try {
      const newItem = {
        title: 'Новая фотография',
        category: 'portrait',
        image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop',
        description: 'Описание фотографии',
        location: 'Москва',
        is_featured: false,
        order_index: (portfolio?.length || 0) + 1
      };

      await updatePortfolio.mutateAsync(newItem);
      
      toast({
        title: "Успешно",
        description: "Новая фотография добавлена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить фотографию",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Управление портфолио</h3>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить фото
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {editingId === item.id ? (
                <div className="space-y-3">
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="Название"
                  />
                  <Input
                    value={editForm.image_url}
                    onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                    placeholder="URL изображения"
                  />
                  <Select
                    value={editForm.category}
                    onValueChange={(value) => setEditForm({...editForm, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Описание"
                    rows={3}
                  />
                  <Input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Локация"
                  />
                  <Input
                    value={editForm.client_name || ''}
                    onChange={(e) => setEditForm({...editForm, client_name: e.target.value})}
                    placeholder="Имя клиента"
                  />
                  <Input
                    value={editForm.tags || ''}
                    onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                    placeholder="Теги (через запятую)"
                  />
                  <Input
                    type="number"
                    value={editForm.order_index || 0}
                    onChange={(e) => setEditForm({...editForm, order_index: parseInt(e.target.value)})}
                    placeholder="Порядок отображения"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editForm.is_featured}
                      onCheckedChange={(checked) => setEditForm({...editForm, is_featured: checked})}
                    />
                    <label className="text-sm">Рекомендуемое</label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" disabled={updatePortfolio.isPending}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.is_featured && (
                      <Badge variant="secondary">Рекомендуем</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {item.location && <p className="text-xs text-gray-500">📍 {item.location}</p>}
                  {item.client_name && <p className="text-xs text-gray-500">👤 {item.client_name}</p>}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <Badge>{categories.find(c => c.value === item.category)?.label}</Badge>
                    <div className="flex gap-1">
                      <Button onClick={() => handleEdit(item)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(item.id)} 
                        variant="destructive" 
                        size="sm"
                        disabled={deletePortfolio.isPending}
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
  );
};

export default PortfolioManager;
