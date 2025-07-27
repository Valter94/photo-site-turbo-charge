import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  role: 'admin' | 'user';
  username: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              setProfile(profileData);
              
              // Log authentication event
              await supabase.rpc('log_action', {
                p_action: event === 'SIGNED_IN' ? 'LOGIN' : 'AUTH_EVENT',
                p_table_name: 'auth',
                p_record_id: session.user.id,
                p_new_values: { event, email: session.user.email }
              });
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            setProfile(profileData);
          });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Log logout action
      if (user) {
        await supabase.rpc('log_action', {
          p_action: 'LOGOUT',
          p_table_name: 'auth',
          p_record_id: user.id,
          p_new_values: { timestamp: new Date().toISOString() }
        });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Ошибка при выходе из системы",
        variant: "destructive"
      });
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isAuthenticated = !!user && !!session;

  return {
    user,
    session,
    profile,
    loading,
    isAdmin,
    isAuthenticated,
    signOut
  };
};