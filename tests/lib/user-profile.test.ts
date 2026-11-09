import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUserProfile, updateUserProfile } from '@/lib/supabase-db'

// Stands in for a configured Supabase project, so database failures can be simulated
const db = vi.hoisted(() => ({
  result: { data: null as unknown, error: null as unknown },
  written: null as unknown,
}))

vi.mock('@/lib/supabase', () => {
  const query: Record<string, unknown> = {}
  query.update = (values: unknown) => {
    db.written = values
    return query
  }
  query.eq = () => query
  query.select = () => query
  query.maybeSingle = () => Promise.resolve(db.result)
  query.then = (resolve: (value: unknown) => void) => resolve(db.result)
  return { isSupabaseConfigured: true, supabaseAdmin: { from: () => query } }
})

const row = {
  id: 'user-1',
  email: 'ada@test.dev',
  name: 'Ada',
  password_hash: 'secret-hash',
  avatar: 'https://example.test/ada.png',
  role: 'user',
  phone: '+234 800 000 0000',
  bio: 'Learning jazz piano.',
  location: 'Lagos',
  date_of_birth: '1995-12-10',
  skill_level: 'Advanced',
  instruments: ['Piano'],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const profile = {
  name: 'Ada',
  email: 'ada@test.dev',
  phone: '+234 800 000 0000',
  bio: 'Learning jazz piano.',
  location: 'Lagos',
  dateOfBirth: '1995-12-10',
  skillLevel: 'Advanced',
  instruments: ['Piano'],
  avatar: 'https://example.test/ada.png',
}

const update = {
  name: 'Ada',
  phone: '',
  bio: '',
  location: '',
  dateOfBirth: '',
  skillLevel: '',
  instruments: [],
}

beforeEach(() => {
  db.written = null
})

describe('getUserProfile with a database', () => {
  // Showing a blank form here would let someone save blanks over their real details
  it('fails loudly when the database cannot be read', async () => {
    db.result = { data: null, error: { message: 'connection lost' } }

    await expect(getUserProfile('user-1')).rejects.toThrow(/connection lost/)
  })

  it('returns the account details without the password hash', async () => {
    db.result = { data: row, error: null }

    await expect(getUserProfile('user-1')).resolves.toEqual(profile)
  })

  it('reads details that were never filled in as blanks', async () => {
    db.result = {
      data: { ...row, avatar: null, phone: null, bio: null, location: null, date_of_birth: null, skill_level: null, instruments: null },
      error: null,
    }

    await expect(getUserProfile('user-1')).resolves.toEqual({
      name: 'Ada',
      email: 'ada@test.dev',
      phone: '',
      bio: '',
      location: '',
      dateOfBirth: '',
      skillLevel: '',
      instruments: [],
      avatar: '',
    })
  })
})

describe('updateUserProfile with a database', () => {
  it('fails loudly when the database reports an error', async () => {
    db.result = { data: null, error: { message: 'connection lost' } }

    await expect(updateUserProfile('user-1', update)).rejects.toThrow(/connection lost/)
  })

  it('fails when no account was updated', async () => {
    db.result = { data: [], error: null }

    await expect(updateUserProfile('user-1', update)).rejects.toThrow(/user not found/)
  })

  // Postgres rejects '' for a DATE column
  it('stores blank details as nulls', async () => {
    db.result = { data: [row], error: null }

    await updateUserProfile('user-1', update)

    expect(db.written).toEqual({
      name: 'Ada',
      phone: null,
      bio: null,
      location: null,
      date_of_birth: null,
      skill_level: null,
      instruments: [],
    })
  })

  it('returns what the database saved', async () => {
    db.result = { data: [row], error: null }

    await expect(updateUserProfile('user-1', update)).resolves.toEqual(profile)
  })
})
