import Link from 'next/link'
import { Music, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-6 shadow-sm">
        <Music className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-3">
        404 - Note Not Found
      </h1>
      <p className="max-w-md text-base text-gray-600 dark:text-gray-400 mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Explore Music Shop
          </Button>
        </Link>
      </div>
    </div>
  )
}
