
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocations } from '@/hooks/useLocations';
import { usePricing } from '@/hooks/usePricing';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    service_type: '',
    location_id: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: locations } = useLocations();
  const { data: pricing } = usePricing();

  // Перевод типов съемки на русский
  const serviceTypeTranslations: { [key: string]: string } = {
    'wedding_preparations': 'Утренние сборы',
    'wedding_ceremony': 'Церемония и банкет',
    'wedding_full_day': 'Полный свадебный день',
    'lovestory': 'Love Story',
    'portrait': 'Портретная съемка',
    'family': 'Семейная фотосессия',
    'maternity': 'Съемка беременности',
    'newborn': 'Съемка новорожденного',
    'corporate': 'Корпоративная съемка',
    'event': 'Съемка мероприятий'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.date || !formData.service_type) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPricing = pricing?.find(p => p.service_type === formData.service_type);
      
      const { error } = await supabase
        .from('bookings')
        .insert([{
          ...formData,
          time: '10:00:00', // Устанавливаем дефолтное время
          total_price: selectedPricing?.price || 0,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Ваша заявка отправлена. Мы свяжемся с вами для уточнения времени съемки.",
      });

      // Сброс формы
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        service_type: '',
        location_id: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPricing = pricing?.find(p => p.service_type === formData.service_type);

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Забронировать съемку
          </h2>
          <p className="text-xl text-gray-600">
            Заполните форму, и мы свяжемся с вами для обсуждения деталей и времени
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Форма бронирования</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ваше имя"
                    required
                    className="border-2 border-pink-200 focus:border-pink-500 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                    className="border-2 border-pink-200 focus:border-pink-500 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+7 (999) 123-45-67"
                  className="border-2 border-pink-200 focus:border-pink-500 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип съемки *
                </label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData({...formData, service_type: value})}
                >
                  <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500 rounded-lg">
                    <SelectValue placeholder="Выберите тип съемки" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricing?.map((service) => (
                      <SelectItem key={service.id} value={service.service_type}>
                        {serviceTypeTranslations[service.service_type] || service.service_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPricing && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      💰 Цена: <span className="font-bold text-pink-600">{selectedPricing.price.toLocaleString('ru-RU')} ₽</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      ⏱️ Продолжительность: {selectedPricing.duration_hours} ч | 📸 Фотографии: {selectedPricing.photos_count}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата съемки *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="border-2 border-pink-200 focus:border-pink-500 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Время съемки обсудим при звонке
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Локация
                </label>
                <Select
                  value={formData.location_id}
                  onValueChange={(value) => setFormData({...formData, location_id: value})}
                >
                  <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500 rounded-lg">
                    <SelectValue placeholder="Выберите локацию (опционально)" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дополнительная информация
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Расскажите о ваших пожеланиях к съемке, предпочтениям по времени..."
                  rows={4}
                  className="border-2 border-pink-200 focus:border-pink-500 rounded-lg"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Отправка...
                  </div>
                ) : (
                  '💌 Отправить заявку'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingForm;
