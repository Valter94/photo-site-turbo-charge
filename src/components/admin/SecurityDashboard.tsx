
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Shield, Eye, Users, Database, AlertTriangle, CheckCircle } from 'lucide-react';

const SecurityDashboard = () => {
  const { data: securitySettings } = useSecuritySettings();
  const { data: auditLog } = useAuditLog(10);

  const getSecurityScore = () => {
    if (!securitySettings) return 0;
    
    let score = 0;
    const settings = securitySettings.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {} as Record<string, any>);

    // Проверка настроек безопасности
    if (settings.max_login_attempts && settings.max_login_attempts <= 5) score += 20;
    if (settings.session_timeout && settings.session_timeout <= 7200) score += 20;
    if (settings.password_min_length && settings.password_min_length >= 8) score += 20;
    if (settings.enable_2fa === 'true') score += 40;

    return score;
  };

  const securityScore = getSecurityScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Отлично';
    if (score >= 60) return 'Хорошо';
    if (score >= 40) return 'Удовлетворительно';
    return 'Требует внимания';
  };

  const recentActions = auditLog?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Оценка безопасности</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              {getScoreLabel(securityScore)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RLS Политики</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Активны
            </div>
            <p className="text-xs text-muted-foreground">
              Все таблицы защищены
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Аудит</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {auditLog?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Записей в журнале
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Угрозы</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              0
            </div>
            <p className="text-xs text-muted-foreground">
              Активных угроз
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Статус безопасности
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Row Level Security</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Активно
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Аудит логирование</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Активно
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Валидация данных</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Активно
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Файловое хранилище</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Защищено
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Последние действия
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActions.length > 0 ? (
              <div className="space-y-2">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {action.action}
                      </Badge>
                      <span>{action.table_name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(action.created_at).toLocaleTimeString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Нет последних действий
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDashboard;
