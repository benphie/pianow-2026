import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/supabase-db'
import { hashPassword, generateToken } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user in Supabase
    const newUser = await createUser({
      email: email.toLowerCase(),
      name,
      password_hash: hashedPassword,
      role: 'user',
    })

    // Generate token
    const token = generateToken({ userId: newUser.id, email: newUser.email })

    return NextResponse.json({
      user: newUser,
      token,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Check if it's a Supabase connection error
    if (error?.message?.includes('fetch') || error?.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your Supabase configuration.' },
        { status: 503 }
      )
    }
    
    // Handle Supabase unique constraint error
    if (error.code === '23505' || error?.message?.includes('duplicate')) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
