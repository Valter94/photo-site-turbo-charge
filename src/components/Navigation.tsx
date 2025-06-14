
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Camera, Menu, X, Star, Heart } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-pink-100' 
        : 'bg-white/90 backdrop-blur-sm shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-pink-600 transition-colors p-2"
            >
              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isScrolled ? 'scale-90' : 'scale-100'
                }`}>
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Star className="w-2 h-2 text-white fill-current" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Фотограф Ирина
              </span>
            </Button>
          </div>
          
          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-1">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('portfolio')}
              className="hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 px-4 py-2 rounded-full"
            >
              <Star className="w-4 h-4 mr-2" />
              Портфолио
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/gallery')}
              className="hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 px-4 py-2 rounded-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              Галерея
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('locations')}
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-full"
            >
              📍 Локации
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('pricing')}
              className="hover:bg-green-50 hover:text-green-600 transition-all duration-200 px-4 py-2 rounded-full"
            >
              💰 Цены
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('reviews')}
              className="hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 px-4 py-2 rounded-full"
            >
              <Heart className="w-4 h-4 mr-2" />
              Отзывы
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ml-4"
              onClick={() => scrollToSection('booking')}
            >
              ✨ Записаться
            </Button>
          </div>

          {/* Мобильная кнопка меню */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 hover:text-pink-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-b border-pink-100 animate-slide-up">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('portfolio')}
                className="w-full justify-start hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 rounded-xl"
              >
                <Star className="w-4 h-4 mr-3" />
                Портфолио
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/gallery')}
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-xl"
              >
                <Camera className="w-4 h-4 mr-3" />
                Галерея
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('locations')}
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-xl"
              >
                📍 Локации
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('pricing')}
                className="w-full justify-start hover:bg-green-50 hover:text-green-600 transition-all duration-200 rounded-xl"
              >
                💰 Цены
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('reviews')}
                className="w-full justify-start hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 rounded-xl"
              >
                <Heart className="w-4 h-4 mr-3" />
                Отзывы
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold shadow-lg mt-4 rounded-xl"
                onClick={() => scrollToSection('booking')}
              >
                ✨ Записаться на съемку
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
