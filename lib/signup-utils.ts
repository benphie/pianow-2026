// Utility functions for extracting signup metadata

export interface SignupMetadata {
  ipAddress?: string
  country?: string
  city?: string
  latitude?: number
  longitude?: number
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  browser?: string
  operatingSystem?: string
  userAgent: string
  referralSource?: string
  referralMedium?: 'direct' | 'organic' | 'paid' | 'social' | 'email' | 'referral' | 'other'
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referringUrl?: string
  campaignId?: string
}

/**
 * Parse user agent string to extract device type
 */
export function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' | 'unknown' {
  if (!userAgent) return 'unknown'
  
  const ua = userAgent.toLowerCase()
  
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(ua)) {
    return 'mobile'
  }
  
  if (/ipad|android|playbook/.test(ua)) {
    return 'tablet'
  }
  
  if (/windows|mac|linux/.test(ua)) {
    return 'desktop'
  }
  
  return 'unknown'
}

/**
 * Parse user agent string to extract browser name
 */
export function getBrowser(userAgent: string): string {
  if (!userAgent) return 'Unknown'
  
  const ua = userAgent
  
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'Internet Explorer'
  
  return 'Other'
}

/**
 * Parse user agent string to extract operating system
 */
export function getOperatingSystem(userAgent: string): string {
  if (!userAgent) return 'Unknown'
  
  const ua = userAgent
  
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('X11')) return 'Unix'
  
  return 'Other'
}

/**
 * Extract UTM parameters from URL search params
 */
export function extractUTMParams(searchParams: URLSearchParams | undefined) {
  if (!searchParams) return {}
  
  return {
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
    utmContent: searchParams.get('utm_content') || undefined,
    utmTerm: searchParams.get('utm_term') || undefined,
    campaignId: searchParams.get('campaign_id') || undefined,
  }
}

/**
 * Get referral medium based on referrer URL or UTM data
 */
export function getReferralMedium(
  referrerUrl?: string,
  utmMedium?: string
): 'direct' | 'organic' | 'paid' | 'social' | 'email' | 'referral' | 'other' {
  if (utmMedium) {
    if (utmMedium.includes('organic')) return 'organic'
    if (utmMedium.includes('paid') || utmMedium.includes('cpc')) return 'paid'
    if (utmMedium.includes('social')) return 'social'
    if (utmMedium.includes('email')) return 'email'
  }
  
  if (!referrerUrl) return 'direct'
  
  const url = referrerUrl.toLowerCase()
  
  // Social media referrers
  if (url.includes('facebook.com') || url.includes('instagram.com') || url.includes('twitter.com') || url.includes('linkedin.com') || url.includes('tiktok.com')) {
    return 'social'
  }
  
  // Search engines
  if (url.includes('google.') || url.includes('bing.') || url.includes('yahoo.') || url.includes('duckduckgo.')) {
    return 'organic'
  }
  
  // Email
  if (url.includes('mail.') || url.includes('email')) {
    return 'email'
  }
  
  // Other referrals
  return 'referral'
}

/**
 * Build complete signup metadata from request
 */
export async function buildSignupMetadata(req: Request): Promise<SignupMetadata> {
  const userAgent = req.headers.get('user-agent') || ''
  const referrer = req.headers.get('referer') || ''
  const url = new URL(req.url)
  const searchParams = url.searchParams
  
  const utmParams = extractUTMParams(searchParams)
  const referralMedium = getReferralMedium(referrer, utmParams.utmMedium)
  
  // Extract geolocation from Vercel headers if available
  const country = req.headers.get('x-vercel-ip-country') || undefined
  const city = req.headers.get('x-vercel-ip-city') || undefined
  
  // Get client IP
  const ipAddress = 
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    undefined
  
  return {
    userAgent,
    deviceType: getDeviceType(userAgent),
    browser: getBrowser(userAgent),
    operatingSystem: getOperatingSystem(userAgent),
    referralSource: referrer || undefined,
    referralMedium,
    ipAddress,
    country,
    city,
    ...utmParams,
  }
}
