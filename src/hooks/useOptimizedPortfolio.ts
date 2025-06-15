
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';

export const useOptimizedPortfolio = (category?: string, limit?: number) => {
  return useQuery({
    queryKey: ['portfolio', category, limit],
    queryFn: async () => {
      let query = supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000,   // 10 минут
  });
};

export const usePortfolioCategories = () => {
  const { data: portfolio } = useOptimizedPortfolio();
  
  return useMemo(() => {
    if (!portfolio) return [];
    
    const categories = Array.from(new Set(portfolio.map(item => item.category)));
    const categoryCounts = categories.map(category => ({
      category,
      count: portfolio.filter(item => item.category === category).length
    }));
    
    return categoryCounts.sort((a, b) => b.count - a.count);
  }, [portfolio]);
};

export const usePortfolioStats = () => {
  const { data: portfolio } = useOptimizedPortfolio();
  
  return useMemo(() => {
    if (!portfolio) return { total: 0, featured: 0, recent: 0 };
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      total: portfolio.length,
      featured: portfolio.filter(item => item.is_featured).length,
      recent: portfolio.filter(item => 
        new Date(item.created_at) > thirtyDaysAgo
      ).length
    };
  }, [portfolio]);
};

export const useOptimizedPortfolioActions = () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Успешно",
        description: "Фотография удалена",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
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
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const addPortfolio = useMutation({
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
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return { 
    deletePortfolio, 
    updatePortfolio, 
    addPortfolio,
    isDeleting: deletePortfolio.isPending,
    isUpdating: updatePortfolio.isPending,
    isAdding: addPortfolio.isPending
  };
};
