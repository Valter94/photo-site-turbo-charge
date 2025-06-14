
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

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
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-lg font-bold text-gray-900 hover:text-pink-600"
            >
              Фотограф Ирина
            </Button>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => scrollToSection('portfolio')}>
              Портфолио
            </Button>
            <Button variant="ghost" onClick={() => navigate('/gallery')}>
              Галерея
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('locations')}>
              Локации
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('pricing')}>
              Цены
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('reviews')}>
              Отзывы
            </Button>
            <Button 
              className="bg-pink-600 hover:bg-pink-700"
              onClick={() => scrollToSection('booking')}
            >
              Записаться
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
