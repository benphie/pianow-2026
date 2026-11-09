import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/api-auth'
import { getUserProfile, updateUserProfile } from '@/lib/supabase-db'
import { parseBody, profileInput } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    const profile = await getUserProfile(auth.user.id)
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Your profile could not be loaded. Please try again.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    const parsed = await parseBody(request, profileInput)
    if (parsed.response) return parsed.response

    const profile = await updateUserProfile(auth.user.id, parsed.data)

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Your profile could not be saved. Please try again.' }, { status: 500 })
  }
}
