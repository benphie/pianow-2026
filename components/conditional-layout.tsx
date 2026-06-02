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

  // Protected pages need auth guard and layout
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
