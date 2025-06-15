import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, Bell, Play, Camera, DollarSign, MapPin, Star, Settings as SettingsIcon, BarChart3, Users, TrendingUp, BookOpen, Download } from 'lucide-react';
import SiteSettingsManager from './SiteSettingsManager';
import TelegramSettings from './TelegramSettings';
import SiteAnalyticsDashboard from './SiteAnalyticsDashboard';
import VideoTutorials from './VideoTutorials';
import PortfolioManager from './PortfolioManager';
import PricingManager from './PricingManager';
import LocationsManager from './LocationsManager';
import ReviewsManager from './ReviewsManager';
import CRMDashboard from './CRMDashboard';
import AnalyticsSetup from './AnalyticsSetup';
import TutorialPresentation from './TutorialPresentation';
import TelegramBotManager from './TelegramBotManager';
import ExportManager from './ExportManager';

const AllSectionsManager = () => {
  const [activeSection, setActiveSection] = useState('portfolio');

  const sections = [
    { id: 'portfolio', label: 'Портфолио', icon: Camera },
    { id: 'pricing', label: '🏷️ Цены', icon: DollarSign },
    { id: 'locations', label: '📍 Локации', icon: MapPin },
    { id: 'reviews', label: '⭐ Отзывы', icon: Star },
    { id: 'settings', label: '⚙️ Настройки', icon: SettingsIcon },
    { id: 'analytics', label: '📊 Аналитика', icon: BarChart3 },
    { id: 'crm', label: '👥 CRM', icon: Users },
    { id: 'seo', label: '🔍 SEO', icon: TrendingUp },
    { id: 'tutorials', label: '📖 Обучение', icon: BookOpen },
    { id: 'telegram', label: '🤖 Telegram', icon: MessageSquare },
    { id: 'export', label: '📤 Экспорт', icon: Download }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'portfolio':
        return <PortfolioManager />;
      case 'pricing':
        return <PricingManager />;
      case 'locations':
        return <LocationsManager />;
      case 'reviews':
        return <ReviewsManager />;
      case 'settings':
        return <SiteSettingsManager />;
      case 'analytics':
        return <SiteAnalyticsDashboard />;
      case 'crm':
        return <CRMDashboard />;
      case 'seo':
        return <AnalyticsSetup />;
      case 'tutorials':
        return <TutorialPresentation />;
      case 'telegram':
        return <TelegramBotManager />;
      case 'export':
        return <ExportManager />;
      default:
        return <PortfolioManager />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="site" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Настройки сайта
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Видео инструкции
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-4">
          <SiteSettingsManager />
        </TabsContent>

        <TabsContent value="telegram" className="space-y-4">
          <TelegramSettings />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SiteAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <VideoTutorials />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllSectionsManager;
