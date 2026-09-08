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

  // Users can access the Home page as guests, but must sign in to access the rest of the app
  const isHomePage = pathname === '/'

  if (!isHomePage) {
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

  // Home page is publicly accessible
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
