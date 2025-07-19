import React, { useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { useLocationActions } from '@/hooks/useLocationActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const LocationImageUpdater = () => {
  const { data: locations, isLoading } = useLocations();
  const { updateLocation } = useLocationActions();
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  const imageUpdates = {
    'Красная площадь': '/locations/red-square-new.jpg',
    'Музей-усадьба Царицыно': '/locations/tsaritsyno-new.jpg',
    'ВДНХ': '/locations/vdnkh-new.jpg',
    'Воробьевы горы': '/locations/vorobyovy-gory-new.jpg',
    'Музей-заповедник Коломенское': '/locations/kolomenskoye-new.jpg',
  };

  const handleUpdateImage = async (locationId: string, locationName: string, newImageUrl: string) => {
    setUpdating(prev => ({ ...prev, [locationId]: true }));
    
    try {
      await updateLocation.mutateAsync({
        id: locationId,
        image_url: newImageUrl
      });
      
      toast.success(`Изображение для "${locationName}" обновлено`);
    } catch (error) {
      toast.error(`Ошибка обновления изображения для "${locationName}"`);
      console.error('Error updating location image:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [locationId]: false }));
    }
  };

  const handleUpdateAll = async () => {
    const locationsToUpdate = locations?.filter(location => 
      imageUpdates[location.name as keyof typeof imageUpdates]
    ) || [];

    for (const location of locationsToUpdate) {
      const newImageUrl = imageUpdates[location.name as keyof typeof imageUpdates];
      if (newImageUrl) {
        await handleUpdateImage(location.id, location.name, newImageUrl);
        // Small delay between updates
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Загрузка локаций...</span>
      </div>
    );
  }

  const locationsWithUpdates = locations?.filter(location => 
    imageUpdates[location.name as keyof typeof imageUpdates]
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Обновление изображений локаций</h2>
          <p className="text-muted-foreground">
            Замена изображений на более качественные версии
          </p>
        </div>
        
        {locationsWithUpdates.length > 0 && (
          <Button 
            onClick={handleUpdateAll}
            disabled={Object.values(updating).some(Boolean)}
            className="bg-primary hover:bg-primary/90"
          >
            {Object.values(updating).some(Boolean) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Обновление...
              </>
            ) : (
              'Обновить все'
            )}
          </Button>
        )}
      </div>

      {locationsWithUpdates.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Нет локаций для обновления. Все доступные изображения уже актуальны.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {locationsWithUpdates.map((location) => {
          const newImageUrl = imageUpdates[location.name as keyof typeof imageUpdates];
          const isUpdating = updating[location.id];
          
          return (
            <Card key={location.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{location.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {location.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    <Image className="h-3 w-3 mr-1" />
                    Обновление доступно
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Current Image */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Текущее изображение
                    </h4>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={location.image_url}
                        alt={`Current ${location.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>

                  {/* New Image */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Новое изображение
                    </h4>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={newImageUrl}
                        alt={`New ${location.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => handleUpdateImage(location.id, location.name, newImageUrl)}
                    disabled={isUpdating}
                    variant="default"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Обновление...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Обновить изображение
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LocationImageUpdater;