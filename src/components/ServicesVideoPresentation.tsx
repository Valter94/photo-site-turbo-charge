
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import DetailedServiceCard from './DetailedServiceCard';

const ServicesVideoPresentation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const slides = [
    {
      title: "Добро пожаловать в мир профессиональной фотографии",
      content: "Создаем незабываемые моменты вашей жизни",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=800&fit=crop&auto=format&q=80",
      duration: 4000
    },
    {
      title: "Свадебная фотография",
      content: "Полный день съемки от утренних сборов до вечернего банкета. В пакет входит: съемка церемонии, банкета, love story, обработка 200+ фотографий",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop&auto=format&q=80",
      duration: 5000
    },
    {
      title: "Love Story фотосессии",
      content: "Романтические фотосессии в самых красивых локациях Москвы. 2-3 часа съемки, смена образов, 30-50 обработанных фотографий",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=800&fit=crop&auto=format&q=80",
      duration: 4500
    },
    {
      title: "Портретная съемка",
      content: "Индивидуальные и групповые портреты. Профессиональный свет, различные локации, персональный подход к каждому клиенту",
      image: "https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=1200&h=800&fit=crop&auto=format&q=80",
      duration: 4000
    },
    {
      title: "Семейная фотография",
      content: "Теплые семейные моменты в парках Москвы. Съемка с детьми, семейные традиции, естественные эмоции",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop&auto=format&q=80",
      duration: 4500
    }
  ];

  const services = [
    {
      title: "Свадебная съемка",
      subtitle: "Полный день вашей свадьбы",
      price: "от 45,000 ₽",
      duration: "8-12 часов",
      photosCount: "200+ фото",
      rating: 4.9,
      reviewsCount: 156,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Полный свадебный день от утренних сборов до последнего танца. Создаем историю вашей любви в фотографиях.",
      features: [
        { icon: "💍", text: "Съемка церемонии и банкета" },
        { icon: "👰", text: "Утренние сборы невесты" },
        { icon: "🤵", text: "Сборы жениха" },
        { icon: "💕", text: "Love Story съемка" },
        { icon: "🎨", text: "Художественная обработка" },
        { icon: "📱", text: "Онлайн галерея" }
      ],
      popular: true
    },
    {
      title: "Love Story",
      subtitle: "Романтическая фотосессия для пары",
      price: "от 15,000 ₽",
      duration: "2-3 часа",
      photosCount: "40-60 фото",
      rating: 4.8,
      reviewsCount: 203,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Романтические кадры в живописных локациях Москвы. Передаем вашу любовь через объектив.",
      features: [
        { icon: "🌸", text: "Красивые локации" },
        { icon: "👫", text: "Естественные эмоции" },
        { icon: "🎭", text: "Смена образов" },
        { icon: "🌅", text: "Золотой час съемки" },
        { icon: "🎨", text: "Цветокоррекция" },
        { icon: "💝", text: "Подарочная упаковка" }
      ]
    },
    {
      title: "Портретная съемка",
      subtitle: "Индивидуальные и семейные портреты",
      price: "от 8,000 ₽",
      duration: "1-2 часа",
      photosCount: "20-30 фото",
      rating: 4.9,
      reviewsCount: 89,
      image: "https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Создаем выразительные портреты, которые раскрывают вашу индивидуальность.",
      features: [
        { icon: "📸", text: "Студийная съемка" },
        { icon: "🌿", text: "Съемка на природе" },
        { icon: "💡", text: "Профессиональный свет" },
        { icon: "🎨", text: "Ретушь портретов" },
        { icon: "👔", text: "Деловые портреты" },
        { icon: "🖼️", text: "Печать фотографий" }
      ]
    },
    {
      title: "Семейная фотосессия",
      subtitle: "Теплые семейные моменты",
      price: "от 12,000 ₽",
      duration: "2-3 часа",
      photosCount: "50-70 фото",
      rating: 4.8,
      reviewsCount: 127,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format&q=80",
      description: "Запечатлеваем искренние эмоции и связь между членами семьи в уютной атмосфере.",
      features: [
        { icon: "👨‍👩‍👧‍👦", text: "Съемка всей семьи" },
        { icon: "🎈", text: "Реквизит для детей" },
        { icon: "🏞️", text: "Локации в парках" },
        { icon: "🎪", text: "Игровая съемка" },
        { icon: "📚", text: "Семейная книга" },
        { icon: "🎁", text: "Магниты в подарок" }
      ]
    }
  ];

  const SLIDE_DURATION = slides[currentSlide]?.duration || 4000;

  useEffect(() => {
    if (!isPlaying) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentSlide(current => {
            if (current >= slides.length - 1) {
              setIsPlaying(false);
              return 0;
            }
            return current + 1;
          });
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isPlaying, currentSlide, SLIDE_DURATION]);

  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restartVideo = () => {
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="space-y-16">
      {/* Video Presentation */}
      <Card className="overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            🎥 Видео-презентация услуг
          </CardTitle>
          <p className="text-gray-600">Узнайте о всех наших услугах за 3 минуты</p>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Video Content */}
          <div className="relative aspect-video bg-black">
            <img
              src={currentSlideData?.image}
              alt={currentSlideData?.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-3 animate-fade-in">
                {currentSlideData?.title}
              </h3>
              <p className="text-lg lg:text-xl leading-relaxed animate-fade-in animation-delay-200">
                {currentSlideData?.content}
              </p>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                onClick={togglePlayPause}
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={restartVideo}
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={toggleMute}
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="flex justify-center gap-2 p-4 bg-white">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? 'bg-pink-500 scale-125'
                    : 'bg-gray-300 hover:bg-pink-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Services */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Наши услуги в деталях
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите идеальный пакет для вашего особенного события
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <DetailedServiceCard key={index} {...service} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Готовы создать что-то прекрасное?</h3>
          <p className="text-pink-100 mb-6 text-lg">
            Свяжитесь с нами для обсуждения вашей фотосессии
          </p>
          <Button 
            size="lg" 
            className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-8"
            onClick={() => {
              const element = document.getElementById('booking');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Забронировать фотосессию
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesVideoPresentation;
