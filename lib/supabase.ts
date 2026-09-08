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

const FALLBACK_PROJECT_URL = 'https://wcvsndpgdnpwambqtpni.supabase.co'
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdnNuZHBnZG5wd2FtYnF0cG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzYxNjAsImV4cCI6MjA4MjYxMjE2MH0.92JxHQwb5pxBX87l6OydI6CRep3gcQltrIv4G5ZKtIU'
const FALLBACK_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdnNuZHBnZG5wd2FtYnF0cG5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzAzNjE2MCwiZXhwIjoyMDgyNjEyMTYwfQ.7W2zkXjGcGlaoGASSH-Q87BIvV6SI5NMYkLpjeHUHwM'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const parsedUrl = getValidHttpUrl(rawUrl)
const hasValidEnvKey = Boolean(
  rawAnonKey &&
  rawAnonKey !== '10000' &&
  rawAnonKey !== 'mock-anon-key' &&
  rawAnonKey.length > 20
)

const resolvedUrl = parsedUrl || FALLBACK_PROJECT_URL
const resolvedAnonKey = hasValidEnvKey ? (rawAnonKey as string) : FALLBACK_ANON_KEY

export const isSupabaseConfigured = Boolean(resolvedUrl && resolvedAnonKey)

if (!isSupabaseConfigured) {
  console.info('ℹ️ Supabase not configured — using in-memory mock storage')
}

const supabaseUrl = resolvedUrl
const supabaseAnonKey = resolvedAnonKey

// Client-side Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Server-side Supabase client (for API routes)
export function createServerClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const validServiceKey =
    serviceRoleKey && serviceRoleKey !== '10' && serviceRoleKey.length > 20
      ? serviceRoleKey
      : FALLBACK_SERVICE_KEY

  return createClient(supabaseUrl, validServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Pre-initialized admin client for server-side database handlers
export const supabaseAdmin: SupabaseClient = createServerClient()

