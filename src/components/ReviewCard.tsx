
import React from "react";
import OptimizedImage from "./OptimizedImage";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { serviceTypeName } from "@/lib/serviceTypes";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service_type?: string;
  created_at?: string;
  photo_url?: string;
};

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
  ));

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <Card className="h-full flex flex-col">
    <CardContent className="p-6 flex flex-col h-full">
      {/* Фото отзыва сверху, если есть */}
      {review.photo_url && (
        <div className="mb-4 mx-auto w-24 h-24 rounded-full overflow-hidden shadow">
          <OptimizedImage
            src={review.photo_url}
            alt={`Фото для отзыва от ${review.name}`}
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-full"
            fallbackUrl="/placeholder.svg"
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
        <Quote className="h-8 w-8 text-pink-300" />
      </div>
      <p className="text-gray-700 mb-4 flex-grow italic">"{review.comment}"</p>
      <div className="border-t pt-4 mt-auto">
        <p className="font-semibold text-gray-900">{review.name}</p>
        {review.service_type && (
          <p className="text-sm text-gray-500">{serviceTypeName(review.service_type)}</p>
        )}
        <p className="text-xs text-gray-400">
          {review.created_at ? new Date(review.created_at).toLocaleDateString("ru-RU") : ""}
        </p>
      </div>
    </CardContent>
  </Card>
);
export default ReviewCard;
