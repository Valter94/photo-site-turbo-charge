
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

const BeforeAfterGallery = () => {
  const [activeSlider, setActiveSlider] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const beforeAfterImages = [
    {
      id: 1,
      title: "Свадебная магия",
      before: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop&auto=format&q=60",
      after: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format&q=80",
      category: "Свадьба",
      description: "Превращение обычного кадра в сказочный момент"
    },
    {
      id: 2,
      title: "Портретное совершенство",
      before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=60",
      after: "https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=600&h=400&fit=crop&auto=format&q=80",
      category: "Портрет",
      description: "Профессиональная обработка для идеального образа"
    },
    {
      id: 3,
      title: "Love Story волшебство",
      before: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&auto=format&q=60",
      after: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&auto=format&q=80",
      category: "Love Story",
      description: "Романтическая атмосфера через цвет и свет"
    }
  ];

  const handleSliderChange = (value: number, index: number) => {
    if (activeSlider === index) {
      setSliderPosition(value);
    }
  };

  const handleImageClick = (index: number) => {
    setActiveSlider(index);
    setSliderPosition(50);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-200 mb-4">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-semibold text-pink-700">Волшебство обработки</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            До и После: Магия профессиональной обработки
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Смотрите, как обычные кадры превращаются в произведения искусства
          </p>
        </div>

        {/* Main Before/After Viewer */}
        <Card className="mb-8 overflow-hidden shadow-2xl border-pink-200">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gray-900">
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <img
                  src={beforeAfterImages[activeSlider].before}
                  alt="До обработки"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-red-500 text-white">
                    ДО
                  </Badge>
                </div>
              </div>
              
              <div className="absolute inset-0">
                <img
                  src={beforeAfterImages[activeSlider].after}
                  alt="После обработки"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    ПОСЛЕ
                  </Badge>
                </div>
              </div>

              {/* Slider Control */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10 flex items-center justify-center"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={(e) => {
                  const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
                  };
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="border-white/30 text-white">
                    {beforeAfterImages[activeSlider].category}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">{beforeAfterImages[activeSlider].title}</h3>
                <p className="text-white/90">{beforeAfterImages[activeSlider].description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beforeAfterImages.map((item, index) => (
            <Card 
              key={item.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                activeSlider === index ? 'ring-2 ring-pink-500 shadow-lg' : ''
              }`}
              onClick={() => handleImageClick(index)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 overflow-hidden">
                      <img
                        src={item.before}
                        alt="До"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="w-1/2 overflow-hidden">
                      <img
                        src={item.after}
                        alt="После"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge variant="outline" className="border-white/30 text-white text-xs mb-1">
                      {item.category}
                    </Badge>
                    <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Заказать обработку фотографий
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterGallery;
