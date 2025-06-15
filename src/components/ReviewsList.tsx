
import React from "react";
import { useReviews } from "@/hooks/useReviews";
import ReviewCard from "./ReviewCard";

const ReviewsList: React.FC = () => {
  const { data: reviews, isLoading } = useReviews();
  let displayReviews = reviews?.filter?.((r: any) => r.is_approved) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">Загрузка отзывов...</div>
    );
  }
  if (!displayReviews.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Отзывы пока не добавлены. Станьте первым!
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
