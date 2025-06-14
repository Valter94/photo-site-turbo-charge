
import React, { useState } from 'react';
import { usePortfolio } from "@/hooks/usePortfolio";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StoryCarousel = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const [active, setActive] = useState(0);

  if (isLoading || !portfolio?.length) return <div className="text-center text-muted-foreground py-8">Загрузка...</div>;

  const slide = portfolio[active];
  
  return (
    <div className="relative w-full max-w-xl mx-auto my-8 rounded-3xl overflow-hidden bg-gradient-to-b from-white via-pink-50 to-rose-50 shadow-lg flex flex-col items-center">
      <div className="flex flex-col md:flex-row items-center p-4 md:p-8 gap-8 w-full">
        <img
          src={slide.image_url}
          alt={slide.title}
          className="w-full md:w-80 h-60 md:h-96 object-cover rounded-2xl shadow-md transition-all duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="flex-1 flex flex-col items-start justify-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{slide.title}</h3>
          {slide.client_name && (
            <div className="mb-1 text-pink-600 font-semibold">{slide.client_name}</div>
          )}
          <div className="text-gray-700 opacity-80 mb-2">{slide.description}</div>
          {slide.shoot_date && (
            <div className="text-xs text-gray-400 mb-2">
              {new Date(slide.shoot_date).toLocaleDateString("ru-RU")}
            </div>
          )}
          {slide.location && (
            <div className="text-xs text-gray-500">{slide.location}</div>
          )}
        </div>
      </div>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
        <button
          onClick={() => setActive(a => (a > 0 ? a - 1 : portfolio.length - 1))}
          className="bg-white bg-opacity-70 hover:bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center shadow transition"
          aria-label="Prev story"
        >
          <ChevronLeft className="w-6 h-6 text-rose-500" />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
        <button
          onClick={() => setActive(a => (a < portfolio.length - 1 ? a + 1 : 0))}
          className="bg-white bg-opacity-70 hover:bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center shadow transition"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6 text-rose-500" />
        </button>
      </div>
      <div className="w-full flex items-center justify-center gap-1 py-4">
        {portfolio.map((_, i) => (
          <div key={i}
            className={`w-2.5 h-2.5 rounded-full ${active === i ? 'bg-pink-500' : 'bg-gray-300'}`}
            onClick={() => setActive(i)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
};
export default StoryCarousel;
