// Request authentication helpers for API routes

import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from './auth-utils'
import { getTeachers, getUserById } from './supabase-db'
import { User } from './types'

export type Role = NonNullable<User['role']>

export type AuthResult =
  | { user: User; response?: undefined }
  | { user?: undefined; response: NextResponse }

// Returns the signed-in user, or null when the request has no valid token
export async function getOptionalUser(request: NextRequest): Promise<User | null> {
  const token = getTokenFromRequest(request.headers)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return getUserById(payload.userId)
}

// Requires a signed-in user, optionally with one of the given roles.
// On failure, return `response` from the route handler.
export async function requireUser(request: NextRequest, roles?: Role[]): Promise<AuthResult> {
  const user = await getOptionalUser(request)

  if (!user) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (roles && !roles.includes(user.role ?? 'user')) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user }
}

// The ID of the teacher profile that belongs to `user`, if they have one
export async function getOwnTeacherId(user: User): Promise<string | null> {
  const teachers = await getTeachers()
  return teachers.find(teacher => teacher.userId === user.id)?.id ?? null
}
