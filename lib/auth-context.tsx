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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('pianow_user')
        const storedToken = localStorage.getItem('pianow_token')
        
        if (storedUser && storedToken) {
          // Verify token is still valid by fetching current user
          try {
            const { user: currentUser } = await apiClient.getCurrentUser()
            setUser(currentUser)
            localStorage.setItem('pianow_user', JSON.stringify(currentUser))
          } catch (error) {
            // Token invalid, clear storage
            localStorage.removeItem('pianow_user')
            localStorage.removeItem('pianow_token')
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('pianow_user')
        localStorage.removeItem('pianow_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      console.log('[v0] Login starting')
      
      const { user: loggedInUser } = await apiClient.login(email, password)
      console.log('[v0] Login successful, user:', loggedInUser)
      
      // Set user first
      setUser(loggedInUser)
      // Then set loading to false
      setIsLoading(false)
      console.log('[v0] Auth state updated, user should be set')
      
      return { success: true }
    } catch (error: any) {
      console.error('[v0] Login error:', error?.message)
      setIsLoading(false)
      setUser(null)
      const errorMessage = error?.message || 'Failed to login. Please check your credentials and try again.'
      return { success: false, error: errorMessage }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      
      const { user: newUser } = await apiClient.signup(email, password, name)
      
      // Set user first
      setUser(newUser)
      // Then set loading to false
      setIsLoading(false)
      
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
    router.push('/auth/login')
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
