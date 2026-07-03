import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Yamaha CP88 Stage Piano",
    brand: "Yamaha",
    price: 2499,
    originalPrice: 2799,
    image: "/PHOTOS FOR THE APP/YAMAHA CP88/Yamaha CP88.avif",
    rating: 4.9,
    reviews: 156,
    badge: "Professional",
    category: "Stage Piano",
    mainCategory: "Pianos"
  },
  {
    id: 2,
    name: "Yamaha P-125 Digital Piano",
    brand: "Yamaha",
    price: 899,
    originalPrice: 1099,
    image: "/PHOTOS FOR THE APP/P 125/P125a.jpg",
    rating: 4.8,
    reviews: 245,
    badge: "Best Seller",
    category: "Digital Piano",
    mainCategory: "Pianos"
  },
  {
    id: 3,
    name: "Yamaha NP-32 Portable Piano",
    brand: "Yamaha",
    price: 299,
    image: "/PHOTOS FOR THE APP/YAMAHA NP 32/Yamaha NP-32.avif",
    rating: 4.6,
    reviews: 189,
    badge: "Portable",
    category: "Portable Piano",
    mainCategory: "Pianos"
  },
  {
    id: 4,
    name: "Yamaha PSR-E473 Keyboard",
    brand: "Yamaha",
    price: 399,
    image: "/PHOTOS FOR THE APP/YAMAHA PSR E 473/Yamaha PSR-E473.jpg",
    rating: 4.5,
    reviews: 312,
    badge: "Beginner",
    category: "Keyboard",
    mainCategory: "Keyboards"
  },
  {
    id: 5,
    name: "Yamaha YDP-145 Digital Piano",
    brand: "Yamaha",
    price: 1299,
    image: "/PHOTOS FOR THE APP/YAMAHA YDP 145/Yamaha YDP-145 Arius.avif",
    rating: 4.7,
    reviews: 178,
    category: "Digital Piano",
    mainCategory: "Pianos"
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')

    const supabase = await createClient()

    try {
      // Try to fetch from Supabase
      let query = supabase.from('products').select('*')

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      if (brand) {
        query = query.eq('brand', brand)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      query = query.limit(100).order('created_at', { ascending: false })

      const { data: products, error } = await query

      if (!error && products) {
        return NextResponse.json({ 
          products,
          source: 'database'
        })
      }
    } catch (dbError) {
      console.log('[v0] Database error, using mock data:', dbError)
    }

    // Fallback to mock data
    let filteredProducts = [...MOCK_PRODUCTS]

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        p.category === category || p.mainCategory === category
      )
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === brand)
    }

    if (minPrice) {
      const min = parseFloat(minPrice)
      filteredProducts = filteredProducts.filter(p => p.price >= min)
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice)
      filteredProducts = filteredProducts.filter(p => p.price <= max)
    }

    if (search) {
      const q = search.toLowerCase()
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ 
      products: filteredProducts,
      source: 'mock'
    })
  } catch (error: any) {
    console.error('[v0] Get products error:', error?.message)
    return NextResponse.json({ 
      products: MOCK_PRODUCTS,
      source: 'mock',
      message: 'Using mock data'
    })
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
