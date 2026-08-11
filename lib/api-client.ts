// API client helper for making authenticated requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export class ApiClient {

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }


    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    return data
  }

  async signup(email: string, password: string, name: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })

    return data
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me')
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' })
  }


  // Lessons
  async getLessons() {
    return this.request<{ lessons: any[] }>('/lessons')
  }

  async getLesson(id: string) {
    return this.request<{ lesson: any }>(`/lessons/${id}`)
  }

  // Products
  async getProducts(category?: string) {
    const url = category ? `/products?category=${category}` : '/products'
    return this.request<{ products: any[] }>(url)
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(`/products/${id}`)
  }

  // Cart
  async getCart() {
    return this.request<{ cart: any }>('/cart')
  }

  async addToCart(productId: string, quantity: number) {
    return this.request<{ cart: any }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
  }

  async updateCart(items: Array<{ productId: string; quantity: number }>) {
    return this.request<{ cart: any }>('/cart', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    })
  }

  // Orders
  async getOrders() {
    return this.request<{ orders: any[] }>('/orders')
  }

  async createOrder(shippingAddress?: any) {
    return this.request<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
    })
  }

  // Teachers
  async getTeachers() {
    return this.request<{ teachers: any[] }>('/teachers')
  }
}

export const apiClient = new ApiClient()
