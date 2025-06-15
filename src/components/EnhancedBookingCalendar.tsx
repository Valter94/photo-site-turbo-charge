
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageSquare, Camera, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from './Analytics';
import { supabase } from '@/integrations/supabase/client';
import { useLocations } from '@/hooks/useLocations';
import { usePricing } from '@/hooks/usePricing';

const EnhancedBookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availability, setAvailability] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    locationId: '',
    message: '',
    additionalServices: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { trackBooking } = useAnalytics();
  const { data: locations } = useLocations();
  const { data: pricing } = usePricing();

  // Временные слоты
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Загрузка доступности
  useEffect(() => {
    const fetchAvailability = async () => {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0]);
      
      if (!error && data) {
        setAvailability(data);
      }
    };

    fetchAvailability();
  }, []);

  // Проверка доступности времени
  const isTimeAvailable = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = availability.find(a => 
      a.date === dateStr && 
      a.time_slot === time + ':00'
    );
    return !slot || slot.is_available;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.serviceType) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля и выберите дату и время",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPricing = pricing?.find(p => p.service_type === formData.serviceType);
      
      const { error } = await supabase
        .from('bookings')
        .insert([{
          ...formData,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime + ':00',
          location_id: formData.locationId || null,
          total_price: selectedPricing?.price || 0,
          status: 'pending'
        }]);

      if (error) throw error;

      // Аналитика
      trackBooking(formData.serviceType, selectedPricing?.price || 0);

      toast({
        title: "Успешно!",
        description: `Ваша заявка на ${selectedDate.toLocaleDateString('ru-RU')} в ${selectedTime} отправлена!`,
      });

      // Сброс формы
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        locationId: '',
        message: '',
        additionalServices: []
      });
      setSelectedDate(undefined);
      setSelectedTime('');
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

  const selectedPricing = pricing?.find(p => p.service_type === formData.serviceType);
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 6);

  return (
    <section id="enhanced-booking" className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Расширенная система бронирования
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите удобную дату и время, укажите предпочтения - мы создадим идеальную фотосессию специально для вас
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Календарь и время */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-rose-400" />
                <span>Дата и время</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < today || date > maxDate}
                className="rounded-md border w-full"
              />
              
              {selectedDate && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 rounded-lg">
                    <p className="text-sm text-gray-600">Выбранная дата:</p>
                    <p className="font-semibold text-rose-600">
                      {selectedDate.toLocaleDateString('ru-RU', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="flex items-center space-x-2 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>Выберите время</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => {
                        const available = isTimeAvailable(selectedDate, time);
                        return (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            disabled={!available}
                            onClick={() => setSelectedTime(time)}
                            className={`${!available ? 'opacity-50' : ''} ${
                              selectedTime === time ? 'bg-rose-400 hover:bg-rose-500' : ''
                            }`}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                    {selectedTime && (
                      <Badge variant="secondary" className="mt-2">
                        Выбрано: {selectedTime}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Форма бронирования */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Детали бронирования</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Основная информация</TabsTrigger>
                  <TabsTrigger value="service">Услуга и локация</TabsTrigger>
                  <TabsTrigger value="additional">Дополнительно</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Ваше имя *</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Введите ваше имя"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Email *</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="your.email@example.com"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Телефон</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+7 (999) 123-45-67"
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="service" className="space-y-4">
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Camera className="h-4 w-4" />
                        <span>Тип съемки *</span>
                      </Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value) => setFormData({...formData, serviceType: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Выберите тип фотосессии" />
                        </SelectTrigger>
                        <SelectContent>
                          {pricing?.map((service) => (
                            <SelectItem key={service.id} value={service.service_type}>
                              <div className="flex justify-between items-center w-full">
                                <span>{service.service_type}</span>
                                <span className="text-rose-600 font-semibold ml-4">
                                  {service.price.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedPricing && (
                        <div className="mt-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Продолжительность:</p>
                              <p className="font-semibold">{selectedPricing.duration_hours} ч</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Фотографии:</p>
                              <p className="font-semibold">{selectedPricing.photos_count}</p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-pink-200">
                            <p className="text-lg font-bold text-pink-600">
                              💰 {selectedPricing.price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Локация</span>
                      </Label>
                      <Select
                        value={formData.locationId}
                        onValueChange={(value) => setFormData({...formData, locationId: value})}
                      >
                        <SelectTrigger className="mt-1">
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
                  </TabsContent>

                  <TabsContent value="additional" className="space-y-4">
                    <div>
                      <Label htmlFor="message" className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Дополнительная информация</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Расскажите о ваших пожеланиях: стиль съемки, количество людей, особые пожелания..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">📋 Что происходит после отправки заявки?</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                          <span>Мы свяжемся с вами в течение 2 часов</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                          <span>Обсудим все детали и локацию съемки</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                          <span>Подтвердим дату, время и условия</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                          <span>Создадим незабываемые кадры!</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <div className="flex justify-end mt-6">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                      disabled={isSubmitting || !selectedDate || !selectedTime}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Отправка...
                        </div>
                      ) : (
                        '💌 Забронировать съемку'
                      )}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EnhancedBookingCalendar;
