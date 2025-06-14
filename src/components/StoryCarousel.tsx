
import React, { useState, useEffect } from 'react';
import { usePortfolio } from "@/hooks/usePortfolio";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const StoryCarousel = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 10000; // Увеличено до 10 секунд на слайд

  useEffect(() => {
    if (!portfolio?.length || !isPlaying) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setActive(current => (current + 1) % portfolio.length);
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 100)); // Обновляем каждые 100мс для плавности
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [portfolio?.length, isPlaying, active]);

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
    <section className="py-20 bg-gradient-to-br from-white via-pink-50/20 to-purple-50/20 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md shadow-2xl border border-pink-100">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-100 to-purple-100 z-20">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Main Content */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {portfolio.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-8 min-h-[500px]">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="relative w-full lg:w-80 h-60 lg:h-96 object-cover rounded-2xl shadow-xl transform transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center space-y-6 text-center lg:text-left">
                      <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                        {item.title}
                      </h3>
                      {item.client_name && (
                        <div className="text-xl text-pink-600 font-semibold animate-fade-in animation-delay-200">
                          💕 {item.client_name}
                        </div>
                      )}
                      <div className="text-gray-700 text-lg leading-relaxed animate-fade-in animation-delay-400">
                        {item.description}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 animate-fade-in animation-delay-600">
                        {item.shoot_date && (
                          <div className="flex items-center gap-2 bg-pink-50 px-3 py-2 rounded-full">
                            📅 {new Date(item.shoot_date).toLocaleDateString("ru-RU")}
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
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
              className="bg-white/95 backdrop-blur-sm hover:bg-pink-50 rounded-full w-12 h-12 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-pink-500/25"
              aria-label="Предыдущая история"
            >
              <ChevronLeft className="w-6 h-6 text-rose-500" />
            </button>
          </div>

          <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
            <button
              onClick={nextSlide}
              className="bg-white/95 backdrop-blur-sm hover:bg-pink-50 rounded-full w-12 h-12 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-pink-500/25"
              aria-label="Следующая история"
            >
              <ChevronRight className="w-6 h-6 text-rose-500" />
            </button>
          </div>

          {/* Play/Pause Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={togglePlayPause}
              className="bg-white/95 backdrop-blur-sm hover:bg-pink-50 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
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
          <div className="flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-pink-50 to-purple-50">
            {portfolio.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  active === i 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-pink-300 hover:scale-110'
                }`}
                onClick={() => setActive(i)}
                aria-label={`Перейти к истории ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryCarousel;
