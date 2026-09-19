import { NextRequest, NextResponse } from 'next/server'
import { getLessons, createLesson } from '@/lib/supabase-db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const lessons = await getLessons()
    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Get lessons error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
