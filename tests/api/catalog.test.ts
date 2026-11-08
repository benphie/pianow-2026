import { describe, expect, it } from 'vitest'
import { DELETE as deleteLesson, PUT as updateLesson } from '@/app/api/lessons/[id]/route'
import { POST as createLesson } from '@/app/api/lessons/route'
import { POST as createProduct } from '@/app/api/products/route'
import { POST as createTeacher } from '@/app/api/teachers/route'
import { apiRequest, makeTeacher, makeUser, routeContext } from '../helpers'

const product = { name: 'Test Piano', description: 'A piano', price: 100, category: 'piano' }
const lesson = { title: 'Scales', description: 'Major scales' }

function postProduct(token?: string, body: unknown = product) {
  return createProduct(apiRequest('/api/products', { method: 'POST', token, body }))
}

function postLesson(token?: string, body: unknown = lesson) {
  return createLesson(apiRequest('/api/lessons', { method: 'POST', token, body }))
}

function putLesson(id: string, token: string | undefined, body: unknown) {
  return updateLesson(apiRequest(`/api/lessons/${id}`, { method: 'PUT', token, body }), routeContext(id))
}

function removeLesson(id: string, token?: string) {
  return deleteLesson(apiRequest(`/api/lessons/${id}`, { method: 'DELETE', token }), routeContext(id))
}

async function makeOwnLesson(token: string): Promise<string> {
  const body = await (await postLesson(token)).json()
  return body.lesson.id
}

describe('creating products', () => {
  it('requires a login', async () => {
    expect((await postProduct()).status).toBe(401)
  })

  it.each(['user', 'teacher'] as const)('is refused for a %s', async role => {
    const { token } = await makeUser(role)
    expect((await postProduct(token)).status).toBe(403)
  })

  it('is allowed for an admin', async () => {
    const { token } = await makeUser('admin')
    expect((await postProduct(token)).status).toBe(201)
  })

  it.each([
    ['a negative price', { ...product, price: -5 }],
    ['an unknown category', { ...product, category: 'kazoo' }],
    ['a missing name', { ...product, name: '' }],
  ])('rejects %s', async (_label, body) => {
    const { token } = await makeUser('admin')
    expect((await postProduct(token, body)).status).toBe(400)
  })

  it('rejects malformed JSON', async () => {
    const { token } = await makeUser('admin')
    const res = await createProduct(apiRequest('/api/products', { method: 'POST', token, rawBody: '{oops' }))

    expect(res.status).toBe(400)
  })
})

describe('creating lessons', () => {
  it('requires a login', async () => {
    expect((await postLesson()).status).toBe(401)
  })

  it('is refused for a student', async () => {
    const { token } = await makeUser()
    expect((await postLesson(token)).status).toBe(403)
  })

  it('assigns a teacher their own profile', async () => {
    const { token, profile } = await makeTeacher()
    const res = await postLesson(token)

    expect(res.status).toBe(201)
    expect((await res.json()).lesson.teacherId).toBe(profile.id)
  })

  it('stops a teacher adding a lesson under someone else', async () => {
    const { token } = await makeTeacher()
    const other = await makeTeacher()

    expect((await postLesson(token, { ...lesson, teacherId: other.profile.id })).status).toBe(403)
  })

  it('stops a teacher role with no profile', async () => {
    const { token } = await makeUser('teacher')
    expect((await postLesson(token)).status).toBe(403)
  })

  it('makes an admin choose a teacher', async () => {
    const { token } = await makeUser('admin')
    const { profile } = await makeTeacher()

    expect((await postLesson(token)).status).toBe(400)
    expect((await postLesson(token, { ...lesson, teacherId: profile.id })).status).toBe(201)
  })
})

describe('editing lessons', () => {
  it('requires a login', async () => {
    const { token } = await makeTeacher()
    const id = await makeOwnLesson(token)

    expect((await putLesson(id, undefined, { title: 'x' })).status).toBe(401)
  })

  it('lets a teacher edit their own lesson but not move it', async () => {
    const { token, profile } = await makeTeacher()
    const other = await makeTeacher()
    const id = await makeOwnLesson(token)

    const res = await putLesson(id, token, { title: 'Scales 2', teacherId: other.profile.id })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.lesson.title).toBe('Scales 2')
    expect(body.lesson.teacherId).toBe(profile.id)
  })

  it("refuses another teacher's lesson", async () => {
    const owner = await makeTeacher()
    const other = await makeTeacher()
    const id = await makeOwnLesson(owner.token)

    expect((await putLesson(id, other.token, { title: 'x' })).status).toBe(403)
  })

  it('rejects an empty title', async () => {
    const { token } = await makeTeacher()
    const id = await makeOwnLesson(token)

    expect((await putLesson(id, token, { title: '' })).status).toBe(400)
  })

  it('returns 404 for a lesson that does not exist', async () => {
    const { token } = await makeTeacher()
    expect((await putLesson('does-not-exist', token, { title: 'x' })).status).toBe(404)
  })
})

describe('deleting lessons', () => {
  it('requires a login', async () => {
    const { token } = await makeTeacher()
    const id = await makeOwnLesson(token)

    expect((await removeLesson(id)).status).toBe(401)
  })

  it("refuses another teacher's lesson", async () => {
    const owner = await makeTeacher()
    const other = await makeTeacher()
    const id = await makeOwnLesson(owner.token)

    expect((await removeLesson(id, other.token)).status).toBe(403)
  })

  it('lets a teacher delete their own lesson', async () => {
    const { token } = await makeTeacher()
    const id = await makeOwnLesson(token)

    expect((await removeLesson(id, token)).status).toBe(200)
  })

  it('lets an admin delete any lesson', async () => {
    const owner = await makeTeacher()
    const admin = await makeUser('admin')
    const id = await makeOwnLesson(owner.token)

    expect((await removeLesson(id, admin.token)).status).toBe(200)
  })
})

describe('creating teacher profiles', () => {
  it('is refused for a student', async () => {
    const { user, token } = await makeUser()
    const res = await createTeacher(
      apiRequest('/api/teachers', { method: 'POST', token, body: { userId: user.id, name: 'Me', bio: 'Bio' } })
    )

    expect(res.status).toBe(403)
  })

  it('is allowed for an admin', async () => {
    const student = await makeUser()
    const admin = await makeUser('admin')
    const res = await createTeacher(
      apiRequest('/api/teachers', {
        method: 'POST',
        token: admin.token,
        body: { userId: student.user.id, name: 'New Teacher', bio: 'Bio' },
      })
    )

    expect(res.status).toBe(201)
  })
})
