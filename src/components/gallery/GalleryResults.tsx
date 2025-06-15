
import React from "react";

interface CategoryProps {
  id: string;
  name: string;
}
interface GalleryResultsProps {
  count: number;
  categories: CategoryProps[];
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}
const GalleryResults: React.FC<GalleryResultsProps> = ({
  count,
}) => (
  <div className="mb-6">
    <p className="text-gray-600">Найдено работ: {count}</p>
  </div>
);

export default GalleryResults;

