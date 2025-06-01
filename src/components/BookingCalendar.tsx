
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Временные данные - в реальности будут из Supabase
  const availableSlots = [
    { time: '09:00', available: true, price: 8000 },
    { time: '11:00', available: true, price: 8000 },
    { time: '13:00', available: false, price: 8000 },
    { time: '15:00', available: true, price: 10000 },
    { time: '17:00', available: true, price: 12000 },
    { time: '19:00', available: true, price: 15000 }
  ];

  const packages = [
    {
      id: 'basic',
      name: 'Базовый пакет',
      duration: '1 час',
      photos: '20-30 фото',
      price: 8000,
      features: ['Базовая ретушь', 'Онлайн-галерея', 'Консультация по образу']
    },
    {
      id: 'standard',
      name: 'Стандартный пакет',
      duration: '2 часа',
      photos: '50-70 фото',
      price: 15000,
      features: ['Профессиональная ретушь', 'Онлайн-галерея', 'Консультация по образу', 'Смена локации']
    },
    {
      id: 'premium',
      name: 'Премиум пакет',
      duration: '3 часа',
      photos: '80-120 фото',
      price: 25000,
      features: ['Художественная ретушь', 'Онлайн-галерея', 'Консультация по образу', '2-3 локации', 'Печатные фото']
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Бронирование фотосессии</h2>
          <p className="text-xl text-gray-600">
            Выберите удобную дату и время для вашей фотосессии
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Календарь */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Выберите дату</span>
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
            </CardContent>
          </Card>

          {/* Доступное время */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Доступное время</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDate && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedDate.toLocaleDateString('ru-RU', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedTime === slot.time
                          ? 'border-rose-400 bg-rose-50'
                          : slot.available
                          ? 'border-gray-200 hover:border-gray-300 bg-white'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{slot.time}</span>
                        {slot.available ? (
                          <Badge variant="secondary">{slot.price.toLocaleString()} ₽</Badge>
                        ) : (
                          <Badge variant="destructive">Занято</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Пакеты услуг */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Выберите пакет</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border rounded-lg p-4 hover:border-rose-400 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{pkg.name}</h3>
                    <Badge className="bg-rose-400 text-white">
                      {pkg.price.toLocaleString()} ₽
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-4">
                      <span>⏱️ {pkg.duration}</span>
                      <span>📸 {pkg.photos}</span>
                    </div>
                  </div>
                  
                  <ul className="text-xs text-gray-500 space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Кнопка бронирования */}
        {selectedDate && selectedTime && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Подтверждение бронирования</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Дата:</span>
                    <span>{selectedDate.toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Время:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Стоимость:</span>
                    <span>от 8,000 ₽</span>
                  </div>
                </div>
                
                <button className="w-full bg-rose-400 text-white py-3 rounded-lg hover:bg-rose-500 transition-colors">
                  Забронировать съемку
                </button>
                
                <p className="text-xs text-gray-500 mt-3">
                  После бронирования с вами свяжется администратор для уточнения деталей
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">
            💡 Для полной функциональности календаря требуется Supabase
          </h3>
          <p className="text-blue-700">
            Подключите Supabase для реального управления бронированиями, доступностью и автоматических уведомлений
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
