
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { safeLocalStorage } from '@/utils/storageUtils';

interface AdminLoginProps {
  onLogin: () => void;
}

const ADMIN_EMAIL = 'otiparty@ya.ru';
const ADMIN_PASSWORD = 'Ameliya2024';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Check for existing lockout on component mount
  React.useEffect(() => {
    const lockoutData = safeLocalStorage.getItem('admin_lockout');
    if (lockoutData) {
      const lockout = JSON.parse(lockoutData);
      const lockoutEnd = new Date(lockout.until);
      if (new Date() < lockoutEnd) {
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
        setLoginAttempts(lockout.attempts);
      } else {
        safeLocalStorage.setItem('admin_lockout', '');
      }
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Доступ заблокирован",
        description: `Слишком много неудачных попыток. Попробуйте через ${Math.ceil((lockoutTime!.getTime() - new Date().getTime()) / 60000)} минут.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check hardcoded credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Clear any lockout data
        safeLocalStorage.setItem('admin_lockout', '');
        setLoginAttempts(0);
        
        // Store admin session
        safeLocalStorage.setItem('admin_session', JSON.stringify({
          isAdmin: true,
          loginTime: new Date().toISOString(),
          email: ADMIN_EMAIL
        }));
        
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в админ-панель!",
        });
        
        onLogin();
        return;
      }

      // Failed login
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = new Date(Date.now() + LOCKOUT_TIME);
        setIsLocked(true);
        setLockoutTime(lockoutUntil);
        
        safeLocalStorage.setItem('admin_lockout', JSON.stringify({
          attempts: newAttempts,
          until: lockoutUntil.toISOString()
        }));
        
        toast({
          title: "Доступ заблокирован",
          description: `Слишком много неудачных попыток. Доступ заблокирован на 15 минут.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Неверные данные",
          description: `Неправильный email или пароль. Осталось попыток: ${MAX_ATTEMPTS - newAttempts}`,
          variant: "destructive"
        });
      }
      
      // Clear form for security
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при входе",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Админ-панель</CardTitle>
          <p className="text-gray-600">Безопасный вход в систему</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email администратора
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLocked}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLocked}
                />
              </div>
            </div>
            
            {isLocked && lockoutTime && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                🔒 Доступ заблокирован до {lockoutTime.toLocaleTimeString('ru-RU')} из-за множественных неудачных попыток входа.
              </div>
            )}
            
            {loginAttempts > 0 && loginAttempts < MAX_ATTEMPTS && !isLocked && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                ⚠️ Неудачных попыток: {loginAttempts}/{MAX_ATTEMPTS}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 transition-all duration-200"
              disabled={isLoading || isLocked}
            >
              {isLoading ? 'Проверка данных...' : 'Войти в админ-панель'}
            </Button>
            
            <div className="text-xs text-center text-gray-500 mt-4">
              Только для авторизованных администраторов
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
