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
--
-- 4. Safe to run more than once:
--    - On an empty database it creates everything.
--    - On a database set up from an earlier version of this file, it adds the missing
--      columns, converts lessons.duration to text and replaces the access policies.
--      Existing rows are kept.
--    - It runs as one transaction: if anything fails, nothing is changed.
--
-- 5. How access works:
--    - The app's server uses the service-role key (SUPABASE_SERVICE_ROLE_KEY), which
--      bypasses row-level security. The app does not use Supabase Auth.
--    - The public anon key can only read products, lessons and teachers. Every other
--      table, including users and teacher applications, is closed to it.
-- ====================================================================

BEGIN;

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
  specialties TEXT[] NOT NULL DEFAULT '{}',
  education TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] NOT NULL DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_students INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers (user_id);

-- Not used by the app yet: specialties are stored in teachers.specialties.
-- Kept for a future normalized design.
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
  duration TEXT DEFAULT '30 minutes', -- shown as written, e.g. "45 minutes"
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

-- 6) Carts: one per user; items is a JSON array of { productId, quantity }
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Not used by the app yet: cart items are stored in carts.items.
-- Kept for a future normalized design.
CREATE TABLE IF NOT EXISTS cart_items (
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items (cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items (product_id);

-- 7) Orders: items is a JSON snapshot of { productId, productName, quantity, price }
--    taken when the order is placed
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

-- Not used by the app yet: order items are stored in orders.items.
-- Kept for a future normalized design.
CREATE TABLE IF NOT EXISTS order_items (
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

-- 8) Teacher Applications Table
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

-- 9) In-App Notifications Table
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

-- 10) Practice Sessions Table (for Practice Log & Calendar)
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

-- 11) Lesson Bookings Table
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

-- 12) Upgrade databases created from an earlier version of this file
--     (CREATE TABLE IF NOT EXISTS leaves existing tables as they were)
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specialties TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS education TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS certifications TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE carts ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb;

-- lessons.duration used to be an INTERVAL; the app reads and writes text like "45 minutes"
DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'duration') = 'interval' THEN
    ALTER TABLE lessons ALTER COLUMN duration DROP DEFAULT;
    ALTER TABLE lessons ALTER COLUMN duration TYPE TEXT
      USING CASE WHEN duration IS NULL THEN NULL
                 ELSE round(extract(epoch FROM duration) / 60)::int || ' minutes' END;
    ALTER TABLE lessons ALTER COLUMN duration SET DEFAULT '30 minutes';
  END IF;
END;
$$;

-- 13) Single updated_at trigger function (public schema)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Attach the trigger to every table with an updated_at column
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'users','teachers','lessons','products','orders','carts','teacher_applications'
  ]) LOOP
    EXECUTE format('
      CREATE OR REPLACE TRIGGER trg_%1$s_updated_at
      BEFORE UPDATE ON %1$I
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    ', tbl);
  END LOOP;
END;
$$;

-- 14) Row-level security on every table
--     With no policy, a table is closed to the anon and authenticated roles.
--     The server's service-role key bypasses these rules.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_bookings ENABLE ROW LEVEL SECURITY;

-- Remove policies from earlier versions of this file. They relied on Supabase Auth
-- (auth.uid()), which the app doesn't use, so they never matched a real user.
DROP POLICY IF EXISTS users_select_self ON users;
DROP POLICY IF EXISTS users_update_self ON users;
DROP POLICY IF EXISTS teachers_select_public ON teachers;
DROP POLICY IF EXISTS teachers_insert_owner ON teachers;
DROP POLICY IF EXISTS teachers_update_owner ON teachers;
DROP POLICY IF EXISTS lessons_select_public ON lessons;
DROP POLICY IF EXISTS lessons_mod_by_teacher ON lessons;
DROP POLICY IF EXISTS products_select_public ON products;
DROP POLICY IF EXISTS carts_select_own ON carts;
DROP POLICY IF EXISTS carts_mod_own ON carts;
DROP POLICY IF EXISTS orders_select_own ON orders;
DROP POLICY IF EXISTS orders_insert_own ON orders;

-- Public catalog: anyone may read products, lessons and teachers
DROP POLICY IF EXISTS products_public_read ON products;
CREATE POLICY products_public_read ON products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS lessons_public_read ON lessons;
CREATE POLICY lessons_public_read ON lessons FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS teachers_public_read ON teachers;
CREATE POLICY teachers_public_read ON teachers FOR SELECT TO anon, authenticated USING (true);

COMMIT;
