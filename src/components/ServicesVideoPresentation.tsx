import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

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
    },
    {
      title: "Дополнительные услуги",
      content: "Расширьте свой опыт с нашими дополнительными услугами",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop&auto=format&q=80",
      duration: 3000
    }
  ];

  const additionalServices = [
    {
      icon: "✨",
      title: "Ретушь и обработка",
      description: "Профессиональная художественная обработка",
      price: "от 500 ₽/фото"
    },
    {
      icon: "📚",
      title: "Фотокниги и альбомы",
      description: "Дизайн и печать premium фотокниг",
      price: "от 8,000 ₽"
    },
    {
      icon: "🎨",
      title: "Стилистика и макияж",
      description: "Услуги профессионального визажиста",
      price: "от 5,000 ₽"
    },
    {
      icon: "🚁",
      title: "Аэросъемка",
      description: "Съемка с дрона для особых моментов",
      price: "от 10,000 ₽"
    },
    {
      icon: "📱",
      title: "Онлайн-галереи",
      description: "Персональные галереи для клиентов",
      price: "Бесплатно"
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Video Presentation */}
      <Card className="overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            🎥 Видео-презентация наших услуг
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

      {/* Additional Services */}
      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            ✨ Дополнительные услуги
          </CardTitle>
          <p className="text-center text-gray-600">
            Сделайте вашу фотосессию еще более особенной
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="border-pink-100 hover:border-pink-300 transition-colors hover:shadow-lg">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-lg text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <div className="text-pink-600 font-bold text-lg">{service.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

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
          >
            Забронировать фотосессию
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesVideoPresentation;
