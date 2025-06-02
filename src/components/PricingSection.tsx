
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePricing } from '@/hooks/usePricing';
import { useAdditionalServices } from '@/hooks/useAdditionalServices';

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();
  const { data: additionalServices } = useAdditionalServices();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getServiceName = (serviceType: string) => {
    const names = {
      wedding_preparations: 'Утренние сборы',
      wedding_ceremony: 'Церемония и банкет',
      wedding_full_day: 'Полный свадебный день',
      lovestory: 'Love Story',
      portrait: 'Портретная съемка',
      family: 'Семейная фотосессия'
    };
    return names[serviceType as keyof typeof names] || serviceType;
  };

  const getServiceFeatures = (features: any) => {
    if (typeof features === 'string') {
      try {
        return JSON.parse(features);
      } catch {
        return [];
      }
    }
    return Array.isArray(features) ? features : [];
  };

  const popularService = pricing?.find(p => p.service_type === 'wedding_ceremony');

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Тарифы и цены</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите подходящий пакет для вашей фотосессии
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricing?.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-xl transition-all duration-300 ${
                plan.service_type === 'wedding_ceremony' ? 'ring-2 ring-rose-400 scale-105' : ''
              }`}
            >
              {plan.service_type === 'wedding_ceremony' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-rose-400 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Популярный
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">
                  {getServiceName(plan.service_type)}
                </CardTitle>
                <div className="text-4xl font-bold text-rose-400 mb-2">
                  {plan.price?.toLocaleString()} ₽
                </div>
                <p className="text-gray-600">{plan.duration_hours} часов съемки</p>
                <p className="text-sm text-gray-500">{plan.photos_count}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {getServiceFeatures(plan.features).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.service_type === 'wedding_ceremony' 
                      ? 'bg-rose-400 hover:bg-rose-500' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Выбрать пакет
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Дополнительные услуги */}
        {additionalServices && additionalServices.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">Дополнительные услуги</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-lg">{service.name}</h4>
                      <span className="text-xl font-bold text-rose-400">
                        {service.price?.toLocaleString()} ₽
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Добавить к заказу
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <h3 className="text-2xl font-bold mb-4">Нужна консультация?</h3>
            <p className="text-gray-600 mb-6">
              Поможем выбрать подходящий пакет и ответим на все вопросы
            </p>
            <Button size="lg" className="bg-rose-400 hover:bg-rose-500">
              Получить консультацию
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
