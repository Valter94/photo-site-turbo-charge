
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocations, useLocationCategories } from '@/hooks/useLocations';
import LocationCard from './LocationCard';
import LocationUploadCard from './LocationUploadCard';

const LocationsManager = () => {
  const { data: locations } = useLocations();
  const { data: categories } = useLocationCategories();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление локациями</h2>
      
      {/* Карточка для добавления новых локаций */}
      <LocationUploadCard />

      {/* Категории */}
      <Card>
        <CardHeader>
          <CardTitle>Категории локаций</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Локации */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations?.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
};

export default LocationsManager;
