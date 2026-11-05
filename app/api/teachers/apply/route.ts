import { NextRequest, NextResponse } from 'next/server'
import { createTeacherApplication, getTeacherApplications, getTeacherApplicationByEmail, getTeacherApplicationByUserId } from '@/lib/supabase-db'
import { getOptionalUser, requireUser } from '@/lib/api-auth'
import { parseBody, teacherApplicationInput } from '@/lib/validation'
import { TeacherApplication, User } from '@/lib/types'

export const dynamic = 'force-dynamic'

function isOwnApplication(application: TeacherApplication, user: User | null): boolean {
  if (!user) return false
  return application.userId === user.id || application.email.toLowerCase() === user.email.toLowerCase()
}

// Email lookups are case-insensitive pattern matches, so keep only exact matches
async function findApplicationByEmail(email: string): Promise<TeacherApplication | null> {
  const application = await getTeacherApplicationByEmail(email)
  return application && application.email.toLowerCase() === email.trim().toLowerCase() ? application : null
}

export async function POST(request: NextRequest) {
  try {
    // Applying doesn't require an account, but a signed-in applicant is linked to it
    const user = await getOptionalUser(request)

    const parsed = await parseBody(request, teacherApplicationInput)
    if (parsed.response) return parsed.response
    const data = parsed.data

    // Check if an application already exists for this email
    const existing = await findApplicationByEmail(data.email)
    if (existing && existing.status === 'pending') {
      return NextResponse.json(
        {
          message: 'An application is already pending review for this email address',
          // Only the applicant may see what they submitted
          application: isOwnApplication(existing, user) ? existing : undefined,
        },
        { status: 200 }
      )
    }

    const application = await createTeacherApplication({
      ...data,
      userId: user?.id,
      instruments: data.instruments || [],
      preferredAgeGroups: data.preferredAgeGroups || [],
      status: 'pending',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Teacher application submitted successfully',
        application
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Teacher application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit teacher application' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response
    const { user } = auth
    const isAdmin = user.role === 'admin'

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (email) {
      if (!isAdmin && email.trim().toLowerCase() !== user.email.toLowerCase()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const application = await findApplicationByEmail(email)
      return NextResponse.json({ application })
    }

    if (userId) {
      if (!isAdmin && userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const application = await getTeacherApplicationByUserId(userId)
      return NextResponse.json({ application })
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const applications = await getTeacherApplications()
    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Get teacher applications error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve applications' },
      { status: 500 }
    )
  }
}
