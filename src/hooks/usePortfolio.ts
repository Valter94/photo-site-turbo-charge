
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePortfolio = () => {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
};
