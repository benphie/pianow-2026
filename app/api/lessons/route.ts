import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MOCK_LESSONS = [
  {
    id: 1,
    title: "10 Steps to Improvise Jazz",
    description: "Master the fundamentals of jazz improvisation with this comprehensive step-by-step guide.",
    instructor: "Jazz Master",
    duration: "60 minutes",
    level: "Intermediate",
    instrument: "Piano",
    rating: 4.9,
    students: 1247,
    thumbnail: "/piano-lesson.png",
    videoUrl: "/video lessons/10 STEPS TO IMPROVISE JAZZ.mp4",
  },
  {
    id: 2,
    title: "Improvising Beautiful Melodies On The Piano",
    description: "Learn to create stunning melodies and express yourself through piano improvisation.",
    instructor: "Melody Expert",
    duration: "45 minutes",
    level: "Intermediate",
    instrument: "Piano",
    rating: 4.8,
    students: 892,
    thumbnail: "/piano-lesson.png",
    videoUrl: "/video lessons/Improvising Beautiful Melodies On The Piano.mp4",
  },
  {
    id: 3,
    title: "Left Hand Arpeggio Patterns",
    description: "Master essential left-hand arpeggio patterns to enhance your piano playing technique.",
    instructor: "Technique Specialist",
    duration: "35 minutes",
    level: "Beginner",
    instrument: "Piano",
    rating: 4.7,
    students: 1156,
    thumbnail: "/piano-lesson.png",
    videoUrl: "/video lessons/Left Hand Arpeggio Patterns (Piano Lesson).mp4",
  },
  {
    id: 4,
    title: "Dramatic Piano Playing with Arpeggios",
    description: "Learn arpeggio patterns that add intensity and mood to your piano performances.",
    instructor: "Performance Coach",
    duration: "50 minutes",
    level: "Intermediate",
    instrument: "Piano",
    rating: 4.9,
    students: 743,
    thumbnail: "/piano-lesson.png",
    videoUrl: "/video lessons/Make Your Piano Playing Instantly More Dramatic.mp4",
  },
  {
    id: 5,
    title: "Piano Arpeggios Tutorial - 6 Patterns",
    description: "From beginner to pro: master 6 essential arpeggio patterns to inspire your playing.",
    instructor: "Arpeggio Master",
    duration: "55 minutes",
    level: "All Levels",
    instrument: "Piano",
    rating: 4.8,
    students: 1689,
    thumbnail: "/piano-lesson.png",
    videoUrl: "/video lessons/Piano Arpeggios Tutorial.mp4",
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const level = searchParams.get('level')
    const instrument = searchParams.get('instrument')
    const search = searchParams.get('search')

    const supabase = await createClient()
    
    try {
      // Try to fetch from Supabase
      let query = supabase.from('lessons').select('*')

      if (level && level !== 'all') {
        query = query.eq('level', level)
      }

      if (instrument && instrument !== 'all') {
        query = query.eq('instrument', instrument)
      }

      if (search) {
        query = query.ilike('title', `%${search}%`)
      }

      query = query.limit(100).order('created_at', { ascending: false })

      const { data: lessons, error } = await query

      if (!error && lessons) {
        return NextResponse.json({ 
          lessons,
          source: 'database'
        })
      }
    } catch (dbError) {
      console.log('[v0] Database error, using mock data:', dbError)
    }

    // Fallback to mock data
    let filteredLessons = [...MOCK_LESSONS]

    if (level && level !== 'all') {
      filteredLessons = filteredLessons.filter(l => l.level === level)
    }

    if (instrument && instrument !== 'all') {
      filteredLessons = filteredLessons.filter(l => l.instrument === instrument)
    }

    if (search) {
      const q = search.toLowerCase()
      filteredLessons = filteredLessons.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ 
      lessons: filteredLessons,
      source: 'mock'
    })
  } catch (error: any) {
    console.error('[v0] Get lessons error:', error?.message)
    return NextResponse.json({ 
      lessons: MOCK_LESSONS,
      source: 'mock',
      message: 'Using mock data'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, videoUrl, youtubeUrl, duration, level, teacherId, price, isFree } = body

    if (!title || !description || !teacherId) {
      return NextResponse.json(
        { error: 'Title, description, and teacherId are required' },
        { status: 400 }
      )
    }

    const newLesson = await createLesson({
      title,
      description,
      videoUrl,
      youtubeUrl,
      duration: duration || '30 minutes',
      level: level || 'Beginner',
      teacherId,
      price,
      isFree: isFree ?? true,
    })

    return NextResponse.json({ lesson: newLesson }, { status: 201 })
  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
