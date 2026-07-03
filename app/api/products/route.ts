import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase-db'
import { createServerClient } from '@/lib/supabase'

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

    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: Number(price),
        category,
        images: images || [],
        in_stock: stockQuantity ? stockQuantity > 0 : true,
        stock_quantity: stockQuantity || 0,
        brand,
      })
      .select('*')
      .single()

    if (error) throw error

    const product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.original_price ? Number(data.original_price) : undefined,
      category: data.category,
      images: data.images || [],
      inStock: data.in_stock,
      stockQuantity: data.stock_quantity,
      brand: data.brand,
      rating: data.rating ? Number(data.rating) : undefined,
      reviews: data.reviews,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
