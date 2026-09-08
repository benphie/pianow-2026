'use client'

import { usePathname } from 'next/navigation'
import AuthGuard from './auth-guard'
import Header from './header'
import Footer from './footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    // Auth pages don't need header/footer or auth guard
    return <>{children}</>
  }

  // Only protect personal account, checkout, and creator upload routes
  const protectedPrefixes = [
    '/account',
    '/checkout',
    '/lessons/tracker',
    '/teachers/upload',
    '/teachers/apply',
  ]
  const isProtected = protectedPrefixes.some((prefix) => pathname?.startsWith(prefix))

  if (isProtected) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </AuthGuard>
    )
  }

  // Public pages (Home, Lessons, Shop, Teachers, etc.) are freely accessible
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
