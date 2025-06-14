
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Camera, 
  Settings, 
  MapPin, 
  MessageSquare,
  BarChart3,
  Sparkles,
  Pause,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const VideoTutorials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tutorials = [
    {
      id: 'portfolio-upload',
      title: 'Загрузка фотографий в портфолио',
      description: 'Пошаговое руководство по добавлению новых фотографий',
      duration: '3:45',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <Camera className="w-5 h-5" />,
      category: 'Основы',
      content: `
        <h3>Шаги для загрузки фотографий:</h3>
        <ol>
          <li>Перейдите в раздел "Портфолио" в админ панели</li>
          <li>Нажмите кнопку "Добавить фото"</li>
          <li>Выберите файлы с компьютера</li>
          <li>Заполните описание и теги</li>
          <li>Выберите категорию съемки</li>
          <li>Нажмите "Сохранить"</li>
        </ol>
        <p><strong>Рекомендации:</strong></p>
        <ul>
          <li>Используйте качественные изображения (минимум 1920x1080)</li>
          <li>Добавляйте описательные теги</li>
          <li>Группируйте фото по категориям</li>
        </ul>
      `
    },
    {
      id: 'photo-retouch',
      title: 'Ретушь и обработка фотографий',
      description: 'Использование встроенных инструментов для улучшения фото',
      duration: '5:20',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'Обработка',
      content: `
        <h3>Инструменты обработки:</h3>
        <ol>
          <li>Откройте изображение в редакторе</li>
          <li>Используйте автокоррекцию для базовой обработки</li>
          <li>Настройте яркость и контрастность</li>
          <li>Примените цветовую коррекцию</li>
          <li>Добавьте резкость при необходимости</li>
          <li>Сохраните обработанное изображение</li>
        </ol>
        <p><strong>Полезные советы:</strong></p>
        <ul>
          <li>Не переусердствуйте с фильтрами</li>
          <li>Сохраняйте оригиналы</li>
          <li>Используйте пакетную обработку для серий</li>
        </ul>
      `
    },
    {
      id: 'locations-manage',
      title: 'Управление локациями',
      description: 'Добавление и редактирование мест для фотосессий',
      duration: '2:30',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <MapPin className="w-5 h-5" />,
      category: 'Настройки',
      content: `
        <h3>Работа с локациями:</h3>
        <ol>
          <li>Перейдите в раздел "Локации"</li>
          <li>Нажмите "Добавить локацию"</li>
          <li>Укажите название и адрес</li>
          <li>Загрузите фотографии места</li>
          <li>Добавьте описание и особенности</li>
          <li>Укажите доступность и стоимость</li>
        </ol>
        <p><strong>Важные моменты:</strong></p>
        <ul>
          <li>Проверяйте разрешения на съемку</li>
          <li>Указывайте время доступности</li>
          <li>Добавляйте контакты администрации</li>
        </ul>
      `
    },
    {
      id: 'reviews-moderate',
      title: 'Модерация отзывов клиентов',
      description: 'Как одобрять и отклонять отзывы',
      duration: '4:15',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'Клиенты',
      content: `
        <h3>Модерация отзывов:</h3>
        <ol>
          <li>Откройте раздел "Отзывы"</li>
          <li>Просмотрите новые отзывы</li>
          <li>Проверьте содержание на соответствие правилам</li>
          <li>Одобрите или отклоните отзыв</li>
          <li>При необходимости добавьте ответ</li>
        </ol>
        <p><strong>Критерии модерации:</strong></p>
        <ul>
          <li>Отсутствие нецензурной лексики</li>
          <li>Конструктивность отзыва</li>
          <li>Соответствие действительности</li>
        </ul>
      `
    },
    {
      id: 'analytics-read',
      title: 'Чтение аналитики и статистики',
      description: 'Понимание метрик и отчетов сайта',
      duration: '6:00',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'Аналитика',
      content: `
        <h3>Основные метрики:</h3>
        <ol>
          <li>Посещаемость сайта</li>
          <li>Конверсия заявок</li>
          <li>Популярные страницы</li>
          <li>Географическое распределение</li>
          <li>Устройства пользователей</li>
        </ol>
        <p><strong>Как использовать данные:</strong></p>
        <ul>
          <li>Анализируйте тренды по месяцам</li>
          <li>Отслеживайте источники трафика</li>
          <li>Оптимизируйте популярные страницы</li>
        </ul>
      `
    },
    {
      id: 'site-settings',
      title: 'Настройка сайта и контактов',
      description: 'Изменение информации о себе и услугах',
      duration: '3:30',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <Settings className="w-5 h-5" />,
      category: 'Настройки',
      content: `
        <h3>Настройки сайта:</h3>
        <ol>
          <li>Перейдите в "Настройки сайта"</li>
          <li>Обновите контактную информацию</li>
          <li>Измените описание услуг</li>
          <li>Настройте социальные сети</li>
          <li>Обновите цены и пакеты</li>
        </ol>
        <p><strong>Рекомендации:</strong></p>
        <ul>
          <li>Регулярно обновляйте информацию</li>
          <li>Проверяйте актуальность цен</li>
          <li>Добавляйте новые услуги</li>
        </ul>
      `
    }
  ];

  const categories = [...new Set(tutorials.map(t => t.category))];

  const handlePlayVideo = (tutorialId: string) => {
    setActiveVideo(tutorialId);
    setIsPlaying(true);
  };

  const handlePauseVideo = () => {
    setIsPlaying(false);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setIsPlaying(false);
  };

  const activeTutorial = tutorials.find(t => t.id === activeVideo);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
          <Play className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Видео инструкции</h2>
        <p className="text-gray-600">Пошаговые руководства по работе с админ панелью</p>
      </div>

      {/* Информация о настройке Telegram */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Важно:</strong> Для получения уведомлений настройте Telegram во вкладке "Telegram". 
          Сообщения будут приходить в чаты, которые вы укажете в настройках.
        </AlertDescription>
      </Alert>

      {/* Активное видео */}
      {activeVideo && activeTutorial && (
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {activeTutorial.title}
                </h3>
                <p className="text-gray-600">
                  {activeTutorial.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPlaying ? handlePauseVideo : () => setIsPlaying(true)}
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Пауза' : 'Воспроизвести'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeVideo}
                >
                  Закрыть
                </Button>
              </div>
            </div>
            
            {/* Встроенный контент */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {isPlaying ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeTutorial.content }}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Play className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Нажмите "Воспроизвести" чтобы посмотреть инструкцию</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Категории */}
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
              {category}
            </Badge>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutorials
              .filter(tutorial => tutorial.category === category)
              .map(tutorial => (
                <Card 
                  key={tutorial.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    activeVideo === tutorial.id ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="w-6 h-6 text-pink-600" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {tutorial.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-pink-600 mt-1">
                        {tutorial.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600 text-xs mb-3">
                          {tutorial.description}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handlePlayVideo(tutorial.id)}
                          className="w-full bg-pink-500 hover:bg-pink-600"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Смотреть
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {/* Дополнительная информация */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Нужна дополнительная помощь?</h3>
            <p className="text-gray-600 mb-4">
              Если у вас остались вопросы, вы можете связаться с нашей службой поддержки
            </p>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              Связаться с поддержкой
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoTutorials;
