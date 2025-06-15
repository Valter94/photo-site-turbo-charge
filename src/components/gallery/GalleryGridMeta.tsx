
import React from "react";
import { MapPin, Calendar, User, Heart } from "lucide-react";

interface GalleryGridMetaProps {
  location?: string;
  client_name?: string;
  shoot_date?: string;
  liked?: boolean;
}

const GalleryGridMeta: React.FC<GalleryGridMetaProps> = ({
  location,
  client_name,
  shoot_date,
  liked,
}) => (
  <div className="space-y-2 text-sm">
    {location && (
      <div className="flex items-center text-gray-500">
        <MapPin className="w-4 h-4 mr-2 text-pink-500" />
        <span>{location}</span>
      </div>
    )}
    {client_name && (
      <div className="flex items-center text-gray-500">
        <User className="w-4 h-4 mr-2 text-purple-500" />
        <span>{client_name}</span>
      </div>
    )}
    {shoot_date && (
      <div className="flex items-center text-gray-500">
        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
        <span>{new Date(shoot_date).toLocaleDateString("ru-RU")}</span>
      </div>
    )}
    {liked && (
      <div className="flex items-center text-red-500">
        <Heart className="w-4 h-4 mr-2 fill-current" />
        <span>Нравится</span>
      </div>
    )}
  </div>
);

export default GalleryGridMeta;
