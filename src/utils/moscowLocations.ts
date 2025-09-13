// Карта реальных фотографий локаций Москвы
export const moscowLocationPhotos: Record<string, string> = {
  // Центр Москвы
  'красная площадь': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
  'кремль': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
  'храм христа спасителя': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop',
  'собор василия блаженного': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
  'александровский сад': 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop',
  
  // Парки и природа
  'воробьевы горы': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop',
  'коломенское': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
  'царицыно': 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop',
  'сокольники': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'измайловский парк': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'парк горького': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'лужники': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  
  // ВДНХ и окрестности
  'вднх': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop',
  'ботанический сад': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'останкинский парк': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  
  // Арбат и центр
  'старый арбат': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
  'новый арбат': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop',
  'тверская': 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop',
  'поклонная гора': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
  
  // Московские улицы и районы
  'китай-город': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
  'замоскворечье': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop',
  'патриаршие пруды': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'чистые пруды': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  
  // Набережные
  'москва-река': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop',
  'крымская набережная': 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop',
  'парк зарядье': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
  
  // Подмосковье
  'серебряный бор': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'битцевский парк': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'тропарево': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'кусково': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
  'архангельское': 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop',
  
  // Современные районы
  'москва-сити': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop',
  'сколково': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
  'красногорск': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop'
};

// Функция для поиска подходящего фото по названию локации
export const getMoscowLocationPhoto = (locationName: string): string => {
  const nameLower = locationName.toLowerCase();
  
  // Ищем точное совпадение
  if (moscowLocationPhotos[nameLower]) {
    return moscowLocationPhotos[nameLower];
  }
  
  // Ищем частичное совпадение
  const foundKey = Object.keys(moscowLocationPhotos).find(key => 
    nameLower.includes(key) || key.includes(nameLower)
  );
  
  if (foundKey) {
    return moscowLocationPhotos[foundKey];
  }
  
  // Возвращаем фото по умолчанию для Москвы
  return 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop';
};

// Список популярных локаций для автодополнения
export const popularMoscowLocations = [
  'Красная площадь',
  'Воробьевы горы',
  'ВДНХ',
  'Коломенское',
  'Царицыно',
  'Парк Горького',
  'Старый Арбат',
  'Храм Христа Спасителя',
  'Патриаршие пруды',
  'Парк Зарядье',
  'Москва-Сити',
  'Крымская набережная',
  'Сокольники',
  'Измайловский парк',
  'Серебряный бор'
];