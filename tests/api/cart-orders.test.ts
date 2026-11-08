import { describe, expect, it } from 'vitest'
import { GET as getCart, POST as addToCart, PUT as replaceCart } from '@/app/api/cart/route'
import { POST as placeOrder } from '@/app/api/orders/route'
import { MAX_CART_QUANTITY } from '@/lib/validation'
import { updateCart } from '@/lib/supabase-db'
import { apiRequest, makeProduct, makeUser } from '../helpers'

function add(token: string | undefined, body: unknown) {
  return addToCart(apiRequest('/api/cart', { method: 'POST', token, body }))
}

function replace(token: string, items: unknown) {
  return replaceCart(apiRequest('/api/cart', { method: 'PUT', token, body: { items } }))
}

function order(token: string) {
  return placeOrder(apiRequest('/api/orders', { method: 'POST', token, body: {} }))
}

describe('adding to the cart', () => {
  it('requires a login', async () => {
    const product = await makeProduct()

    expect((await getCart(apiRequest('/api/cart'))).status).toBe(401)
    expect((await add(undefined, { productId: product.id, quantity: 1 })).status).toBe(401)
  })

  it.each([
    ['a negative quantity', -3],
    ['a zero quantity', 0],
    ['a fractional quantity', 2.5],
    ['a quantity over the limit', MAX_CART_QUANTITY + 1],
    ['a quantity that is not a number', '2'],
  ])('rejects %s', async (_label, quantity) => {
    const { token } = await makeUser()
    const product = await makeProduct()

    expect((await add(token, { productId: product.id, quantity })).status).toBe(400)
  })

  it('rejects a product that does not exist', async () => {
    const { token } = await makeUser()
    expect((await add(token, { productId: 'does-not-exist', quantity: 1 })).status).toBe(404)
  })

  it('rejects a product that is out of stock', async () => {
    const { token } = await makeUser()
    const product = await makeProduct({ inStock: false })

    expect((await add(token, { productId: product.id, quantity: 1 })).status).toBe(400)
  })

  it('adds up repeat additions of the same product', async () => {
    const { token } = await makeUser()
    const product = await makeProduct()
    await add(token, { productId: product.id, quantity: 2 })

    const body = await (await add(token, { productId: product.id, quantity: 3 })).json()

    expect(body.cart.items).toEqual([{ productId: product.id, quantity: 5 }])
  })

  it('will not go past the limit across additions', async () => {
    const { token } = await makeUser()
    const product = await makeProduct()
    await add(token, { productId: product.id, quantity: MAX_CART_QUANTITY })

    expect((await add(token, { productId: product.id, quantity: 1 })).status).toBe(400)
  })
})

describe('replacing the cart', () => {
  it('rejects the same product listed twice', async () => {
    const { token } = await makeUser()
    const product = await makeProduct()
    const items = [
      { productId: product.id, quantity: 1 },
      { productId: product.id, quantity: 2 },
    ]

    expect((await replace(token, items)).status).toBe(400)
  })

  it('rejects a negative quantity', async () => {
    const { token } = await makeUser()
    const product = await makeProduct()

    expect((await replace(token, [{ productId: product.id, quantity: -1 }])).status).toBe(400)
  })

  it('saves a valid cart', async () => {
    const { token } = await makeUser()
    const product = await makeProduct()
    const items = [{ productId: product.id, quantity: 4 }]

    const body = await (await replace(token, items)).json()

    expect(body.cart.items).toEqual(items)
  })
})

describe('placing an order', () => {
  it('refuses an empty cart', async () => {
    const { token } = await makeUser()
    expect((await order(token)).status).toBe(400)
  })

  it('prices the order from the server and empties the cart', async () => {
    const { token } = await makeUser()
    const product = await makeProduct({ price: 899 })
    await add(token, { productId: product.id, quantity: 2 })

    const res = await order(token)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.order.total).toBe(1798)

    const cart = await (await getCart(apiRequest('/api/cart', { token }))).json()
    expect(cart.cart.items).toEqual([])
  })

  it('never creates a negative total from a bad saved cart', async () => {
    const { user, token } = await makeUser()
    const product = await makeProduct({ price: 899 })
    await updateCart(user.id, [{ productId: product.id, quantity: -3 }])

    expect((await order(token)).status).toBe(400)
  })

  it('rejects an incomplete shipping address', async () => {
    const { token } = await makeUser()
    const product = await makeProduct()
    await add(token, { productId: product.id, quantity: 1 })

    const res = await placeOrder(
      apiRequest('/api/orders', { method: 'POST', token, body: { shippingAddress: { city: 'Kampala' } } })
    )

    expect(res.status).toBe(400)
  })
})
