
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import PortfolioManager from './PortfolioManager';
import LocationsManager from './LocationsManager';
import PricingManager from './PricingManager';
import ReviewsManager from './ReviewsManager';
import AdditionalServicesManager from './AdditionalServicesManager';
import TelegramSettings from './TelegramSettings';
import TelegramBotManager from './TelegramBotManager';
import SiteSettingsManager from './SiteSettingsManager';
import SiteAnalyticsDashboard from './SiteAnalyticsDashboard';
import ExportManager from './ExportManager';
import AnalyticsSetup from './AnalyticsSetup';
import AIAdminBot from './AIAdminBot';
import SecurityManager from './SecurityManager';
import SecurityDashboard from './SecurityDashboard';
import { 
  Camera, 
  MapPin, 
  DollarSign, 
  Star, 
  Settings, 
  Bot, 
  MessageSquare,
  BarChart3,
  Download,
  Plus,
  LogOut,
  Shield
} from 'lucide-react';

interface EnhancedAdminPanelProps {
  onLogout: () => void;
}

const EnhancedAdminPanel = ({ onLogout }: EnhancedAdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("security");
  const { signOut } = useAuth();

  const tabs = [
    { id: "security", label: "🔐 Безопасность", icon: Shield },
    { id: "portfolio", label: "Портфолио", icon: Camera },
    { id: "locations", label: "Локации", icon: MapPin },
    { id: "pricing", label: "Цены", icon: DollarSign },
    { id: "services", label: "Доп. услуги", icon: Plus },
    { id: "reviews", label: "Отзывы", icon: Star },
    { id: "ai-bot", label: "🤖 AI Помощник", icon: Bot },
    { id: "telegram", label: "Telegram", icon: MessageSquare },
    { id: "bot", label: "Бот", icon: Bot },
    { id: "settings", label: "Настройки", icon: Settings },
    { id: "analytics", label: "Аналитика", icon: BarChart3 },
    { id: "export", label: "Экспорт", icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                🎨 Панель управления сайтом фотографа
              </CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Добро пожаловать, Администратор
                </span>
                <Button 
                  onClick={signOut}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <TabsList className="grid grid-cols-6 lg:grid-cols-12 gap-2 h-auto bg-transparent">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center gap-2 py-3 px-2 text-xs data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700"
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="hidden sm:block">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Центр безопасности
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SecurityDashboard />
              </CardContent>
            </Card>
            
            <SecurityManager />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Управление портфолио
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PortfolioManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Управление локациями
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Управление ценами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PricingManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Дополнительные услуги
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdditionalServicesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Управление отзывами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-bot" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  🤖 AI Администратор
                  <span className="ml-auto text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full">
                    Неограниченно
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIAdminBot />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="telegram" className="space-y-6">
            <TelegramSettings />
          </TabsContent>

          <TabsContent value="bot" className="space-y-6">
            <TelegramBotManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Настройки сайта
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SiteSettingsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsSetup />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Аналитика сайта
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SiteAnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Экспорт данных
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExportManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAdminPanel;
