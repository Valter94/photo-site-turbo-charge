import React, { useMemo } from 'react';
import { usePricing } from '@/hooks/usePricing';
import { Button } from '@/components/ui/button';

const serviceNamesRu: Record<string, string> = {
  portrait: 'Портретная съёмка',
  family: 'Семейная фотосессия',
  lovestory: 'Love Story',
  wedding: 'Свадебная фотосессия',
  corporate: 'Корпоративная съёмка',
};

const defaultPricing = [
  {
    id: '1',
    service_type: 'portrait',
    price: 8000,
    duration_hours: 1,
    photos_count: '30-40',
    features: [
      'Индивидуальная портретная съемка',
      'Профессиональная обработка',
      'Готовые фото в течение 3 дней',
      'Онлайн-галерея для скачивания',
    ],
    is_active: true,
  },
  {
    id: '2',
    service_type: 'family',
    price: 12000,
    duration_hours: 2,
    photos_count: '50-70',
    features: [
      'Семейная фотосессия',
      'Работа с детьми любого возраста',
      'Естественные эмоции и улыбки',
      'Быстрая обработка фотографий',
    ],
    is_active: true,
    popular: true,
  },
  {
    id: '3',
    service_type: 'lovestory',
    price: 15000,
    duration_hours: 2,
    photos_count: '80-100',
    features: [
      'Романтическая съемка для пары',
      'Несколько локаций на выбор',
      'Создание истории любви в кадрах',
      'Индивидуальный подход к каждой паре',
    ],
    is_active: true,
  },
  {
    id: '4',
    service_type: 'wedding',
    price: 35000,
    duration_hours: 8,
    photos_count: '200+',
    features: [
      'Полный день свадебной съемки',
      'Репортажная и постановочная съемка',
      'Съемка церемонии и банкета',
      'Экспресс-обработка лучших кадров',
    ],
    is_active: true,
    premium: true,
  },
];

const getRussianName = (type: string) => serviceNamesRu[type] || type;

const PricingSection = () => {
  const { data: pricing, isLoading } = usePricing();

  // Используем только русские названия и группируем по категориям
  const grouped = React.useMemo(() => {
    const groups: { [cat: string]: any[] } = {};
    (pricing || defaultPricing).forEach((plan) => {
      const category = getRussianName(plan.service_type);
      if (!groups[category]) groups[category] = [];
      groups[category].push(plan);
    });
    return groups;
  }, [pricing]);

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
        <span className="font-semibold text-gray-900">{plan.title ?? getRussianName(plan.service_type)}</span>
        {open && (
          <div className="absolute z-10 left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl p-4 border border-pink-100 animate-fade-in">
            <div className="text-gray-900 mb-1 font-semibold text-lg">
              {plan.title ?? getRussianName(plan.service_type)}
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
