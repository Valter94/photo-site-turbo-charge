
import React from "react";
import { Badge } from "@/components/ui/badge";

const AchievementsBadges = () => (
  <div className="flex flex-wrap justify-center gap-4 mt-8">
    <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-pink-300 text-pink-700 hover:bg-pink-50">
      🏆 Топ фотограф 2024
    </Badge>
    <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-purple-300 text-purple-700 hover:bg-purple-50">
      ⭐ Рекомендуют 98% клиентов
    </Badge>
    <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-emerald-300 text-emerald-700 hover:bg-emerald-50">
      ✨ Профессионал года
    </Badge>
    <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-blue-300 text-blue-700 hover:bg-blue-50">
      📸 5+ лет опыта
    </Badge>
  </div>
);

export default AchievementsBadges;
