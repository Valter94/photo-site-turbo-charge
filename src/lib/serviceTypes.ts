
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
  newborn: 'Newborn',
  children: 'Детская фотосессия',
  maternity: 'Фотосессия беременности',
  // можно добавить другие
};

export const serviceTypeName = (key: string): string => SERVICE_TYPE_LABELS[key] || key;

// экспорт для использования в выпадающих списках и фильтрах
export const ALL_SERVICE_TYPES = Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => ({
  value, label
}));
