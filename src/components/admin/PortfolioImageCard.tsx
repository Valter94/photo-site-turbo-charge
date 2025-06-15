import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioActions } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';
import PortfolioImageEditForm from './PortfolioImageEditForm';
import PortfolioImagePreview from './PortfolioImagePreview';

interface PortfolioImageCardProps {
  item: any;
}

const PortfolioImageCard = ({ item }: PortfolioImageCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [itemForm, setItemForm] = useState(item);
  const { updatePortfolio, deletePortfolio } = usePortfolioActions();
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setItemForm(item);
  };

  const handleSave = async () => {
    try {
      await updatePortfolio.mutateAsync(itemForm);
      toast({
        title: "Успешно",
        description: "Фотография обновлена",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить фотографию",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту фотографию?')) return;

    try {
      await deletePortfolio.mutateAsync(item.id);
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

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <PortfolioImageEditForm
            itemForm={itemForm}
            setItemForm={setItemForm}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            isSaving={updatePortfolio.isPending}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <PortfolioImagePreview
      item={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      deletePending={deletePortfolio.isPending}
    />
  );
};

export default PortfolioImageCard;
