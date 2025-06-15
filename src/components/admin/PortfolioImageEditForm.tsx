
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";
import ImageUpload from './ImageUpload';

interface PortfolioImageEditFormProps {
  itemForm: any;
  setItemForm: (item: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const categories = [
  { value: 'wedding', label: 'Свадебная съемка' },
  { value: 'portrait', label: 'Портретная съемка' },
  { value: 'family', label: 'Семейная фотосессия' },
  { value: 'lovestory', label: 'Love Story' },
  { value: 'corporate', label: 'Корпоративная съемка' }
];

const PortfolioImageEditForm: React.FC<PortfolioImageEditFormProps> = ({
  itemForm,
  setItemForm,
  onSave,
  onCancel,
  isSaving
}) => {

  const handleImageUpload = (url: string) => {
    setItemForm({ ...itemForm, image_url: url });
  };

  return (
    <div className="space-y-4">
      <Input
        value={itemForm.title || ''}
        onChange={(e) => setItemForm({...itemForm, title: e.target.value})}
        placeholder="Название"
      />
      <Select
        value={itemForm.category}
        onValueChange={(value) => setItemForm({...itemForm, category: value})}
      >
        <SelectTrigger>
          <SelectValue placeholder="Категория" />
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
        value={itemForm.description || ''}
        onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
        placeholder="Описание"
        rows={3}
      />
      <Input
        value={itemForm.location || ''}
        onChange={(e) => setItemForm({...itemForm, location: e.target.value})}
        placeholder="Локация"
      />
      <Input
        value={itemForm.client_name || ''}
        onChange={(e) => setItemForm({...itemForm, client_name: e.target.value})}
        placeholder="Имя клиента"
      />
      <Input
        type="date"
        value={itemForm.shoot_date || ''}
        onChange={(e) => setItemForm({...itemForm, shoot_date: e.target.value})}
      />
      <div className="flex items-center space-x-2">
        <Switch
          checked={itemForm.is_featured || false}
          onCheckedChange={(checked) => setItemForm({...itemForm, is_featured: checked})}
        />
        <label className="text-sm">Рекомендуемая</label>
      </div>
      <ImageUpload
        currentImage={itemForm.image_url}
        onImageUploaded={handleImageUpload}
        folder="portfolio"
      />
      <div className="flex gap-2">
        <Button onClick={onSave} size="sm" disabled={isSaving}>
          <Save className="h-4 w-4" />
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PortfolioImageEditForm;
