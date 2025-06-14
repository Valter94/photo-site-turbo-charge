
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocations, useLocationCategories } from '@/hooks/useLocations';
import { MapPin, Clock, Home, Mail } from 'lucide-react';

const LocationsSection = () => {
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: categories, isLoading: categoriesLoading } = useLocationCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Обновленные реальные локации с красивыми фотографиями
  const mockLocations = [
    {
      id: '1',
      name: 'Парк Сокольники',
      description: 'Идеальное место для свадебных и романтических фотосессий. Красивые аллеи, мостики и природные пейзажи.',
      address: 'Сокольнический Вал, 1, стр. 1, Москва',
      best_time: '9:00-11:00, 16:00-19:00 (золотой час)',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&auto=format',
      category: 'Парки и природа'
    },
    {
      id: '2',
      name: 'Красная площадь',
      description: 'Знаковое место Москвы для торжественных и исторических фотосессий. Собор Василия Блаженного создает уникальный фон.',
      address: 'Красная пл., Москва',
      best_time: 'Раннее утро (7:00-9:00) или поздний вечер',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600&h=400&fit=crop&auto=format',
      category: 'Исторические места'
    },
    {
      id: '3',
      name: 'Воробьевы горы',
      description: 'Панорамный вид на Москву-реку и город. Отличное место для романтических фотосессий на закате.',
      address: 'Воробьёвы горы, Москва',
      best_time: '17:00-20:00 (закат)',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c0aa?w=600&h=400&fit=crop&auto=format',
      category: 'Смотровые площадки'
    },
    {
      id: '4',
      name: 'Студия Loft',
      description: 'Современная фотостудия с большими окнами, минималистичным интерьером и профессиональным освещением.',
      address: 'ул. Арбат, 15, Москва',
      best_time: 'Любое время (контролируемое освещение)',
      indoor: true,
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format',
      category: 'Студии'
    },
    {
      id: '5',
      name: 'Патриаршие пруды',
      description: 'Уютное и романтичное место в центре Москвы. Идеально для love story и индивидуальных портретов.',
      address: 'Патриарший пер., Москва',
      best_time: '10:00-12:00, 16:00-18:00',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=600&h=400&fit=crop&auto=format',
      category: 'Парки и природа'
    },
    {
      id: '6',
      name: 'Москва-Сити',
      description: 'Современный деловой центр с футуристической архитектурой. Отлично для стильных корпоративных фотосессий.',
      address: 'Московский международный деловой центр "Москва-Сити"',
      best_time: '19:00-21:00 (подсветка зданий)',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop&auto=format',
      category: 'Городская архитектура'
    },
    {
      id: '7',
      name: 'Царицыно',
      description: 'Музей-заповедник с дворцовым комплексом XVIII века. Роскошные интерьеры и парковые ансамбли.',
      address: 'Дольская ул., 1, Москва',
      best_time: '10:00-16:00 (естественное освещение)',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&auto=format',
      category: 'Исторические места'
    },
    {
      id: '8',
      name: 'Коломенское',
      description: 'Древняя царская резиденция с церквями и музеями. Живописные виды на Москву-реку.',
      address: 'Андропова пр-т, 39, Москва',
      best_time: '11:00-15:00, 17:00-19:00',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format',
      category: 'Исторические места'
    }
  ];

  const mockCategories = [
    { id: 'parks', name: 'Парки и природа' },
    { id: 'historical', name: 'Исторические места' },
    { id: 'viewpoints', name: 'Смотровые площадки' },
    { id: 'studios', name: 'Студии' },
    { id: 'architecture', name: 'Городская архитектура' }
  ];

  const handleBooking = () => {
    const subject = 'Бронирование фотосессии';
    const body = 'Здравствуйте, Ирина!\n\nХочу забронировать фотосессию:\n\nЖелаемая локация: [укажите локацию]\nДата и время: [укажите предпочтительные даты]\nТип съемки: [свадебная/портретная/семейная/love story]\nКоличество участников: [укажите количество]\nДополнительные пожелания: [опишите ваши идеи]\n\nМой контактный телефон: [укажите номер]\n\nС уважением,\n[Ваше имя]';
    window.location.href = `mailto:bagreshevafoto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Функция для получения категории локации
  const getLocationCategory = (location: any) => {
    // Для данных из базы
    if (location.location_categories) {
      return location.location_categories.name;
    }
    // Для моковых данных
    return location.category;
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

  // Используем базу данных если есть, иначе моковые данные
  const displayLocations = locations && locations.length > 0 ? locations : mockLocations;
  const displayCategories = categories && categories.length > 0 ? categories : mockCategories;

  const filteredLocations = selectedCategory === 'all' 
    ? displayLocations 
    : displayLocations?.filter(location => {
        const categoryName = getLocationCategory(location);
        return categoryName === selectedCategory;
      });

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
            {displayCategories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
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
              <div className="h-48 overflow-hidden">
                <img
                  src={location.image_url}
                  alt={location.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                    <div className="flex gap-1">
                      {getLocationCategory(location) && (
                        <Badge variant="secondary" className="text-xs">
                          {getLocationCategory(location)}
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
                    className="w-full bg-pink-600 hover:bg-pink-700 mt-4 flex items-center justify-center"
                    onClick={handleBooking}
                  >
                    <Mail className="w-4 h-4 mr-2" />
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
