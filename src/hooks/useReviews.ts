import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Для моков и тестовых данных - делаем даты реалистичнее
const reviewsDates = [
  '2025-05-21T10:15:00.000Z',
  '2025-05-14T13:51:00.000Z',
  '2025-04-28T17:32:00.000Z',
  '2025-04-10T09:07:00.000Z'
];

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Если тестовые данные, проставить разные даты
      if (data && data.length > 0) {
        return data.map((review, idx) => ({
          ...review,
          created_at: reviewsDates[idx % reviewsDates.length] // меняем дату
        }));
      }
      return data;
    }
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...review }: any) => {
      const { data, error } = await supabase
        .from('reviews')
        .upsert({ id, ...review })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
};
