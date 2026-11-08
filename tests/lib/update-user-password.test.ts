import { describe, expect, it, vi } from 'vitest'
import { updateUserPassword } from '@/lib/supabase-db'

// Stands in for a configured Supabase project, so a failed write can be simulated
const db = vi.hoisted(() => ({ result: { data: null as unknown, error: null as unknown } }))

vi.mock('@/lib/supabase', () => {
  const query: Record<string, unknown> = {}
  query.update = () => query
  query.eq = () => query
  query.select = () => Promise.resolve(db.result)
  return { isSupabaseConfigured: true, supabaseAdmin: { from: () => query } }
})

describe('updateUserPassword with a database', () => {
  it('fails loudly when the database reports an error', async () => {
    db.result = { data: null, error: { message: 'connection lost' } }

    await expect(updateUserPassword('user-1', 'hash')).rejects.toThrow(/connection lost/)
  })

  it('fails when no account was updated', async () => {
    db.result = { data: [], error: null }

    await expect(updateUserPassword('user-1', 'hash')).rejects.toThrow(/user not found/)
  })

  it('succeeds when the account row changed', async () => {
    db.result = { data: [{ id: 'user-1' }], error: null }

    await expect(updateUserPassword('user-1', 'hash')).resolves.toBeUndefined()
  })
})
