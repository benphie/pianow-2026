import { NextRequest, NextResponse } from 'next/server'
import { getTeachers, createTeacher } from '@/lib/supabase-db'
import { requireUser } from '@/lib/api-auth'
import { parseBody, teacherInput } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const teachers = await getTeachers()
    return NextResponse.json({ teachers })
  } catch (error) {
    console.error('Get teachers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request, ['admin'])
    if (auth.response) return auth.response

    const parsed = await parseBody(request, teacherInput)
    if (parsed.response) return parsed.response
    const { userId, name, bio, specialties, education, certifications } = parsed.data

    const teacher = await createTeacher({
      userId,
      name,
      bio,
      specialties: specialties || [],
      education: education || [],
      certifications: certifications || [],
    })

    return NextResponse.json({ teacher }, { status: 201 })
  } catch (error) {
    console.error('Create teacher error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
