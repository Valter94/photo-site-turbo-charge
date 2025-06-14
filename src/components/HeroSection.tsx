
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Camera, Star, Award, Heart } from 'lucide-react';

const HeroSection = () => {
  const { data: settings } = useSiteSettings();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Анимированный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      {/* Анимированные блобы */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in">
          {/* Фотография фотографа с анимацией */}
          <div className="mb-8 relative">
            <div className="relative mx-auto w-40 h-40 group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full animate-spin-slow opacity-75 blur-sm"></div>
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=300&h=300&fit=crop&crop=face&auto=format"
                alt="Фотограф Ирина"
                className="relative w-40 h-40 rounded-full mx-auto object-cover border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-all duration-500 hover-lift"
              />
              <div className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-2 animate-bounce">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent animate-slide-up">
            Фотограф Ирина
          </h1>
          
          <h2 className="text-3xl md:text-4xl mb-6 text-pink-300 font-medium animate-slide-up animation-delay-200">
            ✨ Создаю магию в каждом кадре ✨
          </h2>
          
          <p className="text-xl md:text-2xl mb-6 text-gray-200 animate-slide-up animation-delay-400">
            Профессиональная фотосъемка в Москве с опытом 5+ лет
          </p>
          
          <div className="max-w-3xl mx-auto mb-8 animate-slide-up animation-delay-600">
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              🎯 <strong>Каждая фотография</strong> - это застывший момент счастья и красоты. 
              Я превращаю ваши самые важные моменты в произведения искусства, которые будут 
              радовать вас долгие годы.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">📸 Свадебная съемка</span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">💕 Love Story</span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">👨‍👩‍👧‍👦 Семейные фото</span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">🎭 Портреты</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-scale-in animation-delay-800">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-10 py-4 text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-0 rounded-full"
            onClick={() => scrollToSection('portfolio')}
          >
            <Star className="w-5 h-5 mr-2" />
            Посмотреть портфолио
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white/50 text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm bg-white/10 rounded-full"
            onClick={() => scrollToSection('pricing')}
          >
            <Heart className="w-5 h-5 mr-2" />
            Узнать цены
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in animation-delay-1000">
          <div className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold text-pink-300 mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
              <p className="text-sm text-gray-300 flex items-center justify-center">
                <Award className="w-4 h-4 mr-1" />
                лет опыта
              </p>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold text-pink-300 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <p className="text-sm text-gray-300 flex items-center justify-center">
                <Heart className="w-4 h-4 mr-1" />
                довольных клиентов
              </p>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold text-pink-300 mb-2 group-hover:scale-110 transition-transform duration-300">48ч</div>
              <p className="text-sm text-gray-300 flex items-center justify-center">
                <Star className="w-4 h-4 mr-1" />
                готовность фото
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action button */}
      <div className="absolute bottom-10 right-10 animate-bounce">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-2xl hover:scale-110 transition-all duration-300"
          onClick={() => scrollToSection('booking')}
        >
          <Camera className="w-8 h-8" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
