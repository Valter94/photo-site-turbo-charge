
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Instagram } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const HeroSection = () => {
  const { data: settings } = useSiteSettings();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Левая часть - текст */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {settings?.hero_title || 'Создаем незабываемые моменты'}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {settings?.hero_subtitle || 'Профессиональная фотосъемка в Москве и Московской области'}
            </p>
            
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone className="h-5 w-5 text-rose-400" />
                  <span className="text-lg font-medium">
                    {settings?.contact_phone || '+7 (925) 506-24-27'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <span className="text-sm">📧</span>
                  <span className="text-lg">
                    {settings?.contact_email || 'Bagreshevafoto@gmail.com'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Забронировать съемку
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
              >
                <Instagram className="mr-2 h-5 w-5" />
                Посмотреть работы
              </Button>
            </div>
          </div>

          {/* Правая часть - фото фотографа */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src={settings?.photographer_photo || '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png'}
                  alt={settings?.photographer_name || 'Фотограф Ирина'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Декоративные элементы */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-300 rounded-full opacity-20"></div>
              
              {/* Информация о фотографе */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <h3 className="font-bold text-gray-900">
                  {settings?.photographer_name || 'Ирина Петрова'}
                </h3>
                <p className="text-sm text-gray-600">Профессиональный фотограф</p>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">8+ лет опыта</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация внизу */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-400 mb-2">500+</div>
              <div className="text-gray-600">Счастливых пар</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-400 mb-2">8</div>
              <div className="text-gray-600">Лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-400 mb-2">15+</div>
              <div className="text-gray-600">Локаций в Москве</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
