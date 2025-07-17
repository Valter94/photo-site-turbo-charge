
import React from 'react';
import { useLocations } from '@/hooks/useLocations';
import LocationCard from './LocationCard';
import LocationUploadCard from './LocationUploadCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin } from 'lucide-react';

const LocationsManager = () => {
  const { data: locations, isLoading, error } = useLocations();

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <MapPin className="h-6 w-6 mr-2" />
          Управление локациями
        </h2>
        <div className="text-sm text-gray-500">
          Всего локаций: {locations?.length || 0}
        </div>
      </div>
      
      {/* Карточка для добавления новых локаций */}
      <LocationUploadCard />
      
      {/* Существующие локации */}
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
          <p className="text-sm mt-1">Добавьте первую локацию, используя форму выше</p>
        </div>
      )}
    </div>
  );
};

export default LocationsManager;
