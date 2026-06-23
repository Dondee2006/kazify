-- Create custom types for our data
CREATE TYPE user_role AS ENUM ('client', 'freelancer', 'student');
CREATE TYPE order_status AS ENUM ('escrow_held', 'pending_approval', 'released');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  country TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  joined_date TEXT,
  skills TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT false,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create gigs table
CREATE TABLE gigs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  freelancer_id UUID REFERENCES profiles(id) NOT NULL,
  starting_price NUMERIC NOT NULL,
  delivery_time INTEGER DEFAULT 3,
  image TEXT,
  badges TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gigs are viewable by everyone" ON gigs FOR SELECT USING (true);
CREATE POLICY "Freelancers can insert their own gigs" ON gigs FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can update own gigs" ON gigs FOR UPDATE USING (auth.uid() = freelancer_id);

-- Create shoutouts table
CREATE TABLE shoutouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  budget NUMERIC NOT NULL,
  delivery_time INTEGER DEFAULT 3,
  client_id UUID REFERENCES profiles(id) NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shoutouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shoutouts are viewable by everyone" ON shoutouts FOR SELECT USING (true);
CREATE POLICY "Clients can insert their own shoutouts" ON shoutouts FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gig_id UUID REFERENCES gigs(id) NOT NULL,
  client_id UUID REFERENCES profiles(id) NOT NULL,
  freelancer_id UUID REFERENCES profiles(id) NOT NULL,
  amount NUMERIC NOT NULL,
  status order_status DEFAULT 'escrow_held',
  delivery_note TEXT,
  delivery_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients and freelancers can view their orders" ON orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);
CREATE POLICY "Clients can insert orders" ON orders FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients and freelancers can update orders" ON orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  gig_id UUID REFERENCES gigs(id) NOT NULL,
  client_id UUID REFERENCES profiles(id) NOT NULL,
  freelancer_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Clients can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = client_id);

