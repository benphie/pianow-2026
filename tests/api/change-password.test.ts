import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST as changePassword } from '@/app/api/auth/change-password/route'
import { POST as login } from '@/app/api/auth/login/route'
import { POST as signup } from '@/app/api/auth/signup/route'
import { apiRequest, uniqueEmail } from '../helpers'

afterEach(() => {
  vi.restoreAllMocks()
})

const oldPassword = 'correct-horse-battery'
const newPassword = 'a-brand-new-passphrase'

async function makeAccount() {
  const email = uniqueEmail()
  const res = await signup(
    apiRequest('/api/auth/signup', { method: 'POST', body: { name: 'Jane', email, password: oldPassword } })
  )
  const { token } = await res.json()
  return { email, token }
}

function change(token: string | undefined, body: unknown) {
  return changePassword(apiRequest('/api/auth/change-password', { method: 'POST', token, body }))
}

async function loginStatus(email: string, password: string) {
  const res = await login(apiRequest('/api/auth/login', { method: 'POST', body: { email, password } }))
  return res.status
}

describe('changing a password', () => {
  it('requires a login', async () => {
    expect((await change(undefined, { currentPassword: oldPassword, newPassword })).status).toBe(401)
  })

  it('replaces the old password with the new one', async () => {
    const { email, token } = await makeAccount()

    const res = await change(token, { currentPassword: oldPassword, newPassword })

    expect(res.status).toBe(200)
    expect(await loginStatus(email, newPassword)).toBe(200)
    expect(await loginStatus(email, oldPassword)).toBe(401)
  })

  it('refuses the wrong current password and changes nothing', async () => {
    const { email, token } = await makeAccount()

    const res = await change(token, { currentPassword: 'wrong-password', newPassword })

    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/current password/i)
    expect(await loginStatus(email, oldPassword)).toBe(200)
    expect(await loginStatus(email, newPassword)).toBe(401)
  })

  it('refuses a new password that is too short', async () => {
    const { email, token } = await makeAccount()

    expect((await change(token, { currentPassword: oldPassword, newPassword: 'short' })).status).toBe(400)
    expect(await loginStatus(email, oldPassword)).toBe(200)
  })

  it('refuses a new password identical to the current one', async () => {
    const { token } = await makeAccount()

    expect((await change(token, { currentPassword: oldPassword, newPassword: oldPassword })).status).toBe(400)
  })

  it('only changes the signed-in account', async () => {
    const first = await makeAccount()
    const second = await makeAccount()

    await change(first.token, { currentPassword: oldPassword, newPassword })

    expect(await loginStatus(second.email, oldPassword)).toBe(200)
  })

  it('never returns the password or its hash', async () => {
    const { token } = await makeAccount()

    const body = await (await change(token, { currentPassword: oldPassword, newPassword })).json()

    expect(body).toEqual({ success: true })
  })
})
