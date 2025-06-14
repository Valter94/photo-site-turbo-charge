
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Camera, Star, ArrowRight } from "lucide-react";

const InteractiveLocationMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(0);

  const locations = [
    {
      id: 1,
      name: "Парк Горького",
      type: "Парк",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&auto=format&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80"
      ],
      bestTime: "Золотой час",
      rating: 4.9,
      features: ["Красивые аллеи", "Фонтаны", "Цветочные клумбы"],
      description: "Идеальное место для романтических и семейных фотосессий",
      distance: "15 мин от центра"
    },
    {
      id: 2,
      name: "Красная площадь",
      type: "Историческое место",
      image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600&h=400&fit=crop&auto=format&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1520637836862-4d197d17c766?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1512495039889-b8193e47ad1d?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop&auto=format&q=80"
      ],
      bestTime: "Раннее утро",
      rating: 5.0,
      features: ["Собор Василия Блаженного", "Кремль", "Брусчатка"],
      description: "Классические кадры с символами Москвы",
      distance: "Центр города"
    },
    {
      id: 3,
      name: "Воробьевы горы",
      type: "Смотровая площадка",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c766?w=600&h=400&fit=crop&auto=format&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1512495039889-b8193e47ad1d?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=300&h=200&fit=crop&auto=format&q=80"
      ],
      bestTime: "Закат",
      rating: 4.8,
      features: ["Панорама Москвы", "МГУ", "Природа"],
      description: "Потрясающие виды на столицу для незабываемых кадров",
      distance: "25 мин от центра"
    },
    {
      id: 4,
      name: "Патриаршие пруды",
      type: "Уютное место",
      image: "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=600&h=400&fit=crop&auto=format&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format&q=80",
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop&auto=format&q=80"
      ],
      bestTime: "Любое время",
      rating: 4.7,
      features: ["Пруд", "Скамейки", "Старые деревья"],
      description: "Атмосферное место для интимных фотосессий",
      distance: "10 мин от центра"
    }
  ];

  const selectedLoc = locations[selectedLocation];

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-blue-700">Лучшие локации</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Интерактивная карта локаций для съемки
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите идеальное место для вашей фотосессии с примерами работ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location List */}
          <div className="space-y-4">
            {locations.map((location, index) => (
              <Card 
                key={location.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedLocation === index 
                    ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLocation(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{location.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{location.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {location.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{location.distance}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Clock className="w-3 h-3" />
                      {location.bestTime}
                    </div>
                    {selectedLocation === index && (
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Location Details */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-xl border-blue-200">
              <div className="relative aspect-video">
                <img
                  src={selectedLoc.image}
                  alt={selectedLoc.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-blue-500 text-white">
                      {selectedLoc.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{selectedLoc.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{selectedLoc.name}</h2>
                  <p className="text-white/90 mb-3">{selectedLoc.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Лучшее время: {selectedLoc.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{selectedLoc.distance}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-500" />
                    Особенности локации
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLoc.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="border-blue-300 text-blue-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">Примеры фотографий</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedLoc.gallery.map((img, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg group cursor-pointer">
                        <img
                          src={img}
                          alt={`Пример ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Забронировать съемку в {selectedLoc.name}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLocationMap;
