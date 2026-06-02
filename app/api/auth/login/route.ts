import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/supabase-db'
import { verifyPassword, generateToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user from Supabase or mock storage
    const user = await getUserByEmail(email)

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Check if it's a Supabase connection error
    if (error?.message?.includes('fetch') || error?.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your Supabase configuration.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
