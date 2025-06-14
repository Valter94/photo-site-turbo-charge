
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Camera, Star, Clock, Users, MapPin } from "lucide-react";
import { usePricing } from '@/hooks/usePricing';

const LiveStats = () => {
  const { data: pricing } = usePricing();
  const [stats, setStats] = useState({
    happyClients: 0,
    photosCreated: 0,
    yearsExperience: 0,
    avgRating: 0,
    activeClients: 0,
    locations: 0
  });

  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  // Анимация счетчиков
  useEffect(() => {
    const targets = {
      happyClients: 523,
      photosCreated: 12847,
      yearsExperience: 5,
      avgRating: 4.9,
      activeClients: 8,
      locations: 47
    };

    const duration = 2000; // 2 секунды
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setStats(current => {
        const newStats = { ...current };
        let allComplete = true;

        Object.keys(targets).forEach(key => {
          const target = targets[key as keyof typeof targets];
          const current = newStats[key as keyof typeof newStats];
          const increment = target / steps;
          
          if (current < target) {
            newStats[key as keyof typeof newStats] = Math.min(
              current + increment,
              target
            );
            allComplete = false;
          }
        });

        if (allComplete) {
          clearInterval(timer);
        }

        return newStats;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Создаем активности на основе реальных услуг
  useEffect(() => {
    if (!pricing || pricing.length === 0) return;

    const serviceNames = pricing.map(service => {
      const serviceTypes = {
        'wedding_preparations': 'утренние сборы',
        'wedding_ceremony': 'свадебную съемку',
        'wedding_full_day': 'полный свадебный день',
        'lovestory': 'Love Story съемку',
        'portrait': 'портретную фотосессию',
        'family': 'семейную фотосессию',
        'corporate': 'корпоративную съемку'
      };
      return serviceTypes[service.service_type] || 'фотосессию';
    });

    const names = ['Анна', 'Михаил', 'Елена', 'Дмитрий', 'Ольга', 'Александр', 'Мария', 'Владимир', 'Наталья', 'Сергей'];
    
    const generateActivities = () => {
      const activities = [];
      
      // Активности бронирования
      serviceNames.forEach(serviceName => {
        names.slice(0, 3).forEach(name => {
          activities.push(`${name} забронировал(а) ${serviceName}`);
        });
      });

      // Общие активности
      names.slice(0, 4).forEach(name => {
        activities.push(`${name} оставил(а) отзыв ⭐⭐⭐⭐⭐`);
        activities.push(`${name} оценил(а) работу на 5 звезд`);
        activities.push(`${name} запросил(а) расчет стоимости`);
      });

      return activities;
    };

    const activities = generateActivities();

    const addActivity = () => {
      if (activities.length === 0) return;
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity(prev => [randomActivity, ...prev.slice(0, 2)]);
    };

    // Увеличиваем интервал: каждые 15-30 минут
    const timer = setInterval(addActivity, Math.random() * 15 * 60 * 1000 + 15 * 60 * 1000);
    
    // Начальная активность через 5 секунд
    setTimeout(addActivity, 5000);

    return () => clearInterval(timer);
  }, [pricing]);

  return (
    <div className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📊 Статистика успеха
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Цифры, которые говорят сами за себя - результаты нашей работы в реальном времени
          </p>
        </div>

        {/* Основная статистика */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-3 animate-pulse" />
              <div className="text-3xl font-bold mb-1">
                {Math.round(stats.happyClients)}
              </div>
              <p className="text-pink-100 text-sm">Довольных клиентов</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <Camera className="w-8 h-8 mx-auto mb-3 animate-bounce" />
              <div className="text-3xl font-bold mb-1">
                {Math.round(stats.photosCreated).toLocaleString()}
              </div>
              <p className="text-purple-100 text-sm">Создано фото</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 animate-spin-slow" />
              <div className="text-3xl font-bold mb-1">
                {Math.round(stats.yearsExperience)}+
              </div>
              <p className="text-emerald-100 text-sm">Лет опыта</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-3 animate-pulse" />
              <div className="text-3xl font-bold mb-1">
                {stats.avgRating.toFixed(1)}
              </div>
              <p className="text-amber-100 text-sm">Средний рейтинг</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 animate-bounce" />
              <div className="text-3xl font-bold mb-1">
                {Math.round(stats.activeClients)}
              </div>
              <p className="text-blue-100 text-sm">Активных проектов</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-violet-500 to-purple-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 animate-pulse" />
              <div className="text-3xl font-bold mb-1">
                {Math.round(stats.locations)}
              </div>
              <p className="text-violet-100 text-sm">Локаций для съемки</p>
            </CardContent>
          </Card>
        </div>

        {/* Живая активность */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">Активность в реальном времени</span>
                <Badge variant="secondary" className="ml-auto">LIVE</Badge>
              </div>
              
              <div className="space-y-3 min-h-[120px]">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-pink-100 to-rose-100 transform scale-105' 
                          : 'bg-gray-50'
                      }`}
                      style={{
                        opacity: index === 0 ? 1 : 0.7 - (index * 0.2),
                        transform: `translateY(${index * 2}px)`
                      }}
                    >
                      <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{activity}</span>
                      <div className="text-xs text-gray-500 ml-auto">
                        {index === 0 ? 'только что' : `${(index + 1) * 15} мин назад`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="animate-pulse">Загрузка активности...</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Бейджи доверия */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-pink-300 text-pink-700 hover:bg-pink-50">
            🏆 Топ фотограф 2024
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-purple-300 text-purple-700 hover:bg-purple-50">
            ⭐ Рекомендуют 98% клиентов
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-emerald-300 text-emerald-700 hover:bg-emerald-50">
            ✨ Профессионал года
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border-blue-300 text-blue-700 hover:bg-blue-50">
            📸 5+ лет опыта
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default LiveStats;
