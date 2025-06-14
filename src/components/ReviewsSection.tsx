
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Quote, Mail } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';

const ReviewsSection = () => {
  const { data: reviews, isLoading } = useReviews();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    comment: '',
    service_type: ''
  });

  // Моковые отзывы с реальными данными
  const mockReviews = [
    {
      id: '1',
      name: 'Анна и Михаил',
      rating: 5,
      comment: 'Ирина - настоящий профессионал! Наша свадебная съемка прошла превосходно. Каждый кадр пропитан эмоциями и любовью. Фотографии получились просто волшебными!',
      service_type: 'Свадебная съемка',
      created_at: '2024-09-15'
    },
    {
      id: '2',
      name: 'Елена Петрова',
      rating: 5,
      comment: 'Потрясающая работа! Love Story съемка в Патриарших прудах была очень романтичной. Ирина умеет найти подход к каждому клиенту и создать непринужденную атмосферу.',
      service_type: 'Love Story',
      created_at: '2024-08-20'
    },
    {
      id: '3',
      name: 'Семья Смирновых',
      rating: 5,
      comment: 'Семейная фотосессия с детьми - это всегда вызов, но Ирина справилась блестяще! Дети были в восторге, а мы получили прекрасные семейные фотографии.',
      service_type: 'Семейная съемка',
      created_at: '2024-10-05'
    },
    {
      id: '4',
      name: 'Мария Иванова',
      rating: 5,
      comment: 'Индивидуальная портретная съемка превзошла все ожидания. Ирина помогла мне почувствовать себя уверенно перед камерой. Результат - шикарные фотографии!',
      service_type: 'Портретная съемка',
      created_at: '2024-07-10'
    },
    {
      id: '5',
      name: 'Алексей Козлов',
      rating: 5,
      comment: 'Корпоративная съемка для нашей компании была организована на высшем уровне. Профессиональный подход, отличное качество фотографий и соблюдение всех сроков.',
      service_type: 'Корпоративная съемка',
      created_at: '2024-08-30'
    },
    {
      id: '6',
      name: 'Виктория и Артем',
      rating: 5,
      comment: 'Романтическая съемка на Крымском мосту была незабываемой! Ирина создала такую атмосферу, что мы забыли о камере и просто наслаждались моментом.',
      service_type: 'Love Story',
      created_at: '2024-09-22'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.rating || !formData.comment) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    // Отправляем email вместо сохранения в базу данных
    const subject = 'Новый отзыв с сайта фотографа';
    const body = `Новый отзыв от клиента:

Имя: ${formData.name}
Email: ${formData.email}
Оценка: ${formData.rating} звезд
Тип услуги: ${formData.service_type}

Комментарий:
${formData.comment}

---
Отправлено с сайта фотографа Ирины`;

    window.location.href = `mailto:bagreshevafoto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Сброс формы
    setFormData({
      name: '',
      email: '',
      rating: '',
      comment: '',
      service_type: ''
    });
    setShowForm(false);

    toast({
      title: "Спасибо!",
      description: "Ваш отзыв будет отправлен фотографу",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Загрузка отзывов...</h2>
          </div>
        </div>
      </section>
    );
  }

  // Используем базу данных если есть, иначе моковые данные
  const displayReviews = reviews && reviews.length > 0 ? reviews.filter(r => r.is_approved) : mockReviews;

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы клиентов</h2>
          <p className="text-xl text-gray-600 mb-8">
            Что говорят о моей работе довольные клиенты
          </p>
          
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Оставить отзыв
          </Button>
        </div>

        {/* Форма для отзыва */}
        {showForm && (
          <Card className="max-w-2xl mx-auto mb-12">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Поделитесь своим впечатлением</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => setFormData({ ...formData, rating: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Оценка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ (5 звезд)</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ (4 звезды)</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ (3 звезды)</SelectItem>
                      <SelectItem value="2">⭐⭐ (2 звезды)</SelectItem>
                      <SelectItem value="1">⭐ (1 звезда)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Тип съемки" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Свадебная съемка</SelectItem>
                      <SelectItem value="portrait">Портретная съемка</SelectItem>
                      <SelectItem value="family">Семейная съемка</SelectItem>
                      <SelectItem value="lovestory">Love Story</SelectItem>
                      <SelectItem value="corporate">Корпоративная съемка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="Расскажите о своих впечатлениях..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  required
                />

                <div className="flex gap-4">
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                    Отправить отзыв
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Отзывы */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <Quote className="h-8 w-8 text-pink-300" />
                </div>
                
                <p className="text-gray-700 mb-4 flex-grow italic">
                  "{review.comment}"
                </p>
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  {review.service_type && (
                    <p className="text-sm text-gray-500">{review.service_type}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {displayReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Отзывы пока не добавлены. Станьте первым!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
