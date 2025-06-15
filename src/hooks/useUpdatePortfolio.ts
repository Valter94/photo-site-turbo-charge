
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (portfolioData: any) => {
      const { data, error } = await supabase
        .from('portfolio')
        .insert(portfolioData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Успешно",
        description: "Фото добавлено в портфолио",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить фото в портфолио",
        variant: "destructive"
      });
    }
  });
};
