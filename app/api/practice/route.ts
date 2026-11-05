import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, supabaseAdmin as supabase } from '@/lib/supabase'
import { requireUser } from '@/lib/api-auth'
import { parseBody, practiceSessionInput } from '@/lib/validation'

export const dynamic = 'force-dynamic'

// Practice logs are private: each user reads and writes only their own sessions
export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('practice_sessions')
          .select('*')
          .eq('user_id', auth.user.id)
          .order('date', { ascending: false })
        if (!error && data) {
          return NextResponse.json({ sessions: data })
        }
      } catch (e) {
        console.warn('Supabase practice sessions fetch error:', e)
      }
    }

    return NextResponse.json({ sessions: [] })
  } catch (error) {
    console.error('Get practice sessions error:', error)
    return NextResponse.json({ error: 'Failed to fetch practice sessions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    const parsed = await parseBody(request, practiceSessionInput)
    if (parsed.response) return parsed.response
    const { date, duration, instrument, lesson, section, bpm, targetBpm, techniques, notes, rating } = parsed.data
    const userId = auth.user.id

    const newSession = {
      id: `ps-${Date.now()}`,
      userId,
      date,
      duration,
      instrument: instrument || 'Piano',
      lesson,
      section: section ?? undefined,
      bpm: bpm ?? undefined,
      targetBpm: targetBpm ?? undefined,
      techniques: techniques || [],
      notes: notes ?? undefined,
      rating: rating ?? 5,
      createdAt: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('practice_sessions').insert({
          id: newSession.id,
          user_id: userId,
          date,
          duration: newSession.duration,
          instrument: newSession.instrument,
          lesson: newSession.lesson,
          section: newSession.section,
          bpm: newSession.bpm,
          target_bpm: newSession.targetBpm,
          techniques: newSession.techniques,
          notes: newSession.notes,
          rating: newSession.rating,
          created_at: newSession.createdAt
        })
      } catch (e) {
        console.warn('Supabase insert practice_session fallback:', e)
      }
    }

    return NextResponse.json({ session: newSession }, { status: 201 })
  } catch (error) {
    console.error('Save practice session error:', error)
    return NextResponse.json({ error: 'Failed to save practice session' }, { status: 500 })
  }
}
