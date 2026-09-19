import { NextRequest, NextResponse } from 'next/server'
import { createTeacherApplication, getTeacherApplications, getTeacherApplicationByEmail, getTeacherApplicationByUserId } from '@/lib/supabase-db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      location,
      instruments,
      experience,
      education,
      certifications,
      teachingExperience,
      timezone,
      availableHours,
      preferredAgeGroups,
      bio,
      teachingPhilosophy,
      sampleVideoUrl,
      references,
    } = body

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'First name, last name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Check if an application already exists for this email
    const existing = await getTeacherApplicationByEmail(email)
    if (existing && existing.status === 'pending') {
      return NextResponse.json(
        { 
          message: 'An application is already pending review for this email address',
          application: existing 
        },
        { status: 200 }
      )
    }

    const application = await createTeacherApplication({
      userId,
      firstName,
      lastName,
      email,
      phone,
      location,
      instruments: instruments || [],
      experience,
      education,
      certifications,
      teachingExperience,
      timezone,
      availableHours,
      preferredAgeGroups: preferredAgeGroups || [],
      bio,
      teachingPhilosophy,
      sampleVideoUrl,
      references,
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
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (email) {
      const application = await getTeacherApplicationByEmail(email)
      return NextResponse.json({ application })
    }

    if (userId) {
      const application = await getTeacherApplicationByUserId(userId)
      return NextResponse.json({ application })
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
