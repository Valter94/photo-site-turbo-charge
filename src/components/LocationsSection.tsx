
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocations, useLocationCategories } from '@/hooks/useLocations';
import { MapPin, Clock, Home } from 'lucide-react';

const LocationsSection = () => {
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: categories, isLoading: categoriesLoading } = useLocationCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (locationsLoading || categoriesLoading) {
    return (
      <section id="locations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Загрузка локаций...</h2>
          </div>
        </div>
      </section>
    );
  }

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations?.filter(location => location.category_id === selectedCategory);

  return (
    <section id="locations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Локации для съемки</h2>
          <p className="text-xl text-gray-600 mb-8">
            Выберите идеальное место для вашей фотосессии
          </p>
          
          {/* Фильтры по категориям */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="mb-2"
            >
              Все локации
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations?.map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {location.image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={location.image_url}
                    alt={location.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                    <div className="flex gap-1">
                      {location.location_categories && (
                        <Badge variant="secondary" className="text-xs">
                          {location.location_categories.name}
                        </Badge>
                      )}
                      {location.indoor && (
                        <Badge variant="outline" className="text-xs">
                          <Home className="h-3 w-3 mr-1" />
                          Студия
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {location.description}
                  </p>
                  
                  {location.address && (
                    <div className="flex items-start space-x-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{location.address}</span>
                    </div>
                  )}
                  
                  {location.best_time && (
                    <div className="flex items-start space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Лучшее время: {location.best_time}</span>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700 mt-4"
                    onClick={scrollToBooking}
                  >
                    Забронировать съемку
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!filteredLocations || filteredLocations.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Локации в этой категории пока не добавлены
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationsSection;
