import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Star } from "lucide-react"
import Link from "next/link"
import VideoThumbnail from "@/components/video-thumbnail"

export default function NewReleases() {
  const lessons = [
    {
      id: 1,
      title: "10 Steps to Improvise Jazz",
      instructor: "Jazz Master",
      duration: "60 minutes",
      level: "Intermediate",
      rating: 4.9,
      thumbnail: "/video lessons/10 STEPS TO IMPROVISE JAZZ.mp4",
      videoUrl: "/video lessons/10 STEPS TO IMPROVISE JAZZ.mp4",
      isNew: true,
    },
    {
      id: 2,
      title: "Improvising Beautiful Melodies On The Piano",
      instructor: "Melody Expert",
      duration: "45 minutes",
      level: "Intermediate",
      rating: 4.8,
      thumbnail: "/video lessons/Improvising Beautiful Melodies On The Piano.mp4",
      videoUrl: "/video lessons/Improvising Beautiful Melodies On The Piano.mp4",
      isNew: true,
    },
    {
      id: 3,
      title: "Piano Arpeggios Tutorial - 6 Patterns",
      instructor: "Arpeggio Master",
      duration: "55 minutes",
      level: "All Levels",
      rating: 4.8,
      thumbnail: "/video lessons/Piano Arpeggios Tutorial, From Beginner to Pro - 6 Patterns To Inspire Your Playing.mp4",
      videoUrl: "/video lessons/Piano Arpeggios Tutorial, From Beginner to Pro - 6 Patterns To Inspire Your Playing.mp4",
      isNew: true,
    },
    {
      id: 4,
      title: "Dramatic Piano Playing with Arpeggios",
      instructor: "Performance Coach",
      duration: "50 minutes",
      level: "Intermediate",
      rating: 4.9,
      thumbnail: "/video lessons/Make Your Piano Playing Instantly More Dramatic (Arpeggio Patterns for Intensity and Mood).mp4",
      videoUrl: "/video lessons/Make Your Piano Playing Instantly More Dramatic (Arpeggio Patterns for Intensity and Mood).mp4",
      isNew: true,
    },
    {
      id: 5,
      title: "Worship Keyboard Background Playing",
      instructor: "Worship Leader",
      duration: "38 minutes",
      level: "Intermediate",
      rating: 4.8,
      thumbnail: "/video lessons/Worship keyboard tutorial_ playing in the background.mp4",
      videoUrl: "/video lessons/Worship keyboard tutorial_ playing in the background.mp4",
      isNew: true,
    },
    {
      id: 6,
      title: "Advanced Jazz Improvisation Exercises",
      instructor: "Jazz Master",
      duration: "42 minutes",
      level: "Advanced",
      rating: 4.9,
      thumbnail: "/video lessons/Simple PIANO EXERCISES for Advanced JAZZ IMPROVISATION.mp4",
      videoUrl: "/video lessons/Simple PIANO EXERCISES for Advanced JAZZ IMPROVISATION.mp4",
      isNew: true,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
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
                  Watch Now
                </Button>
              </Link>
            </div>
            <div className="absolute top-2 left-2">
              <Badge variant="secondary">{lesson.level}</Badge>
            </div>
            {lesson.isNew && <Badge className="absolute top-2 right-2 bg-green-600">New</Badge>}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              <Clock className="h-3 w-3 inline mr-1" />
              {lesson.duration}
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2">{lesson.title}</CardTitle>
            <CardDescription>with {lesson.instructor}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm">{lesson.rating}</span>
              </div>
              <Link href={`/lessons/${lesson.id}`}>
                <Button variant="outline" size="sm">
                  Start Learning
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
