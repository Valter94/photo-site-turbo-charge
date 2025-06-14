
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
    time: '',
    service_type: '',
    location_id: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: locations } = useLocations();
  const { data: pricing } = usePricing();

  const serviceTypes = [
    { value: 'wedding_preparations', label: 'Утренние сборы' },
    { value: 'wedding_ceremony', label: 'Церемония и банкет' },
    { value: 'wedding_full_day', label: 'Полный свадебный день' },
    { value: 'lovestory', label: 'Love Story' },
    { value: 'portrait', label: 'Портретная съемка' },
    { value: 'family', label: 'Семейная фотосессия' },
    { value: 'maternity', label: 'Съемка беременности' },
    { value: 'newborn', label: 'Съемка новорожденного' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.date || !formData.time || !formData.service_type) {
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
          total_price: selectedPricing?.price || 0,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.",
      });

      // Сброс формы
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
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
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Забронировать съемку</h2>
          <p className="text-xl text-gray-600">
            Заполните форму, и мы свяжемся с вами для обсуждения деталей
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Форма бронирования</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип съемки" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPricing && (
                  <p className="text-sm text-gray-600 mt-2">
                    Цена: {selectedPricing.price.toLocaleString('ru-RU')} ₽ 
                    ({selectedPricing.duration_hours} ч, {selectedPricing.photos_count})
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Время *
                  </label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData({...formData, time: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Локация
                </label>
                <Select
                  value={formData.location_id}
                  onValueChange={(value) => setFormData({...formData, location_id: value})}
                >
                  <SelectTrigger>
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
                  placeholder="Расскажите о ваших пожеланиях к съемке..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingForm;
