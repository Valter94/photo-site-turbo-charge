
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
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const VideoTutorials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const tutorials = [
    {
      id: 'portfolio-upload',
      title: 'Загрузка фотографий в портфолио',
      description: 'Пошаговое руководство по добавлению новых фотографий',
      duration: '3:45',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <Camera className="w-5 h-5" />,
      category: 'Основы',
      videoId: 'LXb3EKWsInQ' // Реальное видео о фотографии
    },
    {
      id: 'photo-retouch',
      title: 'Ретушь и обработка фотографий',
      description: 'Использование встроенных инструментов для улучшения фото',
      duration: '5:20',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'Обработка',
      videoId: 'VQN_R2wn9Rc' // Видео о редактировании фото
    },
    {
      id: 'locations-manage',
      title: 'Управление локациями',
      description: 'Добавление и редактирование мест для фотосессий',
      duration: '2:30',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <MapPin className="w-5 h-5" />,
      category: 'Настройки',
      videoId: 'mWRsgZuwf_8' // Видео о локациях для фотосессий
    },
    {
      id: 'reviews-moderate',
      title: 'Модерация отзывов клиентов',
      description: 'Как одобрять и отклонять отзывы',
      duration: '4:15',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'Клиенты',
      videoId: '4CbQ3dKkCWo' // Видео о работе с клиентами
    },
    {
      id: 'analytics-read',
      title: 'Чтение аналитики и статистики',
      description: 'Понимание метрик и отчетов сайта',
      duration: '6:00',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'Аналитика',
      videoId: 'dTX9T5It8Tc' // Видео об аналитике
    },
    {
      id: 'site-settings',
      title: 'Настройка сайта и контактов',
      description: 'Изменение информации о себе и услугах',
      duration: '3:30',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <Settings className="w-5 h-5" />,
      category: 'Настройки',
      videoId: 'Ke90Tje7VS0' // Видео о настройке сайтов
    }
  ];

  const categories = [...new Set(tutorials.map(t => t.category))];

  const openVideoInNewTab = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const getEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  const handleVideoLoad = () => {
    setVideoError(null);
  };

  const handleVideoError = () => {
    setVideoError('Не удалось загрузить видео. Попробуйте открыть его в YouTube.');
  };

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
      {activeVideo && (
        <Card className="mb-8 overflow-hidden">
          <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
            {videoError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white p-6">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                  <p className="mb-4">{videoError}</p>
                  <Button
                    onClick={() => {
                      const tutorial = tutorials.find(t => t.id === activeVideo);
                      if (tutorial) openVideoInNewTab(tutorial.videoId);
                    }}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Открыть в YouTube
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={getEmbedUrl(tutorials.find(t => t.id === activeVideo)?.videoId || '')}
                title="Tutorial Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {tutorials.find(t => t.id === activeVideo)?.title}
                </h3>
                <p className="text-gray-600">
                  {tutorials.find(t => t.id === activeVideo)?.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tutorial = tutorials.find(t => t.id === activeVideo);
                    if (tutorial) openVideoInNewTab(tutorial.videoId);
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Открыть в YouTube
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveVideo(null);
                    setVideoError(null);
                  }}
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </CardContent>
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
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => {
                              setActiveVideo(tutorial.id);
                              setVideoError(null);
                            }}
                            className="flex-1 bg-pink-500 hover:bg-pink-600"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Смотреть
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openVideoInNewTab(tutorial.videoId)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
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
