import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Нет подключения к интернету</CardTitle>
          <CardDescription>
            Вы находитесь в офлайн режиме. Некоторые функции могут быть недоступны.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Что вы можете делать в офлайн режиме:</p>
            <ul className="text-left space-y-1">
              <li>• Просматривать кэшированные страницы</li>
              <li>• Заполнять формы (будут отправлены при подключении)</li>
              <li>• Просматривать загруженные изображения</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </Button>
            
            <Button variant="outline" onClick={handleGoHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>Проверьте подключение к интернету и попробуйте еще раз</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflinePage;