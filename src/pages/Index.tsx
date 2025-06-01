
import React, { useState, useEffect } from 'react';
import { Camera, Instagram, Phone, Mail, MapPin, Star, ArrowRight, Menu, X, ArrowUp } from 'lucide-react';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const portfolioItems = [
    { id: 1, category: 'wedding', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop', alt: 'Свадебная фотосессия' },
    { id: 2, category: 'lovestory', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop', alt: 'Love Story фотосессия' },
    { id: 3, category: 'portrait', image: 'https://images.unsplash.com/photo-1494790108755-2616c4f88464?w=800&h=600&fit=crop', alt: 'Портретная фотосессия' },
    { id: 4, category: 'wedding', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop', alt: 'Свадебное фото' },
    { id: 5, category: 'lovestory', image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&h=600&fit=crop', alt: 'Романтическая фотосессия' },
    { id: 6, category: 'portrait', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', alt: 'Мужской портрет' },
    { id: 7, category: 'wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', alt: 'Свадебная церемония' },
    { id: 8, category: 'lovestory', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop', alt: 'Пара в городе' },
    { id: 9, category: 'portrait', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop', alt: 'Женский портрет' }
  ];

  const services = [
    {
      title: 'Свадебная фотосъемка',
      duration: '6-12 часов',
      price: 'от 30,000 ₽ до 100,000 ₽',
      description: 'Полное сопровождение свадебного дня с репортажной и постановочной съемкой',
      includes: ['100-500 обработанных фото', 'Онлайн-галерея', 'Репортаж и постановка', 'Консультация по локациям'],
      popular: true
    },
    {
      title: 'Love Story',
      duration: '1-3 часа',
      price: 'от 10,000 ₽ до 25,000 ₽',
      description: 'Романтическая фотосессия для влюбленных пар в красивых локациях',
      includes: ['50-150 обработанных фото', 'Романтические локации', 'Помощь в позировании', 'Быстрая обработка']
    },
    {
      title: 'Портретная фотосъемка',
      duration: '1-2 часа',
      price: 'от 8,000 ₽ до 15,000 ₽',
      description: 'Индивидуальная или семейная портретная съемка в студии или на природе',
      includes: ['30-100 обработанных фото', 'Студия или улица', 'Консультация по образу', 'Ретушь портретов']
    }
  ];

  const reviews = [
    {
      name: 'Анна Смирнова',
      rating: 5,
      text: 'Ирина - потрясающий фотограф! Наша свадебная съемка превзошла все ожидания. Каждое фото - произведение искусства.',
      date: '15 ноября 2024'
    },
    {
      name: 'Михаил и Елена',
      rating: 5,
      text: 'Love Story получилась невероятно красивой! Ирина умеет находить идеальные ракурсы и моменты.',
      date: '3 октября 2024'
    },
    {
      name: 'Дарья Волкова',
      rating: 5,
      text: 'Портретная съемка прошла комфортно и результат просто великолепный. Рекомендую всем!',
      date: '28 сентября 2024'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const smoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-lg z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-rose-400" />
              <span className="text-2xl font-bold text-gray-900">Ирина</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => smoothScroll('home')} className="text-gray-700 hover:text-rose-400 transition-colors">Главная</button>
              <button onClick={() => smoothScroll('portfolio')} className="text-gray-700 hover:text-rose-400 transition-colors">Портфолио</button>
              <button onClick={() => smoothScroll('services')} className="text-gray-700 hover:text-rose-400 transition-colors">Услуги</button>
              <button onClick={() => smoothScroll('reviews')} className="text-gray-700 hover:text-rose-400 transition-colors">Отзывы</button>
              <button onClick={() => smoothScroll('contacts')} className="text-gray-700 hover:text-rose-400 transition-colors">Контакты</button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <a href="https://wa.me/+79262563550" 
                 className="bg-rose-400 text-white px-6 py-2 rounded-full hover:bg-rose-500 transition-colors">
                WhatsApp
              </a>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-1">
              <button onClick={() => smoothScroll('home')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-rose-400">Главная</button>
              <button onClick={() => smoothScroll('portfolio')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-rose-400">Портфолио</button>
              <button onClick={() => smoothScroll('services')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-rose-400">Услуги</button>
              <button onClick={() => smoothScroll('reviews')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-rose-400">Отзывы</button>
              <button onClick={() => smoothScroll('contacts')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-rose-400">Контакты</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Фотограф
                  <span className="text-rose-400 block">Ирина</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Свадебная, портретная и романтическая фотосъемка в Москве. 
                  Создаю истории, которые останутся с вами навсегда.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => smoothScroll('portfolio')}
                  className="bg-rose-400 text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-all duration-300 flex items-center justify-center group"
                >
                  Посмотреть работы
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => smoothScroll('contacts')}
                  className="border-2 border-rose-400 text-rose-400 px-8 py-3 rounded-full hover:bg-rose-400 hover:text-white transition-all duration-300"
                >
                  Забронировать съемку
                </button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Счастливых пар</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">Лет опыта</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Фотографий</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616c4f88464?w=600&h=800&fit=crop" 
                  alt="Фотограф Ирина" 
                  className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-rose-200 to-pink-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Портфолио</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Каждая фотография рассказывает историю. Посмотрите на мои работы в разных жанрах.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-full p-1 flex space-x-1">
              {[
                { id: 'all', label: 'Все работы' },
                { id: 'wedding', label: 'Свадьбы' },
                { id: 'lovestory', label: 'Love Story' },
                { id: 'portrait', label: 'Портреты' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-rose-400 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-medium">{item.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Услуги и цены</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Профессиональная фотосъемка для особенных моментов вашей жизни
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  service.popular ? 'ring-2 ring-rose-400' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-rose-400 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Популярно
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="text-3xl font-bold text-rose-400 mb-2">{service.price}</div>
                    <div className="text-sm text-gray-500">{service.duration}</div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {service.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => smoothScroll('contacts')}
                    className={`w-full py-3 rounded-xl transition-all duration-300 ${
                      service.popular
                        ? 'bg-rose-400 text-white hover:bg-rose-500'
                        : 'border-2 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white'
                    }`}
                  >
                    Забронировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы клиентов</h2>
            <p className="text-xl text-gray-600">Что говорят обо мне мои клиенты</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{review.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-medium text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacts" className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Свяжитесь со мной</h2>
            <p className="text-xl text-gray-600">Готова ответить на все ваши вопросы и забронировать съемку</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-rose-400 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Телефон</div>
                    <div className="text-gray-600">+7 (926) 256-35-50</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-rose-400 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">irina@photo.ru</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-rose-400 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Локация</div>
                    <div className="text-gray-600">Москва и Московская область</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-rose-400 p-3 rounded-full">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Instagram</div>
                    <div className="text-gray-600">@irina_photographer</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Быстрая связь</h3>
                <div className="space-y-3">
                  <a href="https://wa.me/+79262563550" 
                     className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="bg-green-500 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-green-700 font-medium">WhatsApp</span>
                  </a>
                  <a href="tel:+79262563550" 
                     className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-blue-700 font-medium">Позвонить</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Забронировать съемку</h3>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                alert('Спасибо за заявку! Я свяжусь с вами в ближайшее время.');
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваше имя *
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Как вас зовут?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип съемки *
                  </label>
                  <select 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  >
                    <option value="">Выберите тип съемки</option>
                    <option value="wedding">Свадебная съемка</option>
                    <option value="lovestory">Love Story</option>
                    <option value="portrait">Портретная съемка</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата съемки
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all resize-none"
                    placeholder="Расскажите больше о ваших пожеланиях..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-rose-400 text-white py-3 rounded-lg hover:bg-rose-500 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Отправить заявку</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-8 w-8 text-rose-400" />
                <span className="text-2xl font-bold">Ирина</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Профессиональная фотосъемка в Москве. Создаю красивые истории, которые останутся с вами навсегда.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Услуги</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Свадебная фотосъемка</li>
                <li>Love Story</li>
                <li>Портретная съемка</li>
                <li>Семейная фотосессия</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-gray-400">
                <p>+7 (926) 256-35-50</p>
                <p>irina@photo.ru</p>
                <p>Москва, Россия</p>
                <div className="flex space-x-4 pt-4">
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Фотограф Ирина. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-rose-400 text-white p-3 rounded-full shadow-lg hover:bg-rose-500 transition-all duration-300 z-50"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Index;
