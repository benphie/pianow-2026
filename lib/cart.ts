// Unified Cart Management Utility for Pianow
export interface CartProduct {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
  brand?: string
  category?: string
}

const CART_STORAGE_KEY = "pianow_cart"

export const INITIAL_DEFAULT_CART: CartProduct[] = [
  {
    id: "yamaha-p125",
    name: "Yamaha P-125 Digital Piano",
    price: 899,
    quantity: 1,
    image: "/yamaha-piano.png",
    category: "piano"
  },
  {
    id: "ath-m50x",
    name: "Audio-Technica ATH-M50x Headphones",
    price: 169,
    quantity: 1,
    image: "/placeholder.svg",
    category: "audio"
  }
]

export function getStoredCart(): CartProduct[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_CART))
      return INITIAL_DEFAULT_CART
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
    return []
  } catch (e) {
    return []
  }
}

export function saveCart(items: CartProduct[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent("pianow_cart_updated", { detail: items }))
  } catch (e) {
    console.error("Failed to save cart to localStorage", e)
  }
}

export function addToCart(product: {
  id: string | number
  name: string
  price: number
  quantity?: number
  image?: string
  brand?: string
  category?: string
}): CartProduct[] {
  const current = getStoredCart()
  const qtyToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1
  const existingIndex = current.findIndex(item => String(item.id) === String(product.id))

  let updated: CartProduct[]
  if (existingIndex > -1) {
    updated = [...current]
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + qtyToAdd
    }
  } else {
    updated = [
      ...current,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qtyToAdd,
        image: product.image || "/placeholder.svg",
        brand: product.brand,
        category: product.category
      }
    ]
  }

  saveCart(updated)
  return updated
}

export function updateCartQuantity(id: string | number, newQuantity: number): CartProduct[] {
  const current = getStoredCart()
  let updated: CartProduct[]

  if (newQuantity <= 0) {
    updated = current.filter(item => String(item.id) !== String(id))
  } else {
    updated = current.map(item =>
      String(item.id) === String(id) ? { ...item, quantity: newQuantity } : item
    )
  }

  saveCart(updated)
  return updated
}

export function removeFromCart(id: string | number): CartProduct[] {
  const current = getStoredCart()
  const updated = current.filter(item => String(item.id) !== String(id))
  saveCart(updated)
  return updated
}

export function clearCart(): CartProduct[] {
  saveCart([])
  return []
}

export function getCartTotalQuantity(items?: CartProduct[]): number {
  const list = items || getStoredCart()
  return list.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
}
