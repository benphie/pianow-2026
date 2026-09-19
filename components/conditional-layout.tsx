'use client'

import { usePathname } from 'next/navigation'
import AuthGuard from './auth-guard'
import Header from './header'
import Footer from './footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

// Protected routes that require an authenticated user account
const PROTECTED_PREFIXES = [
  '/account',
  '/checkout',
  '/lessons/tracker',
  '/teachers/upload',
]

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  // Check if current route requires authentication
  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname?.startsWith(prefix))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {isProtectedRoute ? (
          <AuthGuard>
            {children}
          </AuthGuard>
        ) : (
          children
        )}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

