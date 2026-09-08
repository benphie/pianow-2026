import { NextRequest, NextResponse } from 'next/server'
import { getTeachers, createTeacher } from '@/lib/supabase-db'

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
    const body = await request.json()
    const { userId, name, bio, specialties, education, certifications } = body

    if (!userId || !name || !bio) {
      return NextResponse.json(
        { error: 'UserId, name, and bio are required' },
        { status: 400 }
      )
    }

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
