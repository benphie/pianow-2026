"use client"

import { useState, useEffect, useRef } from 'react'
import { generateVideoThumbnail } from '@/lib/video-utils'
import { Play, Loader2 } from 'lucide-react'

interface VideoThumbnailProps {
  videoUrl: string
  alt: string
  className?: string
  timeOffset?: number
  showPlayButton?: boolean
  fallbackSrc?: string
}

export default function VideoThumbnail({
  videoUrl,
  alt,
  className = "w-full h-48 object-cover",
  timeOffset = 5,
  showPlayButton = true,
  fallbackSrc = "/placeholder.svg"
}: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let isMounted = true

    const generateThumbnail = async () => {
      try {
        setIsLoading(true)
        setError(false)
        
        const thumbnailDataUrl = await generateVideoThumbnail({
          videoUrl,
          timeOffset,
          width: 300,
          height: 200
        })
        
        if (isMounted) {
          setThumbnail(thumbnailDataUrl)
          setIsLoading(false)
        }
      } catch (err) {
        console.warn('Failed to generate video thumbnail:', err)
        if (isMounted) {
          setError(true)
          setIsLoading(false)
        }
      }
    }

    generateThumbnail()

    return () => {
      isMounted = false
    }
  }, [videoUrl, timeOffset])

  if (isLoading) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center`}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !thumbnail) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center relative`}>
        <img 
          src={fallbackSrc} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
        {showPlayButton && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="h-6 w-6 text-black" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${className} relative group`}>
      <img 
        src={thumbnail} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
      {showPlayButton && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 rounded-full p-3">
            <Play className="h-6 w-6 text-black" />
          </div>
        </div>
      )}
    </div>
  )
}

