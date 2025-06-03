
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { usePricing } from '@/hooks/usePricing';
import { useAdditionalServices } from '@/hooks/useAdditionalServices';
import { usePricingActions } from '@/hooks/usePricingActions';
import PricingItemCard from './PricingItemCard';
import AdditionalServiceCard from './AdditionalServiceCard';

const PricingManager = () => {
  const { data: pricing } = usePricing();
  const { data: additionalServices } = useAdditionalServices();
  const { addNewPricing, addNewService } = usePricingActions();

  const serviceTypes = [
    { value: 'wedding_preparations', label: 'Утренние сборы' },
    { value: 'wedding_ceremony', label: 'Церемония и банкет' },
    { value: 'wedding_full_day', label: 'Полный свадебный день' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'portrait', label: 'Портретная съемка' },
    { value: 'family', label: 'Семейная фотосессия' },
    { value: 'corporate', label: 'Корпоративная съемка' }
  ];

  return (
    <div className="space-y-8">
      {/* Основные тарифы */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Основные тарифы</h3>
          <Button onClick={addNewPricing}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить тариф
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricing?.map((item) => (
            <PricingItemCard 
              key={item.id} 
              item={item} 
              serviceTypes={serviceTypes}
            />
          ))}
        </div>
      </div>

      {/* Дополнительные услуги */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Дополнительные услуги</h3>
          <Button onClick={addNewService}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить услугу
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalServices?.map((service) => (
            <AdditionalServiceCard 
              key={service.id} 
              service={service}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingManager;
