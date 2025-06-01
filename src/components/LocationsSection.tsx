
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
    ...(categories?.map(cat => ({ id: cat.name, name: cat.description })) || [])
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations?.filter(location => location.location_categories?.name === selectedCategory);

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
          {filteredLocations?.map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64">
                <OptimizedImage
                  src={location.image_url || 'https://images.unsplash.com/photo-1441829266145-6d4bbc4ed8fb?w=800&h=600&fit=crop'}
                  alt={location.name}
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900">
                    {location.indoor ? 'В помещении' : 'На улице'}
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
                    <span>{location.best_time || 'Любое время'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location.address || 'Москва'}</span>
                  </div>
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
