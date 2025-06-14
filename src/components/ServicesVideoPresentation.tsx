
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DetailedServiceCard from './DetailedServiceCard';

const ServicesVideoPresentation = () => {
  const services = [
    {
      title: "Свадебная съемка",
      subtitle: "Полный день вашей свадьбы",
      price: "от 45,000 ₽",
      duration: "8-12 часов",
      photosCount: "200+ фото",
      rating: 4.9,
      reviewsCount: 156,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Полный свадебный день от утренних сборов до последнего танца. Создаем историю вашей любви в фотографиях.",
      features: [
        { icon: "💍", text: "Съемка церемонии и банкета" },
        { icon: "👰", text: "Утренние сборы невесты" },
        { icon: "🤵", text: "Сборы жениха" },
        { icon: "💕", text: "Love Story съемка" },
        { icon: "🎨", text: "Художественная обработка" },
        { icon: "📱", text: "Онлайн галерея" }
      ],
      popular: true
    },
    {
      title: "Love Story",
      subtitle: "Романтическая фотосессия для пары",
      price: "от 15,000 ₽",
      duration: "2-3 часа",
      photosCount: "40-60 фото",
      rating: 4.8,
      reviewsCount: 203,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Романтические кадры в живописных локациях Москвы. Передаем вашу любовь через объектив.",
      features: [
        { icon: "🌸", text: "Красивые локации" },
        { icon: "👫", text: "Естественные эмоции" },
        { icon: "🎭", text: "Смена образов" },
        { icon: "🌅", text: "Золотой час съемки" },
        { icon: "🎨", text: "Цветокоррекция" },
        { icon: "💝", text: "Подарочная упаковка" }
      ]
    },
    {
      title: "Портретная съемка",
      subtitle: "Индивидуальные и семейные портреты",
      price: "от 8,000 ₽",
      duration: "1-2 часа",
      photosCount: "20-30 фото",
      rating: 4.9,
      reviewsCount: 89,
      image: "https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Создаем выразительные портреты, которые раскрывают вашу индивидуальность.",
      features: [
        { icon: "📸", text: "Студийная съемка" },
        { icon: "🌿", text: "Съемка на природе" },
        { icon: "💡", text: "Профессиональный свет" },
        { icon: "🎨", text: "Ретушь портретов" },
        { icon: "👔", text: "Деловые портреты" },
        { icon: "🖼️", text: "Печать фотографий" }
      ]
    },
    {
      title: "Семейная фотосессия",
      subtitle: "Теплые семейные моменты",
      price: "от 12,000 ₽",
      duration: "2-3 часа",
      photosCount: "50-70 фото",
      rating: 4.8,
      reviewsCount: 127,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Запечатлеваем искренние эмоции и связь между членами семьи в уютной атмосфере.",
      features: [
        { icon: "👨‍👩‍👧‍👦", text: "Съемка всей семьи" },
        { icon: "🎈", text: "Реквизит для детей" },
        { icon: "🏞️", text: "Локации в парках" },
        { icon: "🎪", text: "Игровая съемка" },
        { icon: "📚", text: "Семейная книга" },
        { icon: "🎁", text: "Магниты в подарок" }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Detailed Services */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Наши услуги в деталях
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите идеальный пакет для вашего особенного события
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <DetailedServiceCard key={index} {...service} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Готовы создать что-то прекрасное?</h3>
          <p className="text-pink-100 mb-6 text-lg">
            Свяжитесь с нами для обсуждения вашей фотосессии
          </p>
          <Button 
            size="lg" 
            className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-8"
            onClick={() => {
              const element = document.getElementById('booking');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Забронировать фотосессию
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesVideoPresentation;
