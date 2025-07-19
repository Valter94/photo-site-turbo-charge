import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioManager from './PortfolioManager';
import LocationsManager from './LocationsManager';
import PricingManager from './PricingManager';
import ReviewsManager from './ReviewsManager';
import SiteSettingsManager from './SiteSettingsManager';
import TelegramSettings from './TelegramSettings';
import TelegramBotManager from './TelegramBotManager';
import PhotoRetouchManager from './PhotoRetouchManager';
import SiteAnalyticsDashboard from './SiteAnalyticsDashboard';
import ExportManager from './ExportManager';
import VideoTutorials from './VideoTutorials';
import { 
  Camera, 
  MapPin, 
  DollarSign, 
  Star, 
  Settings, 
  MessageSquare,
  Bot,
  Wand2,
  BarChart3,
  Download,
  Play,
  Image
} from 'lucide-react';
import LocationImageUpdater from './LocationImageUpdater';

const AllSectionsManager = () => {
  const [activeTab, setActiveTab] = useState('portfolio');

  const tabs = [
    { id: 'portfolio', label: 'Портфолио', icon: Camera },
    { id: 'locations', label: 'Локации', icon: MapPin },
    { id: 'location-images', label: 'Обновить фото локаций', icon: Image },
    { id: 'pricing', label: 'Цены', icon: DollarSign },
    { id: 'reviews', label: 'Отзывы', icon: Star },
    { id: 'retouch', label: 'Ретушь', icon: Wand2 },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'telegram', label: 'Telegram', icon: MessageSquare },
    { id: 'bot', label: 'Бот', icon: Bot },
    { id: 'export', label: 'Экспорт', icon: Download },
    { id: 'tutorials', label: 'Инструкции', icon: Play },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Панель управления сайтом</h1>
        <p className="text-gray-600">Управляйте всем контентом и настройками вашего сайта</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="flex items-center space-x-2 px-3 py-2"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="portfolio" className="mt-6">
          <PortfolioManager />
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <LocationsManager />
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <PricingManager />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsManager />
        </TabsContent>

        <TabsContent value="retouch" className="mt-6">
          <PhotoRetouchManager />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <SiteAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="telegram" className="mt-6">
          <TelegramSettings />
        </TabsContent>

        <TabsContent value="bot" className="mt-6">
          <TelegramBotManager />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportManager />
        </TabsContent>

        <TabsContent value="tutorials" className="mt-6">
          <VideoTutorials />
        </TabsContent>

        <TabsContent value="location-images" className="mt-6">
          <LocationImageUpdater />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SiteSettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllSectionsManager;
