import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import ConditionalLayout from "@/components/conditional-layout"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PIANOW - Learn Music Online",
  description:
    "Learn piano, guitar, drums and more with expert instructors. Shop musical instruments and connect with fellow musicians.",
  generator: 'v0.app',
  icons: {
    icon: '/pianow logo1.png',
    apple: '/pianow logo1.png',
  },
  openGraph: {
    title: "PIANOW - Learn Music Online",
    description: "Learn piano, guitar, drums and more with expert instructors. Shop musical instruments and connect with fellow musicians.",
    images: ['/pianow logo1.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
