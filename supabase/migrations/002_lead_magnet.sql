-- Lead magnet / newsletter subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'lead-magnet',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Subscribers can read own email" ON subscribers FOR SELECT USING (email = current_user);
