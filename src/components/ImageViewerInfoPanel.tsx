
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Download } from "lucide-react";

interface Props {
  currentImage: any;
  isLiked: boolean;
  setIsLiked: (b: boolean) => void;
  downloadImage: () => void;
  currentIndex: number;
  imagesLength: number;
}

export function ImageViewerInfoPanel({
  currentImage,
  isLiked,
  setIsLiked,
  downloadImage,
  currentIndex,
  imagesLength,
}: Props) {
  const getCategoryName = (category: string) => {
    const names = {
      wedding: "Свадьба",
      lovestory: "Love Story",
      portrait: "Портрет",
      family: "Семейная съемка",
      corporate: "Корпоративная съемка",
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{currentImage.title}</h3>
              <Badge className="bg-white/20 text-white">{getCategoryName(currentImage.category)}</Badge>
              {currentImage.is_featured && (
                <Badge className="bg-rose-400 text-white">Рекомендуем</Badge>
              )}
            </div>
            {currentImage.description && (
              <p className="text-gray-300 mb-2">{currentImage.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {currentImage.location && <span>📍 {currentImage.location}</span>}
              {currentImage.client_name && <span>👤 {currentImage.client_name}</span>}
              {currentImage.shoot_date && (
                <span>
                  📅 {new Date(currentImage.shoot_date).toLocaleDateString("ru-RU")}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={downloadImage}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {imagesLength > 1 && (
          <div className="text-center text-sm text-gray-400">
            {currentIndex + 1} из {imagesLength}
          </div>
        )}
      </div>
    </div>
  );
}
