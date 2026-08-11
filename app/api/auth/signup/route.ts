import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, signupMethod = 'email' } = await request.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email: String(email).trim().toLowerCase(),
      password: String(password),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${request.nextUrl.origin}/auth/callback`,
        data: { name: String(name).trim(), signup_method: signupMethod },
      },
    })

    if (error || !data.user) {
      const message = error?.message?.toLowerCase().includes('already')
        ? 'Unable to create this account. Check the email or use a different one.'
        : error?.message || 'Unable to create your account.'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({
      message: data.session ? 'Signup successful. Account created.' : 'Check your email to confirm your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'User',
        role: 'user',
      },
      session: data.session,
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unable to create your account right now.' }, { status: 500 })
  }
}
