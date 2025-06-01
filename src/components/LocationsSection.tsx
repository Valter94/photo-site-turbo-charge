
import React, { useState } from 'react';
import { MapPin, Star, Camera, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from './OptimizedImage';

const LocationsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const locations = [
    {
      id: 1,
      name: 'Парк Горького',
      category: 'park',
      description: 'Красивый парк с живописными аллеями и фонтанами. Идеально подходит для романтических съемок.',
      image: 'https://images.unsplash.com/photo-1441829266145-6d4bbc4ed8fb?w=800&h=600&fit=crop',
      rating: 4.8,
      reviewsCount: 156,
      priceFrom: 5000,
      duration: '1-3 часа',
      features: ['Фонтаны', 'Аллеи', 'Цветники', 'Мостики']
    },
    {
      id: 2,
      name: 'Красная площадь',
      category: 'historic',
      description: 'Историческое сердце Москвы. Идеально для классических и торжественных фотосессий.',
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
      rating: 4.9,
      reviewsCount: 203,
      priceFrom: 8000,
      duration: '2-4 часа',
      features: ['Собор', 'Кремль', 'Брусчатка', 'Архитектура']
    },
    {
      id: 3,
      name: 'Воробьевы горы',
      category: 'nature',
      description: 'Потрясающий вид на город и живописная природа. Лучшее место для съемок на закате.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      rating: 4.7,
      reviewsCount: 89,
      priceFrom: 4000,
      duration: '1-2 часа',
      features: ['Панорама', 'Природа', 'Закат', 'Смотровая']
    },
    {
      id: 4,
      name: 'Арбат',
      category: 'street',
      description: 'Старинная пешеходная улица с уникальной атмосферой и интересной архитектурой.',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c0a4?w=800&h=600&fit=crop',
      rating: 4.6,
      reviewsCount: 124,
      priceFrom: 6000,
      duration: '2-3 часа',
      features: ['Уличные музыканты', 'Кафе', 'Витрины', 'Булыжник']
    }
  ];

  const categories = [
    { id: 'all', name: 'Все локации' },
    { id: 'park', name: 'Парки' },
    { id: 'historic', name: 'Исторические' },
    { id: 'nature', name: 'Природа' },
    { id: 'street', name: 'Городские' }
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations.filter(location => location.category === selectedCategory);

  return (
    <section id="locations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Локации для фотосессий</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите идеальное место для вашей фотосессии из нашей коллекции проверенных локаций
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
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
          {filteredLocations.map((location) => (
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
                    от {location.priceFrom.toLocaleString()} ₽
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{location.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{location.rating}</span>
                    <span className="text-sm text-gray-500">({location.reviewsCount})</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600">{location.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{location.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Москва</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {location.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-rose-400 text-white py-2 px-4 rounded-lg hover:bg-rose-500 transition-colors flex items-center justify-center space-x-2">
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
