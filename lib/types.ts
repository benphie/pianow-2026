// Shared types for the application

export interface User {
  id: string
  email: string
  name: string
  password?: string // Hashed password - should not be sent to client
  avatar?: string
  phone?: string
  kingschatHandle?: string
  provider?: 'google' | 'kingschat' | 'email'
  role?: 'user' | 'teacher' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  bio: string
  location: string
  dateOfBirth: string
  skillLevel: string
  instruments: string[]
  avatar: string
  memberSince: string
}

export type UserProfileUpdate = Omit<UserProfile, 'email' | 'avatar' | 'memberSince'>

export interface Lesson {
  id: string
  title: string
  description: string
  videoUrl?: string
  youtubeUrl?: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  teacherId: string
  thumbnail?: string
  price?: number
  isFree: boolean
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: string
  userId: string
  name: string
  bio: string
  specialties: string[]
  education: string[]
  certifications: string[]
  rating: number
  totalStudents: number
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: 'piano' | 'guitar' | 'drums' | 'audio' | 'accessories' | 'instruments'
  images: string[]
  inStock: boolean
  stockQuantity?: number
  brand?: string
  rating?: number
  reviews?: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Cart {
  userId: string
  items: CartItem[]
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

export interface TeacherApplication {
  id: string
  userId?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  instruments: string[]
  experience: string
  education?: string
  certifications?: string
  teachingExperience?: string
  timezone?: string
  availableHours?: string
  preferredAgeGroups?: string[]
  bio: string
  teachingPhilosophy?: string
  sampleVideoUrl?: string
  references?: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface PracticeSessionRecord {
  id: string
  userId?: string
  date: string
  duration: number
  instrument: string
  lesson: string
  section?: string
  bpm?: number
  targetBpm?: number
  techniques?: string[]
  notes?: string
  rating?: number
  createdAt: string
}

export interface NotificationRecord {
  id: string
  userId?: string
  type: string
  title: string
  message: string
  read: boolean
  href?: string
  createdAt: string
}

export interface LessonBookingRecord {
  id: string
  userId: string
  teacherId: string
  teacherName: string
  instrument: string
  date: string
  time: string
  durationMinutes: number
  price: number
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
}
