import { NextRequest, NextResponse } from 'next/server'
import { getCart, updateCart } from '@/lib/supabase-db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth-utils'
import { CartItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request.headers)

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const cart = await getCart(payload.userId)

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
    const token = getTokenFromRequest(request.headers)

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'ProductId and quantity are required' },
        { status: 400 }
      )
    }

    let cart = await getCart(payload.userId)

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId)
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({ productId, quantity })
    }

    cart = await updateCart(payload.userId, cart.items)

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
    const token = getTokenFromRequest(request.headers)

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items } = body

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      )
    }

    const cart = await updateCart(payload.userId, items)

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
