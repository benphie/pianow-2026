import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mockLogin, isDevMode } from '@/lib/dev-mock-auth'

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

    console.log('[v0] Login attempt:', { email })

    try {
      const supabase = await createClient()

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      })

      if (authError) {
        console.log('[v0] Auth error:', authError)
        throw authError
      }

      if (!authData.user) {
        console.log('[v0] No user returned from login')
        throw new Error('Login failed')
      }

      console.log('[v0] Login successful with Supabase:', authData.user.id)

      return NextResponse.json({
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name || 'User',
          role: authData.user.user_metadata?.role || 'user',
        },
        token: authData.session?.access_token || '',
        session: authData.session,
      }, { status: 200 })
    } catch (supabaseError: any) {
      // Fallback to dev mock auth if Supabase fails
      if (isDevMode() || supabaseError?.message?.includes('fetch')) {
        console.log('[v0] Supabase failed, using dev mock auth:', supabaseError?.message)
        const { user, token, session } = await mockLogin(email.toLowerCase(), password)
        return NextResponse.json({
          user: {
            ...user,
            role: 'user',
          },
          token,
          session,
        }, { status: 200 })
      }
      throw supabaseError
    }
  } catch (error: any) {
    console.log('[v0] Login error:', error?.message)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
