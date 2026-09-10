import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('practice_sessions').select('*').order('date', { ascending: false })
        if (userId) {
          query = query.eq('user_id', userId)
        }
        const { data, error } = await query
        if (!error && data) {
          return NextResponse.json({ sessions: data })
        }
      } catch (e) {
        console.warn('Supabase practice sessions fetch error:', e)
      }
    }

    return NextResponse.json({ sessions: [] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch practice sessions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, date, duration, instrument, lesson, section, bpm, targetBpm, techniques, notes, rating } = body

    if (!date || !duration || !lesson) {
      return NextResponse.json({ error: 'Date, duration, and lesson are required' }, { status: 400 })
    }

    const newSession = {
      id: `ps-${Date.now()}`,
      userId,
      date,
      duration: Number(duration),
      instrument: instrument || 'Piano',
      lesson,
      section,
      bpm: bpm ? Number(bpm) : undefined,
      targetBpm: targetBpm ? Number(targetBpm) : undefined,
      techniques: techniques || [],
      notes,
      rating: rating ? Number(rating) : 5,
      createdAt: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('practice_sessions').insert({
          id: newSession.id,
          user_id: userId || null,
          date,
          duration: newSession.duration,
          instrument: newSession.instrument,
          lesson: newSession.lesson,
          section,
          bpm: newSession.bpm,
          target_bpm: newSession.targetBpm,
          techniques: newSession.techniques,
          notes,
          rating: newSession.rating,
          created_at: newSession.createdAt
        })
      } catch (e) {
        console.warn('Supabase insert practice_session fallback:', e)
      }
    }

    return NextResponse.json({ session: newSession }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save practice session' }, { status: 500 })
  }
}
