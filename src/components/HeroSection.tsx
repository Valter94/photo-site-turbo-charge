
import { Button } from "@/components/ui/button";
import { Camera, Star, Users, Award } from "lucide-react";

const HeroSection = () => {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&h=1080&fit=crop')"
        }}
      ></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <div className="flex items-center justify-center mb-6">
          <Camera className="w-12 h-12 text-pink-400 mr-4" />
          <h1 className="text-5xl md:text-7xl font-bold">
            Ирина
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl mb-8 font-light">
          Профессиональный фотограф
        </p>
        
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90">
          Создаю яркие и эмоциональные снимки, которые останутся с вами навсегда. 
          Свадьбы, Love Story, портреты — каждый кадр наполнен чувствами и красотой.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg"
            onClick={scrollToBooking}
          >
            Забронировать съемку
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
          >
            Посмотреть портфолио
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">5.0</div>
            <div className="text-sm opacity-80">Рейтинг</div>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm opacity-80">Довольных клиентов</div>
          </div>
          <div className="text-center">
            <Camera className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">1000+</div>
            <div className="text-sm opacity-80">Проведенных съемок</div>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm opacity-80">Лет опыта</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
