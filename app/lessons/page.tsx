"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Clock, Star, Users, Loader } from "lucide-react"
import VideoThumbnail from "@/components/video-thumbnail"

export default function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedInstrument, setSelectedInstrument] = useState("all")
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch lessons from API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedLevel !== "all") params.append("level", selectedLevel)
        if (selectedInstrument !== "all") params.append("instrument", selectedInstrument)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/lessons?${params}`)
        const data = await response.json()
        setLessons(data.lessons || [])
      } catch (error) {
        console.log("[v0] Error fetching lessons:", error)
        setLessons([])
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [selectedLevel, selectedInstrument, searchQuery])

  const mockLessons = [
    {
      id: 1,
      title: "10 Steps to Improvise Jazz",
      description: "Master the fundamentals of jazz improvisation with this comprehensive step-by-step guide.",
      instructor: "Jazz Master",
      duration: "60 minutes",
      level: "Intermediate",
      instrument: "Piano",
      rating: 4.9,
      students: 1247,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/10 STEPS TO IMPROVISE JAZZ.mp4",
    },
    {
      id: 2,
      title: "Improvising Beautiful Melodies On The Piano",
      description: "Learn to create stunning melodies and express yourself through piano improvisation.",
      instructor: "Melody Expert",
      duration: "45 minutes",
      level: "Intermediate",
      instrument: "Piano",
      rating: 4.8,
      students: 892,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/Improvising Beautiful Melodies On The Piano.mp4",
    },
    {
      id: 3,
      title: "Left Hand Arpeggio Patterns",
      description: "Master essential left-hand arpeggio patterns to enhance your piano playing technique.",
      instructor: "Technique Specialist",
      duration: "35 minutes",
      level: "Beginner",
      instrument: "Piano",
      rating: 4.7,
      students: 1156,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/Left Hand Arpeggio Patterns (Piano Lesson).mp4",
    },
    {
      id: 4,
      title: "Dramatic Piano Playing with Arpeggios",
      description: "Learn arpeggio patterns that add intensity and mood to your piano performances.",
      instructor: "Performance Coach",
      duration: "50 minutes",
      level: "Intermediate",
      instrument: "Piano",
      rating: 4.9,
      students: 743,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/Make Your Piano Playing Instantly More Dramatic (Arpeggio Patterns for Intensity and Mood).mp4",
    },
    {
      id: 5,
      title: "Piano Arpeggios Tutorial - 6 Patterns",
      description: "From beginner to pro: master 6 essential arpeggio patterns to inspire your playing.",
      instructor: "Arpeggio Master",
      duration: "55 minutes",
      level: "All Levels",
      instrument: "Piano",
      rating: 4.8,
      students: 1689,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/Piano Arpeggios Tutorial, From Beginner to Pro - 6 Patterns To Inspire Your Playing.mp4",
    },
    {
      id: 6,
      title: "Piano Speed Drills for Accuracy",
      description: "Develop speed and accuracy with targeted piano exercises and practice techniques.",
      instructor: "Speed Specialist",
      duration: "40 minutes",
      level: "Intermediate",
      instrument: "Piano",
      rating: 4.6,
      students: 934,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/Piano Speed Drills_ How to Play Faster with Accuracy(1).mp4",
    },
    {
      id: 7,
      title: "Rhythmic Jazz Exercises",
      description: "Coordinate your left and right hands with these essential jazz rhythm exercises.",
      instructor: "Jazz Rhythm Expert",
      duration: "30 minutes",
      level: "Intermediate",
      instrument: "Piano",
      rating: 4.7,
      students: 678,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/RHYTHMIC JAZZ EXERCISES - Coordinate Left & Right Hand.mp4",
    },
    {
      id: 8,
      title: "Advanced Jazz Improvisation Exercises",
      description: "Simple yet effective piano exercises for advanced jazz improvisation techniques.",
      instructor: "Jazz Master",
      duration: "42 minutes",
      level: "Advanced",
      instrument: "Piano",
      rating: 4.9,
      students: 456,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/Simple PIANO EXERCISES for Advanced JAZZ IMPROVISATION.mp4",
    },
    {
      id: 9,
      title: "Understanding Arpeggios",
      description: "Learn what arpeggios are and how to use them effectively in your piano playing.",
      instructor: "Music Theory Expert",
      duration: "25 minutes",
      level: "Beginner",
      instrument: "Piano",
      rating: 4.5,
      students: 1234,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/What Is An Arpeggio- - Piano Lesson (Pianote).mp4",
    },
    {
      id: 10,
      title: "Worship Keyboard Background Playing",
      description: "Master the art of playing worship music in the background with proper technique.",
      instructor: "Worship Leader",
      duration: "38 minutes",
      level: "Intermediate",
      instrument: "Piano",
      rating: 4.8,
      students: 789,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/Worship keyboard tutorial_ playing in the background.mp4",
    },
    {
      id: 11,
      title: "12yu Piano Lesson",
      description: "Specialized piano lesson covering advanced techniques and musical concepts.",
      instructor: "Piano Master",
      duration: "50 minutes",
      level: "Advanced",
      instrument: "Piano",
      rating: 4.7,
      students: 567,
      thumbnail: "/piano-lesson.png",
      videoUrl: "/video lessons/12yu.mp4",
    },
  ]

  // Lessons are already filtered by the API call, so just use them directly
  const filteredLessons = lessons

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Music Lessons</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Learn from expert instructors with our comprehensive video lessons
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search lessons, instructors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Instrument" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Instruments</SelectItem>
              <SelectItem value="piano">Piano</SelectItem>
              <SelectItem value="guitar">Guitar</SelectItem>
              <SelectItem value="drums">Drums</SelectItem>
              <SelectItem value="voice">Voice</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2">Loading lessons...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No lessons found matching your criteria.</p>
        </div>
      )}

      {/* Lessons Grid */}
      {!loading && filteredLessons.length > 0 && (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <VideoThumbnail
                videoUrl={lesson.videoUrl}
                alt={lesson.title}
                className="w-full h-48 object-cover"
                timeOffset={10}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Link href={`/lessons/${lesson.id}`}>
                  <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Lesson
                  </Button>
                </Link>
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">{lesson.level}</Badge>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                <Clock className="h-3 w-3 inline mr-1" />
                {lesson.duration}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{lesson.title}</CardTitle>
              <CardDescription>with {lesson.instructor}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{lesson.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{lesson.rating}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{lesson.students.toLocaleString()} students</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  )
}
