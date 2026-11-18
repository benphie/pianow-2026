import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearLoginAttempts, reserveLoginAttempt } from '@/lib/login-attempts'

// Stands in for a configured Supabase project, so counts and failures can be simulated
const db = vi.hoisted(() => ({
  insertResult: { data: null as unknown, error: null as unknown },
  countResult: { count: 0 as number | null, error: null as unknown },
  inserted: [] as Record<string, unknown>[],
  deletes: [] as [string, string, string][],
}))

vi.mock('@/lib/supabase', () => {
  const remember = (filter: string) => (column: string, value: string) => {
    db.deletes.push([filter, column, value])
    return Promise.resolve({ error: null })
  }

  const from = () => ({
    delete: () => ({ lt: remember('lt'), eq: remember('eq') }),
    insert: (row: Record<string, unknown>) => {
      db.inserted.push(row)
      return { select: () => ({ single: () => Promise.resolve(db.insertResult) }) }
    },
    select: () => ({ eq: () => ({ gte: () => Promise.resolve(db.countResult) }) }),
  })

  return { isSupabaseConfigured: true, supabaseAdmin: { from } }
})

// sha256 of "ada@x.com", worked out separately with sha256sum
const ADA_HASH = 'fe2cefe36d6ea66e92d973c05d1c03d5db8dae6e2de8edc6dbe29fcf360d65c6'

beforeEach(() => {
  db.insertResult = { data: { id: 'attempt-1' }, error: null }
  db.countResult = { count: 1, error: null }
  db.inserted = []
  db.deletes = []
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('reserveLoginAttempt with a database', () => {
  it('allows the fifth attempt and keeps its record', async () => {
    db.countResult = { count: 5, error: null }

    await expect(reserveLoginAttempt('ada@x.com')).resolves.toBe(true)

    expect(db.deletes).not.toContainEqual(['eq', 'id', 'attempt-1'])
  })

  it('refuses the sixth attempt and removes its record so the block is not extended', async () => {
    db.countResult = { count: 6, error: null }

    await expect(reserveLoginAttempt('ada@x.com')).resolves.toBe(false)

    expect(db.deletes).toContainEqual(['eq', 'id', 'attempt-1'])
  })

  it('stores a hash instead of the typed email, whatever its capitals or spaces', async () => {
    await reserveLoginAttempt('  ADA@x.com ')

    expect(db.inserted).toEqual([{ email_hash: ADA_HASH }])
  })

  it('removes attempts older than 15 minutes', async () => {
    vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-06-01T12:00:00.000Z') })

    await reserveLoginAttempt('ada@x.com')

    expect(db.deletes).toContainEqual(['lt', 'attempted_at', '2026-06-01T11:45:00.000Z'])
  })

  // Otherwise nobody could log in if the table has not been created yet
  it('allows the login when the attempt cannot be recorded', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    db.insertResult = { data: null, error: { message: 'relation "login_attempts" does not exist' } }

    await expect(reserveLoginAttempt('ada@x.com')).resolves.toBe(true)
  })

  it('allows the login when attempts cannot be counted', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    db.countResult = { count: null, error: { message: 'connection lost' } }

    await expect(reserveLoginAttempt('ada@x.com')).resolves.toBe(true)
  })
})

describe('clearLoginAttempts with a database', () => {
  it('removes the attempts for that email only', async () => {
    await clearLoginAttempts('Ada@x.com')

    expect(db.deletes).toEqual([['eq', 'email_hash', ADA_HASH]])
  })
})
