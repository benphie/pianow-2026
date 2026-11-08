import { describe, expect, it } from 'vitest'
import { GET as getPractice, POST as postPractice } from '@/app/api/practice/route'
import { GET as getApplications, POST as apply } from '@/app/api/teachers/apply/route'
import { apiRequest, makeUser, uniqueEmail } from '../helpers'

function application(email: string) {
  return { firstName: 'Jane', lastName: 'Doe', email, phone: '+256700000000' }
}

function submit(body: unknown, token?: string) {
  return apply(apiRequest('/api/teachers/apply', { method: 'POST', token, body }))
}

function read(query = '', token?: string) {
  return getApplications(apiRequest(`/api/teachers/apply${query}`, { token }))
}

describe('submitting a teacher application', () => {
  it('works without an account', async () => {
    expect((await submit(application(uniqueEmail()))).status).toBe(201)
  })

  it('links a signed-in applicant to their account, whatever the request says', async () => {
    const { user, token } = await makeUser()
    const other = await makeUser()

    const res = await submit({ ...application(user.email), userId: other.user.id }, token)

    expect((await res.json()).application.userId).toBe(user.id)
  })

  it("does not reveal someone else's pending application", async () => {
    const email = uniqueEmail()
    await submit(application(email))

    const res = await submit(application(email))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.application).toBeUndefined()
  })

  it('shows applicants their own pending application', async () => {
    const { user, token } = await makeUser()
    await submit(application(user.email), token)

    const body = await (await submit(application(user.email.toUpperCase()), token)).json()

    expect(body.application.email).toBe(user.email)
  })

  it.each([
    ['an invalid email', { ...application('x'), email: 'not-an-email' }],
    ['a missing phone number', { ...application('x@test.dev'), phone: '' }],
  ])('rejects %s', async (_label, body) => {
    expect((await submit(body)).status).toBe(400)
  })
})

describe('reading teacher applications', () => {
  it('requires a login', async () => {
    expect((await read()).status).toBe(401)
    expect((await read(`?email=${uniqueEmail()}`)).status).toBe(401)
  })

  it('does not let a student list everyone', async () => {
    const { token } = await makeUser()
    expect((await read('', token)).status).toBe(403)
  })

  it('lets an admin list everyone', async () => {
    const { token } = await makeUser('admin')
    const email = uniqueEmail()
    await submit(application(email))

    const body = await (await read('', token)).json()

    expect(body.applications.map((a: { email: string }) => a.email)).toContain(email)
  })

  it("does not let a student read someone else's", async () => {
    const student = await makeUser()
    const other = await makeUser()

    expect((await read(`?email=${encodeURIComponent(other.user.email)}`, student.token)).status).toBe(403)
    expect((await read(`?userId=${other.user.id}`, student.token)).status).toBe(403)
  })

  it('lets a student read their own', async () => {
    const { user, token } = await makeUser()
    await submit(application(user.email), token)

    const res = await read(`?email=${encodeURIComponent(user.email)}`, token)

    expect(res.status).toBe(200)
    expect((await res.json()).application.email).toBe(user.email)
  })
})

describe('practice log', () => {
  const session = { date: '2026-11-05', duration: 30, lesson: 'Scales' }

  function log(body: unknown, token?: string) {
    return postPractice(apiRequest('/api/practice', { method: 'POST', token, body }))
  }

  it('requires a login to read or write', async () => {
    expect((await getPractice(apiRequest('/api/practice'))).status).toBe(401)
    expect((await log(session)).status).toBe(401)
  })

  it('ignores a user ID in the request', async () => {
    const { user, token } = await makeUser()
    const other = await makeUser()

    const res = await log({ ...session, userId: other.user.id }, token)

    expect(res.status).toBe(201)
    expect((await res.json()).session.userId).toBe(user.id)
  })

  it.each([
    ['a zero duration', { ...session, duration: 0 }],
    ['a badly formatted date', { ...session, date: 'tomorrow' }],
    ['a rating out of range', { ...session, rating: 9 }],
  ])('rejects %s', async (_label, body) => {
    const { token } = await makeUser()
    expect((await log(body, token)).status).toBe(400)
  })
})
