
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  selectedDate?: Date;
  selectedTime?: string;
  selectedLocation?: string;
}

const BookingForm = ({ selectedDate, selectedTime, selectedLocation }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          ...formData,
          date: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          time: selectedTime || '12:00',
          location_id: selectedLocation
        });

      if (error) throw error;

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время для уточнения деталей.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Забронировать фотосессию</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Ваше имя"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Input
              type="tel"
              placeholder="Телефон"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div>
            <Select value={formData.service_type} onValueChange={(value) => setFormData({ ...formData, service_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Тип съемки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wedding">Свадебная съемка</SelectItem>
                <SelectItem value="lovestory">Love Story</SelectItem>
                <SelectItem value="portrait">Портретная съемка</SelectItem>
                <SelectItem value="corporate">Корпоративная съемка</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Textarea
              placeholder="Дополнительные пожелания..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>
          
          {selectedDate && selectedTime && (
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Дата:</span>
                <span>{selectedDate.toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between">
                <span>Время:</span>
                <span>{selectedTime}</span>
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
