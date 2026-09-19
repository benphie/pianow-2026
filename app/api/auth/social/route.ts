import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/supabase-db'
import { hashPassword, generateToken } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, email, phone, name, avatar, password, kingschatHandle, mode } = body

    if (!provider || !['google', 'kingschat'].includes(provider)) {
      return NextResponse.json(
        { error: 'Valid social provider (google or kingschat) is required' },
        { status: 400 }
      )
    }

    // Resolve an email or synthetic account identifier
    let normalizedEmail = (email && typeof email === 'string' ? email.trim() : '')

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      if (provider === 'kingschat') {
        if (phone && typeof phone === 'string' && phone.trim()) {
          const cleanPhone = phone.replace(/[^0-9]/g, '')
          normalizedEmail = `${cleanPhone || 'phone'}@kingschat.online`
        } else if (kingschatHandle && typeof kingschatHandle === 'string' && kingschatHandle.trim()) {
          const cleanHandle = kingschatHandle.replace(/^@/, '').replace(/[^a-zA-Z0-9._-]/g, '')
          normalizedEmail = `${cleanHandle || 'user'}@kingschat.online`
        } else if (normalizedEmail) {
          const cleanId = normalizedEmail.replace(/[^a-zA-Z0-9._-]/g, '')
          normalizedEmail = `${cleanId || 'user'}@kingschat.online`
        }
      } else if (normalizedEmail) {
        normalizedEmail = `${normalizedEmail}@gmail.com`
      }
    }

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email, phone number, or KingsChat handle is required' },
        { status: 400 }
      )
    }

    normalizedEmail = normalizedEmail.toLowerCase().trim()

    // Determine clean display name
    let displayName = (name && typeof name === 'string' && name.trim()) || ''
    if (!displayName) {
      if (provider === 'google') {
        displayName = 'Google User'
      } else if (kingschatHandle) {
        displayName = kingschatHandle.startsWith('@') ? kingschatHandle : `@${kingschatHandle}`
      } else if (phone) {
        displayName = `KingsChat (${phone})`
      } else {
        displayName = normalizedEmail.split('@')[0] || 'KingsChat User'
      }
    }

    // Look up existing user
    let user = await getUserByEmail(normalizedEmail)

    // Also check if existing user exists by handle or phone email if kingschat
    if (!user && provider === 'kingschat') {
      if (kingschatHandle) {
        const altEmail = `${kingschatHandle.replace(/^@/, '').toLowerCase().trim()}@kingschat.online`
        user = await getUserByEmail(altEmail)
      }
      if (!user && phone) {
        const cleanPhone = phone.replace(/[^0-9]/g, '')
        const altEmail = `${cleanPhone}@kingschat.online`
        user = await getUserByEmail(altEmail)
      }
    }

    if (!user) {
      // Create user if not found
      const passToHash = password || `social_pass_${provider}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      const hashedPassword = await hashPassword(passToHash)

      // If custom avatar or provider-specific avatar requested
      const finalAvatar = avatar || (provider === 'google'
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=4285F4`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(kingschatHandle || displayName)}`)

      const newUser = await createUser({
        email: normalizedEmail,
        name: displayName,
        password_hash: hashedPassword,
        avatar: finalAvatar,
        role: 'user',
      })

      const userWithDetails = {
        ...newUser,
        avatar: finalAvatar,
        provider,
        phone: phone || undefined,
        kingschatHandle: kingschatHandle || undefined,
      }

      const token = generateToken({ userId: newUser.id, email: newUser.email })

      return NextResponse.json({
        user: userWithDetails,
        token,
        isNew: true,
      }, { status: 201 })
    }

    // Existing user found - generate token
    const token = generateToken({ userId: user.id, email: user.email })
    const { password: _, ...userWithoutPassword } = user

    const userWithDetails = {
      ...userWithoutPassword,
      provider: provider || user.provider,
      phone: phone || user.phone,
      kingschatHandle: kingschatHandle || user.kingschatHandle,
    }

    return NextResponse.json({
      user: userWithDetails,
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
