/**
 * Video utility functions for thumbnail generation and video handling
 */

export interface VideoThumbnailOptions {
  videoUrl: string
  timeOffset?: number // Time in seconds to capture thumbnail (default: 5)
  width?: number
  height?: number
}

/**
 * Generate a thumbnail from a video file
 * This creates a canvas element to capture a frame from the video
 */
export function generateVideoThumbnail(options: VideoThumbnailOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('Browser environment required'))
      return
    }
    if (!options.videoUrl) {
      reject(new Error('Video URL is required'))
      return
    }

    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      const timeOffset = options.timeOffset || 5
      video.currentTime = Math.min(timeOffset, video.duration - 1)
    }
    
    video.onseeked = () => {
      canvas.width = options.width || 300
      canvas.height = options.height || 200
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      try {
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        resolve(thumbnailDataUrl)
      } catch (error) {
        reject(error)
      }
    }
    
    video.onerror = () => {
      reject(new Error('Failed to load video'))
    }
    
    video.src = options.videoUrl
  })
}

/**
 * Create a video element with auto-generated thumbnail
 */
export function createVideoWithThumbnail(videoUrl: string, options?: Partial<VideoThumbnailOptions>) {
  const videoElement = document.createElement('video')
  videoElement.src = videoUrl
  videoElement.preload = 'metadata'
  videoElement.crossOrigin = 'anonymous'
  
  return {
    video: videoElement,
    generateThumbnail: () => generateVideoThumbnail({
      videoUrl,
      timeOffset: 5,
      width: 300,
      height: 200,
      ...options
    })
  }
}

/**
 * Get video duration in a readable format
 */
export function formatVideoDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Extract video metadata
 */
export function getVideoMetadata(videoUrl: string): Promise<{
  duration: number
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      })
    }
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'))
    }
    
    video.src = videoUrl
  })
}

