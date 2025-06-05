
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteSettingsManager from './SiteSettingsManager';
import PortfolioManager from './PortfolioManager';
import LocationsManager from './LocationsManager';
import ReviewsManager from './ReviewsManager';
import PricingManager from './PricingManager';
import ExportManager from './ExportManager';

const AllSectionsManager = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель управления сайтом</h1>
        <p className="text-gray-600">Полное управление всеми разделами вашего сайта</p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
          <TabsTrigger value="settings">Настройки</TabsTrigger>
          <TabsTrigger value="portfolio">Портфолио</TabsTrigger>
          <TabsTrigger value="locations">Локации</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          <TabsTrigger value="pricing">Цены</TabsTrigger>
          <TabsTrigger value="export">Экспорт</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Настройки сайта</CardTitle>
            </CardHeader>
            <CardContent>
              <SiteSettingsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Управление портфолио</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Управление локациями</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Управление отзывами</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Управление ценами</CardTitle>
            </CardHeader>
            <CardContent>
              <PricingManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Экспорт данных</CardTitle>
            </CardHeader>
            <CardContent>
              <ExportManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllSectionsManager;
