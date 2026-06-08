# User Signup Tracking System

## Overview

The PIANOW app now includes a comprehensive signup tracking system that captures detailed analytics about how users register, where they come from, and what devices they use. This helps track user acquisition, marketing effectiveness, and user behavior patterns.

## Database Table: `user_signups`

### Schema

```sql
CREATE TABLE public.user_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  signup_method TEXT NOT NULL CHECK (signup_method IN ('email', 'google', 'kings_chat')),
  email TEXT NOT NULL,
  ip_address INET,
  country TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  browser TEXT,
  operating_system TEXT,
  user_agent TEXT,
  referral_source TEXT,
  referral_medium TEXT CHECK (referral_medium IN ('direct', 'organic', 'paid', 'social', 'email', 'referral', 'other')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referring_url TEXT,
  campaign_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Fields

#### Authentication & Identity
- **id** - Unique identifier for the signup record
- **user_id** - Reference to the authenticated user
- **signup_method** - How user signed up: `'email'`, `'google'`, `'kings_chat'`
- **email** - User's email address

#### Location Data
- **ip_address** - Client IP address (INET format)
- **country** - Country derived from IP (via Vercel headers)
- **city** - City derived from IP (via Vercel headers)
- **latitude** - Geographic latitude (optional)
- **longitude** - Geographic longitude (optional)

#### Device & Browser Information
- **device_type** - Device category: `'desktop'`, `'mobile'`, `'tablet'`, `'unknown'`
- **browser** - Browser name extracted from User-Agent
- **operating_system** - OS extracted from User-Agent (Windows, macOS, iOS, Android, Linux, etc.)
- **user_agent** - Full User-Agent string

#### Traffic Source & Campaign
- **referral_source** - Referring URL (where user came from)
- **referral_medium** - Traffic source type: `'direct'`, `'organic'`, `'paid'`, `'social'`, `'email'`, `'referral'`, `'other'`
- **referring_url** - Full URL of the referrer
- **campaign_id** - Custom campaign identifier

#### UTM Parameters (Google Analytics)
- **utm_source** - Campaign source (e.g., 'google', 'facebook')
- **utm_medium** - Campaign medium (e.g., 'cpc', 'social', 'email')
- **utm_campaign** - Campaign name (e.g., 'summer_launch')
- **utm_content** - Campaign content variant (e.g., 'button_blue')
- **utm_term** - Search keyword (for paid search)

#### Timestamps
- **created_at** - When signup occurred
- **updated_at** - Last update timestamp (auto-maintained)

## Database Functions

### Log User Signup
```typescript
import { logUserSignup } from '@/lib/db'

await logUserSignup(
  userId: string,
  email: string,
  signupMethod: 'email' | 'google' | 'kings_chat',
  signupData?: {
    ipAddress?: string
    country?: string
    city?: string
    latitude?: number
    longitude?: number
    deviceType?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
    browser?: string
    operatingSystem?: string
    userAgent?: string
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
)
```

**Example:**
```typescript
await logUserSignup(user.id, user.email, 'email', {
  ipAddress: '192.168.1.1',
  country: 'US',
  city: 'New York',
  deviceType: 'mobile',
  browser: 'Chrome',
  operatingSystem: 'iOS',
  userAgent: req.headers.get('user-agent') || '',
  utmSource: 'facebook',
  utmMedium: 'paid',
  utmCampaign: 'summer_launch',
})
```

### Get User Signup Record
```typescript
import { getUserSignup } from '@/lib/db'

const signup = await getUserSignup(userId: string)
```

Returns the signup record for a specific user.

### Get Signup Statistics
```typescript
import { getSignupStats } from '@/lib/db'

const stats = await getSignupStats(days: number = 30)
```

Get all signups from the last N days.

### Get Signups by Method
```typescript
import { getSignupsByMethod } from '@/lib/db'

const data = await getSignupsByMethod(days: number = 30)
// Returns: [{ signup_method: 'email', count: 150 }, ...]
```

## Signup Methods

### Email
Traditional email/password signup.

**Initialization:**
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'secure_password',
    name: 'John Doe',
    signupMethod: 'email',
  }),
})
```

### Google OAuth
Sign up using Google account.

**Integration:**
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      signup_method: 'google',
    },
  },
})
```

### Kings Chat
Sign up using Kings Chat integration.

**Integration:**
```typescript
// When user logs in via Kings Chat and provides credentials
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: kingsUserEmail,
    password: kingsUserAuth.token, // or auto-generated
    name: kingsUserName,
    signupMethod: 'kings_chat',
  }),
})
```

## Signup Utilities

### buildSignupMetadata
Automatically extract all signup metadata from a request:

```typescript
import { buildSignupMetadata } from '@/lib/signup-utils'

const metadata = await buildSignupMetadata(request)
// Returns: {
//   userAgent: string
//   deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
//   browser: string
//   operatingSystem: string
//   referralSource?: string
//   referralMedium: 'direct' | 'organic' | 'paid' | 'social' | 'email' | 'referral' | 'other'
//   ipAddress?: string
//   country?: string
//   city?: string
//   utmSource?: string
//   utmMedium?: string
//   utmCampaign?: string
//   utmContent?: string
//   utmTerm?: string
//   campaignId?: string
// }
```

### Helper Functions
```typescript
import {
  getDeviceType,
  getBrowser,
  getOperatingSystem,
  extractUTMParams,
  getReferralMedium,
} from '@/lib/signup-utils'

// Parse User-Agent
const deviceType = getDeviceType(userAgentString)
const browser = getBrowser(userAgentString)
const os = getOperatingSystem(userAgentString)

// Parse URL parameters
const utm = extractUTMParams(url.searchParams)

