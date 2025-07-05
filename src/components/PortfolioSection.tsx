
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { usePortfolio } from '@/hooks/usePortfolio';
import GalleryGrid from './GalleryGrid';
import GalleryFilters from './gallery/GalleryFilters';
import { ALL_SERVICE_TYPES } from '@/lib/serviceTypes';
import { Sparkles, Camera } from 'lucide-react';

// Определения категорий для фильтров
const categories = [
  { id: 'all', name: 'Все работы' },
  ...ALL_SERVICE_TYPES.map(t => ({ id: t.value, name: t.label })),
];

const PortfolioSection = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Фильтрация и сортировка портфолио
  const filteredAndSortedPortfolio = React.useMemo(() => {
    if (!portfolio) return [];

    let filtered = portfolio;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) =>
          new Date(b.shoot_date || b.created_at).getTime() - new Date(a.shoot_date || a.created_at).getTime()
        );
      case 'oldest':
        return filtered.sort((a, b) =>
          new Date(a.shoot_date || a.created_at).getTime() - new Date(b.shoot_date || b.created_at).getTime()
        );
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'featured':
        return filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      default:
        return filtered;
    }
  }, [portfolio, selectedCategory, searchQuery, sortBy]);

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

  // Используем базу данных если есть, иначе пустой массив
  const displayPortfolio = filteredAndSortedPortfolio || [];

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

        {/* Фильтры галереи */}
        <GalleryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Результаты поиска */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            Найдено работ: <span className="font-semibold text-pink-600">{displayPortfolio.length}</span>
            {selectedCategory !== 'all' && (
              <span className="ml-2 text-sm text-gray-500">
                в категории "{categories.find(c => c.id === selectedCategory)?.name}"
              </span>
            )}
          </p>
        </div>

        {/* Галерея работ */}
        <div className="animate-slide-up animation-delay-200">
          <GalleryGrid items={displayPortfolio} columns={3} />
        </div>

        {displayPortfolio.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery || selectedCategory !== 'all'
                  ? 'По вашему запросу ничего не найдено'
                  : 'Работы пока не добавлены'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Попробуйте изменить фильтры или поисковый запрос'
                  : 'Скоро здесь появятся новые фотографии'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="border-pink-500 text-pink-600 hover:bg-pink-50"
                >
                  Сбросить фильтры
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
