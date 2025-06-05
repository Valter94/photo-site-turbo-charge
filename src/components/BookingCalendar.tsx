
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    location: '',
    message: ''
  });
  const { toast } = useToast();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const serviceTypes = [
    { id: 'wedding', name: 'Свадебная съемка', duration: '8-10 часов', price: 'от 80 000 ₽' },
    { id: 'lovestory', name: 'Love Story', duration: '2-3 часа', price: 'от 25 000 ₽' },
    { id: 'portrait', name: 'Портретная съемка', duration: '1-2 часа', price: 'от 15 000 ₽' },
    { id: 'family', name: 'Семейная фотосессия', duration: '2-3 часа', price: 'от 20 000 ₽' },
    { id: 'corporate', name: 'Корпоративная съемка', duration: '3-4 часа', price: 'от 30 000 ₽' }
  ];

  const popularLocations = [
    'Парк Горького',
    'Царицыно',
    'Красная площадь',
    'Сокольники',
    'Коломенское',
    'Студия',
    'Другая локация'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime || !formData.name || !formData.email || !formData.serviceType) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    // Здесь будет логика отправки данных
    console.log('Booking data:', {
      date,
      time: selectedTime,
      ...formData
    });

    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время для подтверждения брони",
    });

    // Сброс формы
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      location: '',
      message: ''
    });
    setSelectedTime('');
  };

  const selectedService = serviceTypes.find(s => s.id === formData.serviceType);

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Забронировать съемку</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите удобную дату и время для вашей фотосессии
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Календарь и время */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-rose-400" />
                <span>Выбор даты и времени</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
              />
              
              {date && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-rose-400" />
                    <span>Доступное время</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`text-sm ${selectedTime === time ? 'bg-rose-400 hover:bg-rose-500' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Форма бронирования */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-rose-400" />
                <span>Детали бронирования</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Имя *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
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
                  <label className="text-sm font-medium mb-2 block">Телефон</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+7 (926) 256-35-50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Тип съемки *</label>
                  <Select value={formData.serviceType} onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип съемки" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex flex-col">
                            <span>{service.name}</span>
                            <span className="text-xs text-gray-500">{service.duration} • {service.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedService && (
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h4 className="font-medium text-rose-800 mb-2">{selectedService.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-rose-600">
                      <span>⏱ {selectedService.duration}</span>
                      <span>💰 {selectedService.price}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Локация</label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите локацию" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Сообщение</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Расскажите о ваших пожеланиях к съемке..."
                    rows={3}
                  />
                </div>

                {date && selectedTime && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Выбранная дата и время:</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📅 {date.toLocaleDateString('ru-RU')}</span>
                      <span>🕐 {selectedTime}</span>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3"
                  disabled={!date || !selectedTime || !formData.name || !formData.email || !formData.serviceType}
                >
                  Забронировать съемку
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Контактная информация */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Или свяжитесь с нами напрямую</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-5 w-5 text-rose-400" />
                <div>
                  <p className="font-medium">Телефон</p>
                  <p className="text-gray-600">+7 (926) 256-35-50</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-5 w-5 text-rose-400" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">Bagreshevafoto@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <MapPin className="h-5 w-5 text-rose-400" />
                <div>
                  <p className="font-medium">Локация</p>
                  <p className="text-gray-600">Москва, Россия</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
