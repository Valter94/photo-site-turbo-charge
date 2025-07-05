
import React from 'react';
import { usePricing } from '@/hooks/usePricing';
import { Button } from '@/components/ui/button';
import { serviceTypeName } from '@/lib/serviceTypes';

const defaultPricing = [
  // ПОРТРЕТНАЯ СЪЕМКА
  {
    id: '1',
    service_type: 'portrait',
    price: 12000,
    duration_hours: 1.5,
    photos_count: '40-60',
    features: [
      'Индивидуальная портретная съемка',
      'Профессиональная цветокоррекция',
      'Готовые фото в течение 5 дней',
      'Онлайн-галерея для скачивания',
      'Помощь в выборе образа',
    ],
    is_active: true,
    category: 'Портретная съемка',
  },
  {
    id: '2',
    service_type: 'portrait',
    title: 'Портрет + макияж',
    price: 18000,
    duration_hours: 2.5,
    photos_count: '60-80',
    features: [
      'Портретная съемка с визажистом',
      'Профессиональный макияж включен',
      'Смена 2-3 образов',
      'Студийная или уличная съемка',
      'Быстрая обработка за 3 дня',
    ],
    is_active: true,
    category: 'Портретная съемка',
    popular: true,
  },

  // СЕМЕЙНАЯ СЪЕМКА
  {
    id: '3',
    service_type: 'family',
    price: 15000,
    duration_hours: 2,
    photos_count: '60-90',
    features: [
      'Семейная фотосессия до 4 человек',
      'Работа с детьми любого возраста',
      'Естественные эмоции и улыбки',
      'Смена 1-2 локаций',
      'Готовые фото через 7 дней',
    ],
    is_active: true,
    category: 'Семейная съемка',
  },
  {
    id: '4',
    service_type: 'family',
    title: 'Большая семья',
    price: 20000,
    duration_hours: 3,
    photos_count: '80-120',
    features: [
      'Семейная съемка от 5 человек',
      'Несколько поколений в кадре',
      'Групповые и индивидуальные кадры',
      'Парковая или студийная съемка',
      'Индивидуальный подход к каждому',
    ],
    is_active: true,
    category: 'Семейная съемка',
  },

  // LOVE STORY
  {
    id: '5',
    service_type: 'lovestory',
    price: 18000,
    duration_hours: 2,
    photos_count: '80-120',
    features: [
      'Романтическая съемка для пары',
      'До 3 локаций на выбор',
      'Создание истории любви в кадрах',
      'Помощь в позировании',
      'Стилистические рекомендации',
    ],
    is_active: true,
    category: 'Love Story',
    popular: true,
  },
  {
    id: '6',
    service_type: 'lovestory',
    title: 'Love Story Премиум',
    price: 25000,
    duration_hours: 3,
    photos_count: '120-150',
    features: [
      'Расширенная Love Story съемка',
      'Смена 3-4 образов',
      'Необычные локации Москвы',
      'Реквизит и декор включены',
      'Экспресс-обработка за 3 дня',
    ],
    is_active: true,
    category: 'Love Story',
  },

  // СВАДЕБНАЯ СЪЕМКА
  {
    id: '7',
    service_type: 'wedding',
    title: 'Утренние сборы',
    price: 15000,
    duration_hours: 3,
    photos_count: '80-120',
    features: [
      'Съемка утренних сборов невесты',
      'Детали и эмоции подготовки',
      'Работа с близкими и друзьями',
      'Естественный репортаж',
      'Готовые фото через 10 дней',
    ],
    is_active: true,
    category: 'Свадебная съемка',
  },
  {
    id: '8',
    service_type: 'wedding',
    title: 'Церемония',
    price: 25000,
    duration_hours: 4,
    photos_count: '120-180',
    features: [
      'Съемка свадебной церемонии',
      'ЗАГС или выездная регистрация',
      'Репортажная и постановочная съемка',
      'Работа с гостями',
      'Ключевые моменты дня',
    ],
    is_active: true,
    category: 'Свадебная съемка',
  },
  {
    id: '9',
    service_type: 'wedding',
    title: 'Полный свадебный день',
    price: 45000,
    duration_hours: 10,
    photos_count: '300-500',
    features: [
      'Полное сопровождение свадебного дня',
      'От сборов до банкета',
      'Репортажная съемка всех событий',
      'Постановочные кадры пары',
      'Второй фотограф в подарок',
      'Экспресс-обработка 50 фото в день свадьбы',
    ],
    is_active: true,
    category: 'Свадебная съемка',
    premium: true,
  },
];

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();

  // Исключить newborn если вдруг она пришла из бэка
  const filteredPricing = (pricing || defaultPricing).filter(plan => plan.service_type !== "newborn");

  const grouped = React.useMemo(() => {
    const groups: { [cat: string]: any[] } = {};
    filteredPricing.forEach((plan) => {
      const category = (plan as any).category || serviceTypeName(plan.service_type);
      if (!groups[category]) groups[category] = [];
      groups[category].push(plan);
    });
    return groups;
  }, [filteredPricing]);

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

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Цены на фотосессии</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Все цены поделены по категориям. Детали по клику или наведению!
          </p>
        </div>
        <div className="divide-y">
          {Object.keys(grouped).map((cat) => (
            <div key={cat} className="py-8">
              <div className="text-xl font-bold text-pink-600 mb-2">{cat}</div>
              <ul>
                {grouped[cat].map((plan, idx) => (
                  <PriceLineDetail key={plan.id || idx} plan={plan} />
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            onClick={() => {
              const booking = document.getElementById('booking');
              if (booking) booking.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-pink-500 text-pink-600 hover:bg-pink-50"
          >
            Индивидуальная консультация
          </Button>
        </div>
      </div>
    </section>
  );
};

const PriceLineDetail = ({ plan }: { plan: any }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <li
      className={`flex items-center justify-between py-2 px-4 rounded-lg hover:bg-pink-50 cursor-pointer transition group relative`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      tabIndex={0}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <div className="flex flex-col flex-1">
        <span className="font-semibold text-gray-900">{plan.title ?? serviceTypeName(plan.service_type)}</span>
        {open && (
          <div className="absolute z-10 left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl p-4 border border-pink-100 animate-fade-in">
            <div className="text-gray-900 mb-1 font-semibold text-lg">
              {plan.title ?? serviceTypeName(plan.service_type)}
            </div>
            <div className="text-gray-600 text-sm mb-2">{plan.description}</div>
            <ul className="mb-2 pl-4 list-disc space-y-1">
              {Array.isArray(plan.features)
                ? plan.features.map((f: string, i: number) => <li key={i}>{f}</li>)
                : null}
            </ul>
            <div className="flex gap-4 text-xs">
              <span>{plan.duration_hours} ч</span>
              <span>{plan.photos_count} фото</span>
            </div>
          </div>
        )}
      </div>
      <span className="font-bold text-pink-600 text-lg">{plan.price?.toLocaleString()} ₽</span>
    </li>
  );
};

export default PricingSection;
