import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setProperties, setFilters } from '../store/slices/propertiesSlice';
import type { RootState } from '../store';
import PropertyCard from '../components/property/PropertyCard';
import { Search } from 'lucide-react';

export default function Explore() {
  const dispatch = useDispatch();
  const { properties, loading, filters } = useSelector((state: RootState) => state.properties);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase
        .from('properties')
        .select('*, property_images(*)');

      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      if (filters.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms);
      }
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      dispatch(setProperties(data));
    };

    fetchProperties();
  }, [dispatch, filters, searchTerm]);

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Villa'];
  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={filters.propertyType || ''}
                onChange={(e) => dispatch(setFilters({ propertyType: e.target.value || null }))}
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="border border-gray-300 rounded-md p-2"
                  value={filters.minPrice || ''}
                  onChange={(e) => dispatch(setFilters({ minPrice: e.target.value ? Number(e.target.value) : null }))}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="border border-gray-300 rounded-md p-2"
                  value={filters.maxPrice || ''}
                  onChange={(e) => dispatch(setFilters({ maxPrice: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={filters.bedrooms || ''}
                onChange={(e) => dispatch(setFilters({ bedrooms: e.target.value ? Number(e.target.value) : null }))}
              >
                <option value="">Any</option>
                {bedroomOptions.map(num => (
                  <option key={num} value={num}>{num}+ beds</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={filters.bathrooms || ''}
                onChange={(e) => dispatch(setFilters({ bathrooms: e.target.value ? Number(e.target.value) : null }))}
              >
                <option value="">Any</option>
                {bathroomOptions.map(num => (
                  <option key={num} value={num}>{num}+ baths</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}