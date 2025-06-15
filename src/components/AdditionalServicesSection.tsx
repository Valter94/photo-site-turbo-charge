
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Camera, Palette, Image, BookOpen, Video, Star, Wand2 } from 'lucide-react';
import { useAdditionalServices } from '@/hooks/useAdditionalServices';

const AdditionalServicesSection = () => {
  const { data: services, isLoading } = useAdditionalServices();

  const serviceIcons = {
    'Экспресс-обработка фото': Clock,
    'Дополнительный час съемки': Camera,
    'Профессиональная ретушь': Palette,
    'Печать фотографий': Image,
    'Создание фотокниги': BookOpen,
    'Видеосъемка': Video,
    'Аренда реквизита': Star,
    'Услуги визажиста': Wand2
  };

  const scrollToBooking = () => {
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Загрузка услуг...</h2>
          </div>
        </div>
      </section>
    );
  }

  const activeServices = services?.filter(service => service.is_active) || [];

  if (activeServices.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Дополнительные услуги</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Сделайте вашу фотосессию еще более особенной с нашими дополнительными услугами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeServices.map((service) => {
            const IconComponent = serviceIcons[service.name as keyof typeof serviceIcons] || Star;

            return (
              <Card 
                key={service.id} 
                className="hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200"
              >
                <CardHeader className="text-center pb-3">
                  <div className="inline-flex p-3 rounded-full bg-pink-100 mb-3 mx-auto">
                    <IconComponent className="w-6 h-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
                      {service.price?.toLocaleString('ru-RU')} ₽
                    </Badge>
                  </div>
                  <Button
                    onClick={scrollToBooking}
                    variant="outline"
                    className="w-full border-pink-500 text-pink-600 hover:bg-pink-50"
                  >
                    Добавить к заказу
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Хотите узнать больше о дополнительных услугах?
          </p>
          <Button 
            onClick={scrollToBooking}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            Обсудить детали
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdditionalServicesSection;
