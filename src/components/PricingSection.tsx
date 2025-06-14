
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePricing } from '@/hooks/usePricing';
import { useAdditionalServices } from '@/hooks/useAdditionalServices';
import { Check, Star } from 'lucide-react';

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();
  const { data: additionalServices } = useAdditionalServices();

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getServiceTypeName = (serviceType: string) => {
    const serviceTypes = {
      'wedding_preparations': 'Утренние сборы невесты',
      'wedding_ceremony': 'Церемония и банкет',
      'wedding_full_day': 'Полный свадебный день',
      'lovestory': 'Love Story съемка',
      'portrait': 'Портретная съемка',
      'family': 'Семейная фотосессия',
      'maternity': 'Съемка беременности',
      'corporate': 'Корпоративная съемка'
    };
    return serviceTypes[serviceType] || serviceType;
  };

  const getServiceCategory = (serviceType: string) => {
    if (serviceType.startsWith('wedding')) return 'Свадебная съемка';
    if (['portrait', 'family', 'maternity'].includes(serviceType)) return 'Портретная съемка';
    if (serviceType === 'lovestory') return 'Love Story';
    if (serviceType === 'corporate') return 'Корпоративная съемка';
    return 'Другие услуги';
  };

  // Функция для безопасного преобразования features из JSON
  const getFeaturesArray = (features: any): string[] => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Загрузка...</h2>
          </div>
        </div>
      </section>
    );
  }

  // Группируем услуги по категориям, исключая съемку новорожденных
  const filteredPricing = pricing?.filter(service => service.service_type !== 'newborn') || [];
  const groupedServices = filteredPricing.reduce((acc, service) => {
    const category = getServiceCategory(service.service_type);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof pricing>) || {};

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Цены и пакеты услуг</h2>
          <p className="text-xl text-gray-600 mb-4">
            Профессиональная фотосъемка с опытом 5+ лет
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Каждая съемка - это уникальная история, которую я помогу рассказать через объектив. 
            Выберите идеальный пакет для ваших самых важных моментов жизни.
          </p>
        </div>

        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
                  {service.service_type === 'wedding_full_day' && (
                    <Badge className="absolute -top-2 left-4 bg-pink-600">
                      <Star className="w-3 h-3 mr-1" />
                      Популярный
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {getServiceTypeName(service.service_type)}
                    </CardTitle>
                    <div className="text-3xl font-bold text-pink-600">
                      {service.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <p className="text-gray-600">
                      {service.duration_hours} {service.duration_hours === 1 ? 'час' : service.duration_hours < 5 ? 'часа' : 'часов'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{service.photos_count}</p>
                    </div>
                    <ul className="space-y-2">
                      {getFeaturesArray(service.features).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      onClick={scrollToBooking}
                    >
                      Забронировать съемку
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Дополнительные услуги */}
        {additionalServices && additionalServices.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Дополнительные услуги</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service) => (
                <Card key={service.id} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="text-lg font-bold text-pink-600">
                      {service.price ? `${service.price.toLocaleString('ru-RU')} ₽` : 'По договоренности'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Почему выбирают меня?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">5+</div>
              <p className="text-gray-600">лет опыта в фотографии</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
              <p className="text-gray-600">счастливых клиентов</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">48ч</div>
              <p className="text-gray-600">быстрая обработка фото</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
