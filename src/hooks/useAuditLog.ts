
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuditLog = (limit = 100) => {
  return useQuery({
    queryKey: ['audit_log', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useLogAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      action,
      table_name,
      record_id,
      old_values,
      new_values
    }: {
      action: string;
      table_name: string;
      record_id?: string;
      old_values?: any;
      new_values?: any;
    }) => {
      const { error } = await supabase.rpc('log_action', {
        p_action: action,
        p_table_name: table_name,
        p_record_id: record_id,
        p_old_values: old_values,
        p_new_values: new_values
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_log'] });
    }
  });
};
