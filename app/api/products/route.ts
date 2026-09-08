import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/supabase-db'

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
    const body = await request.json()
    const { name, description, price, category, images, brand, stockQuantity } = body

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    const product = await createProduct({
      name,
      description,
      price: Number(price),
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
