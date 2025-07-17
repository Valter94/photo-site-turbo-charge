
import React from "react";
import { Button } from "@/components/ui/button";
import GalleryGrid from "@/components/GalleryGrid";
import LoadingSpinner from "@/components/LoadingSpinner";
import { RefreshCw } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";

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
  const { isMobile } = useResponsive();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Загрузка галереи..." />
      </div>
    );
  }

  if (items.length > 0) {
    return <GalleryGrid items={items} columns={isMobile ? 1 : 3} />;
  }

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">🖼️</div>
        <p className="text-gray-500 text-lg mb-4">
          {searchQuery || selectedCategory !== 'all'
            ? 'По вашему запросу ничего не найдено'
            : 'Работы пока не добавлены'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {(searchQuery || selectedCategory !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="w-full sm:w-auto"
            >
              Сбросить фильтры
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              className="inline-flex items-center w-full sm:w-auto"
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
