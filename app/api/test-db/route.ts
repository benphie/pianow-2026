import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test connection by querying profiles
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (error) {
      return NextResponse.json({ 
        status: 'error',
        error: error.message,
        code: error.code 
      })
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connected',
      profileCount: count,
      sampleProfiles: data?.length || 0,
      tables: ['profiles', 'teachers', 'lessons', 'products', 'orders']
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 })
  }
}
