
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocations, useLocationCategories } from '@/hooks/useLocations';
import { useLocationActions } from '@/hooks/useLocationActions';
import LocationCard from './LocationCard';
import ImageUpload from './ImageUpload';

const LocationsManager = () => {
  const { data: locations } = useLocations();
  const { data: categories } = useLocationCategories();
  const { createLocation, createCategory } = useLocationActions();
  
  const [newLocation, setNewLocation] = useState({
    name: '',
    description: '',
    category_id: '',
    address: '',
    best_time: '',
    indoor: false,
    image_url: null
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const handleCreateLocation = async () => {
    if (!newLocation.name || !newLocation.description || !newLocation.category_id) {
      return;
    }

    try {
      await createLocation.mutateAsync(newLocation);
      setNewLocation({
        name: '',
        description: '',
        category_id: '',
        address: '',
        best_time: '',
        indoor: false,
        image_url: null
      });
      setShowLocationDialog(false);
    } catch (error) {
      console.error('Create location failed:', error);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) return;

    try {
      await createCategory.mutateAsync(newCategory);
      setNewCategory({ name: '', description: '' });
      setShowCategoryDialog(false);
    } catch (error) {
      console.error('Create category failed:', error);
    }
  };

  const handleLocationImageUpload = (url: string) => {
    setNewLocation({ ...newLocation, image_url: url });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление локациями</h2>
        <div className="flex gap-2">
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Категория
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить категорию</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Название категории"
                />
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Описание"
                  rows={3}
                />
                <Button 
                  onClick={handleCreateCategory}
                  disabled={createCategory.isPending}
                  className="w-full"
                >
                  Создать категорию
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Локация
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Добавить локацию</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <Input
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="Название локации"
                />
                
                <Textarea
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                  placeholder="Описание"
                  rows={3}
                />

                <Select
                  value={newLocation.category_id}
                  onValueChange={(value) => setNewLocation({...newLocation, category_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  placeholder="Адрес"
                />

                <Input
                  value={newLocation.best_time}
                  onChange={(e) => setNewLocation({...newLocation, best_time: e.target.value})}
                  placeholder="Лучшее время для съемки"
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newLocation.indoor}
                    onCheckedChange={(checked) => setNewLocation({...newLocation, indoor: checked})}
                  />
                  <label className="text-sm">Закрытое помещение</label>
                </div>

                <ImageUpload
                  currentImage={newLocation.image_url}
                  onImageUploaded={handleLocationImageUpload}
                  folder="locations"
                />

                <Button 
                  onClick={handleCreateLocation}
                  disabled={createLocation.isPending}
                  className="w-full"
                >
                  Создать локацию
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Категории */}
      <Card>
        <CardHeader>
          <CardTitle>Категории локаций</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Локации */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations?.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
};

export default LocationsManager;
