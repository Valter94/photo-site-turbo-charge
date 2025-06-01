
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};
