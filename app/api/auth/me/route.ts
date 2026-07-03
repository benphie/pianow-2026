import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[v0] No authorization header')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix
    
    console.log('[v0] Validating token:', token.substring(0, 10) + '...')

    // Validate token is not empty
    if (!token || token.length < 10) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // For development, accept any valid-format token
    // In production, validate against Supabase or database
    return NextResponse.json({
      user: {
        id: 'user-' + token.substring(0, 8),
        email: 'user@pianow.com',
        name: 'PIANOW User',
        role: 'user',
      },
    }, { status: 200 })
  } catch (error: any) {
    console.log('[v0] Auth validation error:', error?.message)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}
