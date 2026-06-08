# PIANOW Application Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                      │
│  - Next.js Pages/Components                                     │
│  - SWR for data fetching                                        │
│  - Auth Context for user state                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐  ┌───────▼────────┐  ┌──▼──────────┐
    │ Login   │  │ Signup         │  │ Other Pages │
    │ Page    │  │ Page           │  │ API Routes  │
    └────┬────┘  └───────┬────────┘  └──┬──────────┘
         │               │              │
         └───────────────┼──────────────┘
                         │
┌─────────────────────────▼──────────────────────────────────────┐
│               API LAYER (Next.js API Routes)                   │
│  - /api/auth/login      → Supabase Auth                        │
│  - /api/auth/signup     → Supabase Auth                        │
│  - /api/lessons/* → Database queries                           │
│  - /api/products/* → Database queries                          │
│  - /api/orders/* → Database queries                            │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│            APPLICATION LAYER (/lib/db.ts)                    │
│  Database Helper Functions (30+)                             │
│  - getProfileById()                                          │
│  - getEnrolledLessons()                                      │
│  - logPracticeSession()                                      │
│  - updateSkillProgress()                                     │
│  - getUserOrders()                                           │
│  - createProductReview()                                     │
│  And 24+ more...                                             │
└────────────────────────┬─────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼─────────┐ ┌───▼────────┐ ┌──▼──────────────┐
│ Supabase Auth    │ │ Supabase   │ │ RLS Policies   │
│ (JWT Tokens)     │ │ PostgreSQL │ │ (Row-level     │
│                  │ │ Database   │ │  security)     │
└────────┬─────────┘ └────┬───────┘ └────────────────┘
         │                │
         └────────────────┼─────────────────────────────────────┐
                          │                                    │
┌─────────────────────────▼──────────────────────────────────┐ │
│                   DATABASE LAYER                          │ │
│                 (PostgreSQL)                              │ │
│                                                            │ │
│  12 Tables with 40+ RLS Policies:                          │ │
│  ├─ profiles                                              │ │
│  ├─ teachers                                              │ │
│  ├─ lessons                                               │ │
│  ├─ products                                              │ │
│  ├─ carts                                                 │ │
│  ├─ orders                                                │ │
│  ├─ student_lessons                                       │ │
│  ├─ practice_sessions                                     │ │
│  ├─ skill_progress                                        │ │
│  ├─ achievements                                          │ │
│  ├─ lesson_reviews                                        │ │
│  └─ product_reviews                                       │ │
│                                                            │ │
│  Triggers & Automation:                                   │ │
│  ├─ Auto-create profile on signup                         │ │
│  ├─ Auto-update timestamps                                │ │
│  └─ Constraints & Validations                             │ │
│                                                            │ │
│  Indexes: 22 for performance optimization                 │ │
└────────────────────────────────────────────────────────────┘ │
                                                                │
                    ◄──── RLS Policies ────────────────────────┘
```

## Data Flow Diagrams

### User Registration & Login Flow

```
USER                    API ROUTE           SUPABASE AUTH       DATABASE
│                       │                   │                   │
├─ Sign Up ─────────────►                   │                   │
│   (email, pwd, name)  │                   │                   │
│                       ├─ signUp() ───────►│                   │
│                       │                   ├─ Hash password    │
│                       │                   ├─ Store user       │
│                       │                   ├─ Fire trigger     ├─ Create profile
│                       │                   │                   │
│                       │◄─ auth.user ─────┤                   │
│                       │                   │                   │
│                       ├──────────────────────────────────────►│
│                       │ INSERT INTO profiles
│                       │                   │                   │
│◄────── Response ──────┤                   │                   │
│  User created, email  │                   │                   │
│  confirmation sent    │                   │                   │
│                       │                   │                   │
├─ Verify Email ───────────────────────────────────────────────┤
│                       │                   │                   │
├─ Log In ──────────────►                   │                   │
│   (email, password)   │                   │                   │
│                       ├─ signInWithPassword() ──────────────►│
│                       │                   ├─ Verify password  │
│                       │                   ├─ Create session   │
│                       │◄─ session ────────┤                   │
│                       │                   │                   │
│                       ├─ getProfileById() ────────────────────►
│                       │                   │  SELECT * FROM    │
│                       │                   │  profiles WHERE    │
│                       │                   │  id = user_id     │
│                       │◄─ profile ───────────────────────────┤
│                       │                   │                   │
│◄─ Response ───────────┤                   │                   │
│  User logged in with  │                   │                   │
│  session & profile    │                   │                   │
```

### Practice Session Logging Flow

```
USER              UI              API ROUTE        DATABASE
│                 │               │                │
├─ Log Practice ──►               │                │
│ (60 mins)       │               │                │
│                 │               │                │
│                 ├─ POST /api/──►│                │
│                 │ practice      │                │
│                 │               ├─ Verify auth  │
│                 │               ├─ logPractice()├─ INSERT INTO
│                 │               │               │ practice_sessions
│                 │               │               │ (user_id, duration,
│                 │               │               │  date, notes)
│                 │               │               │
│                 │               │◄─ session id ─┤
│                 │               │               │
│                 │◄─ Success ────┤               │
│                 │               │               │
├─ View Stats ────►               │               │
│                 │               │               │
│                 ├─ GET /api/───►│               │
│                 │ practice      │               │
│                 │               ├─ Verify auth │
│                 │               ├─ getPractice()├─ SELECT FROM
│                 │               │               │ practice_sessions
│                 │               │               │ WHERE user_id = ?
│                 │               │               │ AND date >= ?
│                 │               │               │
│                 │               │◄─ sessions ──┤
│                 │               │               │
│                 │◄─ Chart Data ─┤               │
│                 │               │               │
```

### Lesson Enrollment & Progress Flow

```
STUDENT          UI              API ROUTE       DATABASE
│                │               │               │
├─ View Lesson ──►               │               │
│                │               │               │
│                ├─ GET lesson ──►               │
│                │               ├─ getLessonById()
│                │               │               ├─ SELECT FROM lessons
│                │               │               │ WHERE id = ?
│                │               │◄─ lesson ────┤
│                │◄─ Display ────┤               │
│                │               │               │
├─ Enroll ──────►                │               │
│                │               │               │
│                ├─ POST enroll ►│               │
│                │               ├─ Verify auth │
│                │               ├─ enrollIn()  ├─ INSERT INTO
│                │               │              │ student_lessons
│                │               │              │ (student_id,
│                │               │              │  lesson_id,
│                │               │              │  progress: 0%)
│                │               │◄─ enrollment─┤
│                │◄─ Success ────┤               │
│                │               │               │
├─ Complete ────►                │               │
│ Section        │               │               │
│                ├─ PUT progress►│               │
│                │  (25%)        │               │
│                │               ├─ updateProgress()
│                │               │               ├─ UPDATE
│                │               │               │ student_lessons
│                │               │               │ SET progress = 25%
│                │               │               │ WHERE id = ?
│                │               │◄─ updated ───┤
│                │◄─ Progress ───┤               │
│                │  Updated      │               │
```

## Database Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         auth.users                          │
│               (Supabase Auth - External)                    │
│                id | email | password                        │
└────────┬─────────────────────────────────────────────┬──────┘
         │                                             │
    1:1  │                                         1:1 │
         │                                             │
    ┌────▼─────────────────┐                    ┌─────▼──────────────┐
    │ profiles             │                    │ teachers           │
    ├─────────────────────┤                    ├────────────────────┤
    │ id (FK)             │                    │ id                 │
    │ email               │                    │ user_id (FK)       │
    │ name                │                    │ bio                │
    │ avatar_url          │                    │ rating             │
    │ role                │                    │ specialties[]      │
    │ created_at          │                    │ certifications[]   │
    │ updated_at          │                    │ created_at         │
    └────┬────────────────┘                    └────────────────────┘
         │                                             │
    1:M  │                                         1:M │
         │                                             │
    ┌────▼──────────────────┬─────────────────────────┴──────┐
    │ orders      │ carts   │ practice_sessions │ skill..    │ lessons
    │ achievements│ student │                  │            │
    │ lesson_     │ _lessons│  ┌────────────────┘            │
    │ reviews     │ product │  │                             │
    │ product_    │ _reviews│  │   ┌──────────────────────────┤
    │ reviews     │         │  │   │                   1:M    │
    │             │         │  │   │                          │
    │  (FK: user) │(FK: user)  1:M  │      ┌───────────────────┘
    │             │(FK: prod)       │      │          1:M
    │             │(FK: lesson)     │      │
    │             │(FK: user,skill) │      │
    │             │                 │      │
    └─────────────┴─────────────────┴──────┴──────────────────┘

STUDENT_LESSONS (Join Table)
├─ student_id → auth.users
├─ lesson_id → lessons
├─ enrolled_at
├─ completed_at
├─ progress_percentage
└─ notes

PRACTICE_SESSIONS
├─ user_id → auth.users
├─ lesson_id → lessons (nullable)
├─ duration_minutes
├─ date
└─ notes

PRODUCTS
├─ name
├─ price
├─ category
├─ in_stock
└─ images[]

REVIEWS (Both Lesson & Product)
├─ user_id → auth.users
├─ (lesson_id OR product_id)
├─ rating
└─ comment
```

## Authentication Flow

```
┌─ CLIENT ────────────────────┐
│                             │
│  User enters credentials    │
│       │                     │
│       ▼                     │
│   Sign Up / Login           │
│       │                     │
│       └──────┬──────────────┤
│              │              │
│              ▼              │
│         Next.js API         │
│         /auth/...           │
└──────────────┬──────────────┘
               │
        ┌──────▼────────────┐
        │ Supabase Auth     │
        │                  │
        ├─ Hash password   │
        ├─ Verify email    │
        ├─ Create session  │
        ├─ JWT token       │
        └──────┬───────────┘
               │
        ┌──────▼────────────┐
        │ PostgreSQL        │
        │ Profiles Table    │
        │                  │
        ├─ Auto-create on  │
        │   new user       │
        ├─ Store metadata  │
        └──────────────────┘
               │
        ┌──────▼────────────┐
        │ Response to Client│
        │                  │
        ├─ User profile    │
        ├─ Session token   │
        ├─ Role info       │
        └──────────────────┘
```

## RLS Policy Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Row Level Security (RLS)                   │
│                                                         │
│  Every database operation checks:                       │
│  1. Is user authenticated? (session valid?)            │
│  2. Does policy allow this operation?                  │
│  3. Is the user the data owner? (or admin?)            │
└─────────────────────────────────────────────────────────┘

POLICIES BY TABLE:

profiles
├─ SELECT: auth.uid() = id (own profile)
├─ UPDATE: auth.uid() = id (own profile)
├─ INSERT: auth.uid() = id (own profile)
└─ Public SELECT: true (view all profiles)

orders
├─ SELECT: auth.uid() = user_id (own orders)
├─ INSERT: auth.uid() = user_id (own orders)
└─ UPDATE: auth.uid() = user_id (own orders)

practice_sessions
├─ SELECT: auth.uid() = user_id
├─ INSERT: auth.uid() = user_id
└─ UPDATE: auth.uid() = user_id

products
├─ SELECT: true (everyone)
├─ INSERT: is_admin() (admins only)
├─ UPDATE: is_admin() (admins only)
└─ DELETE: is_admin() (admins only)

lessons
├─ SELECT: true (everyone)
├─ INSERT: is_teacher() (teachers only)
├─ UPDATE: is_teacher() AND owns_lesson()
└─ DELETE: is_teacher() AND owns_lesson()
```

## Performance Optimization

```
Database Indexes (22 total)

User Lookups:
├─ idx_profiles_email
├─ idx_profiles_role
└─ idx_teachers_user_id

Product Searches:
├─ idx_products_category
├─ idx_products_price
└─ idx_products_name

Lesson Queries:
├─ idx_lessons_teacher_id
├─ idx_lessons_level
└─ idx_lessons_created_at

Practice Tracking:
├─ idx_practice_sessions_user_id
├─ idx_practice_sessions_date
└─ idx_practice_sessions_created_at

Order Tracking:
├─ idx_orders_user_id
├─ idx_orders_status
└─ idx_orders_created_at

And 7 more composite & foreign key indexes
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│              Vercel Deployment                      │
│                                                     │
│  ├─ Next.js App (React Components)                 │
│  ├─ API Routes (Authentication, Data)              │
│  └─ Environment Variables (Secrets)                │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │  Supabase Cloud    │
        │                   │
        │  ├─ Auth Service  │
        │  │  (JWT, email)  │
        │  │                │
        │  └─ PostgreSQL DB │
        │     (Tables,      │
        │      RLS,         │
        │      Triggers)    │
        └────────────────────┘
```

This architecture ensures:
- ✅ Security with RLS
- ✅ Performance with indexes
- ✅ Scalability with PostgreSQL
- ✅ Reliability with automated backups
- ✅ Privacy with data isolation
