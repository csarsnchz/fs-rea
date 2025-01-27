export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  price: number;
  property_type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_size: number | null;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  user_id: string;
  property_id: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}