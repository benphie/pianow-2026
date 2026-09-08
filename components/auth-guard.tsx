'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Music, Loader2, Lock, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = pathname ? `/auth/login?redirect=${encodeURIComponent(pathname)}` : '/auth/login'
      router.push(redirectUrl)
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Music className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <span className="text-gray-600 dark:text-gray-300 font-medium">Checking authentication...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show fallback or redirect prompt if not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    const loginUrl = pathname ? `/auth/login?redirect=${encodeURIComponent(pathname)}` : '/auth/login'
    const signupUrl = pathname ? `/auth/signup?redirect=${encodeURIComponent(pathname)}` : '/auth/signup'

    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950 px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-gray-700 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-purple-50 dark:ring-purple-900/20">
            <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In to Continue</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Sign in to your PIANOW account to unlock courses, practice rooms, the music shop, and community features.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button asChild className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 shadow-md">
              <Link href={loginUrl}>
                Sign In to PIANOW
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold py-2.5">
              <Link href={signupUrl}>
                Create Free Account
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link href="/" className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-purple-600 transition-colors">
              <Home className="h-3.5 w-3.5 mr-1.5" />
              Return to Public Home Page
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated, show protected content
  return <>{children}</>
}