import jwt from 'jsonwebtoken'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST as login } from '@/app/api/auth/login/route'
import { GET as me } from '@/app/api/auth/me/route'
import { POST as signup } from '@/app/api/auth/signup/route'
import { POST as social } from '@/app/api/auth/social/route'
import { apiRequest, uniqueEmail } from '../helpers'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

const password = 'correct-horse-battery'

function signUp(email: string) {
  return signup(apiRequest('/api/auth/signup', { method: 'POST', body: { name: 'Jane', email, password } }))
}

function logIn(email: string, pass: string) {
  return login(apiRequest('/api/auth/login', { method: 'POST', body: { email, password: pass } }))
}

describe('sign-up', () => {
  it('creates an account and returns a working token', async () => {
    const res = await signUp(uniqueEmail())
    const body = await res.json()

    expect(res.status).toBe(201)
    const session = await me(apiRequest('/api/auth/me', { token: body.token }))
    expect(session.status).toBe(200)
  })

  it('never returns the password hash', async () => {
    const body = await (await signUp(uniqueEmail())).json()

    expect(body.user.password).toBeUndefined()
    expect(body.user.password_hash).toBeUndefined()
  })

  it('refuses a duplicate email', async () => {
    const email = uniqueEmail()
    await signUp(email)

    expect((await signUp(email)).status).toBe(409)
  })

  it('requires a name, email and password', async () => {
    const res = await signup(apiRequest('/api/auth/signup', { method: 'POST', body: { email: uniqueEmail() } }))

    expect(res.status).toBe(400)
  })
})

describe('login', () => {
  it('signs in with the right password', async () => {
    const email = uniqueEmail()
    await signUp(email)

    const res = await logIn(email, password)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.token).toEqual(expect.any(String))
    expect(body.user.password).toBeUndefined()
  })

  it('rejects the wrong password', async () => {
    const email = uniqueEmail()
    await signUp(email)

    expect((await logIn(email, 'wrong-password')).status).toBe(401)
  })

  it('rejects an unknown email', async () => {
    expect((await logIn(uniqueEmail(), password)).status).toBe(401)
  })

  it.each(['test@example.com', 'google.user@gmail.com', 'kingschat.user@kingschat.com'])(
    'has no built-in demo account for %s',
    async email => {
      expect((await logIn(email, 'any-password')).status).toBe(401)
    }
  )

  it('hides internal error details from the browser', async () => {
    const email = uniqueEmail()
    await signUp(email)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubEnv('JWT_SECRET', '')

    const res = await logIn(email, password)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).not.toMatch(/JWT_SECRET/)
  })
})

describe('session check', () => {
  it('requires a token', async () => {
    expect((await me(apiRequest('/api/auth/me'))).status).toBe(401)
  })

  it('rejects a token signed with a different secret', async () => {
    const forged = jwt.sign({ userId: '1', email: 'x@test.dev' }, 'a-different-secret-that-is-also-32-characters')

    expect((await me(apiRequest('/api/auth/me', { token: forged }))).status).toBe(401)
  })
})

describe('social sign-in', () => {
  it('stays disabled and never issues a session', async () => {
    const res = await social()
    const body = await res.json()

    expect(res.status).toBe(503)
    expect(body.token).toBeUndefined()
  })
})
