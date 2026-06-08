import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logUserSignup } from '@/lib/db'
import { buildSignupMetadata } from '@/lib/signup-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, signupMethod = 'email' } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      )
    }

    // Extract signup metadata from request
    const signupMetadata = await buildSignupMetadata(request)

    // Log signup event to user_signups table
    try {
      await logUserSignup(
        authData.user.id,
        email.toLowerCase(),
        signupMethod as 'email' | 'google' | 'kings_chat',
        signupMetadata
      )
    } catch (err) {
      console.error('Failed to log signup:', err)
      // Don't fail the signup if logging fails
    }

    // Profile is automatically created by the trigger in the database
    return NextResponse.json({
      message: 'Signup successful. Please check your email to confirm your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
