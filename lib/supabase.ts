// Supabase client configuration
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function getValidHttpUrl(url: string | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (trimmed === '' || trimmed === '10000' || trimmed.includes('your-project-url')) {
    return null
  }
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
  } catch {
    return null
  }
  return null
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const validUrl = getValidHttpUrl(rawUrl)
const hasRealKey = Boolean(
  rawAnonKey &&
  rawAnonKey !== '10000' &&
  rawAnonKey !== 'mock-anon-key' &&
  rawAnonKey.length > 20
)

export const isSupabaseConfigured = Boolean(validUrl && hasRealKey)

if (!isSupabaseConfigured) {
  console.info('ℹ️ Supabase not configured with live credentials — using in-memory mock storage')
}

const DEFAULT_MOCK_URL = 'https://mock-pianow.supabase.co'
const DEFAULT_MOCK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock_key'

const supabaseUrl = validUrl || DEFAULT_MOCK_URL
const supabaseAnonKey = hasRealKey ? (rawAnonKey as string) : DEFAULT_MOCK_KEY

// Client-side Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})

// Server-side Supabase client (for API routes)
export function createServerClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const validServiceKey =
    serviceRoleKey && serviceRoleKey !== '10' && serviceRoleKey.length > 20
      ? serviceRoleKey
      : supabaseAnonKey

  return createClient(supabaseUrl, validServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

