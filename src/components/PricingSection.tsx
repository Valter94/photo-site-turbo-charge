
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePricing } from '@/hooks/usePricing';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getServiceTypeName = (serviceType: string) => {
    const serviceTypes = {
      'wedding_preparations': 'Утренние сборы',
      'wedding_ceremony': 'Церемония и банкет',
      'wedding_full_day': 'Полный свадебный день',
      'lovestory': 'Love Story',
      'portrait': 'Портретная съемка',
      'family': 'Семейная фотосессия',
      'maternity': 'Съемка беременности',
      'newborn': 'Съемка новорожденного'
    };
    return serviceTypes[serviceType] || serviceType;
  };

  const getServiceCategory = (serviceType: string) => {
    if (serviceType.startsWith('wedding')) return 'Свадебная съемка';
    if (['portrait', 'family', 'maternity', 'newborn'].includes(serviceType)) return 'Портретная съемка';
    if (serviceType === 'lovestory') return 'Love Story';
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

  // Группируем услуги по категориям
  const groupedServices = pricing?.reduce((acc, service) => {
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Цены и пакеты</h2>
          <p className="text-xl text-gray-600">Выберите подходящий пакет для вашей фотосессии</p>
        </div>

        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
                  {service.service_type === 'wedding_full_day' && (
                    <Badge className="absolute -top-2 left-4 bg-pink-600">
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
                      {service.duration_hours} {service.duration_hours === 1 ? 'час' : 'часа'}
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
                      Забронировать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
