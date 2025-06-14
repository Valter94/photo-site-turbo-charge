
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.review) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Отправляем отзыв по email
      const subject = `Новый отзыв от ${formData.name}`;
      const body = `Новый отзыв на сайте фотографа Ирины:

⭐ Оценка: ${formData.rating}/5 звезд

👤 Имя клиента: ${formData.name}
📧 Email: ${formData.email || 'Не указан'}

📝 Отзыв:
${formData.review}

---
Отправлено с сайта фотографа Ирины`;

      window.location.href = `mailto:bagreshevafoto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      toast({
        title: "Спасибо за отзыв!",
        description: "Ваш отзыв отправлен и будет опубликован после модерации",
      });

      // Сброс формы
      setFormData({
        name: '',
        email: '',
        rating: 5,
        review: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отзыв. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          ✨ Оставить отзыв
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ваше имя *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите ваше имя"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (необязательно)
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ваша оценка *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-gray-600">
                {formData.rating} из 5 звезд
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Ваш отзыв *
            </label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="Поделитесь своими впечатлениями о фотосессии..."
              rows={5}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 text-lg font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? (
              'Отправка...'
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Отправить отзыв
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
