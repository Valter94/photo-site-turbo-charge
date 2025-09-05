import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { safeLocalStorage } from '@/utils/storageUtils';

interface AdminSession {
  isAdmin: boolean;
  loginTime: string;
  email: string;
}

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing admin session
    const checkAdminSession = () => {
      try {
        const sessionData = safeLocalStorage.getItem('admin_session');
        if (sessionData) {
          const session: AdminSession = JSON.parse(sessionData);
          const loginTime = new Date(session.loginTime);
          const now = new Date();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
          
          // Check if session is still valid
          if (now.getTime() - loginTime.getTime() < sessionDuration && session.isAdmin) {
            setIsAdmin(true);
            setIsAuthenticated(true);
          } else {
            // Session expired, clear it
            safeLocalStorage.setItem('admin_session', '');
            setIsAdmin(false);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        setIsAdmin(false);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAdminSession();
  }, []);

  const signOut = async () => {
    try {
      // Clear admin session
      safeLocalStorage.setItem('admin_session', '');
      safeLocalStorage.setItem('admin_lockout', '');
      
      setIsAdmin(false);
      setIsAuthenticated(false);
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из админ-панели",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Ошибка при выходе из системы",
        variant: "destructive"
      });
    }
  };

  return {
    loading,
    isAdmin,
    isAuthenticated,
    signOut
  };
};