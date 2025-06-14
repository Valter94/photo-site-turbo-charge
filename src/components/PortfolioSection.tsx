
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { usePortfolio } from '@/hooks/usePortfolio';
import GalleryGrid from './GalleryGrid';
import { useNavigate } from 'react-router-dom';

const PortfolioSection = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();

  // Расширенные моковые данные портфолио для демонстрации
  const mockPortfolio = [
    {
      id: '1',
      title: 'Романтическая свадьба в Царицыно',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop&auto=format',
      description: 'Волшебная церемония в дворцовом парке с элегантным декором',
      location: 'Царицыно',
      is_featured: true,
      client_name: 'Анна и Михаил',
      shoot_date: '2024-06-15',
      created_at: '2024-06-15'
    },
    {
      id: '2',
      title: 'Love Story в парке Горького',
      category: 'lovestory',
      image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop&auto=format',
      description: 'Нежная прогулка влюбленных по весенним аллеям',
      location: 'Парк Горького',
      is_featured: true,
      client_name: 'Елена и Дмитрий',
      shoot_date: '2024-05-20',
      created_at: '2024-05-20'
    },
    {
      id: '3',
      title: 'Портретная съемка в студии',
      category: 'portrait',
      image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6f24c?w=600&h=400&fit=crop&auto=format',
      description: 'Профессиональные портреты в минималистичной студии',
      location: 'Фотостудия "Белый зал"',
      is_featured: false,
      client_name: 'Мария',
      shoot_date: '2024-07-10',
      created_at: '2024-07-10'
    },
    {
      id: '4',
      title: 'Семейная фотосессия в Сокольниках',
      category: 'family',
      image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop&auto=format',
      description: 'Теплые семейные моменты среди золотой осени',
      location: 'Сокольники',
      is_featured: true,
      client_name: 'Семья Петровых',
      shoot_date: '2024-08-05',
      created_at: '2024-08-05'
    },
    {
      id: '5',
      title: 'Корпоративная съемка',
      category: 'corporate',
      image_url: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=600&h=400&fit=crop&auto=format',
      description: 'Деловые портреты руководящего состава',
      location: 'Москва-Сити',
      is_featured: false,
      client_name: 'ООО "Технологии"',
      shoot_date: '2024-09-12',
      created_at: '2024-09-12'
    },
    {
      id: '6',
      title: 'Утренняя свадьба на Красной площади',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop&auto=format',
      description: 'Уникальная фотосессия в историческом центре Москвы',
      location: 'Красная площадь',
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Портфолио</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Примеры наших лучших работ в различных стилях фотосъемки
          </p>
        </div>

        {/* Рекомендуемые работы */}
        <GalleryGrid items={featuredPortfolio} columns={3} />

        <div className="mt-16 text-center">
          <Button 
            className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors"
            onClick={() => navigate('/gallery')}
          >
            Посмотреть все работы
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
