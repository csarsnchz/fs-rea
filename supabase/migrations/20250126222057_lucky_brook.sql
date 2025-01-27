/*
  # Real Estate Application Schema

  1. New Tables
    - `profiles`
      - Extends auth.users
      - Stores additional user information
      - Links to auth.users via foreign key
    
    - `properties`
      - Main property listings table
      - Stores all property details
      - Links to profiles for ownership
    
    - `saved_properties`
      - Junction table for user's saved properties
      - Enables users to bookmark properties
    
    - `property_images`
      - Stores property image URLs
      - Links to properties table
    
    - `inquiries`
      - Stores user inquiries about properties
      - Links to both users and properties

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
    - Public read access for properties
    - Protected write access for property owners
*/

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  property_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_size DECIMAL(10,2),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create property_images table
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create saved_properties table
CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Property owners can update their properties"
  ON properties FOR UPDATE
  USING (auth.uid() = owner_id);

-- Property images policies
CREATE POLICY "Property images are viewable by everyone"
  ON property_images FOR SELECT
  USING (true);

CREATE POLICY "Property owners can manage images"
  ON property_images FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM properties WHERE id = property_images.property_id
    )
  );

-- Saved properties policies
CREATE POLICY "Users can view their saved properties"
  ON saved_properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties"
  ON saved_properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave properties"
  ON saved_properties FOR DELETE
  USING (auth.uid() = user_id);

-- Inquiries policies
CREATE POLICY "Users can view their inquiries"
  ON inquiries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Property owners can view received inquiries"
  ON inquiries FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM properties WHERE id = inquiries.property_id
    )
  );

CREATE POLICY "Authenticated users can create inquiries"
  ON inquiries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);