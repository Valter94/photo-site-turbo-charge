
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PortfolioManager = () => {
  const { data: portfolio, refetch } = usePortfolio();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { toast } = useToast();

  const categories = [
    { value: 'wedding', label: 'Свадьба' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'portrait', label: 'Портрет' },
    { value: 'family', label: 'Семейная съемка' }
  ];

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .update(editForm)
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Фотография обновлена",
      });

      setEditingId(null);
      refetch();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить фотографию",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Фотография удалена",
      });

      refetch();
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
        is_featured: false
      };

      const { error } = await supabase
        .from('portfolio')
        .insert(newItem);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Новая фотография добавлена",
      });

      refetch();
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
        <Button onClick={handleAddNew}>Добавить фото</Button>
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
                  />
                  <Input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Локация"
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
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.is_featured && (
                      <Badge variant="secondary">Рекомендуем</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-500">📍 {item.location}</p>
                  <div className="flex justify-between">
                    <Badge>{categories.find(c => c.value === item.category)?.label}</Badge>
                    <div className="flex gap-1">
                      <Button onClick={() => handleEdit(item)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(item.id)} variant="destructive" size="sm">
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
