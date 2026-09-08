'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from './api-client'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('pianow_user')
        if (storedUser) {
          return JSON.parse(storedUser)
        }
      } catch (e) {
        console.error('Failed to parse cached user:', e)
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('pianow_user')
        const storedToken = localStorage.getItem('pianow_token')
        
        if (storedUser && storedToken) {
          try {
            const parsed = JSON.parse(storedUser)
            setUser(parsed)
          } catch (e) {}

          // Verify token in background
          try {
            const { user: currentUser } = await apiClient.getCurrentUser()
            if (currentUser) {
              setUser(currentUser)
              localStorage.setItem('pianow_user', JSON.stringify(currentUser))
            }
          } catch (error: any) {
            // Only clear storage if explicitly 401 Unauthorized
            if (error?.status === 401 || error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
              localStorage.removeItem('pianow_user')
              localStorage.removeItem('pianow_token')
              setUser(null)
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem('pianow_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          setUser(null)
        }
      } catch (e) {}
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('pianow_auth_change', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('pianow_auth_change', handleStorageChange)
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      
      const { user: loggedInUser } = await apiClient.login(email, password)
      
      setUser(loggedInUser)
      setIsLoading(false)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('pianow_auth_change'))
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      setIsLoading(false)
      const errorMessage = error?.message || 'Failed to login. Please check your credentials and try again.'
      return { success: false, error: errorMessage }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      
      const { user: newUser } = await apiClient.signup(email, password, name)
      
      setUser(newUser)
      setIsLoading(false)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('pianow_auth_change'))
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Signup error:', error)
      setIsLoading(false)
      const errorMessage = error?.message || 'Failed to create account. Please try again.'
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('pianow_auth_change'))
    }
    router.push('/')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
