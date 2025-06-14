
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
          {settings?.photographer_photo && (
            <div className="mb-6">
              <img
                src={settings.photographer_photo}
                alt={settings.photographer_name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20"
              />
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {settings?.hero_title || 'Создаем незабываемые моменты'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {settings?.hero_subtitle || 'Профессиональная фотосъемка в Москве и области'}
          </p>
          <p className="text-lg mb-8 text-gray-300">
            {settings?.photographer_description || 'Фотограф Ирина - профессиональная фотосъемка для особенных моментов вашей жизни'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg"
            onClick={() => scrollToSection('portfolio')}
          >
            Посмотреть портфолио
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
            onClick={() => scrollToSection('pricing')}
          >
            Узнать цены
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
