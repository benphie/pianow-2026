import { NextRequest, NextResponse } from 'next/server'
import { getLessonById, updateLesson, deleteLesson } from '@/lib/supabase-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const lesson = await updateLesson(id, body)

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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await params
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
