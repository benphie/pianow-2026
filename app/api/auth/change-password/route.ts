import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/api-auth'
import { hashPassword, verifyPassword } from '@/lib/auth-utils'
import { getUserPasswordHash, updateUserPassword } from '@/lib/supabase-db'
import { changePasswordInput, parseBody } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    const parsed = await parseBody(request, changePasswordInput)
    if (parsed.response) return parsed.response
    const { currentPassword, newPassword } = parsed.data

    const storedHash = await getUserPasswordHash(auth.user.id)
    if (!storedHash || !(await verifyPassword(currentPassword, storedHash))) {
      return NextResponse.json({ error: 'Your current password is incorrect' }, { status: 400 })
    }

    if (await verifyPassword(newPassword, storedHash)) {
      return NextResponse.json({ error: 'Your new password must be different from your current one' }, { status: 400 })
    }

    await updateUserPassword(auth.user.id, await hashPassword(newPassword))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong while changing your password. Please try again.' },
      { status: 500 }
    )
  }
}
