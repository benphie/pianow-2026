import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password: String(password),
    })

    if (error || !data.user) {
      const message = error?.message?.toLowerCase().includes('confirm')
        ? 'Please confirm your email before signing in.'
        : 'Invalid email or password.'
      return NextResponse.json({ error: message }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'user',
      },
      session: data.session,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 500 })
  }
}
