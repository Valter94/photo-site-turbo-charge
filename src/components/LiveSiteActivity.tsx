
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveSiteActivityProps {
  recentActivity: string[];
}

const LiveSiteActivity: React.FC<LiveSiteActivityProps> = ({ recentActivity }) => (
  <div className="max-w-2xl mx-auto mt-12">
    <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">Реальная активность на сайте</span>
          <Badge variant="secondary" className="ml-auto">LIVE</Badge>
        </div>
        <div className="space-y-3 min-h-[120px]">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-pink-100 to-rose-100 transform scale-105' 
                    : 'bg-gray-50'
                }`}
                style={{
                  opacity: index === 0 ? 1 : 0.7 - (index * 0.2),
                  transform: `translateY(${index * 2}px)`
                }}
              >
                <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{activity}</span>
                <div className="text-xs text-gray-500 ml-auto">
                  {index === 0 ? 'только что' : `${(index + 1) * 20} мин назад`}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="animate-pulse">Загрузка активности...</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default LiveSiteActivity;
