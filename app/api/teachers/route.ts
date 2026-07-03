import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MOCK_TEACHERS = [
  {
    id: 1,
    name: "Sarah Johnson",
    instrument: "Piano",
    experience: "15+ years",
    rating: 4.9,
    students: 1234,
    location: "Los Angeles, CA",
    hourlyRate: 75,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Classical", "Jazz", "Beginner-friendly"],
    bio: "Classically trained pianist with a passion for teaching students of all ages. Specializes in building strong fundamentals while making learning enjoyable.",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    instrument: "Guitar",
    experience: "12+ years",
    rating: 4.8,
    students: 987,
    location: "Nashville, TN",
    hourlyRate: 65,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Rock", "Blues", "Acoustic"],
    bio: "Professional guitarist and songwriter with extensive performance experience. Focuses on practical skills and helping students play their favorite songs.",
  },
  {
    id: 3,
    name: "Alex Thompson",
    instrument: "Drums",
    experience: "10+ years",
    rating: 4.7,
    students: 756,
    location: "New York, NY",
    hourlyRate: 70,
    image: "/drum-teacher.png",
    specialties: ["Rock", "Jazz", "Latin"],
    bio: "Studio drummer and percussion specialist. Known for patient teaching style and ability to help students develop solid rhythm and timing.",
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const instrument = searchParams.get('instrument')
    const search = searchParams.get('search')

    const supabase = await createClient()

    try {
      // Try to fetch from Supabase
      let query = supabase.from('teachers').select('*')

      if (instrument && instrument !== 'all') {
        query = query.eq('instrument', instrument)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      query = query.limit(100).order('created_at', { ascending: false })

      const { data: teachers, error } = await query

      if (!error && teachers) {
        return NextResponse.json({ 
          teachers,
          source: 'database'
        })
      }
    } catch (dbError) {
      console.log('[v0] Database error, using mock data:', dbError)
    }

    // Fallback to mock data
    let filteredTeachers = [...MOCK_TEACHERS]

    if (instrument && instrument !== 'all') {
      filteredTeachers = filteredTeachers.filter(t => t.instrument === instrument)
    }

    if (search) {
      const q = search.toLowerCase()
      filteredTeachers = filteredTeachers.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ 
      teachers: filteredTeachers,
      source: 'mock'
    })
  } catch (error: any) {
    console.error('[v0] Get teachers error:', error?.message)
    return NextResponse.json({ 
      teachers: MOCK_TEACHERS,
      source: 'mock',
      message: 'Using mock data'
    })
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
