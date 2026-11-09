import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getTeacherApplicationByEmail, getUserByEmail } from '@/lib/supabase-db'

type Row = Record<string, string>

const db = vi.hoisted(() => ({ rows: [] as Record<string, string>[] }))

// Stands in for a configured Supabase project. Filters behave as they do in Postgres:
// eq is exact, while ilike ignores case and treats _ and % as wildcards.
vi.mock('@/lib/supabase', () => {
  const likePattern = (pattern: string) =>
    new RegExp(
      `^${pattern
        .replace(/[.+?^${}()|[\]\\*]/g, '\\$&')
        .replace(/%/g, '.*')
        .replace(/_/g, '.')}$`,
      'i'
    )

  const from = () => {
    let matches: Row[] = [...db.rows]
    const query = {
      select: () => query,
      eq: (column: string, value: string) => {
        matches = matches.filter(row => row[column] === value)
        return query
      },
      ilike: (column: string, pattern: string) => {
        const regExp = likePattern(pattern)
        matches = matches.filter(row => regExp.test(row[column]))
        return query
      },
      order: (column: string) => {
        matches = [...matches].sort((a, b) => b[column].localeCompare(a[column]))
        return query
      },
      limit: (count: number) => {
        matches = matches.slice(0, count)
        return query
      },
      maybeSingle: () =>
        Promise.resolve(
          matches.length > 1
            ? { data: null, error: { message: 'multiple rows returned' } }
            : { data: matches[0] ?? null, error: null }
        ),
    }
    return query
  }

  return { isSupabaseConfigured: true, supabaseAdmin: { from } }
})

const account = (id: string, email: string): Row => ({
  id,
  email,
  name: id,
  password_hash: 'hash',
  role: 'user',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
})

const application = (id: string, email: string, createdAt: string): Row => ({ id, email, created_at: createdAt })

beforeEach(() => {
  db.rows = []
})

describe('finding an account by email', () => {
  it('tells apart two accounts whose emails differ only where one has an underscore', async () => {
    db.rows = [account('dotted', 'john.doe@x.com'), account('underscored', 'john_doe@x.com')]

    expect((await getUserByEmail('john_doe@x.com'))?.id).toBe('underscored')
  })

  it('does not treat an underscore as matching another account', async () => {
    db.rows = [account('dotted', 'john.doe@x.com')]

    expect(await getUserByEmail('john_doe@x.com')).toBeNull()
  })

  it('does not treat a percent sign as matching another account', async () => {
    db.rows = [account('someone', 'someone@x.com')]

    expect(await getUserByEmail('%@x.com')).toBeNull()
  })

  it('finds an account however the email is capitalised or spaced', async () => {
    db.rows = [account('john', 'john.doe@x.com')]

    expect((await getUserByEmail('  John.DOE@x.com '))?.id).toBe('john')
  })
})

describe('finding a teacher application by email', () => {
  it('returns the matching application, not a newer one matched by a wildcard', async () => {
    db.rows = [
      application('own', 'john_doe@x.com', '2026-01-01T00:00:00Z'),
      application('other', 'john.doe@x.com', '2026-06-01T00:00:00Z'),
    ]

    expect((await getTeacherApplicationByEmail('john_doe@x.com'))?.id).toBe('own')
  })

  it('finds an application however the email is capitalised or spaced', async () => {
    db.rows = [application('own', 'john.doe@x.com', '2026-01-01T00:00:00Z')]

    expect((await getTeacherApplicationByEmail('  John.DOE@x.com '))?.id).toBe('own')
  })
})
