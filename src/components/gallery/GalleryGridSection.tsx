
import React from "react";
import { Button } from "@/components/ui/button";
import GalleryGrid from "@/components/GalleryGrid";

interface GalleryGridSectionProps {
  items: any[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (s: string) => void;
  setSelectedCategory: (s: string) => void;
}

const GalleryGridSection: React.FC<GalleryGridSectionProps> = ({
  items,
  searchQuery,
  selectedCategory,
  setSearchQuery,
  setSelectedCategory
}) => {
  if (items.length > 0) {
    return <GalleryGrid items={items} columns={3} />;
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg mb-4">
        {searchQuery || selectedCategory !== 'all'
          ? 'По вашему запросу ничего не найдено'
          : 'Работы пока не добавлены'
        }
      </p>
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalleryGridSection;

