-- ====================================================================
-- PIANOW Database Schema for Supabase
-- ====================================================================
--
-- IMPORTANT: HOW TO RUN THIS FILE
--
-- 1. Recommended (Easiest & Bypasses Port 5432 Firewalls):
--    - Go to your Supabase project dashboard: https://supabase.com/dashboard
--    - Click on "SQL Editor" in the left sidebar
--    - Click "+ New Query"
--    - Paste the entire contents of this file into the editor and click "Run" (Cmd/Ctrl + Enter)
--    - Running in the Supabase web console connects over HTTPS, which completely avoids
--      "ECONNREFUSED" port 5432 errors.
--
-- 2. Why you might get "connect ECONNREFUSED ...:5432" in external tools:
--    - Direct PostgreSQL connections to db.<project-ref>.supabase.co on port 5432 use IPv6
--      and are often refused if your network/client lacks IPv6 routing or if the project is paused.
--    - If connecting via an external client (VSCode SQL extension, DBeaver, psql):
--      Go to Supabase Dashboard -> Project Settings -> Database -> Connection String.
--      Switch to "Connection Pooling" (using host `aws-0-[region].pooler.supabase.com` on port 6543).
--
-- 3. Note for PIANOW Application:
--    - The PIANOW web app connects to Supabase via the official HTTPS REST API (@supabase/supabase-js),
--      so it does NOT require port 5432 to be open.
-- ====================================================================

-- 1) Extension: prefer pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','teacher','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for case-insensitive email lookups
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email));

-- 3) Teachers (one-to-one with users)
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_students INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers (user_id);

-- Optional: normalized teacher_specialties table for querying/filtering
CREATE TABLE IF NOT EXISTS teacher_specialties (
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  PRIMARY KEY (teacher_id, specialty)
);

-- 4) Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  youtube_url TEXT,
  duration INTERVAL DEFAULT '30 minutes', -- use interval for duration calculations
  level TEXT NOT NULL DEFAULT 'Beginner' CHECK (level IN ('Beginner','Intermediate','Advanced','All Levels')),
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  thumbnail TEXT,
  price NUMERIC(10,2),
  is_free BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON lessons (teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons (level);

-- 5) Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  category TEXT NOT NULL CHECK (category IN ('piano','guitar','drums','audio','accessories','instruments')),
  images TEXT[] DEFAULT ARRAY[]::text[],
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  brand TEXT,
  rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);

-- 6) Carts & Cart Items (normalized instead of JSONB)
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items (cart_id);

-- 7) Orders & Order Items (normalized)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

-- 8) Single updated_at trigger function (public schema)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Attach trigger to multiple tables in a loop (perform once)
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'users','teachers','lessons','products','orders','carts'
  ]) LOOP
    EXECUTE format('
      CREATE TRIGGER IF NOT EXISTS trg_%1$s_updated_at
      BEFORE UPDATE ON %1$I
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    ', tbl);
  END LOOP;
END;
$$;

-- 9) Enable RLS and policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users: restrict to own rows
CREATE POLICY users_select_self ON users
  FOR SELECT TO authenticated USING ((id = (auth.uid())::uuid));

CREATE POLICY users_update_self ON users
  FOR UPDATE TO authenticated USING ((id = (auth.uid())::uuid)) WITH CHECK ((id = (auth.uid())::uuid));

-- Teachers: public read, authenticated insert/update for owner
CREATE POLICY teachers_select_public ON teachers
  FOR SELECT TO public USING (true);

CREATE POLICY teachers_insert_owner ON teachers
  FOR INSERT TO authenticated WITH CHECK (user_id = (auth.uid())::uuid);

CREATE POLICY teachers_update_owner ON teachers
  FOR UPDATE TO authenticated USING (user_id = (auth.uid())::uuid) WITH CHECK (user_id = (auth.uid())::uuid);

-- Lessons: public read, writes by teachers (example: require teacher.user_id = auth.uid())
CREATE POLICY lessons_select_public ON lessons
  FOR SELECT TO public USING (true);

-- Example insert/update policy assuming teacher_user relation:
CREATE POLICY lessons_mod_by_teacher ON lessons
  FOR INSERT, UPDATE TO authenticated WITH CHECK (
    teacher_id IS NULL OR teacher_id IN (
      SELECT t.id FROM teachers t WHERE t.user_id = (auth.uid())::uuid
    )
  );

-- Products: public read
CREATE POLICY products_select_public ON products
  FOR SELECT TO public USING (true);

-- Carts: only owner
CREATE POLICY carts_select_own ON carts
  FOR SELECT TO authenticated USING (user_id = (auth.uid())::uuid);

CREATE POLICY carts_mod_own ON carts
  FOR ALL TO authenticated USING (user_id = (auth.uid())::uuid) WITH CHECK (user_id = (auth.uid())::uuid);

-- Orders: restrict to owner; insert must be for auth user
CREATE POLICY orders_select_own ON orders
  FOR SELECT TO authenticated USING (user_id = (auth.uid())::uuid);

CREATE POLICY orders_insert_own ON orders
  FOR INSERT TO authenticated WITH CHECK (user_id = (auth.uid())::uuid);

-- 10) Helpful indices for common queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items (product_id);

-- 11) Teacher Applications Table
CREATE TABLE IF NOT EXISTS teacher_applications (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  instruments TEXT[] DEFAULT ARRAY[]::text[],
  experience TEXT,
  education TEXT,
  certifications TEXT,
  teaching_experience TEXT,
  timezone TEXT,
  available_hours TEXT,
  preferred_age_groups TEXT[] DEFAULT ARRAY[]::text[],
  bio TEXT,
  teaching_philosophy TEXT,
  sample_video_url TEXT,
  references_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_applications_email ON teacher_applications (lower(email));
CREATE INDEX IF NOT EXISTS idx_teacher_applications_user_id ON teacher_applications (user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_applications_status ON teacher_applications (status);

-- 12) In-App Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  href TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (read);

-- 13) Practice Sessions Table (for Practice Log & Calendar)
CREATE TABLE IF NOT EXISTS practice_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration INTEGER NOT NULL CHECK (duration > 0), -- duration in minutes
  instrument TEXT NOT NULL DEFAULT 'Piano',
  lesson TEXT NOT NULL,
  section TEXT,
  bpm INTEGER,
  target_bpm INTEGER,
  techniques TEXT[] DEFAULT ARRAY[]::text[],
  notes TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_date ON practice_sessions (date);

-- 14) Lesson Bookings Table
CREATE TABLE IF NOT EXISTS lesson_bookings (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  teacher_name TEXT NOT NULL,
  instrument TEXT NOT NULL DEFAULT 'Piano',
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_bookings_user_id ON lesson_bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_bookings_date ON lesson_bookings (booking_date);
