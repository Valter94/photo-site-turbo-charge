
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Camera, Star, ArrowRight } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import OptimizedImage from './OptimizedImage';

const LocationsSection = () => {
  const { data: locations, isLoading } = useLocations();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Моковые данные с обновленными красивыми фотографиями
  const mockLocations = [
    {
      id: '1',
      name: 'Красная площадь',
      description: 'Историческое сердце Москвы с величественной архитектурой и невероятной атмосферой',
      address: 'Красная площадь, 1, Москва',
      best_time: 'Рассвет и золотой час',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические'
    },
    {
      id: '2', 
      name: 'Парк Царицыно',
      description: 'Роскошный дворцово-парковый ансамбль с романтическими мостиками и павильонами',
      address: 'Дольская ул., 1, Москва',
      best_time: 'Весна и лето',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки'
    },
    {
      id: '3',
      name: 'Воробьевы горы',
      description: 'Потрясающие панорамные виды на Москву и живописная природа',
      address: 'Воробьевы горы, Москва',
      best_time: 'Закат',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Панорамные'
    },
    {
      id: '4',
      name: 'Патриаршие пруды',
      description: 'Уютный район с атмосферными кафе и романтическими уголками',
      address: 'Патриаршие пруды, Москва',
      best_time: 'Вечер',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Романтические'
    },
    {
      id: '5',
      name: 'Москва-Сити',
      description: 'Современный деловой центр с футуристическими небоскребами',
      address: 'Московский международный деловой центр "Москва-Сити"',
      best_time: 'Синий час',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Современные'
    },
    {
      id: '6',
      name: 'Коломенское',
      description: 'Древняя царская резиденция с деревянными храмами и садами',
      address: 'Андропова пр-т, 39, Москва',
      best_time: 'Утро',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические'
    },
    {
      id: '7',
      name: 'Парк Горького',
      description: 'Центральный парк культуры с множеством живописных локаций',
      address: 'Крымский Вал, 9, Москва',
      best_time: 'Дневные часы',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки'
    },
    {
      id: '8',
      name: 'Креативное пространство',
      description: 'Современная фотостудия с разнообразными интерьерами',
      address: 'Артплей, Нижняя Сыромятническая ул., 10, стр. 2',
      best_time: 'Любое время',
      indoor: true,
      image_url: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Студии'
    }
  ];

  const displayLocations = locations || mockLocations;

  const categories = [
    { id: 'all', name: 'Все локации', count: displayLocations.length },
    { id: 'Исторические', name: 'Исторические', count: displayLocations.filter(l => l.category === 'Исторические').length },
    { id: 'Парки', name: 'Парки', count: displayLocations.filter(l => l.category === 'Парки').length },
    { id: 'Романтические', name: 'Романтические', count: displayLocations.filter(l => l.category === 'Романтические').length },
    { id: 'Современные', name: 'Современные', count: displayLocations.filter(l => l.category === 'Современные').length }
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? displayLocations 
    : displayLocations.filter(location => {
        const locationCategory = location.category || (location.location_categories?.name);
        return locationCategory === selectedCategory;
      });

  const handleBookLocation = (locationName: string) => {
    const subject = `Бронирование съемки в локации: ${locationName}`;
    const body = `Здравствуйте, Ирина!

Хочу забронировать фотосессию в локации: ${locationName}

📅 Желаемая дата: [укажите дату]
🕐 Время: [укажите время]
📸 Тип съемки: [свадебная/портретная/семейная/love story]
👥 Количество участников: [укажите количество]

✨ Дополнительные пожелания:
[опишите ваши идеи для съемки в этой локации]

📱 Мой контактный телефон: [укажите номер]

С уважением,
[Ваше имя]`;
    
    window.location.href = `mailto:bagreshevafoto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isLoading) {
    return (
      <section id="locations" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded w-96 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl h-96 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="locations" className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6 animate-bounce">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            🌍 Лучшие локации Москвы
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            <strong>Каждое место имеет свою уникальную атмосферу и историю</strong> - от исторических памятников до современных арт-пространств
          </p>
        </div>

        {/* Фильтры категорий */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up animation-delay-200">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Сетка локаций */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in animation-delay-400">
          {filteredLocations.map((location, index) => (
            <Card 
              key={location.id} 
              className="overflow-hidden group cursor-pointer transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-purple-200/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <OptimizedImage
                  src={location.image_url}
                  alt={location.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Градиент оверлей */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Бейдж категории */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg font-medium">
                    {location.category || (location.location_categories?.name)}
                  </Badge>
                </div>

                {/* Информация о времени */}
                <div className="absolute bottom-4 left-4 flex items-center text-white/90">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{location.best_time}</span>
                </div>

                {/* Иконка локации */}
                <div className="absolute top-4 left-4">
                  {location.indoor ? (
                    <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                      <Camera className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  {location.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {location.description}
                </p>
                
                <div className="flex items-start text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span className="line-clamp-2">{location.address}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {location.indoor ? '🏢 Закрытая локация' : '🌳 Открытая локация'}
                  </Badge>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">Рекомендуется</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform transition-all duration-300 hover:scale-105 group-hover:-translate-y-1"
                  onClick={() => handleBookLocation(location.name)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Забронировать съемку
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Призыв к действию */}
        <div className="mt-16 text-center animate-scale-in animation-delay-600">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              🎯 Не нашли подходящую локацию?
            </h3>
            <p className="mb-6 opacity-90">
              Предложите свое место для съемки или доверьтесь моему опыту - я знаю множество скрытых жемчужин Москвы!
            </p>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-purple-600 backdrop-blur-sm rounded-full px-8 py-3"
              onClick={() => handleBookLocation('Индивидуальная локация')}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Обсудить индивидуально
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
