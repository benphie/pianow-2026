import { NextRequest, NextResponse } from 'next/server'
import { getCart, getProductById, updateCart } from '@/lib/supabase-db'
import { requireUser } from '@/lib/api-auth'
import { cartInput, cartItemInput, MAX_CART_QUANTITY, parseBody } from '@/lib/validation'
import { CartItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Returns an error response if any item isn't a product that exists and is in stock
async function checkProducts(items: CartItem[]): Promise<NextResponse | null> {
  for (const item of items) {
    const product = await getProductById(item.productId)
    if (!product) {
      return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
    }
    if (!product.inStock) {
      return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 400 })
    }
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    const cart = await getCart(auth.user.id)

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    const parsed = await parseBody(request, cartItemInput)
    if (parsed.response) return parsed.response
    const { productId, quantity } = parsed.data

    const productError = await checkProducts([parsed.data])
    if (productError) return productError

    const current = await getCart(auth.user.id)
    const items: CartItem[] = (current?.items ?? []).map(item => ({ ...item }))

    // Check if item already exists in cart
    const existingItem = items.find(item => item.productId === productId)

    if (existingItem) {
      if (existingItem.quantity + quantity > MAX_CART_QUANTITY) {
        return NextResponse.json(
          { error: `You can add at most ${MAX_CART_QUANTITY} of one item` },
          { status: 400 }
        )
      }
      existingItem.quantity += quantity
    } else {
      items.push({ productId, quantity })
    }

    const cart = await updateCart(auth.user.id, items)

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireUser(request)
    if (auth.response) return auth.response

    const parsed = await parseBody(request, cartInput)
    if (parsed.response) return parsed.response
    const { items } = parsed.data

    if (new Set(items.map(item => item.productId)).size !== items.length) {
      return NextResponse.json(
        { error: 'Each product may appear only once in the cart' },
        { status: 400 }
      )
    }

    const productError = await checkProducts(items)
    if (productError) return productError

    const cart = await updateCart(auth.user.id, items)

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
