
import React, { useState } from 'react';
import { Clock, Camera, MapPin, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePricing } from '@/hooks/usePricing';

const PricingSection = () => {
  const [selectedDuration, setSelectedDuration] = useState('1');
  const { data: pricingData, isLoading } = usePricing();

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 bg-white">
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

  // Группируем данные по типам услуг
  const serviceTypes = pricingData?.reduce((acc, item) => {
    if (!acc[item.service_type]) {
      acc[item.service_type] = [];
    }
    acc[item.service_type].push(item);
    return acc;
  }, {} as Record<string, typeof pricingData>);

  // Создаем почасовые тарифы из данных
  const hourlyRates = pricingData?.reduce((acc, item) => {
    acc[item.duration_hours.toString()] = {
      price: item.price,
      photos: item.photos_count || '20-30',
      locations: item.locations_count || '1'
    };
    return acc;
  }, {} as Record<string, { price: number; photos: string; locations: string }>);

  const additionalServices = [
    { name: 'Дополнительная обработка фото', price: 200, unit: 'за фото' },
    { name: 'Экспресс-обработка (1 день)', price: 5000, unit: 'за съемку' },
    { name: 'Печать фотокниги', price: 3000, unit: 'от' },
    { name: 'Видеосъемка', price: 15000, unit: 'за час' },
    { name: 'Второй фотограф', price: 10000, unit: 'за съемку' },
    { name: 'Аренда реквизита', price: 2000, unit: 'за комплект' }
  ];

  const getServiceName = (serviceType: string) => {
    const names = {
      wedding: 'Свадебная съемка',
      lovestory: 'Love Story',
      portrait: 'Портретная съемка',
      corporate: 'Корпоративная съемка'
    };
    return names[serviceType as keyof typeof names] || serviceType;
  };

  const getServiceDescription = (serviceType: string) => {
    const descriptions = {
      wedding: 'Полное сопровождение свадебного дня',
      lovestory: 'Романтическая фотосессия для пар',
      portrait: 'Индивидуальная или семейная съемка',
      corporate: 'Деловые портреты и мероприятия'
    };
    return descriptions[serviceType as keyof typeof descriptions] || '';
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Цены и пакеты</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Прозрачное ценообразование для всех видов фотосъемки
          </p>
        </div>

        <Tabs defaultValue="services" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Виды съемки</TabsTrigger>
            <TabsTrigger value="hourly">Почасовая оплата</TabsTrigger>
            <TabsTrigger value="additional">Доп. услуги</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {Object.entries(serviceTypes || {}).map(([serviceType, services]) => {
                const mainService = services[0];
                const features = Array.isArray(mainService.features) ? mainService.features : [];
                const isPopular = serviceType === 'wedding';
                
                return (
                  <Card 
                    key={serviceType} 
                    className={`relative hover:shadow-2xl transition-all duration-300 ${
                      isPopular ? 'ring-2 ring-rose-400' : ''
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-rose-400 text-white px-4 py-2">
                          Популярно
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl font-bold">{getServiceName(serviceType)}</CardTitle>
                      <p className="text-gray-600">{getServiceDescription(serviceType)}</p>
                      
                      <div className="pt-4">
                        <div className="text-3xl font-bold text-rose-400">
                          {mainService.price.toLocaleString()} ₽
                        </div>
                        <p className="text-sm text-gray-500">{mainService.duration_hours} часа</p>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button className={`w-full py-3 rounded-xl transition-all duration-300 ${
                        isPopular
                          ? 'bg-rose-400 text-white hover:bg-rose-500'
                          : 'border-2 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white'
                      }`}>
                        Выбрать пакет
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="hourly" className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Калькулятор стоимости по часам</h3>
              
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {Object.entries(hourlyRates || {}).map(([hours, data]) => (
                    <button
                      key={hours}
                      onClick={() => setSelectedDuration(hours)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedDuration === hours
                          ? 'border-rose-400 bg-rose-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{hours}ч</div>
                      <div className="text-sm text-gray-600">
                        {data.price.toLocaleString()} ₽
                      </div>
                    </button>
                  ))}
                </div>

                {hourlyRates && hourlyRates[selectedDuration] && (
                  <Card className="bg-white">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                          <Clock className="h-8 w-8 text-rose-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{selectedDuration} часа</div>
                          <div className="text-gray-600">Продолжительность</div>
                        </div>
                        
                        <div>
                          <Camera className="h-8 w-8 text-rose-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {hourlyRates[selectedDuration].photos}
                          </div>
                          <div className="text-gray-600">Обработанных фото</div>
                        </div>
                        
                        <div>
                          <MapPin className="h-8 w-8 text-rose-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {hourlyRates[selectedDuration].locations}
                          </div>
                          <div className="text-gray-600">Локации</div>
                        </div>
                      </div>
                      
                      <div className="mt-8 p-6 bg-rose-50 rounded-xl text-center">
                        <div className="text-3xl font-bold text-rose-600 mb-2">
                          {hourlyRates[selectedDuration].price.toLocaleString()} ₽
                        </div>
                        <div className="text-gray-600 mb-4">Общая стоимость съемки</div>
                        <button className="bg-rose-400 text-white px-8 py-3 rounded-lg hover:bg-rose-500 transition-colors">
                          Забронировать {selectedDuration}ч съемку
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{service.name}</h3>
                    <div className="text-2xl font-bold text-rose-400 mb-2">
                      {service.price.toLocaleString()} ₽
                    </div>
                    <div className="text-sm text-gray-500">{service.unit}</div>
                    
                    <button className="w-full mt-4 py-2 border border-rose-400 text-rose-400 rounded-lg hover:bg-rose-400 hover:text-white transition-colors">
                      Добавить к заказу
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Нужна индивидуальная оценка?</h3>
              <p className="text-gray-600 mb-6">
                Для масштабных проектов и особых мероприятий мы готовы предложить персональные условия
              </p>
              <button className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors">
                Получить персональное предложение
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PricingSection;
