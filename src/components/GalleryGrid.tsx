
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Download, Star, MapPin, Calendar, User } from 'lucide-react';
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
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const handleLike = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getCategoryName = (category: string) => {
    const names = {
      wedding: '💒 Свадьба',
      lovestory: '💕 Love Story',
      portrait: '🎭 Портрет',
      family: '👨‍👩‍👧‍👦 Семейная съемка',
      corporate: '🏢 Корпоративная съемка',
      maternity: '🤱 Материнство'
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      wedding: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
      lovestory: 'bg-gradient-to-r from-red-400 to-pink-500 text-white',
      portrait: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
      family: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
      corporate: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
      maternity: 'bg-gradient-to-r from-rose-400 to-pink-400 text-white'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <>
      <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-8`}>
        {items.map((item, index) => (
          <Card 
            key={item.id} 
            className="overflow-hidden group cursor-pointer transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-pink-200/50"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className="relative h-80 overflow-hidden rounded-t-lg">
              <OptimizedImage
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                width={600}
                height={400}
              />
              
              {/* Градиентный оверлей */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Кнопки действий */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                hoveredIndex === index ? 'opacity-100 bg-black/40 backdrop-blur-sm' : 'opacity-0'
              }`}>
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className={`${likedItems.has(item.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'} text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110`}
                    onClick={(e) => handleLike(item.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Бейджи */}
              <div className="absolute top-4 right-4 space-y-2">
                <Badge className={`${getCategoryColor(item.category)} shadow-lg font-medium`}>
                  {getCategoryName(item.category)}
                </Badge>
                {item.is_featured && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Рекомендуем
                  </Badge>
                )}
              </div>

              {/* Информация о лайках */}
              {likedItems.has(item.id) && (
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center animate-bounce">
                    <Heart className="w-3 h-3 mr-1 fill-current" />
                    Нравится
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              
              {item.description && (
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
              )}
              
              <div className="space-y-2 text-sm">
                {item.location && (
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                    <span>{item.location}</span>
                  </div>
                )}
                {item.client_name && (
                  <div className="flex items-center text-gray-500">
                    <User className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{item.client_name}</span>
                  </div>
                )}
                {item.shoot_date && (
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{new Date(item.shoot_date).toLocaleDateString('ru-RU')}</span>
                  </div>
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
