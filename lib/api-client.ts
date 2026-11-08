// API client helper for making authenticated requests

function getApiBaseUrl(): string {
  // In the browser, always use relative '/api' so requests route directly to the Next.js API endpoints
  if (typeof window !== 'undefined') {
    return '/api'
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  // Ignore Supabase URLs or invalid URLs that might have been accidentally passed to NEXT_PUBLIC_API_URL
  if (envUrl && !envUrl.includes('supabase.co') && !envUrl.includes('placeholder')) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      const clean = envUrl.replace(/\/+$/, '')
      return clean.endsWith('/api') ? clean : `${clean}/api`
    }
    if (envUrl.startsWith('/')) {
      const clean = envUrl.replace(/\/+$/, '')
      return clean.endsWith('/api') ? clean : `${clean}/api`
    }
  }
  return '/api'
}

export class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('pianow_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const baseUrl = getApiBaseUrl()
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const fullUrl = `${baseUrl}${cleanEndpoint}`

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    })

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      if (isJson) {
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || errorMessage
        } catch (_) {
          // ignore json parse error
        }
      } else {
        try {
          const text = await response.text()
          if (text && text.length < 200 && !text.includes('<!DOCTYPE')) {
            errorMessage = text
          }
        } catch (_) {}
      }
      throw new Error(errorMessage)
    }

    if (!isJson) {
      throw new Error(`Expected JSON response from ${endpoint}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('pianow_token', data.token)
      localStorage.setItem('pianow_user', JSON.stringify(data.user))
    }
    return data
  }

  async signup(email: string, password: string, name: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('pianow_token', data.token)
      localStorage.setItem('pianow_user', JSON.stringify(data.user))
    }
    return data
  }

  async socialLogin(params: {
    provider: 'google' | 'kingschat'
    email?: string
    phone?: string
    name?: string
    avatar?: string
    password?: string
    kingschatHandle?: string
    mode?: 'login' | 'signup'
  }) {
    const data = await this.request<{ user: any; token: string; isNew?: boolean }>('/auth/social', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('pianow_token', data.token)
      localStorage.setItem('pianow_user', JSON.stringify(data.user))
    }
    return data
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me')
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ success: boolean }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pianow_token')
      localStorage.removeItem('pianow_user')
    }
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

  // Teacher applications (the server only returns the signed-in user's own)
  async getMyTeacherApplication(email: string) {
    return this.request<{ application: any }>(`/teachers/apply?email=${encodeURIComponent(email)}`)
  }

  async submitTeacherApplication(application: Record<string, unknown>) {
    return this.request<{ application?: any; message?: string }>('/teachers/apply', {
      method: 'POST',
      body: JSON.stringify(application),
    })
  }

  // Practice log
  async getPracticeSessions() {
    return this.request<{ sessions: any[] }>('/practice')
  }

  async logPracticeSession(session: Record<string, unknown>) {
    return this.request<{ session: any }>('/practice', {
      method: 'POST',
      body: JSON.stringify(session),
    })
  }
}

export const apiClient = new ApiClient()
