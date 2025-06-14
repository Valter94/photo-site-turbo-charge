
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Download } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import ImageViewer from './ImageViewer';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  location?: string;
  client_name?: string;
  shoot_date?: string;
  is_featured?: boolean;
}

interface GalleryGridProps {
  items: GalleryItem[];
  columns?: number;
}

const GalleryGrid = ({ items, columns = 3 }: GalleryGridProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getCategoryName = (category: string) => {
    const names = {
      wedding: 'Свадьба',
      lovestory: 'Love Story',
      portrait: 'Портрет',
      family: 'Семейная съемка',
      corporate: 'Корпоративная съемка'
    };
    return names[category as keyof typeof names] || category;
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <>
      <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-6`}>
        {items.map((item, index) => (
          <Card 
            key={item.id} 
            className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className="relative h-80 overflow-hidden">
              <OptimizedImage
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                width={600}
                height={400}
              />
              
              {/* Оверлей при ховере */}
              <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
              } flex items-center justify-center`}>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Бейджи */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-gray-900">
                  {getCategoryName(item.category)}
                </Badge>
              </div>
              {item.is_featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-rose-400 text-white">
                    Рекомендуем
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              )}
              <div className="space-y-1 text-sm text-gray-500">
                {item.location && (
                  <p>📍 {item.location}</p>
                )}
                {item.client_name && (
                  <p>👤 {item.client_name}</p>
                )}
                {item.shoot_date && (
                  <p>📅 {new Date(item.shoot_date).toLocaleDateString('ru-RU')}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Просмотрщик изображений */}
      {selectedImageIndex !== null && (
        <ImageViewer
          images={items}
          initialIndex={selectedImageIndex}
          isOpen={selectedImageIndex !== null}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}
    </>
  );
};

export default GalleryGrid;
