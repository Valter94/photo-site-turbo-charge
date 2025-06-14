
import React from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Camera, Clock, Image } from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Свадебная съемка",
      price: "от 45,000 ₽",
      duration: "8-12 часов",
      photosCount: "200+ фото",
      rating: 4.9,
      reviewsCount: 156,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Полный свадебный день от утренних сборов до последнего танца. Создаем историю вашей любви в фотографиях.",
      features: ["Съемка церемонии и банкета", "Утренние сборы", "Love Story съемка", "Художественная обработка"],
      popular: true
    },
    {
      title: "Love Story",
      price: "от 15,000 ₽",
      duration: "2-3 часа",
      photosCount: "40-60 фото",
      rating: 4.8,
      reviewsCount: 203,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Романтические кадры в живописных локациях Москвы. Передаем вашу любовь через объектив.",
      features: ["Красивые локации", "Естественные эмоции", "Смена образов", "Золотой час съемки"]
    },
    {
      title: "Портретная съемка",
      price: "от 8,000 ₽",
      duration: "1-2 часа",
      photosCount: "20-30 фото",
      rating: 4.9,
      reviewsCount: 89,
      image: "https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Создаем выразительные портреты, которые раскрывают вашу индивидуальность.",
      features: ["Студийная съемка", "Съемка на природе", "Профессиональный свет", "Ретушь портретов"]
    },
    {
      title: "Семейная фотосессия",
      price: "от 12,000 ₽",
      duration: "2-3 часа",
      photosCount: "50-70 фото",
      rating: 4.8,
      reviewsCount: 127,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Запечатлеваем искренние эмоции и связь между членами семьи в уютной атмосфере.",
      features: ["Съемка всей семьи", "Реквизит для детей", "Локации в парках", "Игровая съемка"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-20">
        <div className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Наши услуги
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Профессиональная фотография для всех важных моментов вашей жизни
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {services.map((service, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {service.popular && (
                    <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-pink-500 to-rose-500">
                      Популярно
                    </Badge>
                  )}
                  
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {service.title}
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-600">{service.price}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {service.rating} ({service.reviewsCount})
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{service.description}</p>
                    
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Image className="w-4 h-4" />
                        {service.photosCount}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Что включено:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                      onClick={() => {
                        const element = document.getElementById('booking');
                        if (element) {
                          window.location.href = '/#booking';
                        }
                      }}
                    >
                      Забронировать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
              <CardContent className="p-8 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-white" />
                <h3 className="text-3xl font-bold mb-4">Готовы создать что-то прекрасное?</h3>
                <p className="text-pink-100 mb-6 text-lg">
                  Свяжитесь с нами для обсуждения вашей фотосессии
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-8"
                  onClick={() => {
                    window.location.href = '/#booking';
                  }}
                >
                  Забронировать фотосессию
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Services;
