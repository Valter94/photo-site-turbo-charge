
// Типы услуг для сайта (ключ -> человекочитаемое название)
const SERVICE_TYPE_LABELS: Record<string, string> = {
  wedding: 'Свадебная съемка',
  wedding_preparations: 'Утренние сборы',
  wedding_ceremony: 'Свадебная церемония',
  wedding_full_day: 'Полный свадебный день',
  lovestory: 'Love Story',
  portrait: 'Портретная съемка',
  family: 'Семейная съемка',
  corporate: 'Корпоративная съемка',
  children: 'Детская фотосессия',
  maternity: 'Фотосессия беременности',
  // newborn убран по просьбе пользователя
};

export const serviceTypeName = (key: string): string => SERVICE_TYPE_LABELS[key] || key;

// экспорт для выпадающих списков и фильтров
export const ALL_SERVICE_TYPES = Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => ({
  value, label
}));
