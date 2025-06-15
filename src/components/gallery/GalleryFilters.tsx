
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface CategoryProps {
  id: string;
  name: string;
}
interface GalleryFiltersProps {
  categories: CategoryProps[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Поиск */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по названию, описанию, локации..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Категории */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="Категория" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Сортировка */}
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full lg:w-48">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Сначала новые</SelectItem>
          <SelectItem value="oldest">Сначала старые</SelectItem>
          <SelectItem value="title">По названию</SelectItem>
          <SelectItem value="featured">Рекомендуемые</SelectItem>
        </SelectContent>
      </Select>
    </div>
    {/* Активные фильтры */}
    <div className="flex flex-wrap gap-2 mt-4">
      {selectedCategory !== 'all' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCategory('all')}
          className="h-8"
        >
          {categories.find(c => c.id === selectedCategory)?.name} ✕
        </Button>
      )}
      {searchQuery && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchQuery('')}
          className="h-8"
        >
          "{searchQuery}" ✕
        </Button>
      )}
    </div>
  </div>
);

export default GalleryFilters;

