"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Star, Clock, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function LessonDetailPage() {
  const params = useParams()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)

    // Auto-play video when component mounts (with error handling)
    if (videoRef.current) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setIsLoading(false)
          })
          .catch((error) => {
            console.error("Video play failed:", error)
            setHasError(true)
            setErrorMessage("Video failed to load. Please try refreshing the page.")
            setIsLoading(false)
          })
      }
    }
  }, [])

  // Available video lessons mapping
  const videoLessons = {
    "1": {
      title: "Piano Fundamentals: Getting Started",
      description: "Learn the basics of piano playing, including proper posture, hand positioning, and your first scales. This comprehensive lesson will give you a solid foundation to build upon as you continue your piano journey.",
      videoUrl: "/video lessons/10 STEPS TO IMPROVISE JAZZ.mp4",
      duration: "45 minutes",
      level: "Beginner",
    },
    "2": {
      title: "Jazz Improvisation Techniques",
      description: "Master the art of jazz improvisation with advanced techniques and patterns.",
      videoUrl: "/video lessons/Improvising Beautiful Melodies On The Piano.mp4",
      duration: "55 minutes",
      level: "Intermediate",
    },
    "3": {
      title: "Left Hand Arpeggio Patterns",
      description: "Learn essential left hand arpeggio patterns for piano accompaniment.",
      videoUrl: "/video lessons/Left Hand Arpeggio Patterns (Piano Lesson).mp4",
      duration: "35 minutes",
      level: "Intermediate",
    },
    "4": {
      title: "Dramatic Piano Playing",
      description: "Make your piano playing instantly more dramatic with arpeggio patterns.",
      videoUrl: "/video lessons/Make Your Piano Playing Instantly More Dramatic (Arpeggio Patterns for Intensity and Mood).mp4",
      duration: "40 minutes",
      level: "Advanced",
    },
    "5": {
      title: "Piano Arpeggios Tutorial",
      description: "Complete arpeggio tutorial from beginner to pro with 6 inspiring patterns.",
      videoUrl: "/video lessons/Piano Arpeggios Tutorial, From Beginner to Pro - 6 Patterns To Inspire Your Playing.mp4",
      duration: "50 minutes",
      level: "All Levels",
    },
    "6": {
      title: "Piano Speed Drills",
      description: "Learn how to play faster with accuracy through targeted speed drills.",
      videoUrl: "/video lessons/Piano Speed Drills_ How to Play Faster with Accuracy(1).mp4",
      duration: "30 minutes",
      level: "Intermediate",
    },
    "7": {
      title: "Rhythmic Jazz Exercises",
      description: "Coordinate your left and right hand with rhythmic jazz exercises.",
      videoUrl: "/video lessons/RHYTHMIC JAZZ EXERCISES - Coordinate Left & Right Hand.mp4",
      duration: "25 minutes",
      level: "Advanced",
    },
    "8": {
      title: "Advanced Jazz Improvisation",
      description: "Simple piano exercises for advanced jazz improvisation techniques.",
      videoUrl: "/video lessons/Simple PIANO EXERCISES for Advanced JAZZ IMPROVISATION.mp4",
      duration: "35 minutes",
      level: "Advanced",
    },
    "9": {
      title: "Understanding Arpeggios",
      description: "Learn what arpeggios are and how to use them effectively in piano playing.",
      videoUrl: "/video lessons/What Is An Arpeggio- - Piano Lesson (Pianote).mp4",
      duration: "20 minutes",
      level: "Beginner",
    },
    "10": {
      title: "Worship Keyboard Background Playing",
      description: "Learn how to play worship keyboard in the background with proper techniques.",
      videoUrl: "/video lessons/Worship keyboard tutorial_ playing in the background.mp4",
      duration: "40 minutes",
      level: "Intermediate",
    },
  }

  const currentLesson = videoLessons[params?.id as string] || videoLessons["1"]

  const lesson = {
    id: params?.id,
    title: currentLesson.title,
    description: currentLesson.description,
    instructor: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=50&width=50",
      bio: "Professional pianist with 15+ years of teaching experience",
    },
    duration: currentLesson.duration,
    level: currentLesson.level,
    rating: 4.8,
    students: 1234,
    videoUrl: currentLesson.videoUrl,
    thumbnail: "/placeholder.svg?height=400&width=700",
    chapters: [
      { time: "0:00", title: "Introduction" },
      { time: "2:30", title: "Proper Posture" },
      { time: "8:15", title: "Hand Positioning" },
      { time: "15:45", title: "Basic Scales" },
      { time: "30:20", title: "Practice Exercises" },
      { time: "42:00", title: "Next Steps" },
    ],
    resources: [
      { name: "Practice Sheet - C Major Scale", type: "PDF" },
      { name: "Hand Position Guide", type: "PDF" },
      { name: "Practice Schedule Template", type: "PDF" },
    ],
    relatedLessons: [
      {
        id: 2,
        title: "Basic Piano Chords",
        instructor: "Sarah Johnson",
        thumbnail: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 3,
        title: "Reading Sheet Music",
        instructor: "Sarah Johnson",
        thumbnail: "/placeholder.svg?height=100&width=150",
      },
    ],
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const navigateToLesson = (lessonId: number) => {
    // Scroll to top when navigating to a new lesson
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {hasError ? (
              <div className="flex flex-col items-center justify-center h-full text-white p-8">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold mb-2">Video Loading Error</h3>
                <p className="text-center mb-4">{errorMessage}</p>
                <Button 
                  onClick={() => {
                    setHasError(false)
                    setErrorMessage("")
                    setIsLoading(true)
                    if (videoRef.current) {
                      videoRef.current.load()
                    }
                  }}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Loading video...</p>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  poster={lesson.thumbnail}
                  controls
                  autoPlay
                  muted
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onLoadStart={() => setIsLoading(true)}
                  onCanPlay={() => setIsLoading(false)}
                  onError={(e) => {
                    console.warn("Video failed to play source:", lesson.videoUrl)
                    setHasError(true)
                    setErrorMessage("This video file could not be loaded. Please check your internet connection or try a different lesson.")
                    setIsLoading(false)
                  }}
                >
                  <source src={lesson.videoUrl} type="video/mp4" />
                  <source src={lesson.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </>
            )}
          </div>

          {/* Lesson Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{lesson.level}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {lesson.duration}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            <p className="text-muted-foreground mb-6">{lesson.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={lesson.instructor.image || "/placeholder.svg"}
                  alt={lesson.instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{lesson.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{lesson.instructor.bio}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{lesson.rating}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{lesson.students.toLocaleString()} students</span>
                </div>
              </div>
            </div>

            <Separator />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Proper sitting posture and hand positioning for piano playing</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Basic finger exercises to build dexterity and strength</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Introduction to the C major scale and basic music theory</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Practice techniques for effective learning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chapters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Chapters</CardTitle>
                  <CardDescription>Jump to specific sections of the lesson</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lesson.chapters.map((chapter, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <Play className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{chapter.title}</p>
                            <p className="text-sm text-muted-foreground">{chapter.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Downloadable Resources</CardTitle>
                  <CardDescription>Additional materials to support your learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lesson.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-muted-foreground">{resource.type}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>Next Lessons</CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson.relatedLessons.map((relatedLesson) => (
                <Link
                  key={relatedLesson.id}
                  href={`/lessons/${relatedLesson.id}`}
                  onClick={() => navigateToLesson(relatedLesson.id)}
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                    <img
                      src={relatedLesson.thumbnail || "/placeholder.svg"}
                      alt={relatedLesson.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-2">{relatedLesson.title}</p>
                      <p className="text-sm text-muted-foreground">{relatedLesson.instructor}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Take Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/lessons/book">
                <Button className="w-full">Book Private Lesson</Button>
              </Link>
              <Link href="/lessons/tracker">
                <Button variant="outline" className="w-full bg-transparent">
                  Track Progress
                </Button>
              </Link>
              <Link href={`/teachers/${lesson.instructor.name.toLowerCase().replace(" ", "-")}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  View Instructor Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
