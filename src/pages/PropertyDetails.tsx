import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { supabase } from '../lib/supabase';
import type { RootState } from '../store';
import type { Property, PropertyImage } from '../types/database';
import { Home, Bath, BedDouble, Square, MapPin } from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [property, setProperty] = useState<Property & { property_images: PropertyImage[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        return;
      }

      setProperty(data);
      if (data.property_images?.[0]) {
        setSelectedImage(data.property_images[0].url);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !property || !user) return;

    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          user_id: user.id,
          property_id: property.id,
          message: inquiryMessage,
        }
      ]);

    if (error) {
      console.error('Error sending inquiry:', error);
      return;
    }

    setInquiryMessage('');
    alert('Inquiry sent successfully!');
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src={selectedImage || property.property_images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          {property.property_images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {property.property_images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.url)}
                  className={`relative h-24 rounded-lg overflow-hidden ${
                    selectedImage === image.url ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
          <p className="text-2xl font-semibold text-blue-600 mb-6">
            {formatter.format(property.price)}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {property.bedrooms && (
              <div className="flex items-center">
                <BedDouble className="h-5 w-5 text-gray-400 mr-2" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-5 w-5 text-gray-400 mr-2" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            )}
            {property.area_size && (
              <div className="flex items-center">
                <Square className="h-5 w-5 text-gray-400 mr-2" />
                <span>{property.area_size} sqft</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <p className="text-gray-600 flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              {property.address}, {property.city}, {property.state}, {property.country}
            </p>
            {property.latitude && property.longitude && (
              <div className="mt-4 h-64 rounded-lg overflow-hidden">
                <LoadScript googleMapsApiKey="'import.meta.env.API_KEY'">
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: property.latitude, lng: property.longitude }}
                    zoom={15}
                  >
                    <Marker
                      position={{ lat: property.latitude, lng: property.longitude }}
                    />
                  </GoogleMap>
                </LoadScript>
              </div>
            )}
          </div>

          {isAuthenticated && user?.id !== property.owner_id && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Send Inquiry</h2>
              <form onSubmit={handleInquiry}>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="I'm interested in this property..."
                  required
                ></textarea>
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}