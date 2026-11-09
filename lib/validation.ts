// Request body schemas for API routes

import { NextResponse } from 'next/server'
import { z } from 'zod'

type ParseResult<T> =
  | { data: T; response?: undefined }
  | { data?: undefined; response: NextResponse }

// Parses a JSON body against `schema`. Unknown fields are dropped.
// On failure, return `response` from the route handler (a 400 naming the first problem).
export async function parseBody<T extends z.ZodType>(request: Request, schema: T): Promise<ParseResult<z.output<T>>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return { response: NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 }) }
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    const issue = result.error.issues[0]
    const field = issue.path.join('.')
    return {
      response: NextResponse.json({ error: field ? `${field}: ${issue.message}` : issue.message }, { status: 400 }),
    }
  }

  return { data: result.data }
}

const text = (max = 200) => z.string().trim().max(max)
const requiredText = (max = 200) => z.string().trim().min(1).max(max)
const textList = z.array(text(100)).max(20)

export const MAX_CART_QUANTITY = 99

// Passwords aren't trimmed: spaces are significant. bcrypt only reads the first 72 bytes.
export const changePasswordInput = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long').max(72),
})

export const profileInput = z.object({
  name: requiredText(100),
  phone: text(40),
  bio: text(2000),
  location: text(),
  dateOfBirth: z.union([z.literal(''), z.iso.date()]),
  skillLevel: z.enum(['', 'Beginner', 'Intermediate', 'Advanced', 'Professional']),
  instruments: textList,
})

export const productInput = z.object({
  name: requiredText(),
  description: requiredText(5000),
  price: z.coerce.number().positive().max(1_000_000),
  category: z.enum(['piano', 'guitar', 'drums', 'audio', 'accessories', 'instruments']),
  images: z.array(text(2000)).max(20).optional(),
  brand: text(100).optional(),
  stockQuantity: z.coerce.number().int().min(0).max(100_000).optional(),
})

export const lessonInput = z.object({
  title: requiredText(),
  description: requiredText(5000),
  videoUrl: text(2000).optional(),
  youtubeUrl: text(2000).optional(),
  duration: text(50).optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']).optional(),
  teacherId: requiredText(100).optional(),
  thumbnail: text(2000).optional(),
  price: z.coerce.number().min(0).max(100_000).optional(),
  isFree: z.boolean().optional(),
})

export const lessonUpdate = lessonInput.partial()

export const teacherInput = z.object({
  userId: requiredText(100),
  name: requiredText(),
  bio: requiredText(5000),
  specialties: textList.optional(),
  education: textList.optional(),
  certifications: textList.optional(),
})

export const cartItemInput = z.object({
  productId: requiredText(100),
  quantity: z.number().int().min(1).max(MAX_CART_QUANTITY),
})

export const cartInput = z.object({
  items: z.array(cartItemInput).max(50),
})

export const orderInput = z.object({
  shippingAddress: z
    .object({
      street: requiredText(),
      city: requiredText(100),
      state: text(100),
      zipCode: text(20),
      country: requiredText(100),
    })
    .optional(),
})

export const teacherApplicationInput = z.object({
  firstName: requiredText(100),
  lastName: requiredText(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: requiredText(40),
  location: text().optional(),
  instruments: textList.optional(),
  experience: text(5000).optional(),
  education: text(5000).optional(),
  certifications: text(5000).optional(),
  teachingExperience: text(5000).optional(),
  timezone: text(100).optional(),
  availableHours: text(500).optional(),
  preferredAgeGroups: textList.optional(),
  bio: text(5000).optional(),
  teachingPhilosophy: text(5000).optional(),
  sampleVideoUrl: text(2000).optional(),
  references: text(5000).optional(),
})

export const practiceSessionInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD'),
  duration: z.coerce.number().int().min(1).max(1440),
  instrument: text(50).optional(),
  lesson: requiredText(),
  section: text().nullish(),
  bpm: z.number().int().min(1).max(400).nullish(),
  targetBpm: z.number().int().min(1).max(400).nullish(),
  techniques: textList.optional(),
  notes: text(2000).nullish(),
  rating: z.number().int().min(1).max(5).nullish(),
})
