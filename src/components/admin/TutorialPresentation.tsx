
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Upload, 
  Settings, 
  Palette, 
  MapPin, 
  MessageSquare,
  BarChart3,
  Sparkles,
  Monitor,
  Smartphone
} from 'lucide-react';

const TutorialPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Добро пожаловать в админ-панель!",
      subtitle: "Полное руководство по управлению сайтом",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-white" />
          </div>
          <p className="text-lg text-gray-600">
            Изучите все возможности управления вашим фотографическим сайтом
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Badge variant="outline" className="p-3 text-sm">
              <Upload className="w-4 h-4 mr-2" />
              Загрузка фото
            </Badge>
            <Badge variant="outline" className="p-3 text-sm">
              <Palette className="w-4 h-4 mr-2" />
              Обработка
            </Badge>
            <Badge variant="outline" className="p-3 text-sm">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </Badge>
            <Badge variant="outline" className="p-3 text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Аналитика
            </Badge>
          </div>
        </div>
      )
    },
    {
      title: "Управление портфолио",
      subtitle: "Загрузка и организация фотографий",
      content: (
        <div className="space-y-6">
          <div className="bg-pink-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-pink-600" />
              Как загрузить фото:
            </h4>
            <ol className="space-y-2 text-sm">
              <li>1. Перейдите во вкладку "Портфолио"</li>
              <li>2. Нажмите кнопку "Добавить фото"</li>
              <li>3. Выберите файлы (JPEG, PNG до 10MB)</li>
              <li>4. Добавьте описание и категорию</li>
              <li>5. Нажмите "Сохранить"</li>
            </ol>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Совет:</strong> Используйте качественные изображения разрешением не менее 1920x1080 пикселей
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Обработка фотографий",
      subtitle: "Инструменты для улучшения изображений",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                <h4 className="font-semibold">Автоматическая ретушь</h4>
              </div>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Коррекция освещения</li>
                <li>• Устранение дефектов</li>
                <li>• Цветокоррекция</li>
              </ul>
            </Card>
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Palette className="w-5 h-5 mr-2 text-green-600" />
                <h4 className="font-semibold">Ручная обработка</h4>
              </div>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Настройка контраста</li>
                <li>• Изменение насыщенности</li>
                <li>• Кадрирование</li>
              </ul>
            </Card>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Рекомендация:</strong> Всегда сохраняйте оригиналы перед обработкой
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Управление локациями",
      subtitle: "Добавление мест для фотосессий",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="w-16 h-16 text-red-500" />
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Как добавить новую локацию:</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p>1. Выберите вкладку "Локации"</p>
              <p>2. Нажмите "Добавить локацию"</p>
              <p>3. Загрузите фото локации</p>
              <p>4. Укажите название и адрес</p>
              <p>5. Добавьте описание и особенности</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <strong>Хорошие локации:</strong>
                <br />• Парки и сады
                <br />• Архитектурные объекты
                <br />• Студии
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <strong>Учитывайте:</strong>
                <br />• Освещение
                <br />• Доступность
                <br />• Разрешения
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Работа с отзывами",
      subtitle: "Модерация и управление отзывами клиентов",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <MessageSquare className="w-16 h-16 text-blue-500 mx-auto" />
          </div>
          <div className="space-y-4">
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-800">Модерация отзывов</h4>
              <p className="text-sm text-yellow-700">
                Все новые отзывы требуют одобрения перед публикацией на сайте
              </p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">Одобрить отзыв если:</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Отзыв честный и конструктивный</li>
                  <li>✓ Нет нецензурной лексики</li>
                  <li>✓ Соответствует оказанной услуге</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">Отклонить если:</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>✗ Содержит оскорбления</li>
                  <li>✗ Явно фальшивый</li>
                  <li>✗ Не относится к услугам</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Аналитика и статистика",
      subtitle: "Отслеживание эффективности сайта",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <BarChart3 className="w-16 h-16 text-indigo-500 mx-auto" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Ключевые метрики:</h4>
              <ul className="text-sm space-y-1">
                <li>• Посещения сайта</li>
                <li>• Заявки на съемку</li>
                <li>• Популярные услуги</li>
                <li>• Конверсия</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Полезные отчеты:</h4>
              <ul className="text-sm space-y-1">
                <li>• Еженедельная статистика</li>
                <li>• Анализ трафика</li>
                <li>• Отчет по заявкам</li>
                <li>• ROI кампаний</li>
              </ul>
            </Card>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>Совет:</strong> Регулярно анализируйте данные для оптимизации работы сайта
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Настройки сайта",
      subtitle: "Персонализация и конфигурация",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Настройки дизайна</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Цветовая схема</li>
                <li>• Шрифты и размеры</li>
                <li>• Логотип и брендинг</li>
              </ul>
            </div>
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Контактная информация</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Телефон и email</li>
                <li>• Социальные сети</li>
                <li>• Адрес студии</li>
              </ul>
            </div>
          </div>
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Важные настройки:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">SEO настройки:</p>
                <p className="text-green-700">Заголовки, описания, ключевые слова</p>
              </div>
              <div>
                <p className="font-medium">Уведомления:</p>
                <p className="text-green-700">Email и Telegram оповещения</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Заключение",
      subtitle: "Успешного управления сайтом!",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Теперь вы готовы к работе!
          </h3>
          <p className="text-gray-600">
            Используйте полученные знания для эффективного управления сайтом. 
            Регулярно обновляйте контент и следите за аналитикой.
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-3">Помните:</h4>
            <ul className="text-sm space-y-2 text-left max-w-md mx-auto">
              <li>✓ Качественные фото привлекают клиентов</li>
              <li>✓ Быстрый отклик на заявки важен</li>
              <li>✓ Регулярно обновляйте портфолио</li>
              <li>✓ Следите за отзывами и репутацией</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="min-h-[600px]">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {slides[currentSlide].title}
              </CardTitle>
              <p className="text-gray-600 mt-2">{slides[currentSlide].subtitle}</p>
              <Badge variant="outline" className="mt-2">
                {currentSlide + 1} из {slides.length}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="min-h-[400px]">
            {slides[currentSlide].content}
          </div>
        </CardContent>

        {/* Индикаторы слайдов */}
        <div className="flex justify-center pb-6 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-pink-500' 
                  : 'bg-gray-300 hover:bg-pink-300'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TutorialPresentation;
