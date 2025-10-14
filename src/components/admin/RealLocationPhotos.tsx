import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Image, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface LocationPhoto {
  url: string;
  title: string;
  source: string;
  width: number;
  height: number;
  license?: string;
}

interface Location {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

const RealLocationPhotos = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationPhoto[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searching, setSearching] = useState(false);
  const queryClient = useQueryClient();

  const { data: locations, isLoading } = useQuery({
    queryKey: ['photoshoot_locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photoshoot_locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Location[];
    }
  });

  const updateLocationImage = useMutation({
    mutationFn: async ({ locationId, imageUrl }: { locationId: string; imageUrl: string }) => {
      try {
        const { error } = await supabase.functions.invoke('admin-location-image-update', {
          body: { locationId, imageUrl }
        });
        if (error) throw error;
      } catch (e) {
        // Фоллбэк: прямое обновление таблицы
        const { error: upErr } = await supabase
          .from('photoshoot_locations')
          .update({ image_url: imageUrl })
          .eq('id', locationId);
        if (upErr) throw upErr;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photoshoot_locations'] });
      toast.success('Изображение локации обновлено');
      setSearchResults([]);
      setSelectedLocation(null);
    },
    onError: (error) => {
      toast.error('Ошибка обновления: ' + error.message);
    }
  });

  const searchRussianPhotos = async (query: string) => {
    setSearching(true);
    try {
      console.log('🔍 Searching Moscow photos for:', query);
      
      const { moscowLocationPhotos, getMoscowLocationPhoto } = await import('@/utils/moscowLocations');
      const mainPhotoUrl = getMoscowLocationPhoto(query);
      
      // Найдем похожие локации из списка московских мест
      const queryLower = query.toLowerCase();
      const relatedLocations = Object.keys(moscowLocationPhotos)
        .filter(key => {
          const similarity = 
            queryLower.includes(key) || 
            key.includes(queryLower) ||
            // Похожие категории
            (queryLower.includes('парк') && key.includes('парк')) ||
            (queryLower.includes('площад') && key.includes('площад')) ||
            (queryLower.includes('монастыр') && key.includes('монастыр')) ||
            (queryLower.includes('набереж') && key.includes('набереж'))
          return similarity;
        })
        .slice(0, 5); // Берем до 5 похожих локаций
      
      const results: LocationPhoto[] = relatedLocations.map((locationKey) => ({
        url: moscowLocationPhotos[locationKey],
        title: `${locationKey.charAt(0).toUpperCase() + locationKey.slice(1)} - Москва`,
        source: 'Unsplash Moscow Collection',
        width: 800,
        height: 600,
        license: 'Unsplash License'
      }));
      
      // Если не нашли похожих, добавляем основное фото
      if (results.length === 0) {
        results.push({
          url: mainPhotoUrl,
          title: `${query} - Москва`,
          source: 'Unsplash Moscow Collection',
          width: 800,
          height: 600,
          license: 'Unsplash License'
        });
      }
      
      console.log(`✅ Found ${results.length} Moscow photos`);
      setSearchResults(results);
      toast.success(`Найдено ${results.length} фотографий Москвы для "${query}"`);
    } catch (error) {
      console.error('❌ Error searching photos:', error);
      toast.error('Ошибка поиска фотографий');
    } finally {
      setSearching(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    searchRussianPhotos(location.name);
  };

  const handleImageUpdate = (locationId: string, imageUrl: string) => {
    updateLocationImage.mutate({ locationId, imageUrl });
  };

  const moscowLocations = [
    'Красная площадь',
    'Воробьевы горы',
    'Парк Горького',
    'ВДНХ',
    'Коломенское',
    'Царицыно',
    'Сокольники',
    'Измайловский парк',
    'Кусково',
    'Останкинская башня',
    'Московский Кремль',
    'Храм Христа Спасителя'
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Загрузка локаций...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Замена фото локаций</h2>
          <p className="text-muted-foreground">
            Поиск и установка реальных фотографий московских локаций
          </p>
        </div>
        
        <Badge variant="secondary" className="flex items-center gap-2">
          <Image className="h-3 w-3" />
          {locations?.length || 0} локаций
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Locations List */}
        <Card>
          <CardHeader>
            <CardTitle>Локации для обновления</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {locations?.map((location) => (
              <div
                key={location.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedLocation?.id === location.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {location.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <img
                      src={location.image_url}
                      alt={location.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
                
                {moscowLocations.includes(location.name) && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Требует обновления
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {selectedLocation ? `Фото для: ${selectedLocation.name}` : 'Выберите локацию'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedLocation ? (
              <div className="text-center py-8 text-muted-foreground">
                Выберите локацию слева для поиска реальных фотографий
              </div>
            ) : searching ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Поиск фотографий в русских источниках...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8">
                <Button
                  onClick={() => searchRussianPhotos(selectedLocation.name)}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Найти реальные фото
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="aspect-video bg-muted rounded mb-3 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{photo.title}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Источник: {photo.source}</span>
                        <span>{photo.width}×{photo.height}</span>
                      </div>
                      
                      {photo.license && (
                        <p className="text-xs text-green-600">{photo.license}</p>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => handleImageUpdate(selectedLocation.id, photo.url)}
                        disabled={updateLocationImage.isPending}
                        className="w-full"
                      >
                        {updateLocationImage.isPending ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                            Обновление...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Установить это фото
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => searchRussianPhotos(selectedLocation.name)}
                  disabled={searching}
                  className="w-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Найти больше фото
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealLocationPhotos;