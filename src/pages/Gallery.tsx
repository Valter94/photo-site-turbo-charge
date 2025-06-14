import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import GalleryGrid from '../components/GalleryGrid';

const Gallery = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { id: 'all', name: 'Все работы' },
    { id: 'wedding', name: 'Свадьбы' },
    { id: 'lovestory', name: 'Love Story' },
    { id: 'portrait', name: 'Портреты' },
    { id: 'family', name: 'Семейные' },
    { id: 'corporate', name: 'Корпоративные' }
  ];

  // Фильтрация и сортировка
  const filteredAndSortedPortfolio = React.useMemo(() => {
    if (!portfolio) return [];

    let filtered = portfolio;

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Поиск
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Галерея работ</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Просмотрите все наши работы в различных категориях фотосъемки
            </p>
          </div>

          {/* Фильтры и поиск */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Поиск */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Поиск по названию, описанию, локации..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Категории */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Сортировка */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Сначала новые</SelectItem>
                  <SelectItem value="oldest">Сначала старые</SelectItem>
                  <SelectItem value="title">По названию</SelectItem>
                  <SelectItem value="featured">Рекомендуемые</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Активные фильтры */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="h-8"
                >
                  {categories.find(c => c.id === selectedCategory)?.name} ✕
                </Button>
              )}
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="h-8"
                >
                  "{searchQuery}" ✕
                </Button>
              )}
            </div>
          </div>

          {/* Результаты */}
          <div className="mb-6">
            <p className="text-gray-600">
              Найдено работ: {filteredAndSortedPortfolio.length}
            </p>
          </div>

          {/* Галерея */}
          {filteredAndSortedPortfolio.length > 0 ? (
            <GalleryGrid items={filteredAndSortedPortfolio} columns={3} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {searchQuery || selectedCategory !== 'all'
                  ? 'По вашему запросу ничего не найдено'
                  : 'Работы пока не добавлены'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
