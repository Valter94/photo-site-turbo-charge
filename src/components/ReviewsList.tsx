
import React from "react";
import { useReviews } from "@/hooks/useReviews";
import ReviewCard from "./ReviewCard";

const ReviewsList: React.FC = () => {
  const { data: reviews, isLoading, error } = useReviews();
  
  const displayReviews = reviews?.filter?.((r: any) => r.is_approved) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="text-gray-600">Загрузка отзывов...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-2">
          Не удалось загрузить отзывы
        </p>
        <p className="text-gray-500">
          Попробуйте обновить страницу
        </p>
      </div>
    );
  }

  if (!displayReviews.length) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">💭</div>
          <p className="text-gray-500 text-lg mb-2">
            Отзывы пока не добавлены
          </p>
          <p className="text-gray-400">
            Станьте первым, кто поделится впечатлениями!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
