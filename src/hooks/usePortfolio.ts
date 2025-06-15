import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useEffect } from 'react';

// Real-time обновление портфолио
export const usePortfolio = () => {
  const query = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Подписка на real-time изменения таблицы portfolio
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio' },
        (payload) => {
          // Автоматический рефреш данных при любом изменении (insert/update/delete)
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [query]);

  return query;
};

export const usePortfolioActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deletePortfolio = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: ()  => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Успешно",
        description: "Фотография удалена",
      });
    }
  });

  const updatePortfolio = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('portfolio')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Успешно",
        description: "Фотография обновлена",
      });
    }
  });

  return { deletePortfolio, updatePortfolio };
};

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
