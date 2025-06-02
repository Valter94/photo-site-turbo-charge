
import React, { useState } from 'react';
import { MapPin, Star, Camera, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from './OptimizedImage';
import { useLocations, useLocationCategories } from '@/hooks/useLocations';

const LocationsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: categories, isLoading: categoriesLoading } = useLocationCategories();

  if (locationsLoading || categoriesLoading) {
    return (
      <section id="locations" className="py-20 bg-white">
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

  const allCategories = [
    { id: 'all', name: 'Все локации' },
    { id: 'spring', name: 'Весенние' },
    { id: 'summer', name: 'Летние' },
    { id: 'autumn', name: 'Осенние' },
    { id: 'winter', name: 'Зимние' },
    { id: 'indoor', name: 'В помещении' }
  ];

  // Актуальные фотографии по сезонам - Москва и Московская область
  const seasonalLocations = {
    spring: [
      {
        id: 'spring-1',
        name: 'Сад Эрмитаж',
        description: 'Весенний сад с цветущими деревьями в центре Москвы',
        image: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&h=600&fit=crop',
        season: 'spring'
      },
      {
        id: 'spring-2', 
        name: 'Парк Горького',
        description: 'Парк с весенними тюльпанами и молодой зеленью',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
        season: 'spring'
      }
    ],
    summer: [
      {
        id: 'summer-1',
        name: 'Воробьевы горы',
        description: 'Летние виды на Москву-реку с панорамной площадки',
        image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c968?w=800&h=600&fit=crop',
        season: 'summer'
      },
      {
        id: 'summer-2',
        name: 'Царицыно',
        description: 'Летний дворцовый комплекс с садами и прудами',
        image: 'https://images.unsplash.com/photo-1595606571647-47b11eebb26c?w=800&h=600&fit=crop',
        season: 'summer'
      }
    ],
    autumn: [
      {
        id: 'autumn-1',
        name: 'Коломенское',
        description: 'Осенние золотые аллеи и историческая архитектура',
        image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=600&fit=crop',
        season: 'autumn'
      },
      {
        id: 'autumn-2',
        name: 'Измайловский парк',
        description: 'Осенний лес с яркими красками листопада',
        image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&h=600&fit=crop',
        season: 'autumn'
      }
    ],
    winter: [
      {
        id: 'winter-1',
        name: 'Красная площадь',
        description: 'Зимняя сказка с новогодними украшениями',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        season: 'winter'
      },
      {
        id: 'winter-2',
        name: 'Сокольники',
        description: 'Зимний парк с заснеженными тропинками',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
        season: 'winter'
      }
    ],
    indoor: [
      {
        id: 'indoor-1',
        name: 'Фотостудия "Loft"',
        description: 'Современная студия с большими окнами и белыми стенами',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        season: 'indoor'
      },
      {
        id: 'indoor-2',
        name: 'Студия "Винтаж"',
        description: 'Уютная студия с винтажным интерьером и мягким светом',
        image: 'https://images.unsplash.com/photo-1556912167-f556f1ae1776?w=800&h=600&fit=crop',
        season: 'indoor'
      }
    ]
  };

  const getAllLocations = () => {
    return Object.values(seasonalLocations).flat();
  };

  const getFilteredLocations = () => {
    if (selectedCategory === 'all') {
      return getAllLocations();
    }
    return seasonalLocations[selectedCategory as keyof typeof seasonalLocations] || [];
  };

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="locations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Локации для фотосессий</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите идеальное место для вашей фотосессии из нашей коллекции проверенных локаций по сезонам
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-rose-400 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {getFilteredLocations().map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64">
                <OptimizedImage
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900">
                    {location.season === 'indoor' ? 'В помещении' : 
                     location.season === 'spring' ? 'Весна' :
                     location.season === 'summer' ? 'Лето' :
                     location.season === 'autumn' ? 'Осень' : 'Зима'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{location.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-gray-500">(156)</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600">{location.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Любое время</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Москва</span>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={scrollToBooking}
                    className="flex-1 bg-rose-400 text-white py-2 px-4 rounded-lg hover:bg-rose-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Забронировать</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Подробнее
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Не нашли подходящую локацию?</h3>
          <p className="text-gray-600 mb-6">
            Предложите свое место для съемки, и мы поможем организовать фотосессию в любой точке Москвы
          </p>
          <button className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors">
            Предложить локацию
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
