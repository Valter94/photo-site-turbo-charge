
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { usePortfolio } from '@/hooks/usePortfolio';
import GalleryGrid from './GalleryGrid';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Camera } from 'lucide-react';

const PortfolioSection = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();

  const handleViewGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/gallery');
  };

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded w-96 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl h-80 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Используем базу данных если есть, иначе моковые данные
  const displayPortfolio = portfolio || [];
  
  // Показываем только 8 лучших работ на главной странице
  const featuredPortfolio = displayPortfolio
    .filter(item => item.is_featured)
    .slice(0, 8);

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6 animate-bounce">
            <Camera className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
            ✨ Мое портфолио
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            🎨 <strong>Каждая фотография рассказывает уникальную историю любви, красоты и счастья</strong>
          </p>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-500 mb-6">
              За 5+ лет работы я создала тысячи незабываемых кадров для сотен счастливых семей. 
              Каждая съемка - это особенный мир эмоций и воспоминаний.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Свадебная магия
              </span>
              <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                💕 Love Story
              </span>
              <span className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
                👨‍👩‍👧‍👦 Семейное счастье
              </span>
              <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                🎭 Портретное искусство
              </span>
            </div>
          </div>
        </div>

        {/* Рекомендуемые работы с улучшенной сеткой */}
        <div className="animate-slide-up animation-delay-200">
          <GalleryGrid items={featuredPortfolio} columns={4} />
        </div>

        <div className="mt-16 text-center animate-scale-in animation-delay-400">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-pink-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🌟 Хотите увидеть больше волшебства?
            </h3>
            <p className="text-gray-600 mb-6">
              В полной галерее вас ждут сотни потрясающих фотографий из разных локаций Москвы
            </p>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              onClick={handleViewGallery}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Открыть полную галерею
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
