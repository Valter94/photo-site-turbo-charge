
import { useUpdatePricing } from '@/hooks/usePricing';
import { useUpdateAdditionalService } from '@/hooks/useAdditionalServices';
import { useToast } from '@/hooks/use-toast';

export const usePricingActions = () => {
  const updatePricing = useUpdatePricing();
  const updateService = useUpdateAdditionalService();
  const { toast } = useToast();

  const addNewPricing = async () => {
    try {
      const newPricing = {
        service_type: 'portrait',
        price: 5000,
        duration_hours: 1,
        photos_count: '20-30 обработанных фотографий',
        features: ['Консультация по образу', 'Обработка фотографий', 'Онлайн-галерея'],
        is_active: true
      };

      await updatePricing.mutateAsync(newPricing);
      toast({
        title: "Успешно",
        description: "Новый тариф добавлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить тариф",
        variant: "destructive"
      });
    }
  };

  const addNewService = async () => {
    try {
      const newService = {
        name: 'Новая услуга',
        description: 'Описание услуги',
        price: 1000,
        is_active: true
      };

      await updateService.mutateAsync(newService);
      toast({
        title: "Успешно",
        description: "Новая услуга добавлена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить услугу",
        variant: "destructive"
      });
    }
  };

  return {
    addNewPricing,
    addNewService
  };
};
