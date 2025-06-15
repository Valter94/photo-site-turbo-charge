import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Download } from "lucide-react";

interface ActionButtonsProps {
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  onView: (e: React.MouseEvent) => void;
}

const GalleryGridActionButtons: React.FC<ActionButtonsProps> = ({
  isLiked,
  onLike,
  onView,
}) => (
  <div className="flex gap-3">
    <Button
      size="icon"
      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110"
      onClick={onView}
    >
      <Eye className="h-4 w-4" />
    </Button>
    <Button
      size="icon"
      className={
        isLiked
          ? "bg-red-500 hover:bg-red-600 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110"
          : "bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110"
      }
      onClick={onLike}
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
    </Button>
    {/* Кнопку скачивания убрали */}
  </div>
);

export default GalleryGridActionButtons;
