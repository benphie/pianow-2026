import { createClient } from '@/lib/supabase/server'

// Profiles
export async function getProfileById(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function getProfileByEmail(email: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// Teachers
export async function getTeacherById(teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', teacherId)
    .single()
  
  if (error) throw error
  return data
}

export async function getTeachersByRating(limit: number = 10) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

// Lessons
export async function getLessonById(lessonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*, teachers(*)')
    .eq('id', lessonId)
    .single()
  
  if (error) throw error
  return data
}

export async function getLessonsByTeacher(teacherId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getLessonsByLevel(level: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('level', level)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Products
export async function getProductById(productId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()
  
  if (error) throw error
  return data
}

export async function getProductsByCategory(category: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function searchProducts(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('in_stock', true)
  
  if (error) throw error
  return data
}

// Student Lessons (Enrollments)
export async function enrollInLesson(userId: string, lessonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('student_lessons')
    .insert({
      student_id: userId,
      lesson_id: lessonId,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getEnrolledLessons(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('student_lessons')
    .select('*, lessons(*)')
    .eq('student_id', userId)
    .order('enrolled_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function updateLessonProgress(enrollmentId: string, progress: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('student_lessons')
    .update({ progress_percentage: progress })
    .eq('id', enrollmentId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Practice Sessions
export async function logPracticeSession(
  userId: string,
  durationMinutes: number,
  lessonId?: string,
  notes?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({
      user_id: userId,
      duration_minutes: durationMinutes,
      date: new Date().toISOString().split('T')[0],
      lesson_id: lessonId,
      notes,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getPracticeSessions(userId: string, days: number = 30) {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', fromDate.toISOString().split('T')[0])
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}

// Skill Progress
export async function updateSkillProgress(
  userId: string,
  skillName: string,
  level: number,
  progress: number
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_progress')
    .upsert({
      user_id: userId,
      skill_name: skillName,
      level,
      progress_percentage: progress,
      last_practiced: new Date().toISOString(),
    }, {
      onConflict: 'user_id,skill_name'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getSkillProgress(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_progress')
    .select('*')
    .eq('user_id', userId)
    .order('level', { ascending: false })
  
  if (error) throw error
  return data
}

// Orders
export async function createOrder(
  userId: string,
  items: any[],
  total: number,
  shippingAddress: any
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      items,
      total,
      shipping_address: shippingAddress,
      status: 'pending',
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Reviews
export async function createLessonReview(
  userId: string,
  lessonId: string,
  rating: number,
  comment?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lesson_reviews')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      rating,
      comment,
    }, {
      onConflict: 'lesson_id,user_id'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getLessonReviews(lessonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lesson_reviews')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createProductReview(
  userId: string,
  productId: string,
  rating: number,
  comment?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_reviews')
    .upsert({
      user_id: userId,
      product_id: productId,
      rating,
      comment,
    }, {
      onConflict: 'product_id,user_id'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// User Signups Analytics
export async function logUserSignup(
  userId: string,
  email: string,
  signupMethod: 'email' | 'google' | 'kings_chat',
  signupData?: {
    ipAddress?: string
    country?: string
    city?: string
    latitude?: number
    longitude?: number
    deviceType?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
    browser?: string
    operatingSystem?: string
    userAgent?: string
    referralSource?: string
    referralMedium?: 'direct' | 'organic' | 'paid' | 'social' | 'email' | 'referral' | 'other'
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmContent?: string
    utmTerm?: string
    referringUrl?: string
    campaignId?: string
  }
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_signups')
    .insert({
      user_id: userId,
      email,
      signup_method: signupMethod,
      ip_address: signupData?.ipAddress,
      country: signupData?.country,
      city: signupData?.city,
      latitude: signupData?.latitude,
      longitude: signupData?.longitude,
      device_type: signupData?.deviceType || 'unknown',
      browser: signupData?.browser,
      operating_system: signupData?.operatingSystem,
      user_agent: signupData?.userAgent,
      referral_source: signupData?.referralSource,
      referral_medium: signupData?.referralMedium,
      utm_source: signupData?.utmSource,
      utm_medium: signupData?.utmMedium,
      utm_campaign: signupData?.utmCampaign,
      utm_content: signupData?.utmContent,
      utm_term: signupData?.utmTerm,
      referring_url: signupData?.referringUrl,
      campaign_id: signupData?.campaignId,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserSignup(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_signups')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function getSignupStats(days: number = 30) {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('user_signups')
    .select('*')
    .gte('created_at', fromDate.toISOString())
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getSignupsByMethod(days: number = 30) {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('user_signups')
    .select('signup_method, COUNT(*) as count')
    .gte('created_at', fromDate.toISOString())
    .groupBy('signup_method')
  
  if (error) throw error
  return data
}

export async function getSignupsByCountry(days: number = 30) {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('user_signups')
    .select('country, COUNT(*) as count')
    .gte('created_at', fromDate.toISOString())
    .not('country', 'is', null)
    .groupBy('country')
    .order('count', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getSignupsByReferralSource(days: number = 30) {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('user_signups')
    .select('referral_source, referral_medium, COUNT(*) as count')
    .gte('created_at', fromDate.toISOString())
    .not('referral_source', 'is', null)
    .groupBy('referral_source, referral_medium')
    .order('count', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getSignupsByDevice(days: number = 30) {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('user_signups')
    .select('device_type, COUNT(*) as count')
    .gte('created_at', fromDate.toISOString())
    .groupBy('device_type')
  
  if (error) throw error
  return data
}
