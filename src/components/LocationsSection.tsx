
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

  // Обновленные моковые данные с красивыми фотографиями Москвы
  const mockLocations = [
    {
      id: '1',
      name: 'Красная площадь',
      description: 'Историческое сердце Москвы с величественной архитектурой и атмосферой царской России',
      address: 'Красная площадь, 1, Москва',
      best_time: 'Рассвет и золотой час',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические'
    },
    {
      id: '2', 
      name: 'Парк Царицыно',
      description: 'Роскошный дворцово-парковый ансамбль с романтическими мостиками и готической архитектурой',
      address: 'Дольская ул., 1, Москва',
      best_time: 'Весна и лето, закат',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки'
    },
    {
      id: '3',
      name: 'Воробьевы горы',
      description: 'Потрясающие панорамные виды на столицу с высоты птичьего полета',
      address: 'Воробьевы горы, Москва',
      best_time: 'Закат и синий час',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1520637736862-4d197d17c16a?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Панорамные'
    },
    {
      id: '4',
      name: 'Патриаршие пруды',
      description: 'Уютный оазис в центре города с атмосферными кафе и романтическими аллеями',
      address: 'Патриаршие пруды, Москва',
      best_time: 'Вечер, золотой час',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Романтические'
    },
    {
      id: '5',
      name: 'Москва-Сити',
      description: 'Футуристический деловой центр с небоскребами и современной архитектурой',
      address: 'Московский международный деловой центр "Москва-Сити"',
      best_time: 'Синий час, вечернее время',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Современные'
    },
    {
      id: '6',
      name: 'Коломенское',
      description: 'Древняя царская резиденция с деревянными храмами и живописными садами',
      address: 'Андропова пр-т, 39, Москва',
      best_time: 'Утреннее время, весна',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические'
    },
    {
      id: '7',
      name: 'Парк Горького',
      description: 'Центральный парк культуры с множеством живописных локаций и современным дизайном',
      address: 'Крымский Вал, 9, Москва',
      best_time: 'Дневные часы, закат',
      indoor: false,
      image_url: 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки'
    },
    {
      id: '8',
      name: 'Креативная фотостудия',
      description: 'Современная студия с разнообразными интерьерами и профессиональным освещением',
      address: 'Artplay, Нижняя Сыромятническая ул., 10, стр. 2',
      best_time: 'Любое время года',
      indoor: true,
      image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Студии'
    }
  ];

  const displayLocations = locations || mockLocations;

  // Функция для безопасного получения категории
  const getCategoryName = (location: any) => {
    if (location.category) {
      return location.category;
    }
    if (location.location_categories?.name) {
      return location.location_categories.name;
    }
    return 'Без категории';
  };

  const categories = [
    { id: 'all', name: 'Все локации', count: displayLocations.length },
    { id: 'Исторические', name: 'Исторические', count: displayLocations.filter(l => getCategoryName(l) === 'Исторические').length },
    { id: 'Парки', name: 'Парки', count: displayLocations.filter(l => getCategoryName(l) === 'Парки').length },
    { id: 'Романтические', name: 'Романтические', count: displayLocations.filter(l => getCategoryName(l) === 'Романтические').length },
    { id: 'Современные', name: 'Современные', count: displayLocations.filter(l => getCategoryName(l) === 'Современные').length }
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? displayLocations 
    : displayLocations.filter(location => getCategoryName(location) === selectedCategory);

  const handleBookLocation = (locationName: string) => {
    const subject = `Бронирование съемки в локации: ${locationName}`;
    const body = `Здравствуйте, Ирина!

Хочу забронировать фотосессию в удивительной локации: ${locationName}

📅 Желаемая дата: [укажите дату]
🕐 Время: [укажите время]
📸 Тип съемки: [свадебная/портретная/семейная/love story]
👥 Количество участников: [укажите количество]

✨ Почему выбрал именно эту локацию:
[расскажите, что вас привлекло в данном месте]

💫 Дополнительные пожелания:
[опишите ваши идеи для съемки, особые моменты, стиль]

📱 Мой контактный телефон: [укажите номер]

С нетерпением жду создания волшебных кадров в этом прекрасном месте! 

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
            🌍 Волшебные локации Москвы
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            <strong>Каждое место хранит свою уникальную историю и магию</strong> - от величественных исторических памятников до современных арт-пространств, где рождаются незабываемые кадры
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
                    {getCategoryName(location)}
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
              🎯 Не нашли идеальную локацию?
            </h3>
            <p className="mb-6 opacity-90">
              Предложите свое особенное место или доверьтесь моему опыту - я знаю множество скрытых жемчужин Москвы, где можно создать по-настоящему волшебные кадры!
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
