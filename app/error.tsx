"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-300 mb-6 shadow-sm">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-3">
        Something went wrong
      </h1>
      <p className="max-w-md text-base text-gray-600 dark:text-gray-400 mb-8">
        An unexpected error occurred while loading this page. You can try refreshing or returning home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} className="bg-purple-600 hover:bg-purple-700 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
