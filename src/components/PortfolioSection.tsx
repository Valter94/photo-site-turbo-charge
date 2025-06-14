
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { usePortfolio } from '@/hooks/usePortfolio';
import GalleryGrid from './GalleryGrid';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Camera } from 'lucide-react';

const PortfolioSection = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();

  // Обновленные реальные примеры фотографий 2025 года с московскими локациями
  const mockPortfolio = [
    {
      id: '1',
      title: 'Сказочная свадьба в Царицыно',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format',
      description: 'Романтическая церемония в царском парке с изысканной архитектурой XVIII века',
      location: 'Музей-заповедник Царицыно',
      is_featured: true,
      client_name: 'Анна и Михаил',
      shoot_date: '2024-09-15',
      created_at: '2024-09-15'
    },
    {
      id: '2',
      title: 'Love Story на набережной Москвы-реки',
      category: 'lovestory',
      image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop&auto=format',
      description: 'Нежная прогулка влюбленных с видом на сталинские высотки и современные небоскребы',
      location: 'Воробьевы горы, набережная',
      is_featured: true,
      client_name: 'Елена и Дмитрий',
      shoot_date: '2024-08-20',
      created_at: '2024-08-20'
    },
    {
      id: '3',
      title: 'Стильные портреты в Artplay',
      category: 'portrait',
      image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop&auto=format',
      description: 'Современная портретная съемка в креативном пространстве с индустриальным дизайном',
      location: 'Дизайн-завод Artplay',
      is_featured: true,
      client_name: 'Мария',
      shoot_date: '2024-10-10',
      created_at: '2024-10-10'
    },
    {
      id: '4',
      title: 'Семейное счастье в Сокольниках',
      category: 'family',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
      description: 'Теплые семейные моменты среди золотой осенней листвы в старейшем парке Москвы',
      location: 'Парк Сокольники',
      is_featured: true,
      client_name: 'Семья Петровых',
      shoot_date: '2024-10-05',
      created_at: '2024-10-05'
    },
    {
      id: '5',
      title: 'Деловые портреты в Москва-Сити',
      category: 'corporate',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
      description: 'Профессиональная корпоративная съемка на фоне футуристических небоскребов',
      location: 'ММДЦ Москва-Сити',
      is_featured: false,
      client_name: 'ООО "Инновации"',
      shoot_date: '2024-11-12',
      created_at: '2024-11-12'
    },
    {
      id: '6',
      title: 'Утренняя церемония в Коломенском',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&auto=format',
      description: 'Величественная свадьба с панорамным видом на Москву и древние храмы',
      location: 'Музей-заповедник Коломенское',
      is_featured: true,
      client_name: 'Ольга и Сергей',
      shoot_date: '2024-07-28',
      created_at: '2024-07-28'
    },
    {
      id: '7',
      title: 'Романтика на Крымском мосту',
      category: 'lovestory',
      image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop&auto=format',
      description: 'Вечерняя съемка с захватывающими видами на центр Москвы и подсветку мостов',
      location: 'Крымский мост, Парк Горького',
      is_featured: true,
      client_name: 'Виктория и Артем',
      shoot_date: '2024-09-22',
      created_at: '2024-09-22'
    },
    {
      id: '8',
      title: 'Материнство в Ботаническом саду',
      category: 'maternity',
      image_url: 'https://images.unsplash.com/photo-1516627145497-ae4058c73e28?w=800&h=600&fit=crop&auto=format',
      description: 'Нежная съемка ожидания малыша среди экзотических растений и оранжерей',
      location: 'Главный ботанический сад РАН',
      is_featured: true,
      client_name: 'Алина',
      shoot_date: '2024-08-15',
      created_at: '2024-08-15'
    }
  ];

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
  const displayPortfolio = portfolio && portfolio.length > 0 ? portfolio : mockPortfolio;
  
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
              onClick={() => navigate('/gallery')}
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
