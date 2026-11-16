// Limits password guessing. Attempts are counted in the database because
// the app can run as several server instances that don't share memory.

import { createHash } from 'crypto'
import { supabaseAdmin as supabase, isSupabaseConfigured } from './supabase'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

// Only used when no database is configured
const memoryAttempts = new Map<string, number[]>()

// Hashed so that a password typed into the email box is never stored
function hashEmail(email: string) {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
}

function reserveInMemory(emailHash: string, cutoff: number) {
  const recent = (memoryAttempts.get(emailHash) ?? []).filter(time => time >= cutoff)
  const allowed = recent.length < MAX_ATTEMPTS
  if (allowed) recent.push(Date.now())
  memoryAttempts.set(emailHash, recent)
  return allowed
}

// Call before checking the password. Recording the attempt first means simultaneous
// guesses can't all pass the limit. Returns false when the email is currently blocked.
export async function reserveLoginAttempt(email: string): Promise<boolean> {
  const emailHash = hashEmail(email)
  const cutoff = Date.now() - WINDOW_MS

  if (!isSupabaseConfigured) return reserveInMemory(emailHash, cutoff)

  const cutoffTime = new Date(cutoff).toISOString()

  try {
    await supabase.from('login_attempts').delete().lt('attempted_at', cutoffTime)

    const { data: attempt, error: insertError } = await supabase
      .from('login_attempts')
      .insert({ email_hash: emailHash })
      .select('id')
      .single()

    if (insertError) throw new Error(insertError.message)

    const { count, error: countError } = await supabase
      .from('login_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('email_hash', emailHash)
      .gte('attempted_at', cutoffTime)

    if (countError) throw new Error(countError.message)

    if ((count ?? 0) > MAX_ATTEMPTS) {
      // A blocked attempt isn't kept, so continued guessing doesn't extend the block
      await supabase.from('login_attempts').delete().eq('id', attempt.id)
      return false
    }

    return true
  } catch (error) {
    // Logging in must keep working if this table is unavailable
    console.error('Login attempt limit unavailable:', error)
    return true
  }
}

export async function clearLoginAttempts(email: string): Promise<void> {
  const emailHash = hashEmail(email)

  if (!isSupabaseConfigured) {
    memoryAttempts.delete(emailHash)
    return
  }

  const { error } = await supabase.from('login_attempts').delete().eq('email_hash', emailHash)
  if (error) console.error('Could not clear login attempts:', error.message)
}
