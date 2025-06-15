
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Camera, Heart, Users, Star, Crown, Sparkles } from 'lucide-react';
import { usePricing } from '@/hooks/usePricing';

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

  const serviceIcons = {
    portrait: Camera,
    family: Users,
    lovestory: Heart,
    wedding: Crown
  };

  const serviceNames = {
    portrait: 'Портретная съемка',
    family: 'Семейная съемка',
    lovestory: 'Love Story',
    wedding: 'Свадебная съемка'
  };

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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Загрузка...</h2>
          </div>
        </div>
      </section>
    );
  }

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
          {displayPricing.map((plan) => {
            const IconComponent = serviceIcons[plan.service_type as keyof typeof serviceIcons] || Camera;
            const serviceName = serviceNames[plan.service_type as keyof typeof serviceNames] || plan.service_type;

            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-pink-500 shadow-xl' : 'hover:shadow-lg'
                } ${plan.premium ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm font-semibold">
                    <Star className="inline w-4 h-4 mr-1" />
                    Популярный выбор
                  </div>
                )}
                
                {plan.premium && (
                  <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
                    <Sparkles className="inline w-4 h-4 mr-1" />
                    Премиум пакет
                  </div>
                )}

                <CardContent className={`p-4 ${plan.popular || plan.premium ? 'pt-12' : 'pt-6'}`}>
                  <div className="text-center mb-4">
                    <div className={`inline-flex p-3 rounded-full mb-3 ${
                      plan.premium ? 'bg-purple-100' : 'bg-pink-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        plan.premium ? 'text-purple-600' : 'text-pink-600'
                      }`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{serviceName}</h3>
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {plan.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex justify-center gap-2 text-xs text-gray-600 mb-3">
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {plan.duration_hours}ч
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {plan.photos_count} фото
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {(plan.features as string[]).map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={scrollToBooking}
                    className={`w-full transition-all duration-300 text-sm py-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg'
                        : plan.premium
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                        : 'bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    Забронировать
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
