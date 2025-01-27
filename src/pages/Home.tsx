import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { setProperties } from '../store/slices/propertiesSlice';
import type { RootState } from '../store';
import PropertyCard from '../components/property/PropertyCard';

export default function Home() {
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      dispatch(setProperties(data));
    };

    fetchFeaturedProperties();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Find Your Dream Home
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Discover the perfect property from our extensive collection of homes, apartments, and luxury estates.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </div>
  );
}