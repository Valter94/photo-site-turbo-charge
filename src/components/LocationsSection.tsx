
import React, { useState } from 'react';
import { MapPin, Clock, Sun, Snowflake, Flower, Leaf } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocations, useLocationCategories } from '@/hooks/useLocations';
import OptimizedImage from './OptimizedImage';

const LocationsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: locations } = useLocations();
  const { data: categories } = useLocationCategories();

  // Моковые данные локаций для демонстрации
  const mockLocations = [
    {
      id: '1',
      name: 'Парк Горького',
      description: 'Один из самых популярных парков Москвы с красивыми аллеями и видами на Москву-реку',
      image_url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
      address: 'ул. Крымский Вал, 9',
      best_time: 'Утром до 11:00 или после 16:00',
      indoor: false,
      location_categories: { name: 'Парки', description: 'Парки и скверы Москвы' }
    },
    {
      id: '2',
      name: 'Царицыно',
      description: 'Дворцово-парковый ансамбль с великолепной архитектурой',
      image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
      address: 'ул. Дольская, 1',
      best_time: 'Золотой час и голубой час',
      indoor: false,
      location_categories: { name: 'Исторические места', description: 'Музеи, усадьбы и исторические локации' }
    },
    {
      id: '3',
      name: 'Красная площадь',
      description: 'Главная площадь России с видом на Кремль',
      image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      address: 'Красная площадь',
      best_time: 'Раннее утро до 8:00',
      indoor: false,
      location_categories: { name: 'Городские', description: 'Улицы, площади и архитектура города' }
    },
    {
      id: '4',
      name: 'Сокольники',
      description: 'Большой парк с разнообразными локациями: аллеи, пруды, беседки',
      image_url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop',
      address: 'Сокольнический Вал, 1',
      best_time: 'В любое время дня',
      indoor: false,
      location_categories: { name: 'Парки', description: 'Парки и скверы Москвы' }
    },
    {
      id: '5',
      name: 'Коломенское',
      description: 'Музей-заповедник с древними храмами и садами',
      image_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
      address: 'Андропова пр-т, 39',
      best_time: 'Весь день, особенно на рассвете',
      indoor: false,
      location_categories: { name: 'Исторические места', description: 'Музеи, усадьбы и исторические локации' }
    },
    {
      id: '6',
      name: 'Фотостудия "Белый зал"',
      description: 'Просторная студия с натуральным светом',
      image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      address: 'ул. Тверская, 15',
      best_time: 'В любое время',
      indoor: true,
      location_categories: { name: 'Студийные', description: 'Закрытые студийные пространства' }
    },
    {
      id: '7',
      name: 'Измайловский парк',
      description: 'Огромная территория с лесными дорожками и прудами',
      image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      address: 'Измайловское шоссе, 73Ж',
      best_time: 'Золотой час',
      indoor: false,
      location_categories: { name: 'Парки', description: 'Парки и скверы Москвы' }
    },
    {
      id: '8',
      name: 'Арбат',
      description: 'Пешеходная улица с уличными артистами и кафе',
      image_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c32a?w=800&h=600&fit=crop',
      address: 'ул. Арбат',
      best_time: 'Вечером после 18:00',
      indoor: false,
      location_categories: { name: 'Городские', description: 'Улицы, площади и архитектура города' }
    },
    {
      id: '9',
      name: 'Воробьевы горы',
      description: 'Смотровая площадка с видом на город',
      image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop',
      address: 'Воробьевы горы',
      best_time: 'На закате',
      indoor: false,
      location_categories: { name: 'Крыши', description: 'Панорамные виды' }
    },
    {
      id: '10',
      name: 'Лофт-студия "Индустрия"',
      description: 'Стильное пространство в индустриальном стиле',
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      address: 'ул. Бауманская, 43',
      best_time: 'В любое время',
      indoor: true,
      location_categories: { name: 'Студийные', description: 'Закрытые студийные пространства' }
    }
  ];

  const seasons = [
    { id: 'all', name: 'Все', icon: MapPin, color: 'text-gray-500' },
    { id: 'Парки', name: 'Парки', icon: Flower, color: 'text-green-500' },
    { id: 'Исторические места', name: 'Исторические', icon: Sun, color: 'text-yellow-500' },
    { id: 'Городские', name: 'Городские', icon: Leaf, color: 'text-orange-500' },
    { id: 'Студийные', name: 'Студии', icon: Snowflake, color: 'text-blue-500' }
  ];

  // Используем базу данных если есть, иначе моковые данные
  const displayLocations = locations && locations.length > 0 ? locations : mockLocations;

  const filteredLocations = selectedCategory === 'all' 
    ? displayLocations 
    : displayLocations?.filter(location => 
        location.location_categories?.name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Локации для съемки</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Самые красивые места Москвы и Московской области для вашей фотосессии
          </p>
        </div>

        {/* Фильтр по категориям */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {seasons.map((season) => {
            const IconComponent = season.icon;
            return (
              <button
                key={season.id}
                onClick={() => setSelectedCategory(season.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === season.id
                    ? 'bg-rose-400 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className={`h-5 w-5 ${selectedCategory === season.id ? 'text-white' : season.color}`} />
                <span className="font-medium">{season.name}</span>
              </button>
            );
          })}
        </div>

        {/* Локации */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations?.map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64">
                <OptimizedImage
                  src={location.image_url}
                  alt={location.name}
                  className="w-full h-full object-cover"
                  width={600}
                  height={400}
                />
                {location.best_time && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900">
                      <Clock className="h-3 w-3 mr-1" />
                      {location.best_time}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{location.name}</h3>
                  <MapPin className="h-5 w-5 text-rose-400 flex-shrink-0 mt-1" />
                </div>
                
                <p className="text-gray-600 mb-4">{location.description}</p>
                
                {location.address && (
                  <p className="text-sm text-gray-500 mb-2">📍 {location.address}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {location.location_categories && (
                    <Badge variant="secondary" className="text-xs">
                      {location.location_categories.name}
                    </Badge>
                  )}
                  {location.indoor && (
                    <Badge variant="outline" className="text-xs">
                      Закрытое помещение
                    </Badge>
                  )}
                </div>

                <Button 
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white"
                  onClick={() => {
                    const bookingElement = document.querySelector('#booking') as HTMLElement;
                    if (bookingElement) {
                      window.scrollTo({ top: bookingElement.offsetTop, behavior: 'smooth' });
                    }
                  }}
                >
                  Забронировать съемку
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!filteredLocations || filteredLocations.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Локации не найдены</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Не нашли подходящую локацию?</h3>
            <p className="text-gray-600 mb-6">
              У нас есть еще множество секретных мест для незабываемых фотосессий
            </p>
            <Button className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors">
              Обсудить локацию
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
