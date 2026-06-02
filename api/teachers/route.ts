import { NextRequest, NextResponse } from 'next/server'
import { getTeachers } from '@/lib/supabase-db'
import { createServerClient } from '@/lib/supabase'

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

    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('teachers')
      .insert({
        user_id: userId,
        name,
        bio,
        specialties: specialties || [],
        education: education || [],
        certifications: certifications || [],
        rating: 0,
        total_students: 0,
      })
      .select('*')
      .single()

    if (error) throw error

    const teacher = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      bio: data.bio,
      specialties: data.specialties || [],
      education: data.education || [],
      certifications: data.certifications || [],
      rating: Number(data.rating),
      totalStudents: data.total_students,
      avatar: data.avatar,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json({ teacher }, { status: 201 })
  } catch (error) {
    console.error('Create teacher error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
