
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const FloatingReviews = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const reviews = [
    {
      name: "Анна Петрова",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Ирина - настоящий волшебник с камерой! Наша свадебная съемка получилась просто сказочной. Каждый кадр - произведение искусства. Спасибо за незабываемые воспоминания! 💕",
      service: "Свадебная съемка",
      date: "2 дня назад"
    },
    {
      name: "Михаил Соколов",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Семейная фотосессия прошла на высшем уровне! Дети были в восторге, а результат превзошел все ожидания. Профессионализм и теплое отношение - это про Ирину! 👨‍👩‍👧‍👦",
      service: "Семейная съемка",
      date: "5 дней назад"
    },
    {
      name: "Елена Васильева",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Love Story съемка была просто волшебной! Ирина умеет находить самые красивые ракурсы и ловить искренние эмоции. Фотографии получились потрясающие! ✨",
      service: "Love Story",
      date: "1 неделю назад"
    },
    {
      name: "Дмитрий Козлов",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Корпоративная съемка прошла идеально! Все сотрудники остались довольны, а фотографии используем в презентациях. Рекомендую всем! 💼",
      service: "Корпоративная съемка",
      date: "2 недели назад"
    },
    {
      name: "Ольга Романова",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Портретная фотосессия - это нечто! Ирина помогла мне почувствовать себя моделью. Результат просто шикарный, все подруги в восторге! 📸",
      service: "Портретная съемка",
      date: "3 недели назад"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
        setIsVisible(true);
      }, 300);
    }, 5000); // Меняем отзыв каждые 5 секунд

    return () => clearInterval(timer);
  }, [reviews.length]);

  const review = reviews[currentReview];

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      <Card 
        className={`w-80 bg-white/95 backdrop-blur-sm border-pink-200 shadow-2xl transform transition-all duration-500 hover:scale-105 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <CardContent className="p-6">
          {/* Заголовок */}
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-semibold text-gray-700">Свежий отзыв</span>
            <div className="ml-auto flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < review.rating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Профиль клиента */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12 border-2 border-pink-200">
              <AvatarImage src={review.avatar} alt={review.name} />
              <AvatarFallback className="bg-pink-100 text-pink-600">
                {review.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">{review.name}</div>
              <div className="text-sm text-pink-600">{review.service}</div>
            </div>
          </div>

          {/* Текст отзыва */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
            {review.text}
          </p>

          {/* Время */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{review.date}</span>
            <div className="flex gap-1">
              {reviews.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentReview ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingReviews;
