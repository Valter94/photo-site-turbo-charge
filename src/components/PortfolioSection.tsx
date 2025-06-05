
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OptimizedImage from './OptimizedImage';
import { usePortfolio } from '@/hooks/usePortfolio';

const PortfolioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: portfolio, isLoading } = usePortfolio();

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
      shoot_date: '2024-06-15'
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
      shoot_date: '2024-05-20'
    },
    {
      id: '3',
      title: 'Портретная съемка в студии',
      category: 'portrait',
      image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6-f24c?w=600&h=400&fit=crop&auto=format',
      description: 'Профессиональные портреты в минималистичной студии',
      location: 'Фотостудия "Белый зал"',
      is_featured: false,
      client_name: 'Мария',
      shoot_date: '2024-07-10'
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
      shoot_date: '2024-08-05'
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
      shoot_date: '2024-09-12'
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
      shoot_date: '2024-04-28'
    },
    {
      id: '7',
      title: 'Стильная портретная съемка',
      category: 'portrait',
      image_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=400&fit=crop&auto=format',
      description: 'Современные портреты в городской среде с естественным светом',
      location: 'Центр Москвы',
      is_featured: false,
      client_name: 'Александра',
      shoot_date: '2024-07-22'
    },
    {
      id: '8',
      title: 'Love Story на закате',
      category: 'lovestory',
      image_url: 'https://images.unsplash.com/photo-1529634597343-3df5d4ac0c84?w=600&h=400&fit=crop&auto=format',
      description: 'Романтическая прогулка на смотровой площадке',
      location: 'Воробьевы горы',
      is_featured: true,
      client_name: 'Виктор и Анна',
      shoot_date: '2024-08-15'
    },
    {
      id: '9',
      title: 'Семейная съемка в Коломенском',
      category: 'family',
      image_url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop&auto=format',
      description: 'Семейное счастье среди древних храмов и садов',
      location: 'Коломенское',
      is_featured: true,
      client_name: 'Семья Ивановых',
      shoot_date: '2024-06-03'
    },
    {
      id: '10',
      title: 'Модная фотосессия в лофте',
      category: 'portrait',
      image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop&auto=format',
      description: 'Стильная съемка в индустриальном интерьере',
      location: 'Лофт-студия "Индустрия"',
      is_featured: false,
      client_name: 'Екатерина',
      shoot_date: '2024-05-14'
    },
    {
      id: '11',
      title: 'Свадьба в усадьбе Кусково',
      category: 'wedding',
      image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop&auto=format',
      description: 'Классическая свадьба в историческом дворце',
      location: 'Усадьба Кусково',
      is_featured: true,
      client_name: 'Дарья и Артем',
      shoot_date: '2024-07-01'
    },
    {
      id: '12',
      title: 'Love Story на ВДНХ',
      category: 'lovestory',
      image_url: 'https://images.unsplash.com/photo-1525258479668-e4eec2c0aeff?w=600&h=400&fit=crop&auto=format',
      description: 'Современная пара среди архитектурных шедевров',
      location: 'ВДНХ',
      is_featured: true,
      client_name: 'Юлия и Денис',
      shoot_date: '2024-09-10'
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
            onClick={() => {
              const portfolioElement = document.querySelector('#portfolio-full') as HTMLElement;
              if (portfolioElement) {
                window.scrollTo({ top: portfolioElement.offsetTop, behavior: 'smooth' });
              }
            }}
          >
            Посмотреть все работы
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
