import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { serviceTypeName } from '@/lib/serviceTypes';

interface PricingCardProps {
  id: string;
  service_type: string;
  price: number;
  duration_hours: number;
  photos_count: number;
  locations_count: number;
  is_active: boolean;
  description?: string;
}

const PricingCard = ({ service_type, ...rest }: PricingCardProps) => {
  const { price, duration_hours, photos_count, locations_count, description } = rest;

  return (
    <div className="relative">
      <Card className="w-full bg-white/95 backdrop-blur-sm border-pink-200 shadow-xl transform transition-all duration-700 hover:scale-105">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-bold text-xl">{serviceTypeName(service_type)}</div>
            <Badge variant="secondary">
              {duration_hours} часа
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-gray-900">
              {price.toLocaleString('ru-RU')} руб.
            </div>
            <p className="text-sm text-gray-600">
              Включено:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>{photos_count} фото</li>
              <li>{locations_count} локации</li>
              {description && <li>{description}</li>}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PricingCard;
