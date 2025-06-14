
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Home, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

const LocationsSection = () => {
  // Расширенный список локаций Москвы и Подмосковья с обновленными фотографиями
  const locations = [
    {
      id: 1,
      name: 'Парк Царицыно',
      description: 'Дворцово-парковый ансамбль с великолепной архитектурой XVIII века. Идеальное место для торжественных и романтических фотосессий.',
      image: 'https://images.unsplash.com/photo-1598901043946-87da9b77e7e9?w=800&h=600&fit=crop&auto=format&q=80',
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
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=800&h=600&fit=crop&auto=format&q=80',
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
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format&q=80',
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
      image: 'https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=800&h=600&fit=crop&auto=format&q=80',
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
      image: 'https://images.unsplash.com/photo-1582706975765-9c3a6e36c3dc?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические места',
      address: 'Андропова пр-т, 39, Москва',
      bestTime: 'Рассвет и золотой час',
      indoor: false,
      features: ['Храмы', 'Деревянные постройки', 'Сады', 'Набережная']
    },
    {
      id: 9,
      name: 'Парк Сокольники',
      description: 'Один из старейших парков Москвы с живописными аллеями, прудами и розарием.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки',
      address: 'Сокольнический Вал, 1, стр. 1, Москва',
      bestTime: 'Утром и вечером',
      indoor: false,
      features: ['Розарий', 'Пруды', 'Аллеи', 'Беседки']
    },
    {
      id: 10,
      name: 'Патриаршие пруды',
      description: 'Уютный уголок в центре Москвы, идеальный для камерных и романтических фотосессий.',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки',
      address: 'Патриаршие пруды, Москва',
      bestTime: 'Днем и на закате',
      indoor: false,
      features: ['Пруд', 'Скамейки', 'Деревья', 'Фонари']
    },
    {
      id: 11,
      name: 'Битцевский парк',
      description: 'Природный заказник с лесными тропинками и живописными полянами.',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Природные парки',
      address: 'Новоясеневский тупик, 1, Москва',
      bestTime: 'Золотой час',
      indoor: false,
      features: ['Лес', 'Поляны', 'Тропинки', 'Река']
    },
    {
      id: 12,
      name: 'Измайловский Кремль',
      description: 'Культурно-развлекательный комплекс в русском стиле с яркой архитектурой.',
      image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические места',
      address: 'Измайловское ш., 73Ж, Москва',
      bestTime: 'Днем',
      indoor: false,
      features: ['Башни', 'Храмы', 'Дворы', 'Ремесленные мастерские']
    },
    {
      id: 13,
      name: 'Нескучный сад',
      description: 'Старинный парк на берегу Москвы-реки с романтическими аллеями и беседками.',
      image: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки',
      address: 'Ленинский пр-т, 30, Москва',
      bestTime: 'Вечером на закате',
      indoor: false,
      features: ['Набережная', 'Беседки', 'Старые деревья', 'Мосты']
    },
    {
      id: 14,
      name: 'Александровский сад',
      description: 'Исторический сад у стен Кремля с вечным огнем и могилой неизвестного солдата.',
      image: 'https://images.unsplash.com/photo-1578894381820-7a526b1b2b9e?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Исторические места',
      address: 'Александровский сад, Москва',
      bestTime: 'Утром до 9:00',
      indoor: false,
      features: ['Кремлевская стена', 'Фонтаны', 'Аллеи', 'Памятники']
    },
    {
      id: 15,
      name: 'Останкинский парк',
      description: 'Большой парк с прудами, аллеями и видом на Останкинскую башню.',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Парки',
      address: 'ул. Академика Королева, Москва',
      bestTime: 'Утром и вечером',
      indoor: false,
      features: ['Пруды', 'Телебашня', 'Аллеи', 'Мостики']
    },
    {
      id: 16,
      name: 'Усадьба Люблино',
      description: 'Уникальная усадьба в форме креста с романтичным парком.',
      image: 'https://images.unsplash.com/photo-1580894547592-a5d8b5ab5cb5?w=800&h=600&fit=crop&auto=format&q=80',
      category: 'Усадьбы',
      address: 'Летняя ул., 1, к. 1, Москва',
      bestTime: 'Золотой час',
      indoor: false,
      features: ['Дворец', 'Парк', 'Пруд', 'Грот']
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
