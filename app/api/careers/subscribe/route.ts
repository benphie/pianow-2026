import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    console.log('[v0] Job notification subscription:', email)

    // Here you would:
    // 1. Save to database
    // 2. Add to email marketing service (Mailchimp, SendGrid, etc.)
    // 3. Send confirmation email

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to job notifications',
      email
    })
  } catch (error: any) {
    console.error('[v0] Error processing subscription:', error?.message)
    return NextResponse.json(
      { error: 'Error processing subscription' },
      { status: 500 }
    )
  }
}
