
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Mail } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';

const ReviewsSection = () => {
  const { data: reviews, isLoading } = useReviews();

  // Моковые данные отзывов для демонстрации
  const mockReviews = [
    {
      id: '1',
      name: 'Анна Петрова',
      rating: 5,
      comment: 'Ирина - потрясающий фотограф! Свадебные фотографии получились просто волшебными. Очень профессиональный подход и внимание к деталям.',
      service_type: 'wedding',
      photo_url: 'https://images.unsplash.com/photo-1494790108755-2616c6-f24c?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      name: 'Елена Сидорова',
      rating: 5,
      comment: 'Замечательная фотосессия Love Story! Ирина сумела поймать все наши эмоции и создать невероятно романтичные кадры.',
      service_type: 'lovestory',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      name: 'Михаил Иванов',
      rating: 5,
      comment: 'Отличные корпоративные портреты! Быстро, качественно и очень профессионально. Рекомендую всем!',
      service_type: 'corporate',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    {
      id: '4',
      name: 'Мария Козлова',
      rating: 5,
      comment: 'Семейная фотосессия прошла великолепно! Дети были в восторге, а фотографии получились живыми и естественными.',
      service_type: 'family',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    },
    {
      id: '5',
      name: 'Дмитрий Смирнов',
      rating: 5,
      comment: 'Индивидуальная портретная съемка превзошла все ожидания. Ирина создала настоящие произведения искусства!',
      service_type: 'portrait',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: '6',
      name: 'Ольга Кравцова',
      rating: 5,
      comment: 'Потрясающие свадебные фотографии! Каждый кадр - это эмоция, каждая фотография рассказывает историю.',
      service_type: 'wedding',
      photo_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop'
    }
  ];

  // Используем базу данных если есть, иначе моковые данные
  const displayReviews = reviews && reviews.length > 0 ? reviews.filter(r => r.is_approved) : mockReviews;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getServiceTypeName = (serviceType: string) => {
    const types = {
      wedding: 'Свадебная съемка',
      lovestory: 'Love Story',
      portrait: 'Портретная съемка',
      family: 'Семейная съемка',
      corporate: 'Корпоративная съемка'
    };
    return types[serviceType as keyof typeof types] || serviceType;
  };

  const handleWriteReview = () => {
    const subject = 'Отзыв о фотосъемке';
    const body = 'Здравствуйте, Ирина!\n\nХочу оставить отзыв о проведенной фотосъемке:\n\n[Напишите ваш отзыв здесь]\n\nС уважением,\n[Ваше имя]';
    window.location.href = `mailto:bagreshevafoto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы клиентов</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Что говорят о нашей работе те, кто уже доверил нам свои важные моменты
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews?.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={review.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=f3f4f6&color=374151`}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                
                {review.service_type && (
                  <div className="text-sm text-rose-400 font-medium">
                    {getServiceTypeName(review.service_type)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Хотите оставить отзыв?</h3>
            <p className="text-gray-600 mb-6">
              Мы ценим ваше мнение и будем рады узнать о вашем опыте работы с нами
            </p>
            <button 
              onClick={handleWriteReview}
              className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors flex items-center mx-auto"
            >
              <Mail className="w-5 h-5 mr-2" />
              Написать отзыв
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
