
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Camera, Star, Users, MapPin } from "lucide-react";

interface ServiceFeature {
  icon: string;
  text: string;
}

interface DetailedServiceProps {
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  photosCount: string;
  rating: number;
  reviewsCount: number;
  image: string;
  features: ServiceFeature[];
  description: string;
  popular?: boolean;
}

const DetailedServiceCard = ({
  title,
  subtitle,
  price,
  duration,
  photosCount,
  rating,
  reviewsCount,
  image,
  features,
  description,
  popular
}: DetailedServiceProps) => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className={`group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
      popular ? 'ring-2 ring-pink-400' : ''
    }`}>
      {popular && (
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm font-semibold">
          🔥 Самый популярный пакет
        </div>
      )}
      
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-900 font-semibold">
            {price}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold text-gray-900">{rating}</span>
          <span className="text-xs text-gray-600">({reviewsCount})</span>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <p className="text-gray-600">{subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-pink-500" />
            <span className="font-medium">{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Camera className="w-5 h-5 text-pink-500" />
            <span className="font-medium">{photosCount}</span>
          </div>
        </div>

        {/* Описание */}
        <p className="text-gray-600 leading-relaxed">{description}</p>

        {/* Особенности */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Что входит в пакет:</h4>
          <div className="grid grid-cols-1 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-lg">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка бронирования */}
        <Button
          onClick={scrollToBooking}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          Забронировать от {price}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DetailedServiceCard;
