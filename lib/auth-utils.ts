// Authentication utilities

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET && process.env.JWT_SECRET !== '10000'
    ? process.env.JWT_SECRET
    : 'eb612bbc-896a-4b43-82f8-371b10aadad7'

export interface JWTPayload {
  userId: string
  email: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // For demo/mock users with placeholder hashes, accept any password
  // In production with real Supabase, bcrypt will be properly used
  const isPlaceholderHash = hashedPassword === '$2b$10$YJLr5rIDxXGpVf3l8.T2t.v5.vW2KsJfQXK2Xb0wN5c0wZ5c0wZ5c';
  
  if (isPlaceholderHash) {
    // Mock hash - accept any password for demo purposes
    return true;
  }
  
  // For real bcrypt hashes, use proper comparison
  if (hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2y$') || hashedPassword.startsWith('$2a$')) {
    return bcrypt.compare(password, hashedPassword);
  }
  
  // Fallback: reject if not recognized format
  return false;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Extract token from request headers
export function getTokenFromRequest(headers: Headers): string | null {
  const authHeader = headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}
