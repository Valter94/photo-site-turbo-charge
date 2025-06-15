import React, { useState, useMemo } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePortfolio } from '@/hooks/usePortfolio';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import GalleryFilters from '@/components/gallery/GalleryFilters';
import GalleryResults from '@/components/gallery/GalleryResults';
import GalleryGridSection from '@/components/gallery/GalleryGridSection';
import { ALL_SERVICE_TYPES } from '@/lib/serviceTypes';

// Определения категорий для фильтров
const categories = [
  { id: 'all', name: 'Все работы' },
  ...ALL_SERVICE_TYPES.map(t => ({ id: t.value, name: t.label })),
];

const Gallery = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredAndSortedPortfolio = useMemo(() => {
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <GalleryHeader isLoading />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryHeader />
          <GalleryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <GalleryResults
            count={filteredAndSortedPortfolio.length}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <GalleryGridSection
            items={filteredAndSortedPortfolio}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
