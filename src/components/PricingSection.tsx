import React from 'react';
import { usePricing } from '@/hooks/usePricing';
import PricingCard from './PricingCard';
import { Button } from '@/components/ui/button';

const serviceNamesRu: Record<string, string> = {
  portrait: 'Портретная съёмка',
  family: 'Семейная съёмка',
  lovestory: 'Love Story',
  wedding: 'Свадебная съёмка',
  corporate: 'Корпоративная съёмка'
};

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();

  const defaultPricing = [
    {
      id: '1',
      service_type: 'portrait',
      price: 8000,
      duration_hours: 1,
      photos_count: '30-40',
      locations_count: '1',
      features: [
        'Индивидуальная портретная съемка',
        'Профессиональная обработка',
        'Готовые фото в течение 3 дней',
        'Онлайн-галерея для скачивания'
      ],
      is_active: true
    },
    {
      id: '2',
      service_type: 'family',
      price: 12000,
      duration_hours: 2,
      photos_count: '50-70',
      locations_count: '1-2',
      features: [
        'Семейная фотосессия',
        'Работа с детьми любого возраста',
        'Естественные эмоции и улыбки',
        'Быстрая обработка фотографий'
      ],
      is_active: true,
      popular: true
    },
    {
      id: '3',
      service_type: 'lovestory',
      price: 15000,
      duration_hours: 2,
      photos_count: '80-100',
      locations_count: '2-3',
      features: [
        'Романтическая съемка для пары',
        'Несколько локаций на выбор',
        'Создание истории любви в кадрах',
        'Индивидуальный подход к каждой паре'
      ],
      is_active: true
    },
    {
      id: '4',
      service_type: 'wedding',
      price: 35000,
      duration_hours: 8,
      photos_count: '200+',
      locations_count: 'без ограничений',
      features: [
        'Полный день свадебной съемки',
        'Репортажная и постановочная съемка',
        'Съемка церемонии и банкета',
        'Экспресс-обработка лучших кадров'
      ],
      is_active: true,
      premium: true
    }
  ];

  const displayPricing = pricing && pricing.length > 0 
    ? pricing.filter(p => p.is_active) 
    : defaultPricing;

  const scrollToBooking = () => {
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Загрузка цен...</h2>
          </div>
        </div>
      </section>
    );
  }

  // Проводим диагностику: если пришли нереализованные типы сервисов — уведомим в консоль
  displayPricing.forEach(plan => {
    if (!serviceNamesRu[plan.service_type]) {
      console.warn('Неизвестный service_type в ценах:', plan.service_type);
    }
  });

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Цены на фотосессии</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите подходящий пакет для вашей фотосессии. Все цены указаны с учетом профессиональной обработки
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPricing.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              russianName={serviceNamesRu[plan.service_type] || plan.service_type}
              scrollToBooking={scrollToBooking}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Нужен индивидуальный пакет? Свяжитесь со мной для обсуждения деталей
          </p>
          <Button 
            variant="outline" 
            onClick={scrollToBooking}
            className="border-pink-500 text-pink-600 hover:bg-pink-50"
          >
            Индивидуальная консультация
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
