"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, Users, Video, Radio, Square, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/**
 * LIVE PAGE CODE EXPLANATION:
 * 
 * 1. DATA STRUCTURE (lines 7-39):
 *    - `liveStreams` array contains hardcoded stream objects
 *    - Each stream has: id, title, instructor, viewers, duration, level, isLive status, thumbnail
 *    - This simulates a database of available live streams
 * 
 * 2. RENDERING LOGIC (lines 48-80):
 *    - Uses `.map()` to iterate through liveStreams array
 *    - Creates a Card component for each stream
 *    - Conditionally shows "LIVE" badge if `isLive === true`
 *    - Shows different button text based on live status
 * 
 * 3. CONDITIONAL DISPLAY:
 *    - `{stream.isLive && <Badge>}` - Only shows LIVE badge when stream is active
 *    - Button is disabled when `!stream.isLive` (not live)
 *    - Shows "watching" count for live streams, "Starts at" for upcoming
 * 
 * 4. UPCOMING SESSIONS (lines 83-103):
 *    - Separate section showing scheduled future sessions
 *    - Simple list format with time and instructor info
 */

export default function LivePage() {
  const { toast } = useToast()
  const [isLive, setIsLive] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [viewers, setViewers] = useState(0)
  const [streamDuration, setStreamDuration] = useState(0) // in seconds
  const [isLoading, setIsLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Ensure video plays when stream is set
  useEffect(() => {
    if (isLive && videoRef.current && streamRef.current) {
      const video = videoRef.current
      const stream = streamRef.current

      // Make sure video element has the stream
      if (video.srcObject !== stream) {
        video.srcObject = stream
      }

      // Force play
      video.play().catch(err => {
        console.error("Video play error:", err)
        setVideoError("Failed to play video. Please check your camera permissions.")
      })

      // Handle video events
      const handleCanPlay = () => {
        video.play().catch(console.error)
      }

      const handleError = () => {
        setVideoError("Video stream error occurred")
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }
  }, [isLive])

  // Simulate viewer count when live
  useEffect(() => {
    if (isLive) {
      // Simulate random viewer count updates
      const viewerInterval = setInterval(() => {
        setViewers(prev => {
          const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
          return Math.max(0, prev + change)
        })
      }, 3000)

      // Update duration counter
      intervalRef.current = setInterval(() => {
        setStreamDuration(prev => prev + 1)
      }, 1000)

      return () => {
        clearInterval(viewerInterval)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isLive])

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleGoLive = async () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Stream Title Required",
        description: "Please enter a title for your live stream",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setVideoError(null)

    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera/microphone access")
      }

      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true
      })

      streamRef.current = stream

      // Set the video element source to the stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not found"))
            return
          }

          const video = videoRef.current
          
          const onLoadedMetadata = () => {
            video.play()
              .then(() => {
                resolve()
              })
              .catch(reject)
          }

          const onError = () => {
            reject(new Error("Failed to load video stream"))
          }

          video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true })
          video.addEventListener('error', onError, { once: true })

          // Fallback timeout
          setTimeout(() => {
            if (video.readyState >= 2) {
              video.play().then(resolve).catch(reject)
            } else {
              reject(new Error("Video stream timeout"))
            }
          }, 5000)
        })

        // Ensure video is visible
        if (videoRef.current) {
          videoRef.current.style.display = 'block'
        }
      }

      setIsLive(true)
      setIsLoading(false)
      setViewers(Math.floor(Math.random() * 50) + 10) // Random initial viewers
      setStreamDuration(0)

      toast({
        title: "You're Live! 🎥",
        description: "Your stream has started. Viewers can now join your session.",
      })
    } catch (error: any) {
      console.error("Error accessing media devices:", error)
      setIsLoading(false)
      setVideoError(error.message || "Failed to start stream")
      
      // Stop any partial stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      toast({
        title: "Camera/Microphone Access Denied",
        description: error.message || "Please allow camera and microphone access to go live.",
        variant: "destructive"
      })
    }
  }

  const handleStopLive = () => {
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsLive(false)
    setViewers(0)
    setStreamDuration(0)

    toast({
      title: "Stream Ended",
      description: "Your live stream has been stopped.",
    })
  }

  const liveStreams = [
    {
      id: 1,
      title: "Piano Fundamentals with Sarah",
      instructor: "Sarah Johnson",
      viewers: 234,
      duration: "45 min",
      level: "Beginner",
      isLive: true,
      thumbnail: "/piano-lesson.png",
    },
    {
      id: 2,
      title: "Jazz Piano Workshop",
      instructor: "Marcus Thompson",
      viewers: 156,
      duration: "60 min",
      level: "Advanced",
      isLive: true,
      thumbnail: "/jazz-piano.png",
    },
    {
      id: 3,
      title: "Guitar Basics Session",
      instructor: "Alex Rodriguez",
      viewers: 89,
      duration: "30 min",
      level: "Beginner",
      isLive: false,
      startsAt: "2:00 PM EST",
      thumbnail: "/guitar-lesson.png",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Live Music Sessions</h1>
        <p className="text-xl text-muted-foreground">Join live music lessons and workshops with expert instructors</p>
      </div>

      {/* PROGRAMMABLE TV - Your Live Stream Section */}
      <div className="mb-12">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Your Live Stream
            </CardTitle>
            <CardDescription>
              Start your own live music session and share your expertise with students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Go Live Button and Stream Title Input */}
              <div className="flex gap-4 items-center">
                {!isLive ? (
                  <Button
                    onClick={handleGoLive}
                    className="bg-red-600 hover:bg-red-700 whitespace-nowrap"
                    size="lg"
                  >
                    <Radio className="h-5 w-5 mr-2" />
                    Go Live
                  </Button>
                ) : (
                  <Button
                    onClick={handleStopLive}
                    variant="destructive"
                    className="whitespace-nowrap"
                    size="lg"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    End Stream
                  </Button>
                )}
                <Input
                  placeholder="Enter stream title (e.g., 'Piano Basics for Beginners')"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  disabled={isLive}
                  className="flex-1"
                />
              </div>

              {/* Programmable TV - Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                {!isLive && !isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="text-center text-white/60">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">Ready to Go Live</p>
                      <p className="text-sm mt-2">Your stream will appear here</p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="text-center text-white/60">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-lg font-semibold">Starting stream...</p>
                      <p className="text-sm mt-2">Please allow camera access</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'block',
                        backgroundColor: '#000'
                      }}
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          videoRef.current.play().catch(console.error)
                        }
                      }}
                      onError={(e) => {
                        console.error("Video error:", e)
                        setVideoError("Failed to display video stream")
                      }}
                    />
                    {videoError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-900/20">
                        <div className="text-center text-red-400 p-4">
                          <p className="font-semibold">Video Error</p>
                          <p className="text-sm">{videoError}</p>
                        </div>
                      </div>
                    )}
                    {/* Live Overlay Info */}
                    <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
                      <Badge className="bg-red-600 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 inline-block animate-pulse"></span>
                        LIVE
                      </Badge>
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {viewers} watching
                      </Badge>
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {formatDuration(streamDuration)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {streamTitle || "Untitled Stream"}
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              {isLive && (
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                  <p className="font-semibold mb-2">Stream Status:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Stream is active and broadcasting</li>
                    <li>Viewers can join your session</li>
                    <li>Camera and microphone are active</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Live Streams */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Other Live Sessions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {liveStreams.map((stream) => (
            <Card key={stream.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={stream.thumbnail || "/placeholder.svg"}
                  alt={stream.title}
                  className="w-full h-48 object-cover"
                />
                {stream.isLive && <Badge className="absolute top-2 left-2 bg-red-600">• LIVE</Badge>}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {stream.duration}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{stream.title}</CardTitle>
                <CardDescription>with {stream.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{stream.level}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {stream.isLive ? `${stream.viewers} watching` : `Starts at ${stream.startsAt}`}
                  </div>
                </div>
                <Button className="w-full" disabled={!stream.isLive}>
                  <Video className="h-4 w-4 mr-2" />
                  {stream.isLive ? "Join Live" : "Notify Me"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Sessions</h2>
        <div className="space-y-4">
          {[
            { time: "3:00 PM EST", title: "Drum Basics Workshop", instructor: "Mike Davis" },
            { time: "5:00 PM EST", title: "Songwriting Masterclass", instructor: "Emma Wilson" },
            { time: "7:00 PM EST", title: "Piano Practice Session", instructor: "Sarah Johnson" },
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{session.title}</h3>
                <p className="text-sm text-muted-foreground">with {session.instructor}</p>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {session.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
