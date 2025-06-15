
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface GalleryGridBadgesProps {
  category: string;
  isFeatured?: boolean;
}

const getCategoryName = (category: string) => {
  const names = {
    wedding: "💒 Свадьба",
    lovestory: "💕 Love Story",
    portrait: "🎭 Портрет",
    family: "👨‍👩‍👧‍👦 Семейная съемка",
    corporate: "🏢 Корпоративная съемка",
    maternity: "🤱 Материнство",
  };
  return names[category as keyof typeof names] || category;
};

const getCategoryColor = (category: string) => {
  const colors = {
    wedding: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
    lovestory: "bg-gradient-to-r from-red-400 to-pink-500 text-white",
    portrait: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
    family: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
    corporate: "bg-gradient-to-r from-gray-600 to-gray-700 text-white",
    maternity: "bg-gradient-to-r from-rose-400 to-pink-400 text-white",
  };
  return colors[category as keyof typeof colors] || "bg-gray-500 text-white";
};

const GalleryGridBadges: React.FC<GalleryGridBadgesProps> = ({
  category,
  isFeatured,
}) => (
  <div className="space-y-2">
    <Badge className={`${getCategoryColor(category)} shadow-lg font-medium`}>
      {getCategoryName(category)}
    </Badge>
    {isFeatured && (
      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg font-medium flex items-center">
        <Star className="w-3 h-3 mr-1 fill-current" />
        Рекомендуем
      </Badge>
    )}
  </div>
);

export default GalleryGridBadges;
