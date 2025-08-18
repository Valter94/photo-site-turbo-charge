import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, MapPin, Clock, Navigation, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface LocationSuggestion {
  name: string;
  description: string;
  best_time: string;
  address: string;
  image_search_query: string;
}

interface AILocationFinderProps {
  onLocationAdd?: (location: any) => void;
}

const AILocationFinder: React.FC<AILocationFinderProps> = ({ onLocationAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const { toast } = useToast();

  const searchLocations = async () => {
    if (!query.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите запрос для поиска локаций",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Searching for locations:', query);
      
      const { data, error } = await supabase.functions.invoke('ai-location-images', {
        body: {
          action: 'search_images',
          query: query
        }
      });

      if (error) {
        throw error;
      }

      if (data.success && data.data?.locations) {
        setSuggestions(data.data.locations);
        toast({
          title: "Найдено локаций",
          description: `Найдено ${data.data.locations.length} подходящих мест для фотосессий`,
        });
      } else {
        throw new Error(data.error || 'Не удалось найти локации');
      }
    } catch (error: any) {
      console.error('Error searching locations:', error);
      toast({
        title: "Ошибка поиска",
        description: error.message || "Не удалось найти локации",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addLocationToDatabase = async (location: LocationSuggestion) => {
    try {
      // Generate AI description
      const { data: descData } = await supabase.functions.invoke('ai-location-images', {
        body: {
          action: 'generate_description',
          query: location.name
        }
      });

      const description = descData?.description || location.description;

      // Generate image using the existing image generation
      const imageResponse = await fetch('/api/generate-location-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Beautiful photography location in Moscow: ${location.name}, ${location.description}, professional photography, golden hour lighting, cinematic composition`
        })
      });

      let imageUrl = null;
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.image_url;
      }

      // Add to photoshoot_locations table
      const { data, error } = await supabase
        .from('photoshoot_locations')
        .insert({
          name: location.name,
          description: description,
          address: location.address,
          best_time: location.best_time,
          image_url: imageUrl,
          category_id: 'default-category-id' // You may need to handle categories
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Локация добавлена",
        description: `"${location.name}" успешно добавлена в базу данных`,
      });

      if (onLocationAdd) {
        onLocationAdd(data);
      }

      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s.name !== location.name));

    } catch (error: any) {
      console.error('Error adding location:', error);
      toast({
        title: "Ошибка добавления",
        description: error.message || "Не удалось добавить локацию",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          ИИ Поиск Локаций
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Например: романтические места, осенняя фотосессия, архитектура..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocations()}
          />
          <Button 
            onClick={searchLocations}
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? 'Поиск...' : 'Найти'}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h4 className="font-medium text-sm text-gray-600">
              Найденные локации ({suggestions.length}):
            </h4>
            {suggestions.map((location, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-gray-900">{location.name}</h5>
                  <Button
                    size="sm"
                    onClick={() => addLocationToDatabase(location)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Добавить
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600">{location.description}</p>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {location.address}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {location.best_time}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Введите запрос для поиска новых локаций с помощью ИИ</p>
            <p className="text-xs mt-1">Например: "места для свадебной фотосессии" или "осенние локации"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AILocationFinder;