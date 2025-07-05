import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Download, Star, MapPin, Calendar, User } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import ImageViewer from './ImageViewer';
import GalleryGridCard from "./gallery/GalleryGridCard";

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

  useEffect(() => {
    setSelectedImageIndex(null);
  }, [items]);

  const handleLike = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDownload = async (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.image_url) return;
    try {
      const response = await fetch(item.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.title || "image"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    }
  };

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (!items || !Array.isArray(items)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid ${
          gridCols[columns as keyof typeof gridCols] || gridCols[3]
        } gap-8`}
      >
        {items.map((item, index) => (
          <GalleryGridCard
            key={item.id}
            item={item}
            isHovered={hoveredIndex === index}
            isLiked={likedItems.has(item.id)}
            onLike={(e) => handleLike(item.id, e)}
            onView={() => setSelectedImageIndex(index)}
            onClick={() => setSelectedImageIndex(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
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
