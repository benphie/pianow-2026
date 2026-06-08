import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getSignupStats,
  getSignupsByMethod,
  getSignupsByCountry,
  getSignupsByReferralSource,
  getSignupsByDevice,
} from '@/lib/db'

/**
 * Get signup analytics data
 * Protected endpoint - requires admin role
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - please login' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - admin access required' },
        { status: 403 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const metric = searchParams.get('metric') || 'all'

    let response: any = {
      period: `Last ${days} days`,
      timestamp: new Date().toISOString(),
    }

    // Fetch requested metrics
    if (metric === 'all' || metric === 'overview') {
      response.overview = await getSignupStats(days)
      response.byMethod = await getSignupsByMethod(days)
      response.byCountry = await getSignupsByCountry(days)
      response.byReferralSource = await getSignupsByReferralSource(days)
      response.byDevice = await getSignupsByDevice(days)
    } else if (metric === 'byMethod') {
      response.byMethod = await getSignupsByMethod(days)
    } else if (metric === 'byCountry') {
      response.byCountry = await getSignupsByCountry(days)
    } else if (metric === 'byReferralSource') {
      response.byReferralSource = await getSignupsByReferralSource(days)
    } else if (metric === 'byDevice') {
      response.byDevice = await getSignupsByDevice(days)
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
