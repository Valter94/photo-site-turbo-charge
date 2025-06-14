
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, Bell, Play } from 'lucide-react';
import SiteSettingsManager from './SiteSettingsManager';
import TelegramSettings from './TelegramSettings';
import SiteAnalyticsDashboard from './SiteAnalyticsDashboard';
import VideoTutorials from './VideoTutorials';

const AllSectionsManager = () => {
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
