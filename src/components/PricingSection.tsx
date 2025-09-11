import React from 'react';
import { usePricing } from '@/hooks/usePricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Heart, Users, Camera, Sparkles } from 'lucide-react';
import { serviceTypeName } from '@/lib/serviceTypes';

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();

  // Преобразуем данные из БД в планы отображения
  const typeIconMap: Record<string, any> = {
    wedding: Crown,
    wedding_preparations: Camera,
    wedding_ceremony: Crown,
    wedding_full_day: Crown,
    lovestory: Heart,
    portrait: Camera,
    family: Users,
    corporate: Users,
  };

  const typeColorMap: Record<string, string> = {
    wedding: 'from-amber-500 to-orange-600',
    wedding_preparations: 'from-amber-500 to-orange-600',
    wedding_ceremony: 'from-yellow-500 to-amber-600',
    wedding_full_day: 'from-purple-600 to-pink-600',
    lovestory: 'from-rose-500 to-pink-600',
    portrait: 'from-purple-500 to-pink-600',
    family: 'from-green-500 to-teal-600',
    corporate: 'from-blue-500 to-indigo-600',
  };

  type Plan = {
    id: string;
    category: string;
    title: string;
    price: number;
    duration: string;
    photos: string;
    icon: any;
    color: string;
    features: string[];
    popular?: boolean;
    premium?: boolean;
    gift?: string;
  };

  const plans: Plan[] = (pricing ?? []).map((p: any) => {
    const Icon = typeIconMap[p.service_type] || Camera;
    const color = typeColorMap[p.service_type] || 'from-blue-500 to-indigo-600';
    const duration = p.duration_hours ? `${p.duration_hours} ч` : '—';
    const photos = p.photos_count || '—';
    const features = Array.isArray(p.features) ? p.features : [];

    return {
      id: p.id,
      category: serviceTypeName(p.service_type),
      title: serviceTypeName(p.service_type),
      price: p.price || 0,
      duration,
      photos,
      icon: Icon,
      color,
      features,
      popular: false,
      premium: false,
    };
  });

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
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.category]) {
      acc[plan.category] = [] as Plan[];
    }
    acc[plan.category].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

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