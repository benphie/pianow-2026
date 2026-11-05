import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Disabled until the server verifies the provider's identity token (for example
// Google Identity Services or Supabase Auth). Never issue a session based only on
// an email address, phone number or handle sent by the browser.
export async function POST() {
  return NextResponse.json(
    { error: 'Google and KingsChat sign-in are temporarily unavailable. Please use your email and password.' },
    { status: 503 }
  )
}
