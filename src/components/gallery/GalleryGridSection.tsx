
import React from "react";
import { Button } from "@/components/ui/button";
import GalleryGrid from "@/components/GalleryGrid";
import { RefreshCw } from "lucide-react";

interface GalleryGridSectionProps {
  items: any[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (s: string) => void;
  setSelectedCategory: (s: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const GalleryGridSection: React.FC<GalleryGridSectionProps> = ({
  items,
  searchQuery,
  selectedCategory,
  setSearchQuery,
  setSelectedCategory,
  isLoading = false,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="text-gray-600">Загрузка галереи...</span>
        </div>
      </div>
    );
  }

  if (items.length > 0) {
    return <GalleryGrid items={items} columns={3} />;
  }

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">🖼️</div>
        <p className="text-gray-500 text-lg mb-4">
          {searchQuery || selectedCategory !== 'all'
            ? 'По вашему запросу ничего не найдено'
            : 'Работы пока не добавлены'
          }
        </p>
        <div className="space-x-4">
          {(searchQuery || selectedCategory !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Сбросить фильтры
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              className="inline-flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryGridSection;
