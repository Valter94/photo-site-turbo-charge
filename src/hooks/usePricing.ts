
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePricing = () => {
  return useQuery({
    queryKey: ['pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });
};
