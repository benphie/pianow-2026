import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/supabase-db'
import { requireUser } from '@/lib/api-auth'
import { parseBody, productInput } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const products = await getProducts(category || undefined)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request, ['admin'])
    if (auth.response) return auth.response

    const parsed = await parseBody(request, productInput)
    if (parsed.response) return parsed.response
    const { name, description, price, category, images, brand, stockQuantity } = parsed.data

    const product = await createProduct({
      name,
      description,
      price,
      category,
      images: images || [],
      brand,
      stockQuantity: stockQuantity || 0,
      inStock: stockQuantity ? stockQuantity > 0 : true,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
