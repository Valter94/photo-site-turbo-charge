
import React, { useState } from 'react';
import { Clock, Camera, MapPin, Star, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PricingSection = () => {
  const [selectedDuration, setSelectedDuration] = useState('1');

  const hourlyRates = {
    '1': { price: 8000, photos: '20-30', locations: 1 },
    '2': { price: 15000, photos: '50-70', locations: 2 },
    '3': { price: 22000, photos: '80-120', locations: 3 },
    '4': { price: 28000, photos: '100-150', locations: 3 },
    '6': { price: 40000, photos: '150-250', locations: 'без ограничений' },
    '8': { price: 55000, photos: '200-350', locations: 'без ограничений' }
  };

  const serviceTypes = [
    {
      id: 'wedding',
      name: 'Свадебная съемка',
      description: 'Полное сопровождение свадебного дня',
      basePrice: 30000,
      maxPrice: 100000,
      duration: '6-12 часов',
      includes: [
        'Репортажная съемка церемонии',
        'Постановочные кадры',
        'Съемка банкета',
        'Онлайн-галерея',
        'Профессиональная обработка',
        'Консультация по сценарию'
      ],
      popular: true
    },
    {
      id: 'lovestory',
      name: 'Love Story',
      description: 'Романтическая фотосессия для пар',
      basePrice: 10000,
      maxPrice: 25000,
      duration: '1-3 часа',
      includes: [
        'Романтические локации',
        'Помощь в позировании',
        'Быстрая обработка (3-5 дней)',
        'Онлайн-галерея',
        'Консультация по образу'
      ]
    },
    {
      id: 'portrait',
      name: 'Портретная съемка',
      description: 'Индивидуальная или семейная съемка',
      basePrice: 8000,
      maxPrice: 15000,
      duration: '1-2 часа',
      includes: [
        'Студия или улица',
        'Консультация по образу',
        'Профессиональная ретушь',
        'Онлайн-галерея',
        'Печать лучших кадров'
      ]
    },
    {
      id: 'corporate',
      name: 'Корпоративная съемка',
      description: 'Деловые портреты и мероприятия',
      basePrice: 12000,
      maxPrice: 30000,
      duration: '2-6 часов',
      includes: [
        'Деловые портреты',
        'Съемка мероприятий',
        'Быстрая обработка',
        'Высокое разрешение',
        'Коммерческая лицензия'
      ]
    }
  ];

  const additionalServices = [
    { name: 'Дополнительная обработка фото', price: 200, unit: 'за фото' },
    { name: 'Экспресс-обработка (1 день)', price: 5000, unit: 'за съемку' },
    { name: 'Печать фотокниги', price: 3000, unit: 'от' },
    { name: 'Видеосъемка', price: 15000, unit: 'за час' },
    { name: 'Второй фотограф', price: 10000, unit: 'за съемку' },
    { name: 'Аренда реквизита', price: 2000, unit: 'за комплект' }
  ];

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
              {serviceTypes.map((service) => (
                <Card 
                  key={service.id} 
                  className={`relative hover:shadow-2xl transition-all duration-300 ${
                    service.popular ? 'ring-2 ring-rose-400' : ''
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-rose-400 text-white px-4 py-2">
                        Популярно
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                    
                    <div className="pt-4">
                      <div className="text-3xl font-bold text-rose-400">
                        {service.basePrice.toLocaleString()} ₽
                        {service.maxPrice !== service.basePrice && (
                          <span className="text-lg text-gray-500">
                            {' '}- {service.maxPrice.toLocaleString()} ₽
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {service.includes.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full py-3 rounded-xl transition-all duration-300 ${
                      service.popular
                        ? 'bg-rose-400 text-white hover:bg-rose-500'
                        : 'border-2 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white'
                    }`}>
                      Выбрать пакет
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hourly" className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Калькулятор стоимости по часам</h3>
              
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {Object.entries(hourlyRates).map(([hours, data]) => (
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
                          {hourlyRates[selectedDuration as keyof typeof hourlyRates].photos}
                        </div>
                        <div className="text-gray-600">Обработанных фото</div>
                      </div>
                      
                      <div>
                        <MapPin className="h-8 w-8 text-rose-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {hourlyRates[selectedDuration as keyof typeof hourlyRates].locations}
                        </div>
                        <div className="text-gray-600">Локации</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-rose-50 rounded-xl text-center">
                      <div className="text-3xl font-bold text-rose-600 mb-2">
                        {hourlyRates[selectedDuration as keyof typeof hourlyRates].price.toLocaleString()} ₽
                      </div>
                      <div className="text-gray-600 mb-4">Общая стоимость съемки</div>
                      <button className="bg-rose-400 text-white px-8 py-3 rounded-lg hover:bg-rose-500 transition-colors">
                        Забронировать {selectedDuration}ч съемку
                      </button>
                    </div>
                  </CardContent>
                </Card>
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
