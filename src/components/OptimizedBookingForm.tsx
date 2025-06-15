
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocations } from '@/hooks/useLocations';
import { usePricing } from '@/hooks/usePricing';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const OptimizedBookingForm = () => {
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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const { toast } = useToast();
  const { data: locations } = useLocations();
  const { data: pricing } = usePricing();

  // Мемоизированные переводы
  const serviceTypeTranslations = useMemo(() => ({
    'wedding_preparations': 'Утренние сборы',
    'wedding_ceremony': 'Церемония и банкет',
    'wedding_full_day': 'Полный свадебный день',
    'lovestory': 'Love Story',
    'portrait': 'Портретная съемка',
    'family': 'Семейная фотосессия',
    'maternity': 'Съемка беременности',
    'event': 'Съемка мероприятий'
  }), []);

  // Валидация в реальном времени
  const validateField = useCallback((field: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    switch (field) {
      case 'name':
        if (value.length < 2) errors.name = 'Имя должно содержать минимум 2 символа';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errors.email = 'Некорректный формат email';
        break;
      case 'phone':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (value && !phoneRegex.test(value)) errors.phone = 'Некорректный формат телефона';
        break;
      case 'date':
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) errors.date = 'Дата не может быть в прошлом';
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: errors[field] || ''
    }));
    
    return !errors[field];
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Валидация с задержкой для лучшего UX
    setTimeout(() => validateField(field, value), 300);
  }, [validateField]);

  const isFormValid = useMemo(() => {
    const requiredFields = ['name', 'email', 'date', 'service_type'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData]);
    const hasNoErrors = Object.values(validationErrors).every(error => !error);
    
    return hasRequiredFields && hasNoErrors;
  }, [formData, validationErrors]);

  const selectedPricing = useMemo(() => 
    pricing?.find(p => p.service_type === formData.service_type),
    [pricing, formData.service_type]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, исправьте ошибки в форме",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          ...formData,
          time: '10:00:00',
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
        service_type: '',
        location_id: '',
        message: ''
      });
      setValidationErrors({});

    } catch (error: any) {
      toast({
        title: "Ошибка отправки",
        description: error.message || "Попробуйте еще раз",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputWithValidation = ({ 
    field, 
    type = 'text', 
    placeholder, 
    required = false 
  }: {
    field: string;
    type?: string;
    placeholder: string;
    required?: boolean;
  }) => (
    <div className="relative">
      <Input
        type={type}
        value={formData[field as keyof typeof formData]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`border-2 transition-colors ${
          validationErrors[field] 
            ? 'border-red-300 focus:border-red-500' 
            : 'border-pink-200 focus:border-pink-500'
        } rounded-lg`}
      />
      {validationErrors[field] && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {validationErrors[field]}
        </div>
      )}
      {formData[field as keyof typeof formData] && !validationErrors[field] && (
        <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
      )}
    </div>
  );

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Забронировать съемку
          </h2>
          <p className="text-xl text-gray-600">
            Заполните форму, и мы свяжемся с вами для обсуждения деталей
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
                  <InputWithValidation
                    field="name"
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <InputWithValidation
                    field="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <InputWithValidation
                  field="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип съемки *
                </label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => handleInputChange('service_type', value)}
                >
                  <SelectTrigger className="border-2 border-pink-200 focus:border-pink-500 rounded-lg">
                    <SelectValue placeholder="Выберите тип съемки" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricing?.filter(service => 
                      !['newborn', 'corporate'].includes(service.service_type)
                    ).map((service) => (
                      <SelectItem key={service.id} value={service.service_type}>
                        {serviceTypeTranslations[service.service_type as keyof typeof serviceTypeTranslations] || service.service_type}
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
                <InputWithValidation
                  field="date"
                  type="date"
                  placeholder=""
                  required
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
                  onValueChange={(value) => handleInputChange('location_id', value)}
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
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Расскажите о ваших пожеланиях к съемке, предпочтениям по времени..."
                  rows={4}
                  className="border-2 border-pink-200 focus:border-pink-500 rounded-lg"
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full text-white text-lg py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                  !isFormValid 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:scale-105'
                }`}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
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

export default OptimizedBookingForm;
