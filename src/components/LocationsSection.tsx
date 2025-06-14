
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Home, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

const LocationsSection = () => {
  // Реальные локации Москвы и Подмосковья с красивыми фотографиями
  const locations = [
    {
      id: 1,
      name: 'Парк Царицыно',
      description: 'Дворцово-парковый ансамбль с великолепной архитектурой XVIII века. Идеальное место для торжественных и романтических фотосессий.',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические места',
      address: 'ул. Дольская, 1, Москва',
      bestTime: 'Золотой час (за час до заката)',
      indoor: false,
      features: ['Дворцы', 'Мосты', 'Пруды', 'Аллеи']
    },
    {
      id: 2,
      name: 'Парк Горького',
      description: 'Культурный центр Москвы с современными арт-объектами, красивыми аллеями и видами на Москву-реку.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки',
      address: 'ул. Крымский Вал, 9, Москва',
      bestTime: 'Утром до 11:00 или после 16:00',
      indoor: false,
      features: ['Набережная', 'Фонтаны', 'Аллеи', 'Арт-объекты']
    },
    {
      id: 3,
      name: 'Красная площадь',
      description: 'Главная площадь России с видом на Кремль и Собор Василия Блаженного. Символичное место для особенных фотосессий.',
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические места',
      address: 'Красная площадь, Москва',
      bestTime: 'Раннее утро до 8:00',
      indoor: false,
      features: ['Кремль', 'Собор', 'Брусчатка', 'ГУМ']
    },
    {
      id: 4,
      name: 'Воробьевы горы',
      description: 'Смотровая площадка с потрясающим панорамным видом на Москву. Идеально для романтических фотосессий на закате.',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Смотровые площадки',
      address: 'Воробьевы горы, Москва',
      bestTime: 'На закате',
      indoor: false,
      features: ['Панорама', 'МГУ', 'Набережная', 'Канатная дорога']
    },
    {
      id: 5,
      name: 'Усадьба Архангельское',
      description: 'Роскошная усадьба XVIII века в Подмосковье с дворцом, парком и великолепной архитектурой.',
      image: 'https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Усадьбы',
      address: 'пос. Архангельское, Красногорский р-н',
      bestTime: 'Утром и в золотой час',
      indoor: false,
      features: ['Дворец', 'Регулярный парк', 'Колоннады', 'Террасы']
    },
    {
      id: 6,
      name: 'Парк Кусково',
      description: 'Французский регулярный парк с дворцом графов Шереметевых. Идеальная локация для классических фотосессий.',
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Усадьбы',
      address: 'ул. Юности, 2, Москва',
      bestTime: 'Утром до 10:00',
      indoor: false,
      features: ['Дворец', 'Регулярный парк', 'Пруд', 'Павильоны']
    },
    {
      id: 7,
      name: 'ВДНХ',
      description: 'Выставочный комплекс с знаменитыми павильонами, фонтанами и современными арт-объектами.',
      image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Выставочные комплексы',
      address: 'просп. Мира, 119, Москва',
      bestTime: 'Днем и вечером',
      indoor: false,
      features: ['Павильоны', 'Фонтаны', 'Аллеи', 'Монументы']
    },
    {
      id: 8,
      name: 'Коломенское',
      description: 'Музей-заповедник с древними храмами и панорамным видом на Москву-реку.',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические места',
      address: 'Андропова пр-т, 39, Москва',
      bestTime: 'Рассвет и золотой час',
      indoor: false,
      features: ['Храмы', 'Деревянные постройки', 'Сады', 'Набережная']
    }
  ];

  return (
    <section id="locations" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            📍 Лучшие локации для фотосессий
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Тщательно отобранные места в Москве и Подмосковье, которые создадут идеальный фон для ваших незабываемых кадров
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((location) => (
            <Card key={location.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="relative overflow-hidden">
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-md text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {location.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {location.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {location.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="truncate">{location.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{location.bestTime}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Home className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{location.indoor ? 'Закрытое помещение' : 'На открытом воздухе'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {location.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                      {feature}
                    </span>
                  ))}
                  {location.features.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      +{location.features.length - 3}
                    </span>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Не нашли подходящую локацию?
            </h3>
            <p className="text-gray-600 mb-6">
              Расскажите о своих предпочтениях, и мы найдем идеальное место для вашей фотосессии
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-105">
              Связаться с фотографом
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
