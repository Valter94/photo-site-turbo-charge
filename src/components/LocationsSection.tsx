
import React, { useState } from 'react';
import { MapPin, Clock, Sun, Snowflake, Flower, Leaf } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from './OptimizedImage';

const LocationsSection = () => {
  const [selectedSeason, setSelectedSeason] = useState('spring');

  const seasons = [
    { id: 'spring', name: 'Весна', icon: Flower, color: 'text-green-500' },
    { id: 'summer', name: 'Лето', icon: Sun, color: 'text-yellow-500' },
    { id: 'autumn', name: 'Осень', icon: Leaf, color: 'text-orange-500' },
    { id: 'winter', name: 'Зима', icon: Snowflake, color: 'text-blue-500' }
  ];

  const locations = {
    spring: [
      {
        id: 1,
        name: 'Парк Горького',
        description: 'Цветущие сады и живописные аллеи создают романтическую атмосферу',
        image: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=600&h=400&fit=crop',
        bestTime: '10:00-16:00',
        features: ['Цветущие деревья', 'Романтические аллеи', 'Фонтаны']
      },
      {
        id: 2,
        name: 'Музеон',
        description: 'Современное искусство в сочетании с весенней природой',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
        bestTime: '09:00-15:00',
        features: ['Арт-объекты', 'Вид на Москву-реку', 'Современная архитектура']
      },
      {
        id: 3,
        name: 'Александровский сад',
        description: 'Историческое место с весенними цветами у Кремля',
        image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c13a?w=600&h=400&fit=crop',
        bestTime: '08:00-12:00',
        features: ['Историческая архитектура', 'Весенние клумбы', 'Торжественная атмосфера']
      },
      {
        id: 4,
        name: 'Воробьевы горы',
        description: 'Панорамные виды на Москву с весенней зеленью',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
        bestTime: '16:00-19:00',
        features: ['Панорамный вид', 'Весенняя природа', 'Смотровая площадка']
      }
    ],
    summer: [
      {
        id: 5,
        name: 'Сокольники',
        description: 'Густая летняя зелень и тенистые аллеи парка',
        image: 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=600&h=400&fit=crop',
        bestTime: '07:00-11:00',
        features: ['Тенистые аллеи', 'Летняя зелень', 'Розарий']
      },
      {
        id: 6,
        name: 'Царицыно',
        description: 'Дворцовый комплекс с великолепными летними садами',
        image: 'https://images.unsplash.com/photo-1580500550469-5ad6e2b0e1d0?w=600&h=400&fit=crop',
        bestTime: '17:00-20:00',
        features: ['Дворцовая архитектура', 'Французские сады', 'Пруды']
      },
      {
        id: 7,
        name: 'Коломенское',
        description: 'Историческая усадьба с летними лугами и церквями',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
        bestTime: '15:00-19:00',
        features: ['Деревянная архитектура', 'Луга', 'Историческая церковь']
      },
      {
        id: 8,
        name: 'Парк Победы',
        description: 'Просторные аллеи и фонтаны в летнем солнце',
        image: 'https://images.unsplash.com/photo-1605608187585-0ab9a75c5b2e?w=600&h=400&fit=crop',
        bestTime: '18:00-21:00',
        features: ['Мемориальный комплекс', 'Фонтаны', 'Торжественная атмосфера']
      },
      {
        id: 9,
        name: 'Кузьминки',
        description: 'Живописные пруды и летние павильоны',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        bestTime: '10:00-14:00',
        features: ['Пруды', 'Мостики', 'Летние павильоны']
      },
      {
        id: 10,
        name: 'ВДНХ',
        description: 'Советская архитектура в окружении летних цветников',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=400&fit=crop',
        bestTime: '09:00-13:00',
        features: ['Советская архитектура', 'Фонтаны', 'Цветники']
      }
    ],
    autumn: [
      {
        id: 11,
        name: 'Измайловский парк',
        description: 'Золотая осень в одном из самых больших парков Москвы',
        image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop',
        bestTime: '14:00-17:00',
        features: ['Осенние краски', 'Лесные тропы', 'Озеро']
      },
      {
        id: 12,
        name: 'Битцевский лес',
        description: 'Естественный лес с яркими осенними красками',
        image: 'https://images.unsplash.com/photo-1507371341162-763b5e419618?w=600&h=400&fit=crop',
        bestTime: '11:00-15:00',
        features: ['Природный лес', 'Осенняя листва', 'Тропинки']
      },
      {
        id: 13,
        name: 'Нескучный сад',
        description: 'Романтические аллеи с осенним ковром из листьев',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop',
        bestTime: '13:00-16:00',
        features: ['Романтические аллеи', 'Осенний ковер', 'Вид на реку']
      }
    ],
    winter: [
      {
        id: 14,
        name: 'Красная площадь',
        description: 'Зимняя сказка в сердце Москвы с новогодней иллюминацией',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        bestTime: '16:00-19:00',
        features: ['Историческая архитектура', 'Зимняя иллюминация', 'Снежный покров']
      },
      {
        id: 15,
        name: 'Парк Сокольники зимой',
        description: 'Заснеженные аллеи и зимние развлечения',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        bestTime: '12:00-15:00',
        features: ['Заснеженные деревья', 'Зимние аллеи', 'Каток']
      }
    ]
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Локации для съемки</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Самые красивые места Москвы и Московской области для вашей фотосессии
          </p>
        </div>

        {/* Выбор сезона */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {seasons.map((season) => {
            const IconComponent = season.icon;
            return (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedSeason === season.id
                    ? 'bg-rose-400 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className={`h-5 w-5 ${selectedSeason === season.id ? 'text-white' : season.color}`} />
                <span className="font-medium">{season.name}</span>
              </button>
            );
          })}
        </div>

        {/* Локации */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations[selectedSeason as keyof typeof locations]?.map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64">
                <OptimizedImage
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                  width={600}
                  height={400}
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900">
                    <Clock className="h-3 w-3 mr-1" />
                    {location.bestTime}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{location.name}</h3>
                  <MapPin className="h-5 w-5 text-rose-400 flex-shrink-0 mt-1" />
                </div>
                
                <p className="text-gray-600 mb-4">{location.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {location.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
