
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OptimizedImage from './OptimizedImage';
import { usePortfolio } from '@/hooks/usePortfolio';

const PortfolioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: portfolio, isLoading } = usePortfolio();

  // Моковые данные портфолио для демонстрации
  const mockPortfolio = [
    {
      id: '1',
      title: 'Романтическая свадьба в Царицыно',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop',
      description: 'Волшебная церемония в дворцовом парке',
      location: 'Царицыно',
      is_featured: true,
      client_name: 'Анна и Михаил',
      shoot_date: '2024-06-15'
    },
    {
      id: '2',
      title: 'Love Story в парке Горького',
      category: 'lovestory',
      image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop',
      description: 'Нежная прогулка влюбленных по аллеям',
      location: 'Парк Горького',
      is_featured: true,
      client_name: 'Елена и Дмитрий',
      shoot_date: '2024-05-20'
    },
    {
      id: '3',
      title: 'Портретная съемка в студии',
      category: 'portrait',
      image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6-f24c?w=600&h=400&fit=crop',
      description: 'Профессиональные портреты в студии',
      location: 'Фотостудия "Белый зал"',
      is_featured: false,
      client_name: 'Мария',
      shoot_date: '2024-07-10'
    },
    {
      id: '4',
      title: 'Семейная фотосессия в Сокольниках',
      category: 'family',
      image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
      description: 'Теплые семейные моменты на природе',
      location: 'Сокольники',
      is_featured: true,
      client_name: 'Семья Петровых',
      shoot_date: '2024-08-05'
    },
    {
      id: '5',
      title: 'Корпоративная съемка',
      category: 'corporate',
      image_url: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=600&h=400&fit=crop',
      description: 'Деловые портреты сотрудников',
      location: 'Москва-Сити',
      is_featured: false,
      client_name: 'ООО "Технологии"',
      shoot_date: '2024-09-12'
    },
    {
      id: '6',
      title: 'Утренняя свадьба на Красной площади',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop',
      description: 'Уникальная фотосессия в сердце Москвы',
      location: 'Красная площадь',
      is_featured: true,
      client_name: 'Ольга и Сергей',
      shoot_date: '2024-04-28'
    }
  ];

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
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

  const categories = [
    { id: 'all', name: 'Все работы' },
    { id: 'wedding', name: 'Свадьбы' },
    { id: 'lovestory', name: 'Love Story' },
    { id: 'portrait', name: 'Портреты' },
    { id: 'family', name: 'Семейные' },
    { id: 'corporate', name: 'Корпоративные' }
  ];

  // Используем базу данных если есть, иначе моковые данные
  const displayPortfolio = portfolio && portfolio.length > 0 ? portfolio : mockPortfolio;

  const filteredPortfolio = selectedCategory === 'all' 
    ? displayPortfolio 
    : displayPortfolio?.filter(item => item.category === selectedCategory);

  const getCategoryName = (category: string) => {
    const names = {
      wedding: 'Свадьба',
      lovestory: 'Love Story',
      portrait: 'Портрет',
      family: 'Семейная съемка',
      corporate: 'Корпоративная съемка'
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Портфолио</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Примеры наших работ в различных стилях фотосъемки
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-rose-400 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolio?.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-80">
                <OptimizedImage
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  width={600}
                  height={400}
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900">
                    {getCategoryName(item.category)}
                  </Badge>
                </div>
                {item.is_featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-rose-400 text-white">
                      Рекомендуем
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 mb-4">{item.description}</p>
                )}
                {item.location && (
                  <p className="text-sm text-gray-500">📍 {item.location}</p>
                )}
                {item.shoot_date && (
                  <p className="text-sm text-gray-500">
                    📅 {new Date(item.shoot_date).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button 
            className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors"
            onClick={() => window.scrollTo({ top: document.querySelector('#portfolio-full')?.offsetTop || 0, behavior: 'smooth' })}
          >
            Посмотреть все работы
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
