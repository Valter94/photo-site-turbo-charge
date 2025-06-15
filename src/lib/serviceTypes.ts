
export const serviceTypeName = (key: string): string => {
  switch (key) {
    case 'wedding': return 'Свадебная съемка';
    case 'lovestory': return 'Love Story';
    case 'portrait': return 'Портретная съемка';
    case 'family': return 'Семейная съемка';
    case 'corporate': return 'Корпоративная съемка';
    default: return key;
  }
};
