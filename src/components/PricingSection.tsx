import React from 'react';
import { usePricing } from '@/hooks/usePricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Heart, Users, Camera, Sparkles } from 'lucide-react';

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();

  const pricingPlans = [
    // ПОРТРЕТНАЯ СЪЕМКА
    {
      id: 'portrait-basic',
      category: 'Портретная съемка',
      title: 'Персональный портрет',
      price: 8000,
      duration: '1.5 часа',
      photos: '25-35 фото',
      icon: Camera,
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Индивидуальная портретная съемка',
        'Профессиональная цветокоррекция',
        'Готовые фото в течение 5 дней',
        'Онлайн-галерея для скачивания',
        'Помощь в выборе образа'
      ]
    },
    {
      id: 'portrait-premium',
      category: 'Портретная съемка',
      title: 'Портрет + Макияж',
      price: 15000,
      duration: '2.5 часа',
      photos: '50-70 фото',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
      popular: true,
      features: [
        'Портретная съемка с визажистом',
        'Профессиональный макияж включён',
        'Смена 2-3 образов',
        'Студийная или уличная съемка',
        'Экспресс-обработка за 3 дня'
      ]
    },

    // СЕМЕЙНАЯ СЪЕМКА
    {
      id: 'family-basic',
      category: 'Семейная съемка',
      title: 'Семейная фотосессия',
      price: 12000,
      duration: '2 часа',
      photos: '60-80 фото',
      icon: Users,
      color: 'from-green-500 to-teal-600',
      features: [
        'Семейная фотосессия до 4 человек',
        'Работа с детьми любого возраста',
        'Естественные эмоции и улыбки',
        'Смена 1-2 локаций',
        'Готовые фото через 7 дней'
      ]
    },
    {
      id: 'family-extended',
      category: 'Семейная съемка',
      title: 'Большая семья',
      price: 18000,
      duration: '3 часа',
      photos: '80-120 фото',
      icon: Users,
      color: 'from-emerald-500 to-green-600',
      features: [
        'Семейная съемка от 5 человек',
        'Несколько поколений в кадре',
        'Групповые и индивидуальные портреты',
        'Парковая или студийная съемка',
        'Индивидуальный подход к каждому'
      ]
    },

    // LOVE STORY
    {
      id: 'lovestory-basic',
      category: 'Love Story',
      title: 'Love Story',
      price: 15000,
      duration: '2 часа',
      photos: '70-100 фото',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      popular: true,
      features: [
        'Романтическая съемка для пары',
        'До 3 локаций на выбор',
        'Создание истории любви в кадрах',
        'Помощь в позировании',
        'Стилистические рекомендации'
      ]
    },
    {
      id: 'lovestory-premium',
      category: 'Love Story',
      title: 'Love Story Премиум',
      price: 22000,
      duration: '3 часа',
      photos: '120-150 фото',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      features: [
        'Расширенная Love Story съемка',
        'Смена 3-4 образов',
        'Необычные локации Москвы',
        'Реквизит и декор включены',
        'Экспресс-обработка за 3 дня'
      ]
    },

    // СВАДЕБНЫЕ ПАКЕТЫ
    {
      id: 'wedding-prep',
      category: 'Свадебная съемка',
      title: 'Утренние сборы',
      price: 20000,
      duration: '4 часа',
      photos: '100-150 фото',
      icon: Camera,
      color: 'from-amber-500 to-orange-600',
      features: [
        'Съемка утренних сборов невесты',
        'Детали и эмоции подготовки',
        'Работа с близкими и друзьями',
        'Естественный репортаж',
        'Готовые фото через 10 дней'
      ]
    },
    {
      id: 'wedding-ceremony',
      category: 'Свадебная съемка',
      title: 'Свадебная церемония',
      price: 35000,
      duration: '6 часов',
      photos: '200-300 фото',
      icon: Crown,
      color: 'from-yellow-500 to-amber-600',
      features: [
        'Съемка свадебной церемонии',
        'ЗАГС или выездная регистрация',
        'Репортажная и постановочная съемка',
        'Работа с гостями',
        'Ключевые моменты дня'
      ]
    },
    {
      id: 'wedding-full',
      category: 'Свадебная съемка',
      title: 'Полный свадебный день',
      price: 65000,
      duration: '12 часов',
      photos: '400-600 фото',
      icon: Crown,
      color: 'from-purple-600 to-pink-600',
      premium: true,
      gift: 'Визажист в подарок!',
      features: [
        'Полное сопровождение свадебного дня',
        'От сборов до банкета',
        'Репортажная съемка всех событий',
        'Постановочные кадры пары',
        'Второй фотограф в команде',
        'Экспресс-обработка 50 фото в день свадьбы',
        '🎁 Профессиональный визажист БЕСПЛАТНО'
      ]
    }
  ];

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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

  // Группировка по категориям
  const groupedPlans = pricingPlans.reduce((acc, plan) => {
    if (!acc[plan.category]) {
      acc[plan.category] = [];
    }
    acc[plan.category].push(plan);
    return acc;
  }, {} as Record<string, typeof pricingPlans>);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
            💎 Прайс-лист на фотосессии
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Прозрачные цены на все виды съемок. Качество и профессионализм по честной стоимости
          </p>
        </div>

        {Object.entries(groupedPlans).map(([category, plans]) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
              {category}
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <Card 
                    key={plan.id}
                    className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                      plan.popular ? 'ring-2 ring-pink-500 ring-opacity-50' : ''
                    } ${plan.premium ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                        ПОПУЛЯРНЫЙ
                      </div>
                    )}
                    {plan.premium && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                        ПРЕМИУМ
                      </div>
                    )}
                    
                    <CardHeader className="text-center relative">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${plan.color} mb-4 mx-auto`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                        {plan.title}
                      </CardTitle>
                      
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {plan.price.toLocaleString('ru-RU')} ₽
                      </div>
                      
                      <div className="flex justify-center gap-4 text-sm text-gray-600">
                        <span>🕐 {plan.duration}</span>
                        <span>📸 {plan.photos}</span>
                      </div>

                      {plan.gift && (
                        <Badge className="mt-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                          {plan.gift}
                        </Badge>
                      )}
                    </CardHeader>
                    
                    <CardContent className="px-6 pb-6">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        onClick={scrollToBooking}
                        className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105`}
                      >
                        Забронировать
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-pink-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💬 Индивидуальный расчет
            </h3>
            <p className="text-gray-600 mb-6">
              Нужен особенный пакет? Обсудим ваши пожелания и составим персональное предложение
            </p>
            <Button 
              onClick={scrollToBooking}
              variant="outline"
              className="border-pink-500 text-pink-600 hover:bg-pink-50 px-8 py-3"
            >
              Получить консультацию
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;