
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  location?: string;
  client_name?: string;
  shoot_date?: string;
  is_featured?: boolean;
  created_at?: string;
}

// Обновленные моковые данные с новыми красивыми фотографиями
const mockPortfolioData: PortfolioItem[] = [
  {
    id: '1',
    title: 'Романтическая свадьба в Царицыно',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Сказочная церемония в царском парке с изысканной архитектурой',
    location: 'Музей-заповедник Царицыно',
    client_name: 'Анна и Михаил',
    shoot_date: '2024-09-15',
    is_featured: true
  },
  {
    id: '2',
    title: 'Love Story на набережной',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Нежная прогулка влюбленных с видом на город',
    location: 'Воробьевы горы',
    client_name: 'Елена и Дмитрий',
    shoot_date: '2024-08-20',
    is_featured: true
  },
  {
    id: '3',
    title: 'Элегантный портрет',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Стильная портретная съемка в креативном пространстве',
    location: 'Дизайн-завод Artplay',
    client_name: 'Мария',
    shoot_date: '2024-10-10',
    is_featured: true
  },
  {
    id: '4',
    title: 'Семейное счастье',
    category: 'family',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Теплые семейные моменты среди осенней природы',
    location: 'Парк Сокольники',
    client_name: 'Семья Петровых',
    shoot_date: '2024-10-05',
    is_featured: true
  },
  {
    id: '5',
    title: 'Корпоративные портреты',
    category: 'corporate',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Профессиональная съемка на фоне современной архитектуры',
    location: 'Москва-Сити',
    client_name: 'ООО "Инновации"',
    shoot_date: '2024-11-12',
    is_featured: false
  },
  {
    id: '6',
    title: 'Свадьба в историческом стиле',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Торжественная церемония с панорамным видом на Москву',
    location: 'Коломенское',
    client_name: 'Ольга и Сергей',
    shoot_date: '2024-07-28',
    is_featured: true
  },
  {
    id: '7',
    title: 'Вечерняя романтика',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Романтическая съемка с видом на центр города',
    location: 'Крымский мост',
    client_name: 'Виктория и Артем',
    shoot_date: '2024-09-22',
    is_featured: true
  },
  {
    id: '8',
    title: 'Ожидание чуда',
    category: 'maternity',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae4058c73e28?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Нежная съемка будущей мамы в природной обстановке',
    location: 'Ботанический сад',
    client_name: 'Алина',
    shoot_date: '2024-08-15',
    is_featured: true
  },
  {
    id: '9',
    title: 'Детский портрет',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Искренние эмоции маленькой модели в парке',
    location: 'Сокольники',
    client_name: 'София',
    shoot_date: '2024-09-25',
    is_featured: false
  },
  {
    id: '10',
    title: 'Бизнес-съемка',
    category: 'corporate',
    image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Профессиональные портреты для корпоративного сайта',
    location: 'Деловой центр',
    client_name: 'Алексей К.',
    shoot_date: '2024-08-30',
    is_featured: false
  },
  {
    id: '11',
    title: 'Свадебные детали',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Изысканные детали свадебного торжества',
    location: 'Загородный клуб',
    client_name: 'Анастасия и Игорь',
    shoot_date: '2024-07-12',
    is_featured: true
  },
  {
    id: '12',
    title: 'Художественный портрет',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Творческий портрет с игрой света и тени',
    location: 'Студия',
    client_name: 'Дарья Л.',
    shoot_date: '2024-06-20',
    is_featured: true
  },
  {
    id: '13',
    title: 'Городская love story',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Стильная съемка в городской среде',
    location: 'Патриаршие пруды',
    client_name: 'Максим и Юлия',
    shoot_date: '2024-06-30',
    is_featured: true
  },
  {
    id: '14',
    title: 'Семейная идиллия',
    category: 'family',
    image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Счастливые моменты большой семьи',
    location: 'Парк Горького',
    client_name: 'Семья Смирновых',
    shoot_date: '2024-05-18',
    is_featured: false
  },
  {
    id: '15',
    title: 'Весенняя свадьба',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Нежная церемония в цветущем саду',
    location: 'Аптекарский огород',
    client_name: 'Екатерина и Павел',
    shoot_date: '2024-05-25',
    is_featured: true
  },
  {
    id: '16',
    title: 'Модная фотосессия',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Стильная съемка в урбанистическом стиле',
    location: 'Красная Пресня',
    client_name: 'Анастасия В.',
    shoot_date: '2024-04-12',
    is_featured: true
  },
  {
    id: '17',
    title: 'Романтика в парке',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Нежная прогулка влюбленной пары',
    location: 'Парк Кусково',
    client_name: 'Денис и Кристина',
    shoot_date: '2024-03-20',
    is_featured: true
  },
  {
    id: '18',
    title: 'Элегантная свадьба',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Классическая свадебная церемония',
    location: 'Храм Христа Спасителя',
    client_name: 'Мария и Александр',
    shoot_date: '2024-02-14',
    is_featured: true
  }
];

export const usePortfolio = () => {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Portfolio fetch error, using mock data:", error);
        return mockPortfolioData;
      }

      // Если нет данных в базе, возвращаем mock данные
      return data && data.length > 0 ? data : mockPortfolioData;
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (portfolioData: any) => {
      const { data, error } = await supabase
        .from('portfolio')
        .update(portfolioData)
        .eq('id', portfolioData.id)
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
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить фотографию",
        variant: "destructive"
      });
    }
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
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
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить фотографию",
        variant: "destructive"
      });
    }
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (portfolioData: Omit<PortfolioItem, 'id' | 'created_at'>) => {
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
        description: "Фотография добавлена в портфолио",
      });
    },
    onError: (error) => {
      console.error('Create portfolio error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить фотографию",
        variant: "destructive"
      });
    }
  });
};
