import { NextRequest, NextResponse } from 'next/server'
import { getLessons, createLesson } from '@/lib/supabase-db'
import { getOwnTeacherId, requireUser } from '@/lib/api-auth'
import { lessonInput, parseBody } from '@/lib/validation'

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
    const auth = await requireUser(request, ['admin', 'teacher'])
    if (auth.response) return auth.response

    const parsed = await parseBody(request, lessonInput)
    if (parsed.response) return parsed.response
    const { title, description, videoUrl, youtubeUrl, duration, level, thumbnail, price, isFree } = parsed.data

    // Teachers can only add lessons to their own teacher profile
    let teacherId = parsed.data.teacherId
    if (auth.user.role !== 'admin') {
      const ownTeacherId = await getOwnTeacherId(auth.user)
      if (!ownTeacherId || (teacherId && teacherId !== ownTeacherId)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      teacherId = ownTeacherId
    }

    if (!teacherId) {
      return NextResponse.json({ error: 'teacherId is required' }, { status: 400 })
    }

    const newLesson = await createLesson({
      title,
      description,
      videoUrl,
      youtubeUrl,
      thumbnail,
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
