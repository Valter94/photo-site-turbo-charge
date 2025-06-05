
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  });
  const { toast } = useToast();

  const serviceTypes = [
    { value: 'wedding', label: 'Свадебная съемка', price: 'от 50 000 ₽' },
    { value: 'lovestory', label: 'Love Story', price: 'от 15 000 ₽' },
    { value: 'portrait', label: 'Портретная съемка', price: 'от 10 000 ₽' },
    { value: 'family', label: 'Семейная фотосессия', price: 'от 12 000 ₽' },
    { value: 'corporate', label: 'Корпоративная съемка', price: 'от 20 000 ₽' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.name || !formData.email || !formData.serviceType) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время для подтверждения бронирования.",
    });

    // Сброс формы
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      message: ''
    });
    setSelectedDate(undefined);
  };

  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 3);

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Забронировать фотосессию</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите удобную дату и заполните форму - мы свяжемся с вами для уточнения деталей
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Календарь */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-rose-400" />
                <span>Выберите дату</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < today || date > nextMonth}
                className="rounded-md border w-full"
              />
              {selectedDate && (
                <div className="mt-6 p-4 bg-rose-50 rounded-lg">
                  <p className="text-sm text-gray-600">Выбранная дата:</p>
                  <p className="font-semibold text-rose-600">
                    {selectedDate.toLocaleDateString('ru-RU', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Точное время обсуждается индивидуально
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Форма бронирования */}
          <Card>
            <CardHeader>
              <CardTitle>Форма бронирования</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Ваше имя *</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Введите ваше имя"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Телефон</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Тип съемки *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип фотосессии" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          <div className="flex justify-between items-center w-full">
                            <span>{service.label}</span>
                            <span className="text-rose-600 font-semibold ml-4">{service.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Дополнительная информация</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Расскажите о ваших пожеланиях, локации, количестве людей..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 text-lg rounded-full"
                >
                  Отправить заявку
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Что происходит дальше?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Мы свяжемся с вами в течение 2 часов</li>
                  <li>• Обсудим детали и локацию съемки</li>
                  <li>• Подтвердим дату и время</li>
                  <li>• Создадим незабываемые кадры!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
