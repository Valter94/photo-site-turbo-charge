
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSiteSettings } from '@/hooks/useSiteSettings';

const HeroSection = () => {
  const { data: settings } = useSiteSettings();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="mb-6">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=200&h=200&fit=crop&crop=face&auto=format"
              alt="Фотограф Ирина"
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-lg"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Фотограф Ирина
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 text-pink-300 font-medium">
            Создаю магию в каждом кадре
          </h2>
          <p className="text-xl md:text-2xl mb-6 text-gray-200">
            Профессиональная фотосъемка в Москве и области с опытом 5+ лет
          </p>
          <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Каждая фотография - это застывший момент счастья. Я помогаю сохранить самые важные 
            моменты вашей жизни, превращая их в произведения искусства, которые будут радовать 
            вас долгие годы.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg shadow-lg transform transition hover:scale-105"
            onClick={() => scrollToSection('portfolio')}
          >
            Посмотреть портфолио
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg shadow-lg transform transition hover:scale-105"
            onClick={() => scrollToSection('pricing')}
          >
            Узнать цены
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-pink-300 mb-2">5+</div>
            <p className="text-sm text-gray-300">лет опыта</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-pink-300 mb-2">500+</div>
            <p className="text-sm text-gray-300">довольных клиентов</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-pink-300 mb-2">48ч</div>
            <p className="text-sm text-gray-300">готовность фото</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
