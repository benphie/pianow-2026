import jwt from 'jsonwebtoken'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateToken, hashPassword, verifyPassword, verifyToken } from '@/lib/auth-utils'

afterEach(() => {
  vi.unstubAllEnvs()
})

const payload = { userId: 'user-1', email: 'user@test.dev' }

describe('verifyPassword', () => {
  it('accepts the right password and rejects the wrong one', async () => {
    const hash = await hashPassword('correct-horse-battery')

    expect(await verifyPassword('correct-horse-battery', hash)).toBe(true)
    expect(await verifyPassword('wrong-password', hash)).toBe(false)
  })

  it('rejects stored values that are not bcrypt hashes', async () => {
    expect(await verifyPassword('anything', 'plain-text-password')).toBe(false)
    expect(await verifyPassword('anything', '')).toBe(false)
  })

  it('rejects a malformed hash instead of accepting any password', async () => {
    expect(await verifyPassword('anything', '$2b$10$not-a-complete-bcrypt-hash')).toBe(false)
  })
})

describe('login tokens', () => {
  it('accepts a token it signed', () => {
    expect(verifyToken(generateToken(payload))).toMatchObject(payload)
  })

  it('rejects a token signed with a different secret', () => {
    const forged = jwt.sign(payload, 'a-different-secret-that-is-also-32-characters')
    expect(verifyToken(forged)).toBeNull()
  })

  it('rejects an expired token', () => {
    const expired = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: -10 })
    expect(verifyToken(expired)).toBeNull()
  })

  it('rejects garbage', () => {
    expect(verifyToken('not-a-token')).toBeNull()
  })

  it.each([
    ['missing', ''],
    ['too short', 'only-20-characters-x'],
  ])('refuses to sign or check tokens when JWT_SECRET is %s', (_label, secret) => {
    const token = generateToken(payload)
    vi.stubEnv('JWT_SECRET', secret)

    expect(() => generateToken(payload)).toThrow(/JWT_SECRET/)
    expect(() => verifyToken(token)).toThrow(/JWT_SECRET/)
  })
})
