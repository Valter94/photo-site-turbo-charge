
import React from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import PortfolioImageCard from './PortfolioImageCard';
import PortfolioUploadCard from './PortfolioUploadCard';

const PortfolioImageManager = () => {
  const { data: portfolio } = usePortfolio();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление портфолио</h2>
      
      {/* Карточка для добавления новых фотографий */}
      <PortfolioUploadCard />
      
      {/* Существующие фотографии */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio?.map((item) => (
          <PortfolioImageCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PortfolioImageManager;
