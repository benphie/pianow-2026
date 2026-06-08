# PIANOW Database API Reference

Quick reference guide for all database helper functions in `/lib/db.ts`.

## Authentication & Profiles

### Get User Profile
```typescript
import { getProfileById } from '@/lib/db'

const profile = await getProfileById(userId: string)
// Returns: { id, email, name, avatar_url, role, created_at, updated_at }
```

### Get Profile by Email
```typescript
import { getProfileByEmail } from '@/lib/db'

const profile = await getProfileByEmail(email: string)
// Returns: user profile or null if not found
```

---

## Teachers

### Get Teacher by ID
```typescript
import { getTeacherById } from '@/lib/db'

const teacher = await getTeacherById(teacherId: string)
// Returns: { id, user_id, bio, specialties, education, certifications, rating, total_students, created_at, updated_at }
```

### Get Top-Rated Teachers
```typescript
import { getTeachersByRating } from '@/lib/db'

const teachers = await getTeachersByRating(limit: number = 10)
// Returns: array of teachers sorted by rating (highest first)
```

---

## Lessons

### Get Lesson Details
```typescript
import { getLessonById } from '@/lib/db'

const lesson = await getLessonById(lessonId: string)
// Returns: { id, title, description, video_url, youtube_url, duration, level, teacher_id, teachers, thumbnail_url, price, is_free, created_at, updated_at }
```

### Get Teacher's Lessons
```typescript
import { getLessonsByTeacher } from '@/lib/db'

const lessons = await getLessonsByTeacher(teacherId: string)
// Returns: array of lessons for the teacher, sorted by newest first
```

### Get Lessons by Difficulty Level
```typescript
import { getLessonsByLevel } from '@/lib/db'

const lessons = await getLessonsByLevel(level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels')
// Returns: array of lessons at the specified level
```

---

## Products

### Get Product Details
```typescript
import { getProductById } from '@/lib/db'

const product = await getProductById(productId: string)
// Returns: { id, name, description, price, original_price, category, images, in_stock, stock_quantity, brand, rating, reviews_count, created_at, updated_at }
```

### Get Products by Category
```typescript
import { getProductsByCategory } from '@/lib/db'

const products = await getProductsByCategory(category: 'piano' | 'guitar' | 'drums' | 'audio' | 'accessories' | 'instruments')
// Returns: array of in-stock products in the category
```

### Search Products
```typescript
import { searchProducts } from '@/lib/db'

const products = await searchProducts(query: string)
// Searches product names and descriptions
// Returns: array of matching in-stock products
```

---

## Lesson Enrollment & Progress

### Enroll in a Lesson
```typescript
import { enrollInLesson } from '@/lib/db'

const enrollment = await enrollInLesson(userId: string, lessonId: string)
// Returns: { id, student_id, lesson_id, enrolled_at, completed_at, progress_percentage, notes }
// Throws error if already enrolled
```

### Get Student's Enrolled Lessons
```typescript
import { getEnrolledLessons } from '@/lib/db'

const enrollments = await getEnrolledLessons(userId: string)
// Returns: array of enrollments with full lesson details, newest first
```

### Update Lesson Progress
```typescript
import { updateLessonProgress } from '@/lib/db'

const updated = await updateLessonProgress(enrollmentId: string, progress: number)
// progress: 0-100 (percentage)
// Returns: updated enrollment record
```

---

## Practice Tracking

### Log Practice Session
```typescript
import { logPracticeSession } from '@/lib/db'

const session = await logPracticeSession(
  userId: string,
  durationMinutes: number,
  lessonId?: string,      // optional
  notes?: string          // optional
)
// Returns: { id, user_id, lesson_id, duration_minutes, date, notes, created_at }
```

### Get Practice History
```typescript
import { getPracticeSessions } from '@/lib/db'

const sessions = await getPracticeSessions(userId: string, days: number = 30)
// Returns: array of practice sessions from the last N days, sorted by newest first
```

---

## Skill Progress

### Update Skill Progress
```typescript
import { updateSkillProgress } from '@/lib/db'

const skill = await updateSkillProgress(
  userId: string,
  skillName: string,
  level: 1 | 2 | 3 | 4 | 5,
  progress: number              // 0-100
)
// Returns: { id, user_id, skill_name, level, progress_percentage, last_practiced, created_at, updated_at }
// Creates new skill if doesn't exist (upsert)
```