// Determine traffic source
const medium = getReferralMedium(referrerUrl, utmMedium)
```

## Analytics Endpoints

### GET /api/analytics/signups

Get signup analytics. **Requires admin role.**

**Query Parameters:**
- `days` (default: 30) - Number of days to analyze
- `metric` (default: 'all') - Which metric to return:
  - `all` - All metrics
  - `overview` - All signup records
  - `byMethod` - Breakdown by signup method
  - `byCountry` - Breakdown by country
  - `byReferralSource` - Breakdown by traffic source
  - `byDevice` - Breakdown by device type

**Example Requests:**

```bash
# Get all analytics for last 30 days
GET /api/analytics/signups

# Get last 7 days
GET /api/analytics/signups?days=7

# Get signup method breakdown
GET /api/analytics/signups?metric=byMethod

# Get geographical distribution
GET /api/analytics/signups?metric=byCountry&days=90
```

**Response Examples:**

```json
// byMethod response
{
  "period": "Last 30 days",
  "timestamp": "2024-06-08T10:30:00Z",
  "byMethod": [
    { "signup_method": "email", "count": 150 },
    { "signup_method": "google", "count": 85 },
    { "signup_method": "kings_chat", "count": 23 }
  ]
}

// byCountry response
{
  "period": "Last 30 days",
  "timestamp": "2024-06-08T10:30:00Z",
  "byCountry": [
    { "country": "US", "count": 120 },
    { "country": "UK", "count": 45 },
    { "country": "CA", "count": 38 }
  ]
}

// byDevice response
{
  "period": "Last 30 days",
  "timestamp": "2024-06-08T10:30:00Z",
  "byDevice": [
    { "device_type": "mobile", "count": 180 },
    { "device_type": "desktop", "count": 92 },
    { "device_type": "tablet", "count": 15 }
  ]
}
```

## UTM Parameter Examples

### Campaign URLs

**Facebook Ad Campaign:**
```
https://pianow.app/signup?utm_source=facebook&utm_medium=paid&utm_campaign=summer_launch&utm_content=button_blue
```

**Google Search Campaign:**
```
https://pianow.app/signup?utm_source=google&utm_medium=cpc&utm_campaign=piano_lessons&utm_term=learn+piano
```

**Email Newsletter:**
```
https://pianow.app/signup?utm_source=newsletter&utm_medium=email&utm_campaign=week_30
```

**Referral Program:**
```
https://pianow.app/signup?utm_source=referral&utm_medium=referral&campaign_id=ref_123456
```

## Row Level Security (RLS)

The `user_signups` table has three RLS policies:

1. **users_view_own_signup** - Users can see their own signup record
2. **admins_view_all_signups** - Admins can view all signup data
3. **system_insert_signups** - System can insert signup records (for signup routes)

## Performance & Indexes

The following indexes optimize analytics queries:

- `idx_user_signups_user_id` - Fast user lookups
- `idx_user_signups_signup_method` - Fast filtering by signup method
- `idx_user_signups_created_at` - Fast date range queries
- `idx_user_signups_country` - Fast geographical analysis
- `idx_user_signups_referral_source` - Fast referral tracking
- `idx_user_signups_device_type` - Fast device breakdown
- `idx_user_signups_referral_medium` - Fast traffic source analysis
- `idx_user_signups_utm_source` - Fast campaign tracking

## Integration Examples

### In Signup Form Component

```typescript
// When user clicks signup button
const handleSignup = async (email, password, name) => {
  // Get current URL to capture UTM params and referrer
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name,
      signupMethod: 'email',
    }),
  })
}
```

### Google OAuth with Signup Tracking

```typescript
const handleGoogleSignup = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?method=google`,
    },
  })
}

// In callback route
export async function GET(request: NextRequest) {
  const code = searchParams.get('code')
  const method = searchParams.get('method') || 'google'
  
  const { data } = await supabase.auth.exchangeCodeForSession(code)
  
  if (data.user) {
    await logUserSignup(data.user.id, data.user.email, method, metadata)
  }
}
```

## Best Practices

1. **Always log signups** - Even if an error occurs in signup logging, don't fail the user signup
2. **Use UTM parameters** - Add utm_* parameters to all marketing campaign URLs
3. **Track referral sources** - The system automatically extracts referrer information
4. **Mobile-friendly** - Track mobile vs desktop signups separately
5. **Privacy compliant** - Only store IP address for geolocation, not for tracking
6. **Regular analysis** - Check signup metrics weekly to identify trends

## Common Queries

### Get signup conversion by traffic source
```typescript
const bySource = await getSignupsByReferralSource(30)
// Identify which channels bring the most signups
```

### Get mobile vs desktop breakdown
```typescript
const byDevice = await getSignupsByDevice(30)
// Track adoption rates by device type
```

### Get geographic distribution
```typescript
const byCountry = await getSignupsByCountry(90)
// Identify key markets
```

### Get signup method preference
```typescript
const byMethod = await getSignupsByMethod(30)
// See if users prefer email, Google, or Kings Chat
```

## Troubleshooting

**No geolocation data?**
- Geolocation requires Vercel deployment (uses Vercel headers)
- Local development won't have location data

**Missing UTM parameters?**
- Ensure marketing URLs include `?utm_source=...` parameters
- Check that the referrer URL is being captured

**Signup logging failing?**
- Check that the `user_signups` table was created successfully
- Verify RLS policies allow system inserts
- Check database connection and authentication

## Future Enhancements

- [ ] Conversion funnel analysis (signup → profile completion → first lesson)
- [ ] Cohort analysis (track cohorts of users who signed up together)
- [ ] Retention metrics (how many signups become active users)
- [ ] A/B testing integration (track which signup flow converts better)
- [ ] Custom event tracking (track events beyond signup)
