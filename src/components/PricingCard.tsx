import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Camera, Heart, Users, Star, Crown, Sparkles } from 'lucide-react';

const serviceIcons = {
  portrait: Camera,
  family: Users,
  lovestory: Heart,
  wedding: Crown,
  corporate: Camera
};

const russianLabels: Record<string, string> = {
  portrait: "Портретная съемка",
  family: "Семейная фотосессия",
  lovestory: "Love Story",
  wedding: "Свадебная съемка",
  corporate: "Корпоративная съемка"
};

const PricingCard = ({
  plan,
  russianName,
  scrollToBooking,
}: {
  plan: any;
  russianName: string;
  scrollToBooking: () => void;
}) => {
  const IconComponent = serviceIcons[plan.service_type as keyof typeof serviceIcons] || Camera;
  const displayName = russianLabels[plan.service_type] || plan.service_type;

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        plan.popular ? 'ring-2 ring-pink-500 shadow-xl' : 'hover:shadow-lg'
      } ${plan.premium ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white'}`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm font-semibold">
          <Star className="inline w-4 h-4 mr-1" />
          Популярный выбор
        </div>
      )}
      {plan.premium && (
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
          <Sparkles className="inline w-4 h-4 mr-1" />
          Премиум пакет
        </div>
      )}

      <CardContent className={`p-4 ${plan.popular || plan.premium ? 'pt-12' : 'pt-6'}`}>
        <div className="text-center mb-4">
          <div className={`inline-flex p-3 rounded-full mb-3 ${
            plan.premium ? 'bg-purple-100' : 'bg-pink-100'
          }`}>
            <IconComponent className={`w-6 h-6 ${
              plan.premium ? 'text-purple-600' : 'text-pink-600'
            }`} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{displayName}</h3>
          <div className="mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {plan.price?.toLocaleString('ru-RU') ?? '—'} ₽
            </span>
          </div>
          <div className="flex justify-center gap-2 text-xs text-gray-600 mb-3">
            <Badge variant="outline" className="text-xs px-2 py-1">
              {plan.duration_hours}ч
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1">
              {plan.photos_count} фото
            </Badge>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {(plan.features as string[]).map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-700 leading-tight">{feature}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={scrollToBooking}
          className={`w-full transition-all duration-300 text-sm py-2 ${
            plan.popular
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg'
              : plan.premium
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
              : 'bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50'
          }`}
        >
          Забронировать
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
