
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Camera } from 'lucide-react';
import BookingForm from './BookingForm';

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Планы для каждого типа съемки
  const serviceTypes = {
    wedding: {
      name: 'Свадебная съемка',
      plans: [
        { id: 'wedding-basic', name: 'Сборы', price: 20000, duration: '2-3 часа' },
        { id: 'wedding-standard', name: 'Сборы + Торжество', price: 45000, duration: '6-8 часов' },
        { id: 'wedding-premium', name: 'Полный день', price: 70000, duration: 'Весь день', gift: 'Визажист в подарок' }
      ]
    },
    lovestory: {
      name: 'Love Story',
      plans: [
        { id: 'lovestory-basic', name: 'Базовый', price: 8000, duration: '1 час' },
        { id: 'lovestory-standard', name: 'Стандарт', price: 15000, duration: '2 часа' },
        { id: 'lovestory-premium', name: 'Премиум', price: 25000, duration: '3 часа', gift: 'Фотокнига в подарок' }
      ]
    },
    portrait: {
      name: 'Портретная съемка',
      plans: [
        { id: 'portrait-basic', name: 'Базовый', price: 5000, duration: '30 минут' },
        { id: 'portrait-standard', name: 'Стандарт', price: 10000, duration: '1 час' },
        { id: 'portrait-premium', name: 'Премиум', price: 18000, duration: '1.5 часа', gift: 'Макияж в подарок' }
      ]
    },
    corporate: {
      name: 'Корпоративная съемка',
      plans: [
        { id: 'corporate-basic', name: 'Базовый', price: 12000, duration: '1 час' },
        { id: 'corporate-standard', name: 'Стандарт', price: 25000, duration: '2-3 часа' },
        { id: 'corporate-premium', name: 'Мероприятие', price: 40000, duration: '4-6 часов', gift: 'Видеоролик в подарок' }
      ]
    }
  };

  const handleBooking = () => {
    if (selectedDate && selectedService && selectedPlan) {
      setShowBookingForm(true);
    }
  };

  const selectedServiceData = selectedService ? serviceTypes[selectedService as keyof typeof serviceTypes] : null;
  const selectedPlanData = selectedServiceData?.plans.find(plan => plan.id === selectedPlan);

  if (showBookingForm) {
    return (
      <section id="booking" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Оформление заявки</h2>
            <p className="text-xl text-gray-600">
              Заполните форму для подтверждения бронирования
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Детали бронирования</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedServiceData?.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedPlanData?.name}</p>
                  <div className="text-2xl font-bold text-rose-400 mb-2">
                    {selectedPlanData?.price.toLocaleString()} ₽
                  </div>
                  <p className="text-sm text-gray-500">{selectedPlanData?.duration}</p>
                  {selectedPlanData?.gift && (
                    <p className="text-sm text-yellow-600 font-medium mt-2">🎁 {selectedPlanData.gift}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Дата:</span>
                    <span>{selectedDate?.toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowBookingForm(false)}
                  className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Вернуться к выбору
                </button>
              </CardContent>
            </Card>
            
            <BookingForm 
              selectedDate={selectedDate}
              selectedTime=""
              selectedLocation={selectedService}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Бронирование фотосессии</h2>
          <p className="text-xl text-gray-600">
            Выберите тип съемки, план и дату
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Выбор типа съемки */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Тип съемки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(serviceTypes).map(([key, service]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedService(key);
                    setSelectedPlan('');
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedService === key
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">
                    от {Math.min(...service.plans.map(p => p.price)).toLocaleString()} ₽
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Выбор плана */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">План съемки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedServiceData ? (
                selectedServiceData.plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedPlan === plan.id
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm font-semibold text-rose-400">
                      {plan.price.toLocaleString()} ₽
                    </div>
                    <div className="text-xs text-gray-500">{plan.duration}</div>
                    {plan.gift && (
                      <div className="text-xs text-yellow-600 font-medium">🎁 {plan.gift}</div>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Сначала выберите тип съемки</p>
              )}
            </CardContent>
          </Card>

          {/* Календарь */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Дата</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
              {selectedDate && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  {selectedDate.toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Кнопка бронирования */}
        {selectedDate && selectedService && selectedPlan && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Готово к бронированию</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Услуга:</span>
                    <span>{selectedServiceData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>План:</span>
                    <span>{selectedPlanData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Дата:</span>
                    <span>{selectedDate.toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 text-base">
                    <span>Стоимость:</span>
                    <span>{selectedPlanData?.price.toLocaleString()} ₽</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleBooking}
                  className="w-full bg-rose-400 text-white py-3 rounded-lg hover:bg-rose-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <Camera className="h-5 w-5" />
                  <span>Забронировать съемку</span>
                </button>
                
                <p className="text-xs text-gray-500 mt-3">
                  После отправки заявки с вами свяжется администратор
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingCalendar;
