-- Create careers_jobs table
CREATE TABLE IF NOT EXISTS careers_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  salary VARCHAR(100),
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  responsibilities TEXT[] NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES careers_jobs(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  resume_url VARCHAR(500),
  cover_letter TEXT,
  years_experience INTEGER,
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create career_subscriptions table
CREATE TABLE IF NOT EXISTS career_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  interested_departments TEXT[] DEFAULT ARRAY[]::text[],
  interested_locations TEXT[] DEFAULT ARRAY[]::text[],
  job_types TEXT[] DEFAULT ARRAY[]::text[],
  email_frequency VARCHAR(50) DEFAULT 'weekly',
  subscribed_at TIMESTAMP DEFAULT now(),
  last_email_sent TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Create career_guidance table
CREATE TABLE IF NOT EXISTS career_guidance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  tips TEXT[] NOT NULL,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_careers_jobs_status ON careers_jobs(status);
CREATE INDEX IF NOT EXISTS idx_careers_jobs_department ON careers_jobs(department);
CREATE INDEX IF NOT EXISTS idx_careers_jobs_location ON careers_jobs(location);
CREATE INDEX IF NOT EXISTS idx_careers_jobs_job_type ON careers_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_subscriptions_email ON career_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_career_subscriptions_active ON career_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_career_guidance_category ON career_guidance(category);

-- Enable RLS for security
ALTER TABLE careers_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_guidance ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to view active jobs
CREATE POLICY "jobs_select_public" ON careers_jobs
  FOR SELECT USING (status = 'active');

-- Allow anyone to insert job applications
CREATE POLICY "applications_insert_public" ON job_applications
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view their own applications
CREATE POLICY "applications_select_own" ON job_applications
  FOR SELECT USING (true);

-- Allow anyone to subscribe to career notifications
CREATE POLICY "subscriptions_insert_public" ON career_subscriptions
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update their own subscription
CREATE POLICY "subscriptions_update_own" ON career_subscriptions
  FOR UPDATE USING (true);

-- Allow anyone to view career guidance
CREATE POLICY "guidance_select_public" ON career_guidance
  FOR SELECT USING (true);

-- Insert sample career guidance data
INSERT INTO career_guidance (title, category, content, tips, order_index) VALUES
('How to Become a Music Teacher', 'Getting Started', 'Start your music teaching career with passion and dedication. This guide covers the essential steps to become an effective music educator.', ARRAY['Get proper music education credentials', 'Develop teaching methodology', 'Build your portfolio', 'Network with other musicians'], 1),
('Creating Engaging Online Lessons', 'Teaching Tips', 'Master the art of creating compelling online music lessons that keep students engaged and motivated.', ARRAY['Use interactive exercises', 'Provide clear demonstrations', 'Encourage student participation', 'Give constructive feedback'], 2),
('Music Career Opportunities Beyond Teaching', 'Career Paths', 'Explore diverse career paths in music beyond traditional teaching roles.', ARRAY['Session musician', 'Music producer', 'Content creator', 'Sound engineer', 'Music therapist'], 3),
('Building Your Personal Brand as a Musician', 'Professional Development', 'Establish yourself as a unique presence in the music industry.', ARRAY['Create social media presence', 'Share your unique style', 'Collaborate with others', 'Document your journey'], 4),
('Income Strategies for Music Educators', 'Business', 'Diversify your income streams as a music educator.', ARRAY['Private lessons', 'Group classes', 'Online courses', 'Digital products', 'Sponsored content'], 5)
ON CONFLICT DO NOTHING;

-- Insert sample job listings
INSERT INTO careers_jobs (title, department, location, job_type, salary, description, requirements, responsibilities) VALUES
('Music Teacher - Piano', 'Education', 'Remote', 'Full-time', '$40,000 - $60,000', 'Join our team of experienced music educators and inspire the next generation of musicians.', ARRAY['Bachelor''s degree in Music', '3+ years teaching experience', 'Proficiency in piano', 'Excellent communication skills'], ARRAY['Create and deliver piano lessons', 'Develop customized learning plans', 'Track student progress', 'Collaborate with other teachers'], 1),
('Content Creator - Music Tutorials', 'Content', 'Remote', 'Full-time', '$35,000 - $55,000', 'Create engaging music tutorial content for our platform.', ARRAY['Video creation experience', 'Strong musical background', 'Video editing skills', 'Creative storytelling ability'], ARRAY['Plan and film tutorials', 'Edit and produce content', 'Develop tutorial series', 'Engage with community'], 2),
('Marketing Manager', 'Marketing', 'Hybrid', 'Full-time', '$50,000 - $70,000', 'Drive growth for PIANOW by developing and executing marketing strategies.', ARRAY['Bachelor''s in Marketing', '4+ years marketing experience', 'Digital marketing expertise', 'Project management experience'], ARRAY['Develop marketing campaigns', 'Manage social media', 'Analyze campaign metrics', 'Lead initiatives'], 3),
('Guitar Teacher - Beginner Focus', 'Education', 'Remote', 'Full-time', '$35,000 - $50,000', 'Teach beginner and intermediate guitar students in our online platform.', ARRAY['Guitar teaching experience', 'Beginner-friendly approach', 'Online teaching capability', 'Patience and communication'], ARRAY['Teach guitar lessons', 'Create lesson plans', 'Support beginner growth', 'Build student confidence'], 4),
('Community Manager', 'Community', 'Remote', 'Full-time', '$38,000 - $58,000', 'Build and nurture our vibrant PIANOW community of music learners and educators.', ARRAY['Community management experience', 'Communication skills', 'Social media knowledge', 'Passion for music'], ARRAY['Moderate discussions', 'Plan community events', 'Support member engagement', 'Gather feedback'], 5)
ON CONFLICT DO NOTHING;
