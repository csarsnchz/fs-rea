import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Bath, BedDouble, Square } from 'lucide-react';
import type { Property } from '../../types/database';

interface PropertyCardProps {
  property: Property & {
    property_images: Array<{ url: string; is_primary: boolean }>;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage = property.property_images?.find(img => img.is_primary)?.url ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  return (
    <Link to={`/property/${property.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
        <div className="relative h-48">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
            {formatter.format(property.price)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {property.city}, {property.state}
          </p>
          <div className="flex justify-between text-sm text-gray-600">
            {property.bedrooms && (
              <div className="flex items-center">
                <BedDouble className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.area_size && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area_size} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}