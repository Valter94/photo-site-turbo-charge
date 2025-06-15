
import React from "react";

const GalleryHeader = ({ isLoading = false }: { isLoading?: boolean }) => (
  <div className="text-center mb-16">
    {isLoading ? (
      <>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
        </div>
      </>
    ) : (
      <>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Портфолио</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Вся коллекция кадров — личное портфолио и галерея работ.
        </p>
      </>
    )}
  </div>
);

export default GalleryHeader;

