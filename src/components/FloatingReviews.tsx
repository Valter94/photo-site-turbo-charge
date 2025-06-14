
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
      text: "Ирина - настоящий волшебник с камерой! Наша свадебная съемка получилась просто сказочной. 💕",
      service: "Свадебная съемка",
      date: "2 дня назад"
    },
    {
      name: "Михаил Соколов",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Семейная фотосессия прошла на высшем уровне! Дети были в восторге. 👨‍👩‍👧‍👦",
      service: "Семейная съемка",
      date: "5 дней назад"
    },
    {
      name: "Елена Васильева",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Love Story съемка была просто волшебной! Фотографии получились потрясающие! ✨",
      service: "Love Story",
      date: "1 неделю назад"
    },
    {
      name: "Дмитрий Козлов",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format&q=80",
      rating: 5,
      text: "Корпоративная съемка прошла идеально! Рекомендую всем! 💼",
      service: "Корпоративная съемка",
      date: "2 недели назад"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const review = reviews[currentReview];

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      <Card 
        className={`w-40 bg-white/95 backdrop-blur-sm border-pink-200 shadow-xl transform transition-all duration-500 hover:scale-105 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-1 mb-2">
            <Quote className="w-3 h-3 text-pink-500" />
            <span className="text-xs font-semibold text-gray-700">Отзыв</span>
            <div className="ml-auto flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-2.5 h-2.5 ${
                    i < review.rating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-6 h-6 border border-pink-200">
              <AvatarImage src={review.avatar} alt={review.name} />
              <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                {review.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-xs text-gray-900">{review.name}</div>
              <div className="text-xs text-pink-600">{review.service}</div>
            </div>
          </div>

          <p className="text-gray-700 text-xs leading-relaxed mb-2 line-clamp-2">
            {review.text}
          </p>

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="text-xs">{review.date}</span>
            <div className="flex gap-1">
              {reviews.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full transition-colors ${
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
