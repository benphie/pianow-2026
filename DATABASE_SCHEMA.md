# PIANOW Database Schema

## Overview
This document describes the complete database schema for the PIANOW music education platform, built on Supabase PostgreSQL with Row Level Security (RLS) for data protection.

## Database Tables

### 1. **profiles** - User Profiles
Stores extended user information and metadata.
- `id` (UUID) - Primary key, references auth.users(id)
- `email` (TEXT, UNIQUE) - User email address
- `name` (TEXT) - User's full name
- `avatar_url` (TEXT) - Profile picture URL
- `role` (TEXT) - User role (user, teacher, admin)
- `created_at` (TIMESTAMP) - Account creation date
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes**: email, role

### 2. **teachers** - Teacher Profiles
Detailed information for teachers.
- `id` (UUID) - Primary key
- `user_id` (UUID, UNIQUE) - References auth.users(id)
- `bio` (TEXT) - Teacher bio
- `specialties` (TEXT[]) - Array of specialties
- `education` (TEXT[]) - Educational background
- `certifications` (TEXT[]) - Professional certifications
- `rating` (DECIMAL) - Average teacher rating
- `total_students` (INTEGER) - Number of students
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes**: user_id, rating (DESC)

### 3. **lessons** - Music Lessons
Lesson content and metadata.
- `id` (UUID) - Primary key
- `title` (TEXT) - Lesson title
- `description` (TEXT) - Lesson description
- `video_url` (TEXT) - Video content URL
- `youtube_url` (TEXT) - YouTube video URL
- `duration` (TEXT) - Lesson duration
- `level` (TEXT) - Level (Beginner, Intermediate, Advanced, All Levels)
- `teacher_id` (UUID) - References teachers(id)
- `thumbnail_url` (TEXT) - Lesson thumbnail
- `price` (DECIMAL) - Lesson price
- `is_free` (BOOLEAN) - Is lesson free
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes**: teacher_id, level

### 4. **products** - Shop Products
Musical instruments and accessories for sale.
- `id` (UUID) - Primary key
- `name` (TEXT) - Product name
- `description` (TEXT) - Product description
- `price` (DECIMAL) - Current price
- `original_price` (DECIMAL) - Original price (for discounts)
- `category` (TEXT) - Category (piano, guitar, drums, audio, accessories, instruments)
- `images` (TEXT[]) - Array of image URLs
- `in_stock` (BOOLEAN) - Stock status
- `stock_quantity` (INTEGER) - Number in stock
- `brand` (TEXT) - Product brand
- `rating` (DECIMAL) - Average rating
- `reviews_count` (INTEGER) - Number of reviews
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes**: category, price

### 5. **carts** - Shopping Carts
User shopping carts for products.
- `id` (UUID) - Primary key
- `user_id` (UUID, UNIQUE) - References auth.users(id)
- `items` (JSONB) - Cart items array
- `updated_at` (TIMESTAMP)

**Indexes**: user_id

### 6. **orders** - Orders
Purchase orders from users.
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users(id)
- `items` (JSONB) - Order items details
- `total` (DECIMAL) - Order total
- `status` (TEXT) - Status (pending, processing, shipped, delivered, cancelled)
- `shipping_address` (JSONB) - Shipping address details
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes**: user_id, status

### 7. **student_lessons** - Lesson Enrollments
Tracks which students are enrolled in which lessons.
- `id` (UUID) - Primary key
- `student_id` (UUID) - References auth.users(id)
- `lesson_id` (UUID) - References lessons(id)
- `enrolled_at` (TIMESTAMP) - Enrollment date
- `completed_at` (TIMESTAMP) - Completion date (nullable)
- `progress_percentage` (INTEGER) - Progress (0-100)
- `notes` (TEXT) - Student notes
- **Unique constraint**: (student_id, lesson_id)

**Indexes**: student_id, lesson_id

### 8. **practice_sessions** - Practice Tracking
Logs of user practice sessions.
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users(id)
- `lesson_id` (UUID, nullable) - References lessons(id)
- `duration_minutes` (INTEGER) - Session duration
- `date` (DATE) - Practice date
- `notes` (TEXT) - Session notes
- `created_at` (TIMESTAMP)

**Indexes**: user_id, date

### 9. **skill_progress** - Skill Development
Tracks user progress in different skills.
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users(id)
- `skill_name` (TEXT) - Skill name
- `level` (INTEGER) - Skill level (1-5)
- `progress_percentage` (INTEGER) - Progress (0-100)
- `last_practiced` (TIMESTAMP) - Last practice time
- `created_at`, `updated_at` (TIMESTAMP)
- **Unique constraint**: (user_id, skill_name)

