
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

interface PortfolioImagePreviewProps {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
  deletePending?: boolean;
}

const categories = [
  { value: 'wedding', label: 'Свадебная съемка' },
  { value: 'portrait', label: 'Портретная съемка' },
  { value: 'family', label: 'Семейная фотосессия' },
  { value: 'lovestory', label: 'Love Story' },
  { value: 'corporate', label: 'Корпоративная съемка' }
];

const PortfolioImagePreview: React.FC<PortfolioImagePreviewProps> = ({
  item, onEdit, onDelete, deletePending
}) => {
  // Определяем, является ли изображение с бота
  const isBotImage = item.image_url?.includes('supabase.co') || item.image_url?.includes('ojrekbttkriwwyaupbox');

  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <OptimizedImage
          src={item.image_url}
          alt={item.title}
          className="w-full h-full"
          preserveAspectRatio={isBotImage}
        />
        {item.is_featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500">
            Рекомендуемая
          </Badge>
        )}
        {isBotImage && (
          <Badge className="absolute top-2 right-2 bg-green-500">
            Из бота
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{item.title}</h4>
            <div className="flex gap-1">
              <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onDelete} 
                variant="destructive" 
                size="sm"
                disabled={deletePending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Badge variant="secondary">
            {categories.find(c => c.value === item.category)?.label || item.category}
          </Badge>
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
          )}
          {item.location && (
            <p className="text-sm text-gray-500">📍 {item.location}</p>
          )}
          {item.client_name && (
            <p className="text-sm text-gray-500">👤 {item.client_name}</p>
          )}
          <div className="text-xs text-gray-400">
            {new Date(item.created_at).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioImagePreview;
