// Shared helpers for calling API route handlers directly against the in-memory store

import { NextRequest } from 'next/server'
import { generateToken } from '@/lib/auth-utils'
import { createProduct, createTeacher, createUser } from '@/lib/supabase-db'
import { Product, User } from '@/lib/types'

let counter = 0
export const uniqueEmail = (prefix = 'user') => `${prefix}-${Date.now()}-${++counter}@test.dev`

// The in-memory store builds some IDs from the current millisecond
const nextMillisecond = () => new Promise(resolve => setTimeout(resolve, 2))

export async function makeUser(role: NonNullable<User['role']> = 'user') {
  const user = await createUser({
    email: uniqueEmail(role),
    name: `Test ${role}`,
    password_hash: 'not-a-real-hash',
    role,
  })
  return { user, token: generateToken({ userId: user.id, email: user.email }) }
}

export async function makeTeacher() {
  const { user, token } = await makeUser('teacher')
  await nextMillisecond()
  const profile = await createTeacher({ userId: user.id, name: 'Test Teacher', bio: 'Teaches tests' })
  return { user, token, profile }
}

export async function makeProduct(overrides: Partial<Product> = {}) {
  await nextMillisecond()
  return createProduct({
    name: 'Test Piano',
    description: 'A piano for tests',
    price: 100,
    category: 'piano',
    ...overrides,
  })
}

interface RequestOptions {
  method?: string
  token?: string
  body?: unknown
  rawBody?: string
}

export function apiRequest(path: string, { method = 'GET', token, body, rawBody }: RequestOptions = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  return new NextRequest(`http://localhost${path}`, {
    method,
    headers,
    body: rawBody ?? (body === undefined ? undefined : JSON.stringify(body)),
  })
}

export const routeContext = (id: string) => ({ params: Promise.resolve({ id }) })
