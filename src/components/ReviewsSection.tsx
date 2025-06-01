
import React from 'react';
import { Star, User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReviews } from '@/hooks/useReviews';

const ReviewsSection = () => {
  const { data: reviews, isLoading } = useReviews();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getServiceName = (serviceType: string | null) => {
    const names = {
      wedding: 'Свадебная съемка',
      lovestory: 'Love Story',
      portrait: 'Портретная съемка',
      corporate: 'Корпоративная съемка'
    };
    return serviceType ? names[serviceType as keyof typeof names] || serviceType : '';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы клиентов</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Что говорят о нас наши клиенты
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews?.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {review.service_type && (
                    <Badge variant="secondary" className="ml-auto">
                      {getServiceName(review.service_type)}
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 italic">"{review.comment}"</p>
                
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-rose-100 rounded-full mr-3">
                    <User className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Поделитесь своим опытом</h3>
          <p className="text-gray-600 mb-6">
            Ваши отзывы помогают нам становиться лучше и помогают другим клиентам делать выбор
          </p>
          <button className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors">
            Оставить отзыв
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
