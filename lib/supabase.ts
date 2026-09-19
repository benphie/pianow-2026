// Supabase client configuration
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function resolveSupabaseConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  let resolvedUrl: string | null = null

  // 1. Try rawUrl if it is a valid HTTP/HTTPS URL
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl)
      if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && !rawUrl.includes('placeholder')) {
        resolvedUrl = parsed.origin
      }
    } catch {}
  }

  // 2. Try rawApiUrl if it was configured with a Supabase project URL
  if (!resolvedUrl && rawApiUrl && rawApiUrl.includes('supabase.co')) {
    try {
      const parsed = new URL(rawApiUrl)
      resolvedUrl = parsed.origin
    } catch {
      const match = rawApiUrl.match(/https?:\/\/[a-z0-9_-]+\.supabase\.co/i)
      if (match) resolvedUrl = match[0]
    }
  }

  // 3. Auto-derive project ref from JWT tokens if URL was not directly provided
  if (!resolvedUrl) {
    const tokens = [rawServiceKey, rawAnonKey]
    for (const token of tokens) {
      if (token && token.includes('.')) {
        try {
          const parts = token.split('.')
          if (parts[1]) {
            const jsonStr = typeof atob !== 'undefined'
              ? atob(parts[1])
              : Buffer.from(parts[1], 'base64').toString('utf8')
            const payload = JSON.parse(jsonStr)
            if (payload && payload.ref && typeof payload.ref === 'string') {
              resolvedUrl = `https://${payload.ref}.supabase.co`
              break
            }
          }
        } catch {}
      }
    }
  }

  // Resolve anon key
  let resolvedAnonKey: string | null = null
  if (rawAnonKey && rawAnonKey.length > 20 && !rawAnonKey.includes('placeholder')) {
    resolvedAnonKey = rawAnonKey
  } else if (rawUrl && rawUrl.startsWith('sb_publishable_')) {
    resolvedAnonKey = rawUrl
  }

  // Resolve service key
  let resolvedServiceKey: string | null = null
  if (rawServiceKey && rawServiceKey.length > 20 && !rawServiceKey.includes('placeholder')) {
    resolvedServiceKey = rawServiceKey
  }

  return {
    url: resolvedUrl,
    anonKey: resolvedAnonKey,
    serviceKey: resolvedServiceKey,
  }
}

const config = resolveSupabaseConfig()

export const isSupabaseConfigured = Boolean(config.url && (config.anonKey || config.serviceKey))

if (!isSupabaseConfigured) {
  console.info('ℹ️ Supabase not configured — using reliable high-speed in-memory storage')
}

// Fallback placeholders for client instantiation so imports never crash
const clientUrl = config.url || 'https://placeholder-project.supabase.co'
const clientKey = config.anonKey || config.serviceKey || 'placeholder-anon-key-00000000000000'

// Client-side Supabase client
export const supabase: SupabaseClient = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Server-side Supabase client (for API routes)
export function createServerClient(): SupabaseClient {
  const serviceKeyToUse = config.serviceKey || clientKey

  return createClient(clientUrl, serviceKeyToUse, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Pre-initialized admin client for server-side database handlers
export const supabaseAdmin: SupabaseClient = createServerClient()



