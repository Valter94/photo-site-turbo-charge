
import React from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import PortfolioImageCard from './PortfolioImageCard';
import PortfolioUploadCard from './PortfolioUploadCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

const PortfolioImageManager = () => {
  const { data: portfolio, isLoading, error } = usePortfolio();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Загрузка портфолио...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Ошибка загрузки портфолио: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление портфолио</h2>
        <div className="text-sm text-gray-500">
          Всего фото: {portfolio?.length || 0}
        </div>
      </div>
      
      {/* Карточка для добавления новых фотографий */}
      <PortfolioUploadCard />
      
      {/* Существующие фотографии */}
      {portfolio && portfolio.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <PortfolioImageCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Пока нет фотографий в портфолио</p>
          <p className="text-sm mt-1">Добавьте первую фотографию, используя форму выше</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioImageManager;
