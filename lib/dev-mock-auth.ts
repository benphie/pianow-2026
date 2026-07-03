// Development mock authentication for testing
// In production, use real Supabase authentication

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

interface MockUser {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: string
}

// Use a file-based store for persistence across server restarts
const MOCK_USERS_FILE = path.join(process.cwd(), '.mock-users.json')

function loadMockUsers(): Map<string, MockUser> {
  try {
    if (fs.existsSync(MOCK_USERS_FILE)) {
      const data = fs.readFileSync(MOCK_USERS_FILE, 'utf-8')
      const users = JSON.parse(data)
      return new Map(Object.entries(users))
    }
  } catch (error) {
    console.log('[v0] Failed to load mock users:', error)
  }
  return new Map()
}

function saveMockUsers(users: Map<string, MockUser>): void {
  try {
    const data = Object.fromEntries(users)
    fs.writeFileSync(MOCK_USERS_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.log('[v0] Failed to save mock users:', error)
  }
}

// In-memory store (synced to file for dev only)
let mockUsers = loadMockUsers()

export async function mockSignup(email: string, name: string, password: string) {
  // Reload to get any updates from other processes
  mockUsers = loadMockUsers()
  
  // Check if user already exists
  const existingUser = Array.from(mockUsers.values()).find(u => u.email === email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Create new user
  const userId = crypto.randomUUID()
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  
  const newUser: MockUser = {
    id: userId,
    email,
    name,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  }

  mockUsers.set(userId, newUser)
  saveMockUsers(mockUsers)

  // Return user without password
  const { password_hash, ...userWithoutPassword } = newUser
  return {
    user: userWithoutPassword,
    token: crypto.randomBytes(32).toString('hex'),
    session: {
      access_token: crypto.randomBytes(32).toString('hex'),
    },
  }
}

export async function mockLogin(email: string, password: string) {
  // Reload to get any updates from other processes
  mockUsers = loadMockUsers()
  
  // Find user by email
  const user = Array.from(mockUsers.values()).find(u => u.email === email)
  
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Check password
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  if (user.password_hash !== passwordHash) {
    throw new Error('Invalid email or password')
  }

  // Return user without password
  const { password_hash, ...userWithoutPassword } = user
  return {
    user: userWithoutPassword,
    token: crypto.randomBytes(32).toString('hex'),
    session: {
      access_token: crypto.randomBytes(32).toString('hex'),
    },
  }
}

export function isDevMode() {
  return process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_SUPABASE_URL
}
