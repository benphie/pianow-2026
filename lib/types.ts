// Shared types for the application

export interface User {
  id: string
  email: string
  name: string
  password?: string // Hashed password - should not be sent to client
  avatar?: string
  role?: 'user' | 'teacher' | 'admin'
  createdAt: string
  updatedAt: string
}

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
