import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST as login } from '@/app/api/auth/login/route'
import { POST as signup } from '@/app/api/auth/signup/route'
import { apiRequest, uniqueEmail } from '../helpers'

// These tests log in dozens of times and don't depend on how passwords are hashed.
// Real hashing is deliberately slow; the auth and change-password tests cover it.
vi.mock('bcryptjs', () => ({
  default: {
    hash: async (password: string) => `$2a$fast-${password}`,
    compare: async (password: string, hash: string) => hash === `$2a$fast-${password}`,
  },
}))

const password = 'correct-horse-battery'
const wrongPassword = 'not-the-password'
const MINUTE = 60 * 1000

afterEach(() => {
  vi.useRealTimers()
})

async function makeAccount() {
  const email = uniqueEmail()
  await signup(apiRequest('/api/auth/signup', { method: 'POST', body: { name: 'Jane', email, password } }))
  return email
}

const attempt = (email: string, pass: string) =>
  login(apiRequest('/api/auth/login', { method: 'POST', body: { email, password: pass } }))

async function failTimes(email: string, times: number) {
  const statuses: number[] = []
  for (let i = 0; i < times; i++) {
    statuses.push((await attempt(email, wrongPassword)).status)
  }
  return statuses
}

const moveClockForward = (ms: number) => vi.useFakeTimers({ toFake: ['Date'], now: Date.now() + ms })

describe('limiting login attempts', () => {
  it('blocks an email after 5 failed attempts', async () => {
    const email = await makeAccount()

    expect(await failTimes(email, 6)).toEqual([401, 401, 401, 401, 401, 429])
  })

  it('refuses the correct password while an email is blocked', async () => {
    const email = await makeAccount()
    await failTimes(email, 5)

    const res = await attempt(email, password)

    expect(res.status).toBe(429)
    expect((await res.json()).token).toBeUndefined()
  })

  it('answers the same whether or not the account exists', async () => {
    const realEmail = await makeAccount()
    const unknownEmail = uniqueEmail('nobody')
    await failTimes(realEmail, 5)
    await failTimes(unknownEmail, 5)

    const forReal = await attempt(realEmail, wrongPassword)
    const forUnknown = await attempt(unknownEmail, wrongPassword)

    expect(forUnknown.status).toBe(forReal.status)
    expect(await forUnknown.json()).toEqual(await forReal.json())
  })

  it('starts counting again after a successful login', async () => {
    const email = await makeAccount()
    await failTimes(email, 4)

    expect((await attempt(email, password)).status).toBe(200)

    expect(await failTimes(email, 5)).toEqual([401, 401, 401, 401, 401])
  })

  it('does not block other emails', async () => {
    const blocked = await makeAccount()
    const other = await makeAccount()
    await failTimes(blocked, 5)

    expect((await attempt(other, password)).status).toBe(200)
  })

  it('counts capitals and extra spaces as the same email', async () => {
    const email = await makeAccount()
    await failTimes(email, 3)
    await failTimes(`  ${email.toUpperCase()} `, 2)

    expect((await attempt(email, password)).status).toBe(429)
  })

  it('stays blocked until the 15 minutes are up', async () => {
    const email = await makeAccount()
    await failTimes(email, 5)

    moveClockForward(14 * MINUTE)

    expect((await attempt(email, password)).status).toBe(429)
  })

  it('allows another try once 15 minutes have passed', async () => {
    const email = await makeAccount()
    await failTimes(email, 5)

    moveClockForward(15 * MINUTE + 1000)

    expect((await attempt(email, password)).status).toBe(200)
  })

  it('does not extend the block when someone keeps trying', async () => {
    const email = await makeAccount()
    await failTimes(email, 5)

    moveClockForward(14 * MINUTE)
    expect(await failTimes(email, 5)).toEqual([429, 429, 429, 429, 429])
    vi.useRealTimers()

    moveClockForward(15 * MINUTE + 1000)
    expect((await attempt(email, password)).status).toBe(200)
  })

  it('lets only 5 simultaneous guesses through', async () => {
    const email = await makeAccount()

    const responses = await Promise.all(Array.from({ length: 12 }, () => attempt(email, wrongPassword)))

    const statuses = responses.map(res => res.status).sort()
    expect(statuses).toEqual([401, 401, 401, 401, 401, 429, 429, 429, 429, 429, 429, 429])
  })
})
