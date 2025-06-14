
import React, { useState, useEffect } from 'react';
import { usePortfolio } from "@/hooks/usePortfolio";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const StoryCarousel = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 5000; // 5 секунд на слайд

  useEffect(() => {
    if (!portfolio?.length || !isPlaying) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Переключаем на следующий слайд
          setActive(current => (current + 1) % portfolio.length);
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50)); // Обновляем каждые 50мс
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [portfolio?.length, isPlaying, active]);

  // Сброс прогресса при ручном переключении
  useEffect(() => {
    setProgress(0);
  }, [active]);

  if (isLoading || !portfolio?.length) return <div className="text-center text-muted-foreground py-8">Загрузка...</div>;

  const slide = portfolio[active];
  
  const nextSlide = () => {
    setActive(a => (a < portfolio.length - 1 ? a + 1 : 0));
  };

  const prevSlide = () => {
    setActive(a => (a > 0 ? a - 1 : portfolio.length - 1));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-12 rounded-3xl overflow-hidden bg-gradient-to-br from-white via-pink-50 to-rose-50 shadow-2xl">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {portfolio.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-8 min-h-[500px]">
                <div className="relative group">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full lg:w-80 h-60 lg:h-96 object-cover rounded-2xl shadow-lg transform transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center space-y-4 text-center lg:text-left">
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 animate-fade-in">
                    {item.title}
                  </h3>
                  {item.client_name && (
                    <div className="text-lg text-pink-600 font-semibold animate-fade-in animation-delay-200">
                      {item.client_name}
                    </div>
                  )}
                  <div className="text-gray-700 text-lg leading-relaxed animate-fade-in animation-delay-400">
                    {item.description}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 animate-fade-in animation-delay-600">
                    {item.shoot_date && (
                      <div className="flex items-center gap-2">
                        📅 {new Date(item.shoot_date).toLocaleDateString("ru-RU")}
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-2">
                        📍 {item.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
        <button
          onClick={prevSlide}
          className="bg-white/90 backdrop-blur-sm hover:bg-pink-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Предыдущая история"
        >
          <ChevronLeft className="w-6 h-6 text-rose-500" />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
        <button
          onClick={nextSlide}
          className="bg-white/90 backdrop-blur-sm hover:bg-pink-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Следующая история"
        >
          <ChevronRight className="w-6 h-6 text-rose-500" />
        </button>
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={togglePlayPause}
          className="bg-white/90 backdrop-blur-sm hover:bg-pink-50 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-rose-500" />
          ) : (
            <Play className="w-4 h-4 text-rose-500" />
          )}
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex items-center justify-center gap-2 py-6">
        {portfolio.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              active === i 
                ? 'bg-pink-500 scale-125' 
                : 'bg-gray-300 hover:bg-pink-300'
            }`}
            onClick={() => setActive(i)}
            aria-label={`Перейти к истории ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryCarousel;
