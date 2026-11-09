import { describe, expect, it } from 'vitest'
import { GET as getCurrentUser } from '@/app/api/auth/me/route'
import { GET as getProfile, PUT as putProfile } from '@/app/api/auth/profile/route'
import { getUserById } from '@/lib/supabase-db'
import { apiRequest, makeUser } from '../helpers'

const details = {
  name: 'Ada Lovelace',
  phone: '+234 800 000 0000',
  bio: 'Learning jazz piano.',
  location: 'Lagos',
  dateOfBirth: '1995-12-10',
  skillLevel: 'Intermediate',
  instruments: ['Piano', 'Vocals'],
}

const read = (token?: string) => getProfile(apiRequest('/api/auth/profile', { token }))

const save = (token: string | undefined, body: unknown) =>
  putProfile(apiRequest('/api/auth/profile', { method: 'PUT', token, body }))

async function profileOf(token: string) {
  return (await (await read(token)).json()).profile
}

describe('reading and saving a profile', () => {
  it('requires a login to read', async () => {
    expect((await read()).status).toBe(401)
  })

  it('requires a login to save', async () => {
    expect((await save(undefined, details)).status).toBe(401)
  })

  it('starts a new account with only its name and email filled in', async () => {
    const { user, token } = await makeUser()

    expect(await profileOf(token)).toEqual({
      name: 'Test user',
      email: user.email,
      phone: '',
      bio: '',
      location: '',
      dateOfBirth: '',
      skillLevel: '',
      instruments: [],
      avatar: user.avatar,
    })
  })

  it('keeps saved details for the next visit', async () => {
    const { token } = await makeUser()

    const res = await save(token, details)

    expect(res.status).toBe(200)
    expect((await res.json()).profile).toMatchObject(details)
    expect(await profileOf(token)).toMatchObject(details)
  })

  it('clears details that are saved blank', async () => {
    const { token } = await makeUser()
    await save(token, details)

    await save(token, { ...details, phone: '', dateOfBirth: '', skillLevel: '', instruments: [] })

    expect(await profileOf(token)).toMatchObject({ phone: '', dateOfBirth: '', skillLevel: '', instruments: [] })
  })

  it('uses a new name everywhere the account is shown', async () => {
    const { token } = await makeUser()

    await save(token, details)

    const me = await getCurrentUser(apiRequest('/api/auth/me', { token }))
    expect((await me.json()).user.name).toBe('Ada Lovelace')
  })

  it('only changes the signed-in account', async () => {
    const first = await makeUser()
    const second = await makeUser()

    await save(first.token, details)

    expect(await profileOf(second.token)).toMatchObject({ name: 'Test user', phone: '' })
  })

  it('does not let a request change the login email or role', async () => {
    const { user, token } = await makeUser()

    await save(token, { ...details, email: 'someone-else@test.dev', role: 'admin' })

    const stored = await getUserById(user.id)
    expect(stored?.email).toBe(user.email)
    expect(stored?.role).toBe('user')
  })

  it.each([
    ['a blank name', { name: '   ' }],
    ['a date that does not exist', { dateOfBirth: '2024-02-31' }],
    ['a skill level the form does not offer', { skillLevel: 'Wizard' }],
    ['a bio that is too long', { bio: 'x'.repeat(2001) }],
  ])('refuses %s and changes nothing', async (_label, change) => {
    const { token } = await makeUser()
    await save(token, details)

    const res = await save(token, { ...details, ...change })

    expect(res.status).toBe(400)
    expect(await profileOf(token)).toMatchObject(details)
  })

  it('never returns the password hash', async () => {
    const { token } = await makeUser()

    const saved = await (await save(token, details)).text()
    const loaded = await (await read(token)).text()

    expect(saved).not.toContain('not-a-real-hash')
    expect(loaded).not.toContain('not-a-real-hash')
  })
})