**Indexes**: user_id, skill_name

### 10. **achievements** - Badges & Achievements
User earned achievements and badges.
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users(id)
- `badge_name` (TEXT) - Badge name
- `description` (TEXT) - Badge description
- `earned_at` (TIMESTAMP) - Achievement date

**Indexes**: user_id

### 11. **lesson_reviews** - Lesson Reviews
User reviews for lessons.
- `id` (UUID) - Primary key
- `lesson_id` (UUID) - References lessons(id)
- `user_id` (UUID) - References auth.users(id)
- `rating` (INTEGER) - Rating (1-5)
- `comment` (TEXT) - Review comment
- `created_at`, `updated_at` (TIMESTAMP)
- **Unique constraint**: (lesson_id, user_id)

**Indexes**: lesson_id, user_id

### 12. **product_reviews** - Product Reviews
User reviews for products.
- `id` (UUID) - Primary key
- `product_id` (UUID) - References products(id)
- `user_id` (UUID) - References auth.users(id)
- `rating` (INTEGER) - Rating (1-5)
- `comment` (TEXT) - Review comment
- `created_at`, `updated_at` (TIMESTAMP)
- **Unique constraint**: (product_id, user_id)

**Indexes**: product_id, user_id

## Row Level Security (RLS) Policies

All tables have RLS enabled with the following key policies:

### Profiles
- Users can view and update their own profile
- Public can view all profiles

### Teachers
- Anyone can view teachers
- Teachers can manage their own profile
- Teachers can create lessons

### Lessons
- Anyone can view lessons
- Teachers can manage their own lessons

### Products
- Anyone can view products
- Admins can manage products

### Orders, Carts, Practice Sessions, Skill Progress
- Users can only access their own data

### Reviews
- Anyone can view reviews
- Users can create and update their own reviews

## Triggers & Automation

### 1. Auto-create Profile on Signup
When a new user is created in auth.users, a profile is automatically created with:
- email from auth.users
- name from user_metadata
- role from user_metadata (defaults to 'user')

### 2. Auto-update Timestamps
All tables with `updated_at` column automatically update the timestamp on modifications.

## Database Helper Functions

The app includes comprehensive database helper functions in `/lib/db.ts`:

### Profile Functions
- `getProfileById(userId)` - Get user profile
- `getProfileByEmail(email)` - Get profile by email

### Teacher Functions
- `getTeacherById(teacherId)` - Get teacher details
- `getTeachersByRating(limit)` - Get top-rated teachers

### Lesson Functions
- `getLessonById(lessonId)` - Get lesson details
- `getLessonsByTeacher(teacherId)` - Get teacher's lessons
- `getLessonsByLevel(level)` - Get lessons by difficulty level

### Product Functions
- `getProductById(productId)` - Get product details
- `getProductsByCategory(category)` - Get products by category
- `searchProducts(query)` - Search products

### Enrollment Functions
- `enrollInLesson(userId, lessonId)` - Enroll in a lesson
- `getEnrolledLessons(userId)` - Get user's enrolled lessons
- `updateLessonProgress(enrollmentId, progress)` - Update progress

### Practice Tracking Functions
- `logPracticeSession(userId, duration, lessonId?, notes?)` - Log practice session
- `getPracticeSessions(userId, days)` - Get practice history

### Skill Progress Functions
- `updateSkillProgress(userId, skill, level, progress)` - Update skill progress
- `getSkillProgress(userId)` - Get all user skills

### Order Functions
- `createOrder(userId, items, total, address)` - Create order
- `getUserOrders(userId)` - Get user's orders

### Review Functions
- `createLessonReview(userId, lessonId, rating, comment)` - Create lesson review
- `getLessonReviews(lessonId)` - Get lesson reviews
- `createProductReview(userId, productId, rating, comment)` - Create product review
- `getProductReviews(productId)` - Get product reviews

## Authentication

The app uses Supabase Auth with:
- Email/password authentication
- Automatic profile creation on signup via database trigger
- Session management with JWT tokens
- Secure password handling with bcrypt

## API Routes

### Auth Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- Automatically creates profile via database trigger

### Database Access
All data access is protected by:
1. Supabase RLS policies (row-level filtering)
2. User authentication verification
3. Input validation and sanitization
