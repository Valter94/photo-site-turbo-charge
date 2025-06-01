
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAvailability = (date?: string) => {
  return useQuery({
    queryKey: ['availability', date],
    queryFn: async () => {
      let query = supabase
        .from('availability')
        .select('*')
        .eq('is_available', true);
      
      if (date) {
        query = query.eq('date', date);
      }
      
      const { data, error } = await query.order('time_slot', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!date
  });
};
