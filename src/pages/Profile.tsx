import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import type { RootState } from '../store';
import type { Property, SavedProperty, Inquiry } from '../types/database';
import PropertyCard from '../components/property/PropertyCard';

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [savedProperties, setSavedProperties] = useState<(SavedProperty & { property: Property & { property_images: any[] } })[]>([]);
  const [inquiries, setInquiries] = useState<(Inquiry & { property: Property })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const [savedResponse, inquiriesResponse] = await Promise.all([
        supabase
          .from('saved_properties')
          .select('*, property:properties(*, property_images(*))')
          .eq('user_id', user.id),
        supabase
          .from('inquiries')
          .select('*, property:properties(*)')
          .eq('user_id', user.id)
      ]);

      if (savedResponse.error) {
        console.error('Error fetching saved properties:', savedResponse.error);
      } else {
        setSavedProperties(savedResponse.data);
      }

      if (inquiriesResponse.error) {
        console.error('Error fetching inquiries:', inquiriesResponse.error);
      } else {
        setInquiries(inquiriesResponse.data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name: {user?.full_name}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Properties</h2>
        {savedProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProperties.map((saved) => (
              <PropertyCard key={saved.id} property={saved.property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No saved properties yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Inquiries</h2>
        {inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {inquiry.property.title}
                </h3>
                <p className="text-gray-600 mb-2">{inquiry.message}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Status: <span className="capitalize">{inquiry.status}</span>
                  </span>
                  <span className="text-gray-500">
                    Sent: {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No inquiries yet.</p>
        )}
      </div>
    </div>
  );
}