import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mockSignup, isDevMode } from '@/lib/dev-mock-auth'

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

    console.log('[v0] Signup attempt:', { email, name, method: signupMethod })

    try {
      const supabase = await createClient()

      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            name,
            signup_method: signupMethod,
          },
        },
      })

      if (authError) {
        console.log('[v0] Auth error:', authError)
        throw authError
      }

      if (!authData.user) {
        console.log('[v0] No user returned from signup')
        throw new Error('Failed to create user')
      }

      console.log('[v0] User created with Supabase:', authData.user.id)

      // Profile is automatically created by the trigger in the database
      return NextResponse.json({
        message: 'Signup successful. Account created.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name || 'User',
          role: authData.user.user_metadata?.role || 'user',
        },
        token: authData.session?.access_token || '',
        session: authData.session,
      }, { status: 201 })
    } catch (supabaseError: any) {
      // Fallback to dev mock auth if Supabase fails
      if (isDevMode() || supabaseError?.message?.includes('fetch')) {
        console.log('[v0] Supabase failed, using dev mock auth:', supabaseError?.message)
        const { user, token, session } = await mockSignup(email.toLowerCase(), name, password)
        return NextResponse.json({
          message: 'Signup successful (dev mode). Account created.',
          user: {
            ...user,
            role: 'user',
          },
          token,
          session,
        }, { status: 201 })
      }
      throw supabaseError
    }
  } catch (error: any) {
    console.log('[v0] Signup error:', error?.message)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
