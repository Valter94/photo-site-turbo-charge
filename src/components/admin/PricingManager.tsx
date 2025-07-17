
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, DollarSign } from 'lucide-react';
import { usePricing } from '@/hooks/usePricing';
import { useAdditionalServices } from '@/hooks/useAdditionalServices';
import { usePricingActions } from '@/hooks/usePricingActions';
import PricingItemCard from './PricingItemCard';
import AdditionalServiceCard from './AdditionalServiceCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

const PricingManager = () => {
  const { data: pricing, isLoading: pricingLoading, error: pricingError } = usePricing();
  const { data: additionalServices, isLoading: servicesLoading, error: servicesError } = useAdditionalServices();
  const { addNewPricing, addNewService } = usePricingActions();

  const serviceTypes = [
    { value: 'wedding', label: 'Свадебная съемка' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'portrait', label: 'Портретная съемка' },
    { value: 'family', label: 'Семейная фотосессия' },
    { value: 'corporate', label: 'Корпоративная съемка' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTotalRevenue = () => {
    if (!pricing) return 0;
    return pricing.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="space-y-8">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-600">Всего тарифов</p>
              <p className="text-2xl font-bold text-blue-800">{pricing?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-600">Средняя цена</p>
              <p className="text-2xl font-bold text-green-800">
                {pricing?.length ? formatPrice(getTotalRevenue() / pricing.length) : '0 ₽'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Plus className="h-5 w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-purple-600">Доп. услуги</p>
              <p className="text-2xl font-bold text-purple-800">{additionalServices?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Основные тарифы */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Основные тарифы</h3>
          <Button onClick={addNewPricing} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Добавить тариф
          </Button>
        </div>
        
        {pricingError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Ошибка загрузки тарифов: {pricingError.message}
            </AlertDescription>
          </Alert>
        )}
        
        {pricingLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Загрузка тарифов...</span>
          </div>
        ) : pricing && pricing.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricing.map((item) => (
              <PricingItemCard 
                key={item.id} 
                item={item} 
                serviceTypes={serviceTypes}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Пока нет тарифов</p>
            <p className="text-sm mt-1">Добавьте первый тариф</p>
          </div>
        )}
      </div>

      {/* Дополнительные услуги */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Дополнительные услуги</h3>
          <Button onClick={addNewService} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Добавить услугу
          </Button>
        </div>
        
        {servicesError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Ошибка загрузки услуг: {servicesError.message}
            </AlertDescription>
          </Alert>
        )}
        
        {servicesLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Загрузка услуг...</span>
          </div>
        ) : additionalServices && additionalServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service) => (
              <AdditionalServiceCard 
                key={service.id} 
                service={service}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Пока нет дополнительных услуг</p>
            <p className="text-sm mt-1">Добавьте первую услугу</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingManager;
