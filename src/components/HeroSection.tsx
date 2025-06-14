import React from 'react';
import { Button } from "@/components/ui/button";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Camera, Star, Award, Heart, Mail, Phone } from 'lucide-react';

const HeroSection = () => {
  const { data: settings } = useSiteSettings();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBooking = () => {
    const subject = 'Бронирование фотосессии - Фотограф Ирина';
    const body = `Здравствуйте, Ирина!

Хочу забронировать фотосессию:

📅 Желаемая дата: [укажите дату]
🕐 Время: [укажите время]
📸 Тип съемки: [свадебная/портретная/семейная/love story/корпоративная]
📍 Локация: [укажите желаемую локацию или "на ваше усмотрение"]
👥 Количество участников: [укажите количество]
💰 Бюджет: [укажите примерный бюджет]

✨ Дополнительные пожелания:
[опишите ваши идеи, стиль съемки, особые моменты]

📱 Мой контактный телефон: [укажите номер]

С нетерпением жду нашей встречи и создания магических кадров вместе! 💕

С уважением,
[Ваше имя]`;
    
    window.location.href = `mailto:bagreshevafoto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCall = () => {
    window.location.href = 'tel:+79262563550';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Анимированный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      {/* Анимированные блобы */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая колонка - текст */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent animate-slide-up">
              Фотограф Ирина
            </h1>
            
            <h2 className="text-2xl md:text-3xl mb-6 text-pink-300 font-medium animate-slide-up animation-delay-200">
              ✨ Создаю магию из каждого мгновения ✨
            </h2>
            
            <div className="max-w-2xl mb-8 animate-slide-up animation-delay-400">
              <p className="text-xl md:text-2xl mb-6 text-gray-200 leading-relaxed">
                💖 <strong>Превращаю ваши самые дорогие моменты в вечные воспоминания</strong>
              </p>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                Каждая фотосессия для меня - это уникальная история любви, счастья и красоты. 
                За 5+ лет работы я научилась видеть и запечатлевать то особенное, что делает именно ваш день незабываемым. 
                Ваши эмоции, ваша любовь, ваша радость - это то, что вдохновляет меня создавать настоящие шедевры!
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">💒 Свадебная магия</span>
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">💕 Love Story</span>
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">👨‍👩‍👧‍👦 Семейное счастье</span>
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">🎭 Портретное искусство</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-scale-in animation-delay-600">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-4 text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-0 rounded-full"
                onClick={() => scrollToSection('portfolio')}
              >
                <Star className="w-5 h-5 mr-2 text-white" />
                <span className="text-white font-bold">Посмотреть мои работы</span>
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-4 text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-0 rounded-full"
                onClick={handleBooking}
              >
                <Mail className="w-5 h-5 mr-2 text-white" />
                <span className="text-white font-bold">Забронировать съемку</span>
              </Button>
            </div>

            <div className="flex justify-center lg:justify-start gap-4 animate-fade-in animation-delay-800">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/50 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:border-white/70 rounded-full px-6 font-bold shadow-xl transition-all duration-300"
                onClick={handleCall}
              >
                <Phone className="w-4 h-4 mr-2 text-white" />
                <span className="text-white font-bold">+7 (926) 256-35-50</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/50 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:border-white/70 rounded-full px-6 font-bold shadow-xl transition-all duration-300"
                onClick={() => scrollToSection('pricing')}
              >
                <Heart className="w-4 h-4 mr-2 text-white" />
                <span className="text-white font-bold">Узнать цены</span>
              </Button>
            </div>
          </div>

          {/* Правая колонка - фотография Ирины */}
          <div className="flex justify-center lg:justify-end animate-fade-in animation-delay-400">
            <div className="relative group">
              <div className="relative w-80 h-96 md:w-96 md:h-[480px]">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 rounded-3xl animate-spin-slow opacity-75 blur-sm group-hover:blur-md transition-all duration-500"></div>
                <img
                  src="/lovable-uploads/48022099-9629-4273-8469-31a37157d96c.png"
                  alt="Фотограф Ирина - профессиональная фотосъемка в Москве"
                  className="relative w-full h-full rounded-3xl object-cover border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-all duration-500 hover-lift"
                  onError={(e) => {
                    console.log('Ошибка загрузки фото Ирины, используем запасное изображение');
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&auto=format&q=80';
                  }}
                />
                <div className="absolute -top-4 -right-4 bg-pink-500 rounded-full p-3 animate-bounce shadow-xl">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-purple-500 rounded-full p-3 animate-pulse shadow-xl">
                  <Star className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Статистика с улучшенным дизайном */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in animation-delay-1000">
          <div className="group text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold text-pink-300 mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
              <p className="text-sm text-gray-300 flex items-center justify-center">
                <Award className="w-4 h-4 mr-1" />
                лет создаю магию
              </p>
            </div>
          </div>
          <div className="group text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold text-pink-300 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <p className="text-sm text-gray-300 flex items-center justify-center">
                <Heart className="w-4 h-4 mr-1" />
                счастливых клиентов
              </p>
            </div>
          </div>
          <div className="group text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold text-pink-300 mb-2 group-hover:scale-110 transition-transform duration-300">48ч</div>
              <p className="text-sm text-gray-300 flex items-center justify-center">
                <Star className="w-4 h-4 mr-1" />
                готовность фото
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
