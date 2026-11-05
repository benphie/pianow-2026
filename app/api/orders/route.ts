import { NextRequest, NextResponse } from 'next/server'
import { getCart, updateCart, getOrders, createOrder } from '@/lib/supabase-db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth-utils'
import { getProductById } from '@/lib/supabase-db'
import { orderInput, parseBody } from '@/lib/validation'

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

    const orders = await getOrders(payload.userId)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
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

    const parsed = await parseBody(request, orderInput)
    if (parsed.response) return parsed.response
    const { shippingAddress } = parsed.data

    // Get user's cart
    const cart = await getCart(payload.userId)

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Get products to calculate total
    let total = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = await getProductById(item.productId)
      // Skip anything the cart would no longer accept, such as a zero or negative quantity
      if (product && Number.isInteger(item.quantity) && item.quantity >= 1) {
        const itemTotal = product.price * item.quantity
        total += itemTotal
        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        })
      }
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create order
    const newOrder = await createOrder({
      userId: payload.userId,
      items: orderItems,
      total,
      shippingAddress,
    })

    // Clear cart
    await updateCart(payload.userId, [])

    return NextResponse.json({ order: newOrder }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
