
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { usePortfolio } from '@/hooks/usePortfolio';
import GalleryGrid from './GalleryGrid';
import { useNavigate } from 'react-router-dom';

const PortfolioSection = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();

  // Обновленные реальные примеры фотографий 2025 года
  const mockPortfolio = [
    {
      id: '1',
      title: 'Свадьба в Парке Горького',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop&auto=format',
      description: 'Романтическая церемония среди весенней зелени с нежным декором',
      location: 'Парк Горького, Москва',
      is_featured: true,
      client_name: 'Анна и Михаил',
      shoot_date: '2024-06-15',
      created_at: '2024-06-15'
    },
    {
      id: '2',
      title: 'Love Story на Патриарших прудах',
      category: 'lovestory',
      image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&auto=format',
      description: 'Нежная прогулка влюбленных в историческом центре Москвы',
      location: 'Патриаршие пруды, Москва',
      is_featured: true,
      client_name: 'Елена и Дмитрий',
      shoot_date: '2024-05-20',
      created_at: '2024-05-20'
    },
    {
      id: '3',
      title: 'Портретная съемка в лофте',
      category: 'portrait',
      image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop&auto=format',
      description: 'Стильные портреты в современном лофт-пространстве',
      location: 'Лофт "Красный Октябрь"',
      is_featured: true,
      client_name: 'Мария',
      shoot_date: '2024-07-10',
      created_at: '2024-07-10'
    },
    {
      id: '4',
      title: 'Семейная съемка в Коломенском',
      category: 'family',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format',
      description: 'Теплые семейные моменты на фоне исторической архитектуры',
      location: 'Коломенское, Москва',
      is_featured: true,
      client_name: 'Семья Петровых',
      shoot_date: '2024-08-05',
      created_at: '2024-08-05'
    },
    {
      id: '5',
      title: 'Корпоративная съемка в бизнес-центре',
      category: 'corporate',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format',
      description: 'Профессиональные деловые портреты руководителей',
      location: 'Москва-Сити',
      is_featured: false,
      client_name: 'ООО "Инновации"',
      shoot_date: '2024-09-12',
      created_at: '2024-09-12'
    },
    {
      id: '6',
      title: 'Утренняя свадьба на Воробьевых горах',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format',
      description: 'Незабываемая церемония с панорамным видом на Москву',
      location: 'Воробьевы горы',
      is_featured: true,
      client_name: 'Ольга и Сергей',
      shoot_date: '2024-04-28',
      created_at: '2024-04-28'
    }
  ];

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Используем базу данных если есть, иначе моковые данные
  const displayPortfolio = portfolio && portfolio.length > 0 ? portfolio : mockPortfolio;
  
  // Показываем только 6 лучших работ на главной странице
  const featuredPortfolio = displayPortfolio
    .filter(item => item.is_featured)
    .slice(0, 6);

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Мое портфолио</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Каждая фотография рассказывает уникальную историю
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            За 5+ лет работы я создала тысячи незабываемых кадров для сотен счастливых семей. 
            Посмотрите на некоторые из моих любимых работ.
          </p>
        </div>

        {/* Рекомендуемые работы */}
        <GalleryGrid items={featuredPortfolio} columns={3} />

        <div className="mt-16 text-center">
          <Button 
            className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors shadow-lg transform hover:scale-105"
            onClick={() => navigate('/gallery')}
          >
            Посмотреть все работы в галерее
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
