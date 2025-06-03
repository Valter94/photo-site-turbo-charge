
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Save, X, Plus, Star } from 'lucide-react';
import { useReviews, useUpdateReview, useDeleteReview } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';

const ReviewsManager = () => {
  const { data: reviews } = useReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { toast } = useToast();

  const serviceTypes = [
    { value: 'wedding', label: 'Свадьба' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'portrait', label: 'Портрет' },
    { value: 'family', label: 'Семейная съемка' },
    { value: 'corporate', label: 'Корпоративная съемка' }
  ];

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async () => {
    try {
      await updateReview.mutateAsync(editForm);
      toast({
        title: "Успешно",
        description: "Отзыв обновлен",
      });
      setEditingId(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить отзыв",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    
    try {
      await deleteReview.mutateAsync(id);
      toast({
        title: "Успешно",
        description: "Отзыв удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить отзыв",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = async () => {
    try {
      const newReview = {
        name: 'Имя клиента',
        email: 'email@example.com',
        comment: 'Отличная работа фотографа!',
        rating: 5,
        service_type: 'portrait',
        is_approved: false
      };

      await updateReview.mutateAsync(newReview);
      toast({
        title: "Успешно",
        description: "Новый отзыв добавлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить отзыв",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Управление отзывами</h3>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить отзыв
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Имя клиента"
                  />
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="Email"
                  />
                  <Select
                    value={editForm.service_type || ''}
                    onValueChange={(value) => setEditForm({...editForm, service_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Тип услуги" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={editForm.rating.toString()}
                    onValueChange={(value) => setEditForm({...editForm, rating: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} звезд{rating > 1 && rating < 5 ? 'ы' : rating === 1 ? 'а' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                    placeholder="Текст отзыва"
                    rows={3}
                  />
                  <Input
                    value={editForm.photo_url || ''}
                    onChange={(e) => setEditForm({...editForm, photo_url: e.target.value})}
                    placeholder="URL фото клиента"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editForm.is_approved}
                      onCheckedChange={(checked) => setEditForm({...editForm, is_approved: checked})}
                    />
                    <label className="text-sm">Одобрен</label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" disabled={updateReview.isPending}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(item.rating)}
                      </div>
                      <Badge variant={item.is_approved ? "default" : "secondary"}>
                        {item.is_approved ? "Одобрен" : "На модерации"}
                      </Badge>
                    </div>
                  </div>
                  
                  {item.photo_url && (
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={item.photo_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-700">{item.comment}</p>
                  
                  {item.service_type && (
                    <Badge variant="outline">
                      {serviceTypes.find(s => s.value === item.service_type)?.label}
                    </Badge>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </p>
                  
                  <div className="flex justify-end gap-1">
                    <Button onClick={() => handleEdit(item)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDelete(item.id)} 
                      variant="destructive" 
                      size="sm"
                      disabled={deleteReview.isPending}
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

export default ReviewsManager;
