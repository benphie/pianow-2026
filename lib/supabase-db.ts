// Database utility functions using Supabase
import { createServerClient } from './supabase'
import { User, Lesson, Teacher, Product, Cart, Order } from './types'

const supabase = createServerClient()

// Users
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, avatar, role, created_at, updated_at')
    .eq('id', id)
    .single()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatar: data.avatar,
    role: data.role,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getUserByEmail(email: string): Promise<User & { password_hash: string } | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    password: data.password_hash,
    avatar: data.avatar,
    role: data.role,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function createUser(userData: {
  email: string
  name: string
  password_hash: string
  role?: string
}): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email.toLowerCase(),
      name: userData.name,
      password_hash: userData.password_hash,
      role: userData.role || 'user',
    })
    .select('id, email, name, avatar, role, created_at, updated_at')
    .single()
  
  if (error) throw error
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatar: data.avatar,
    role: data.role,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Lessons
export async function getLessons(): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return data.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.video_url,
    youtubeUrl: lesson.youtube_url,
    duration: lesson.duration,
    level: lesson.level,
    teacherId: lesson.teacher_id,
    thumbnail: lesson.thumbnail,
    price: lesson.price ? Number(lesson.price) : undefined,
    isFree: lesson.is_free,
    createdAt: lesson.created_at,
    updatedAt: lesson.updated_at,
  }))
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    videoUrl: data.video_url,
    youtubeUrl: data.youtube_url,
    duration: data.duration,
    level: data.level,
    teacherId: data.teacher_id,
    thumbnail: data.thumbnail,
    price: data.price ? Number(data.price) : undefined,
    isFree: data.is_free,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function createLesson(lessonData: Partial<Lesson>): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      title: lessonData.title!,
      description: lessonData.description!,
      video_url: lessonData.videoUrl,
      youtube_url: lessonData.youtubeUrl,
      duration: lessonData.duration || '30 minutes',
      level: lessonData.level || 'Beginner',
      teacher_id: lessonData.teacherId,
      thumbnail: lessonData.thumbnail,
      price: lessonData.price,
      is_free: lessonData.isFree ?? true,
    })
    .select('*')
    .single()
  
  if (error) throw error
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    videoUrl: data.video_url,
    youtubeUrl: data.youtube_url,
    duration: data.duration,
    level: data.level,
    teacherId: data.teacher_id,
    thumbnail: data.thumbnail,
    price: data.price ? Number(data.price) : undefined,
    isFree: data.is_free,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Products
export async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    originalPrice: product.original_price ? Number(product.original_price) : undefined,
    category: product.category,
    images: product.images || [],
    inStock: product.in_stock,
    stockQuantity: product.stock_quantity,
    brand: product.brand,
    rating: product.rating ? Number(product.rating) : undefined,
    reviews: product.reviews,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }))
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    originalPrice: data.original_price ? Number(data.original_price) : undefined,
    category: data.category,
    images: data.images || [],
    inStock: data.in_stock,
    stockQuantity: data.stock_quantity,
    brand: data.brand,
    rating: data.rating ? Number(data.rating) : undefined,
    reviews: data.reviews,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Teachers
export async function getTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return data.map(teacher => ({
    id: teacher.id,
    userId: teacher.user_id,
    name: teacher.name,
    bio: teacher.bio,
    specialties: teacher.specialties || [],
    education: teacher.education || [],
    certifications: teacher.certifications || [],
    rating: Number(teacher.rating),
    totalStudents: teacher.total_students,
    avatar: teacher.avatar,
    createdAt: teacher.created_at,
    updatedAt: teacher.updated_at,
  }))
}

// Cart
export async function getCart(userId: string): Promise<Cart | null> {
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  
  if (!data) {
    // Create empty cart if doesn't exist
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: userId, items: [] })
      .select('*')
      .single()
    
    if (createError) throw createError
    
    return {
      userId: newCart.user_id,
      items: newCart.items || [],
      updatedAt: newCart.updated_at,
    }
  }
  
  return {
    userId: data.user_id,
    items: data.items || [],
    updatedAt: data.updated_at,
  }
}

export async function updateCart(userId: string, items: Cart['items']): Promise<Cart> {
  const { data, error } = await supabase
    .from('carts')
    .upsert({
      user_id: userId,
      items,
    })
    .select('*')
    .single()
  
  if (error) throw error
  
  return {
    userId: data.user_id,
    items: data.items || [],
    updatedAt: data.updated_at,
  }
}

// Orders
export async function getOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return data.map(order => ({
    id: order.id,
    userId: order.user_id,
    items: order.items,
    total: Number(order.total),
    status: order.status,
    shippingAddress: order.shipping_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }))
}

export async function createOrder(orderData: {
  userId: string
  items: Order['items']
  total: number
  shippingAddress?: Order['shippingAddress']
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      shipping_address: orderData.shippingAddress,
      status: 'pending',
    })
    .select('*')
    .single()
  
  if (error) throw error
  
  return {
    id: data.id,
    userId: data.user_id,
    items: data.items,
    total: Number(data.total),
    status: data.status,
    shippingAddress: data.shipping_address,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
