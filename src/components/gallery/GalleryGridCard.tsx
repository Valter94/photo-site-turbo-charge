
import React from "react";
import { Card } from "@/components/ui/card";
import OptimizedImage from "@/components/OptimizedImage";
import GalleryGridActionButtons from "./GalleryGridActionButtons";
import GalleryGridBadges from "./GalleryGridBadges";
import GalleryGridMeta from "./GalleryGridMeta";

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

interface GalleryGridCardProps {
  item: GalleryItem;
  isHovered: boolean;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
  onView: (e: React.MouseEvent | undefined) => void; // Обновим сигнатуру для совместимости
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const GalleryGridCard: React.FC<GalleryGridCardProps> = ({
  item,
  isHovered,
  isLiked,
  onLike,
  onDownload,
  onView,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Card
    className="overflow-hidden group cursor-pointer transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-pink-200/50"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="relative h-80 overflow-hidden rounded-t-lg">
      <OptimizedImage
        src={item.image_url}
        alt={item.title}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        width={600}
        height={400}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? "opacity-100 bg-black/40 backdrop-blur-sm" : "opacity-0"
        }`}
      >
        <GalleryGridActionButtons
          isLiked={isLiked}
          onLike={onLike}
          onDownload={onDownload}
          onView={onView}
        />
      </div>
      <div className="absolute top-4 right-4">
        <GalleryGridBadges
          category={item.category}
          isFeatured={item.is_featured}
        />
      </div>
      {isLiked && (
        <div className="absolute top-4 left-4">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center animate-bounce">
            <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
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
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      )}
      <GalleryGridMeta
        location={item.location}
        client_name={item.client_name}
        shoot_date={item.shoot_date}
      />
    </div>
  </Card>
);

export default GalleryGridCard;
