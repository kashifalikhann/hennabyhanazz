-- Services (fixed-price menu)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  price DECIMAL(10,2) NOT NULL,
  deposit_percentage INTEGER DEFAULT 50,
  category TEXT NOT NULL CHECK (category IN ('walkin', 'events', 'classes', 'custom', 'byod')),
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  service_id UUID REFERENCES services(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  booking_code TEXT UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 8)),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Available time slots
CREATE TABLE available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  UNIQUE(date, time)
);

-- Instagram cached posts
CREATE TABLE instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id TEXT UNIQUE NOT NULL,
  media_url TEXT NOT NULL,
  permalink TEXT,
  caption TEXT,
  media_type TEXT DEFAULT 'IMAGE',
  timestamp TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- Inquiries (for custom/BYOD)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('custom', 'byod', 'event', 'other')),
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'booked', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gift certificates
CREATE TABLE gift_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 12)),
  amount DECIMAL(10,2) NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_email TEXT,
  message TEXT,
  stripe_session_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now(),
  redeemed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_bookings_email ON bookings(client_email);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
CREATE INDEX idx_instagram_fetched ON instagram_posts(fetched_at);
CREATE INDEX idx_available_slots_date ON available_slots(date);

-- Enable Row Level Security (open for anon but service_role for admin)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Anon can read services and instagram posts, can insert bookings
CREATE POLICY "Anyone can read services" ON services FOR SELECT USING (true);
CREATE POLICY "Anyone can read instagram" ON instagram_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read their own booking" ON bookings FOR SELECT USING (client_email = current_user OR client_email = '');
