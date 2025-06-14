
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePricing } from '@/hooks/usePricing';
import { useAdditionalServices } from '@/hooks/useAdditionalServices';
import { Check, Star, Sparkles, Clock, Image, Award } from 'lucide-react';

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
    if (['portrait', 'family'].includes(serviceType)) return 'Портретная съемка';
    if (serviceType === 'lovestory') return 'Love Story';
    if (serviceType === 'corporate') return 'Корпоративная съемка';
    return 'Другие услуги';
  };

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
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const filteredPricing = pricing?.filter(service => 
    service.service_type !== 'newborn' && service.service_type !== 'maternity'
  ) || [];
  const groupedServices = filteredPricing.reduce((acc, service) => {
    const category = getServiceCategory(service.service_type);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof pricing>) || {};

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6 animate-bounce">
            <Award className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
            ✨ Цены и пакеты услуг
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            💎 <strong>Профессиональная фотосъемка с опытом 5+ лет</strong>
          </p>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-500 mb-6">
              Каждая съемка - это уникальная история, которую я помогу рассказать через объектив. 
              Выберите идеальный пакет для ваших самых важных моментов жизни.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Лучшие цены в Москве
              </span>
              <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                ⚡ Быстрая обработка
              </span>
              <span className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
                🎁 Бонусы в подарок
              </span>
            </div>
          </div>
        </div>

        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category} className="mb-16 animate-slide-up animation-delay-200">
            <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-md border border-pink-100 overflow-hidden group">
                  {service.service_type === 'wedding_full_day' && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Популярный
                      </Badge>
                    </div>
                  )}
                  
                  {/* Декоративный градиент */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500"></div>
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {getServiceTypeName(service.service_type)}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        {service.price.toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-pink-500" />
                          {service.duration_hours} {service.duration_hours === 1 ? 'час' : service.duration_hours < 5 ? 'часа' : 'часов'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Image className="w-4 h-4 text-pink-500" />
                          {service.photos_count}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {getFeaturesArray(service.features).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-pink-500/25"
                      onClick={scrollToBooking}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
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
          <div className="mt-16 animate-scale-in animation-delay-400">
            <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ✨ Дополнительные услуги
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service) => (
                <Card key={service.id} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-md border border-pink-100 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 group-hover:scale-110">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      {service.price ? `${service.price.toLocaleString('ru-RU')} ₽` : 'По договоренности'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Преимущества */}
        <div className="mt-16 animate-fade-in animation-delay-600">
          <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-center mb-8">
                🌟 Почему выбирают меня?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="transform transition-transform duration-300 hover:scale-105">
                  <div className="text-4xl font-bold mb-2">5+</div>
                  <p className="text-pink-100">лет опыта в фотографии</p>
                </div>
                <div className="transform transition-transform duration-300 hover:scale-105">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <p className="text-pink-100">счастливых клиентов</p>
                </div>
                <div className="transform transition-transform duration-300 hover:scale-105">
                  <div className="text-4xl font-bold mb-2">48ч</div>
                  <p className="text-pink-100">быстрая обработка фото</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
