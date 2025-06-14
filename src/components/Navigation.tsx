
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Menu, X, Heart } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Главная', action: () => scrollToSection('hero') },
    { name: 'Услуги', path: '/services' },
    { name: 'Портфолио', action: () => scrollToSection('portfolio') },
    { name: 'Галерея', path: '/gallery' },
    { name: 'Локации', action: () => scrollToSection('locations') },
    { name: 'Цены', action: () => scrollToSection('pricing') },
    { name: 'Отзывы', action: () => scrollToSection('reviews') },
    { name: 'Контакты', action: () => scrollToSection('contact') }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-pink-100' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Camera className={`w-8 h-8 transition-colors duration-300 ${
                isScrolled ? 'text-pink-600' : 'text-white'
              } group-hover:text-pink-500`} />
              <div className="absolute -top-1 -right-1">
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
              </div>
            </div>
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            } group-hover:text-pink-600`}>
              Ирина Фото
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.path ? (
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className={`text-sm font-medium transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 ${
                        isScrolled ? 'text-gray-700' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={item.action}
                    className={`text-sm font-medium transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 ${
                      isScrolled ? 'text-gray-700' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => scrollToSection('booking')}
              className="hidden md:flex bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium px-6 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Забронировать
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.path ? (
                  <Link to={item.path} onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-lg py-3"
                    >
                      {item.name}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={item.action}
                    className="w-full justify-start text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-lg py-3"
                  >
                    {item.name}
                  </Button>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t border-pink-100">
              <Button
                onClick={() => scrollToSection('booking')}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 rounded-lg shadow-lg"
              >
                Забронировать съемку
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
