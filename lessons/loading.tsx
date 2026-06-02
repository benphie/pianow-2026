import { Loader2 } from 'lucide-react'

export default function LessonsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    </div>
  )
}
