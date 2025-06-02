
import React from 'react';
import { Check, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePricing } from '@/hooks/usePricing';

const PricingSection = () => {
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

  const serviceTypes = {
    wedding: {
      name: 'Свадебная съемка',
      plans: [
        {
          name: 'Сборы',
          price: 20000,
          duration: '2-3 часа',
          photos: '50-80 фото',
          features: ['Съемка утренних сборов', 'Детали и атмосфера', 'Базовая ретушь', 'Онлайн-галерея']
        },
        {
          name: 'Сборы + Торжество',
          price: 45000,
          duration: '6-8 часов',
          photos: '150-250 фото',
          features: ['Утренние сборы', 'Церемония', 'Банкет до полуночи', 'Профессиональная ретушь', 'Онлайн-галерея']
        },
        {
          name: 'Полный день',
          price: 70000,
          duration: 'Весь день',
          photos: '300-500 фото',
          isPopular: true,
          gift: 'Визажист в подарок',
          features: ['Утренние сборы', 'Церемония', 'Банкет без ограничений', 'Художественная ретушь', 'Печатные фото 20 шт', 'Онлайн-галерея', 'Слайд-шоу']
        }
      ]
    },
    lovestory: {
      name: 'Love Story',
      plans: [
        {
          name: 'Базовый',
          price: 8000,
          duration: '1 час',
          photos: '20-30 фото',
          features: ['1 локация', 'Помощь в позировании', 'Базовая ретушь', 'Онлайн-галерея']
        },
        {
          name: 'Стандарт',
          price: 15000,
          duration: '2 часа',
          photos: '50-70 фото',
          features: ['2 локации', 'Смена образов', 'Профессиональная ретушь', 'Онлайн-галерея', 'Консультация стилиста']
        },
        {
          name: 'Премиум',
          price: 25000,
          duration: '3 часа',
          photos: '80-120 фото',
          isPopular: true,
          gift: 'Печатная фотокнига в подарок',
          features: ['3 локации', 'Неограниченная смена образов', 'Художественная ретушь', 'Печатные фото 10 шт', 'Фотокнига 20x30', 'Онлайн-галерея']
        }
      ]
    },
    portrait: {
      name: 'Портретная съемка',
      plans: [
        {
          name: 'Базовый',
          price: 5000,
          duration: '30 минут',
          photos: '10-15 фото',
          features: ['Студия или улица', 'Базовая ретушь', 'Онлайн-галерея']
        },
        {
          name: 'Стандарт',
          price: 10000,
          duration: '1 час',
          photos: '25-40 фото',
          features: ['Выбор локации', 'Смена образа', 'Профессиональная ретушь', 'Онлайн-галерея', 'Консультация по образу']
        },
        {
          name: 'Премиум',
          price: 18000,
          duration: '1.5 часа',
          photos: '50-80 фото',
          isPopular: true,
          gift: 'Профессиональный макияж в подарок',
          features: ['Студия + улица', 'Множественная смена образов', 'Художественная ретушь', 'Печатные фото 5 шт', 'Онлайн-галерея', 'Персональная консультация']
        }
      ]
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Тарифы и пакеты</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите подходящий план для вашего типа съемки
          </p>
        </div>

        <Tabs defaultValue="wedding" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wedding">Свадьба</TabsTrigger>
            <TabsTrigger value="lovestory">Love Story</TabsTrigger>
            <TabsTrigger value="portrait">Портрет</TabsTrigger>
          </TabsList>

          {Object.entries(serviceTypes).map(([serviceType, service]) => (
            <TabsContent key={serviceType} value={serviceType} className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {service.plans.map((plan, index) => (
                  <Card 
                    key={index} 
                    className={`relative hover:shadow-2xl transition-all duration-300 ${
                      plan.isPopular ? 'ring-2 ring-rose-400 scale-105' : ''
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-rose-400 text-white px-4 py-2">
                          Популярный
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      
                      <div className="pt-4">
                        <div className="text-3xl font-bold text-rose-400">
                          {plan.price.toLocaleString()} ₽
                        </div>
                        <p className="text-sm text-gray-500">{plan.duration}</p>
                        <p className="text-sm text-gray-600 mt-1">{plan.photos}</p>
                      </div>

                      {plan.gift && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                          <div className="flex items-center justify-center space-x-2 text-yellow-700">
                            <Gift className="h-5 w-5" />
                            <span className="font-semibold text-sm">{plan.gift}</span>
                          </div>
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button className={`w-full py-3 rounded-xl transition-all duration-300 ${
                        plan.isPopular
                          ? 'bg-rose-400 text-white hover:bg-rose-500'
                          : 'border-2 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white'
                      }`}>
                        Выбрать план
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Индивидуальные условия</h3>
          <p className="text-gray-600 mb-6">
            Для особых мероприятий и уникальных проектов мы готовы предложить персональные условия
          </p>
          <button className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-colors">
            Получить персональное предложение
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
