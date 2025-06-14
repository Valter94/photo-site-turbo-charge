
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Camera, 
  Upload, 
  Settings, 
  MapPin, 
  MessageSquare,
  BarChart3,
  Sparkles
} from 'lucide-react';

const VideoTutorials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const tutorials = [
    {
      id: 'portfolio-upload',
      title: 'Загрузка фотографий в портфолио',
      description: 'Пошаговое руководство по добавлению новых фотографий',
      duration: '3:45',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <Camera className="w-5 h-5" />,
      category: 'Основы',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Пример URL
    },
    {
      id: 'photo-retouch',
      title: 'Ретушь и обработка фотографий',
      description: 'Использование встроенных инструментов для улучшения фото',
      duration: '5:20',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'Обработка',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'locations-manage',
      title: 'Управление локациями',
      description: 'Добавление и редактирование мест для фотосессий',
      duration: '2:30',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <MapPin className="w-5 h-5" />,
      category: 'Настройки',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'reviews-moderate',
      title: 'Модерация отзывов клиентов',
      description: 'Как одобрять и отклонять отзывы',
      duration: '4:15',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'Клиенты',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'analytics-read',
      title: 'Чтение аналитики и статистики',
      description: 'Понимание метрик и отчетов сайта',
      duration: '6:00',
      thumbnail: '/lovable-uploads/192fde74-a0e2-4178-9e1a-70253c938e8d.png',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'Аналитика',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'site-settings',
      title: 'Настройка сайта и контактов',
      description: 'Изменение информации о себе и услугах',
      duration: '3:30',
      thumbnail: '/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png',
      icon: <Settings className="w-5 h-5" />,
      category: 'Настройки',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const categories = [...new Set(tutorials.map(t => t.category))];

  const togglePlay = (videoId: string) => {
    if (activeVideo === videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveVideo(videoId);
      setIsPlaying(true);
    }
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

      {/* Активное видео */}
      {activeVideo && (
        <Card className="mb-8 overflow-hidden">
          <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={tutorials.find(t => t.id === activeVideo)?.videoUrl}
              title="Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Fullscreen logic */}}
                >
                  <Maximize2 className="w-4 h-4" />
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
                  onClick={() => togglePlay(tutorial.id)}
                >
                  <div className="relative">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        {activeVideo === tutorial.id && isPlaying ? (
                          <Pause className="w-6 h-6 text-pink-600" />
                        ) : (
                          <Play className="w-6 h-6 text-pink-600" />
                        )}
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
