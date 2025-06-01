
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from './OptimizedImage';
import { usePortfolio } from '@/hooks/usePortfolio';

const PortfolioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: portfolio, isLoading } = usePortfolio();

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
    { id: 'corporate', name: 'Корпоративные' }
  ];

  const filteredPortfolio = selectedCategory === 'all' 
    ? portfolio 
    : portfolio?.filter(item => item.category === selectedCategory);

  const getCategoryName = (category: string) => {
    const names = {
      wedding: 'Свадьба',
      lovestory: 'Love Story',
      portrait: 'Портрет',
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
          <button className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors">
            Посмотреть все работы
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
