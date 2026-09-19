"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 text-gray-900">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
