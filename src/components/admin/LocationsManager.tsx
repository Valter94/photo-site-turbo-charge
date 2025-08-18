
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocations } from '@/hooks/useLocations';
import LocationCard from './LocationCard';
import LocationUploadCard from './LocationUploadCard';
import AILocationFinder from './AILocationFinder';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Plus, Sparkles } from 'lucide-react';

const LocationsManager = () => {
  const { data: locations, isLoading, error } = useLocations();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Загрузка локаций...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Ошибка загрузки локаций: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Location Finder */}
      <AILocationFinder onLocationAdd={(location) => {
        console.log('New location added:', location);
        // The locations will be refreshed automatically due to React Query
      }} />

      {/* Add New Location */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Управление локациями
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                variant={showAddForm ? "outline" : "default"}
              >
                <Plus className="w-4 h-4 mr-2" />
                {showAddForm ? 'Отменить' : 'Добавить вручную'}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showAddForm && (
          <CardContent>
            <LocationUploadCard />
          </CardContent>
        )}
      </Card>
      
      {/* Существующие локации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Текущие локации</span>
            <span className="text-sm text-gray-500">
              Всего: {locations?.length || 0}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locations && locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Пока нет локаций для съемки</p>
              <p className="text-sm mt-1">Используйте ИИ поиск или добавьте локацию вручную</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsManager;