### Get User's Skills
```typescript
import { getSkillProgress } from '@/lib/db'

const skills = await getSkillProgress(userId: string)
// Returns: array of skills, sorted by level (highest first)
```

---

## Orders

### Create Order
```typescript
import { createOrder } from '@/lib/db'

const order = await createOrder(
  userId: string,
  items: Array<{ productId, name, price, quantity }>,
  total: number,
  shippingAddress: { street, city, state, zip, country }
)
// Returns: { id, user_id, items, total, status: 'pending', shipping_address, created_at, updated_at }
```

### Get User's Orders
```typescript
import { getUserOrders } from '@/lib/db'

const orders = await getUserOrders(userId: string)
// Returns: array of orders, sorted by newest first
// Statuses: pending, processing, shipped, delivered, cancelled
```

---

## Reviews

### Create/Update Lesson Review
```typescript
import { createLessonReview } from '@/lib/db'

const review = await createLessonReview(
  userId: string,
  lessonId: string,
  rating: 1 | 2 | 3 | 4 | 5,
  comment?: string
)
// Returns: { id, lesson_id, user_id, rating, comment, created_at, updated_at }
// Updates if user already reviewed this lesson
```

### Get Lesson Reviews
```typescript
import { getLessonReviews } from '@/lib/db'

const reviews = await getLessonReviews(lessonId: string)
// Returns: array of reviews for the lesson, newest first
```

### Create/Update Product Review
```typescript
import { createProductReview } from '@/lib/db'

const review = await createProductReview(
  userId: string,
  productId: string,
  rating: 1 | 2 | 3 | 4 | 5,
  comment?: string
)
// Returns: { id, product_id, user_id, rating, comment, created_at, updated_at }
// Updates if user already reviewed this product
```

### Get Product Reviews
```typescript
import { getProductReviews } from '@/lib/db'

const reviews = await getProductReviews(productId: string)
// Returns: array of reviews for the product, newest first
```

---

## Usage Examples

### Example 1: User Enrolls in Lesson and Logs Practice
```typescript
import { enrollInLesson, logPracticeSession, updateLessonProgress } from '@/lib/db'

// Step 1: Enroll in lesson
const enrollment = await enrollInLesson(userId, lessonId)

// Step 2: Log a practice session
await logPracticeSession(userId, 60, lessonId, 'Completed first section')

// Step 3: Update progress
await updateLessonProgress(enrollment.id, 25) // 25% complete
```

### Example 2: Display Teacher and Their Lessons
```typescript
import { getTeacherById, getLessonsByTeacher } from '@/lib/db'

const teacher = await getTeacherById(teacherId)
const lessons = await getLessonsByTeacher(teacherId)

// Display teacher info and their lessons
```

### Example 3: Track Student Progress
```typescript
import { getEnrolledLessons, getPracticeSessions, getSkillProgress } from '@/lib/db'

const enrollments = await getEnrolledLessons(userId)
const recentPractice = await getPracticeSessions(userId, 7) // Last week
const skills = await getSkillProgress(userId)

// Display progress dashboard
```

### Example 4: Product Search and Review
```typescript
import { searchProducts, createProductReview, getProductReviews } from '@/lib/db'

const products = await searchProducts('piano')
const reviews = await getProductReviews(productId)

// User reviews a product
await createProductReview(userId, productId, 5, 'Amazing quality!')
```

---

## Error Handling

All functions throw errors if:
- User is not authenticated (RLS policy blocks access)
- Record not found (single queries)
- Database constraints violated (unique violations, foreign keys)
- Network/connection issues

```typescript
try {
  const lesson = await getLessonById(lessonId)
} catch (error) {
  console.error('Failed to get lesson:', error.message)
}
```

---

## Performance Tips

1. **Batch Queries**: Load related data in one query when possible
2. **Use Filters**: Pass lessonId/teacherId to limit results
3. **Cache Results**: Use SWR or similar for client-side caching
4. **Pagination**: Implement pagination for large result sets
5. **Indexes**: Database indexes are optimized for common queries

---

## Rate Limits

- No built-in rate limiting (implement at API layer if needed)
- Supabase Free plan: 50,000 monthly active users
- Supabase Pro plan: Unlimited users

---

## Related Documentation

- Full schema details: See `DATABASE_SCHEMA.md`
- Setup instructions: See `BACKEND_SETUP.md`
- Authentication: See `/lib/supabase/` files
- API routes: See `/app/api/auth/` routes
