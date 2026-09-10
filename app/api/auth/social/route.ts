import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/supabase-db'
import { hashPassword, generateToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, email, name, avatar, password, kingschatHandle } = body

    if (!provider || !['google', 'kingschat'].includes(provider)) {
      return NextResponse.json(
        { error: 'Valid social provider (google or kingschat) is required' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const displayName = (name && name.trim()) || (provider === 'google' ? 'Google User' : (kingschatHandle || 'KingsChat User'))

    // Look up existing user
    let user = await getUserByEmail(normalizedEmail)

    if (!user) {
      // Create user if not found
      const passToHash = password || `social_pass_${provider}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      const hashedPassword = await hashPassword(passToHash)

      const newUser = await createUser({
        email: normalizedEmail,
        name: displayName,
        password_hash: hashedPassword,
        role: 'user',
      })

      // If custom avatar or provider-specific avatar requested
      const finalAvatar = avatar || (provider === 'google'
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=4285F4`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(kingschatHandle || displayName)}`)

      const userWithAvatar = {
        ...newUser,
        avatar: finalAvatar,
      }

      const token = generateToken({ userId: newUser.id, email: newUser.email })

      return NextResponse.json({
        user: userWithAvatar,
        token,
        isNew: true,
      }, { status: 201 })
    }

    // Existing user found - generate token
    const token = generateToken({ userId: user.id, email: user.email })
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      isNew: false,
    })
  } catch (error: any) {
    console.error('Social auth error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to authenticate with social provider' },
      { status: 500 }
    )
  }
}
