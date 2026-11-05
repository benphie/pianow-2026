// Authentication utilities

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const MIN_JWT_SECRET_LENGTH = 32

// Read lazily so a missing secret fails the request that needs it, not the build
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim()
  if (!secret || secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be set to at least ${MIN_JWT_SECRET_LENGTH} random characters (for example: openssl rand -base64 48)`
    )
  }
  return secret
}

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
  // Reject anything that isn't a bcrypt hash
  if (hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2y$') || hashedPassword.startsWith('$2a$')) {
    return bcrypt.compare(password, hashedPassword);
  }

  return false;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  // Outside the try so a missing secret surfaces as a server error, not as "invalid token"
  const secret = getJwtSecret()
  try {
    return jwt.verify(token, secret) as JWTPayload
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
