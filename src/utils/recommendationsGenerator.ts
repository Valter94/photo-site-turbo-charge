
import { AnalyticsData, Recommendation } from '../types/analytics';

// Генерация рекомендаций
export const generateRecommendations = (analytics: AnalyticsData): Recommendation[] => {
  const recs: Recommendation[] = [];

  // Рекомендации по производительности
  if (analytics.bounceRate > 70) {
    recs.push({
      id: 'high-bounce-rate',
      type: 'performance',
      priority: 'high',
      title: 'Высокий показатель отказов',
      description: `Текущий показатель отказов ${analytics.bounceRate}% превышает норму`,
      action: 'Улучшить время загрузки страниц и первое впечатление',
      implemented: false
    });
  }

  // Рекомендации по ошибкам
  if (analytics.errors.length > 10) {
    recs.push({
      id: 'many-errors',
      type: 'performance',
      priority: 'high',
      title: 'Обнаружено много ошибок',
      description: `За последнее время зафиксировано ${analytics.errors.length} ошибок`,
      action: 'Провести аудит кода и исправить критические ошибки',
      implemented: false
    });
  }

  // SEO рекомендации
  if (!document.querySelector('meta[name="description"]')) {
    recs.push({
      id: 'missing-meta-description',
      type: 'seo',
      priority: 'medium',
      title: 'Отсутствует мета-описание',
      description: 'На страницах не хватает мета-описаний для поисковых систем',
      action: 'Добавить уникальные мета-описания для всех страниц',
      implemented: false
    });
  }

  // Рекомендации по контенту
  const mobileUsers = analytics.deviceTypes.find(d => d.type === 'mobile')?.count || 0;
  const totalUsers = analytics.deviceTypes.reduce((sum, d) => sum + d.count, 0);
  
  if (mobileUsers / totalUsers > 0.6) {
    recs.push({
      id: 'mobile-optimization',
      type: 'usability',
      priority: 'medium',
      title: 'Оптимизация для мобильных устройств',
      description: `${Math.round(mobileUsers / totalUsers * 100)}% пользователей используют мобильные устройства`,
      action: 'Улучшить мобильную версию сайта и время загрузки',
      implemented: false
    });
  }

  return recs;
};
