
import React, { useState } from 'react';
import { MapPin, Clock, Sun, Snowflake, Flower, Leaf } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocations, useLocationCategories } from '@/hooks/useLocations';
import OptimizedImage from './OptimizedImage';

const LocationsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: locations } = useLocations();
  const { data: categories } = useLocationCategories();

  const seasons = [
    { id: 'all', name: 'Все', icon: MapPin, color: 'text-gray-500' },
    { id: 'spring', name: 'Весна', icon: Flower, color: 'text-green-500' },
    { id: 'summer', name: 'Лето', icon: Sun, color: 'text-yellow-500' },
    { id: 'autumn', name: 'Осень', icon: Leaf, color: 'text-orange-500' },
    { id: 'winter', name: 'Зима', icon: Snowflake, color: 'text-blue-500' }
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations?.filter(location => 
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
                {location.image_url ? (
                  <OptimizedImage
                    src={location.image_url}
                    alt={location.name}
                    className="w-full h-full object-cover"
                    width={600}
                    height={400}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                )}
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
                
                <div className="flex flex-wrap gap-2">
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
            <button className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors">
              Обсудить локацию
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
