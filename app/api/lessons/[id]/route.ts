import { NextRequest, NextResponse } from 'next/server'
import { getLessonById, updateLesson, deleteLesson } from '@/lib/supabase-db'
import { AuthResult, getOwnTeacherId, requireUser } from '@/lib/api-auth'
import { lessonUpdate, parseBody } from '@/lib/validation'

export const dynamic = 'force-dynamic'

// Admins can change any lesson; teachers only lessons on their own teacher profile
async function authorizeLessonChange(request: NextRequest, lessonId: string): Promise<AuthResult> {
  const auth = await requireUser(request, ['admin', 'teacher'])
  if (auth.response || auth.user.role === 'admin') return auth

  const lesson = await getLessonById(lessonId)
  if (!lesson) {
    return { response: NextResponse.json({ error: 'Lesson not found' }, { status: 404 }) }
  }

  const ownTeacherId = await getOwnTeacherId(auth.user)
  if (!ownTeacherId || lesson.teacherId !== ownTeacherId) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return auth
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lesson = await getLessonById(id)

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Get lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await authorizeLessonChange(request, id)
    if (auth.response) return auth.response

    const parsed = await parseBody(request, lessonUpdate)
    if (parsed.response) return parsed.response
    const updates = parsed.data

    // Only admins can move a lesson to another teacher
    if (auth.user.role !== 'admin') {
      delete updates.teacherId
    }

    const lesson = await updateLesson(id, updates)

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Update lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await authorizeLessonChange(request, id)
    if (auth.response) return auth.response

    const deleted = await deleteLesson(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('Delete lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
