import { NextRequest, NextResponse } from 'next/server'
import { getLessonById } from '@/lib/supabase-db'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await getLessonById(params.id)

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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('lessons')
      .update({
        ...body,
        video_url: body.videoUrl,
        youtube_url: body.youtubeUrl,
        teacher_id: body.teacherId,
        is_free: body.isFree,
      })
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        )
      }
      throw error
    }

    const lesson = {
      id: data.id,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url,
      youtubeUrl: data.youtube_url,
      duration: data.duration,
      level: data.level,
      teacherId: data.teacher_id,
      thumbnail: data.thumbnail,
      price: data.price ? Number(data.price) : undefined,
      isFree: data.is_free,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', params.id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        )
      }
      throw error
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
