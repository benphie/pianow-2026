"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, Play, Search, Star, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Real YouTube lessons from your CSV file
const youtubeLessons = [
  // BEGINNER PIANO LESSONS
  {
    id: "1",
    title: "YOUR FIRST PIANO LESSON",
    channelName: "Piano Lessons",
    duration: "15:32",
    views: "125K",
    uploadDate: "2 weeks ago",
    thumbnail: "https://img.youtube.com/vi/mUsTII7vv8E/maxresdefault.jpg",
    videoId: "mUsTII7vv8E",
    description: "Start your piano journey with this comprehensive first lesson covering the basics.",
    level: "Beginner",
    rating: 4.8,
  },
  {
    id: "2",
    title: "HOW TO COUNT BASIC RHYTHMS",
    channelName: "Piano Lessons",
    duration: "12:45",
    views: "89K",
    uploadDate: "1 week ago",
    thumbnail: "https://img.youtube.com/vi/x3CK4-G5Eg4/maxresdefault.jpg",
    videoId: "x3CK4-G5Eg4",
    description: "Learn essential rhythm counting techniques for piano beginners.",
    level: "Beginner",
    rating: 4.9,
  },
  {
    id: "3",
    title: "JAZZ PIANO FOR ABSOLUTE BEGINNERS",
    channelName: "Piano Lessons",
    duration: "18:20",
    views: "156K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/RpObAWZ0SKM/maxresdefault.jpg",
    videoId: "RpObAWZ0SKM",
    description: "Introduction to jazz piano concepts for complete beginners.",
    level: "Beginner",
    rating: 4.7,
  },
  {
    id: "4",
    title: "BEGINNERS GUIDE TO JAZZ IMPROVISATION",
    channelName: "Piano Lessons",
    duration: "22:15",
    views: "203K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/lhNZEIFv3uk/maxresdefault.jpg",
    videoId: "lhNZEIFv3uk",
    description: "Learn the fundamentals of jazz improvisation on piano.",
    level: "Beginner",
    rating: 4.9,
  },
  {
    id: "5",
    title: "CRACK YOUR PIANO TIMING",
    channelName: "Piano Lessons",
    duration: "14:45",
    views: "167K",
    uploadDate: "3 months ago",
    thumbnail: "https://img.youtube.com/vi/estKCwDwJBY/maxresdefault.jpg",
    videoId: "estKCwDwJBY",
    description: "Master timing and rhythm in your piano playing.",
    level: "Beginner",
    rating: 4.8,
  },
  {
    id: "6",
    title: "HOW TO USE TRANSPOSE",
    channelName: "Piano Lessons",
    duration: "8:30",
    views: "156K",
    uploadDate: "2 weeks ago",
    thumbnail: "https://img.youtube.com/vi/l3mfuz2dvDQ/maxresdefault.jpg",
    videoId: "l3mfuz2dvDQ",
    description: "Learn how to use the transpose function on digital pianos.",
    level: "Beginner",
    rating: 4.7,
  },
  {
    id: "7",
    title: "PIANO CHORD PROGRESSION",
    channelName: "Piano Lessons",
    duration: "16:20",
    views: "312K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/j26v8C4hYyc/maxresdefault.jpg",
    videoId: "j26v8C4hYyc",
    description: "Understand basic piano chord progressions and how to use them.",
    level: "Beginner",
    rating: 4.9,
  },
  {
    id: "8",
    title: "PIANO PRACTICE",
    channelName: "Piano Lessons",
    duration: "12:10",
    views: "145K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/t3ir_gMH8RA/maxresdefault.jpg",
    videoId: "t3ir_gMH8RA",
    description: "Effective piano practice techniques for beginners.",
    level: "Beginner",
    rating: 4.6,
  },
  {
    id: "9",
    title: "CHORDS FOR BEGINNERS",
    channelName: "Piano Lessons",
    duration: "12:30",
    views: "198K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/A_sq3JLC5uQ/maxresdefault.jpg",
    videoId: "A_sq3JLC5uQ",
    description: "Learn essential piano chords for beginners.",
    level: "Beginner",
    rating: 4.9,
  },
  {
    id: "10",
    title: "PIANO MAJOR SCALES EXPLAINED",
    channelName: "Piano Lessons",
    duration: "14:15",
    views: "89K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/qdDHiHuvlls/maxresdefault.jpg",
    videoId: "qdDHiHuvlls",
    description: "Complete guide to major scales on piano for beginners.",
    level: "Beginner",
    rating: 4.8,
  },
  {
    id: "11",
    title: "PIANO TIME SIGNATURE",
    channelName: "Piano Lessons",
    duration: "18:45",
    views: "198K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/vNUBEcPdZxY/maxresdefault.jpg",
    videoId: "vNUBEcPdZxY",
    description: "Understanding time signatures in piano music.",
    level: "Beginner",
    rating: 4.8,
  },
  {
    id: "12",
    title: "NAMING PIANO NOTES",
    channelName: "Piano Lessons",
    duration: "16:20",
    views: "156K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/wjXCJ3OrBRQ/maxresdefault.jpg",
    videoId: "wjXCJ3OrBRQ",
    description: "Learn how to name and identify piano notes.",
    level: "Beginner",
    rating: 4.6,
  },
  {
    id: "13",
    title: "RHYTHMS FOR BEGINNERS",
    channelName: "Piano Lessons",
    duration: "19:45",
    views: "267K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/ISeAMN-rkU4/maxresdefault.jpg",
    videoId: "ISeAMN-rkU4",
    description: "Master basic rhythms for piano beginners.",
    level: "Beginner",
    rating: 4.8,
  },

  // INTERMEDIATE PIANO LESSONS
  {
    id: "14",
    title: "STOP MEMORIZING SCALES .START IMPROVING",
    channelName: "Piano Lessons",
    duration: "18:20",
    views: "156K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/oDVlWRs-zRA/maxresdefault.jpg",
    videoId: "oDVlWRs-zRA",
    description: "Advanced approach to learning and practicing piano scales.",
    level: "Intermediate",
    rating: 4.7,
  },

  // ADVANCED PIANO LESSONS
  {
    id: "15",
    title: "PLAY GOSPEL CHORDS",
    channelName: "Piano Lessons",
    duration: "25:30",
    views: "78K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/BHVNU7PIG-s/maxresdefault.jpg",
    videoId: "BHVNU7PIG-s",
    description: "Learn advanced gospel chord techniques and voicings.",
    level: "Advanced",
    rating: 4.6,
  },
  {
    id: "16",
    title: "ADVANCED PASSING CHORDS",
    channelName: "Piano Lessons",
    duration: "32:15",
    views: "95K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/GdPj720ljCQ/maxresdefault.jpg",
    videoId: "GdPj720ljCQ",
    description: "Master advanced passing chord techniques for smooth progressions.",
    level: "Advanced",
    rating: 4.8,
  },
  {
    id: "17",
    title: "10 STEPS FROM BEGINNER TO ADVANCED PIANO CHORDS",
    channelName: "Piano Lessons",
    duration: "28:45",
    views: "112K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/UvBGC1QR6eE/maxresdefault.jpg",
    videoId: "UvBGC1QR6eE",
    description: "Complete progression from basic to advanced piano chord techniques.",
    level: "Advanced",
    rating: 4.9,
  },
  {
    id: "18",
    title: "5 LEVELS OF PASSING CHORDS",
    channelName: "Piano Lessons",
    duration: "26:30",
    views: "87K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/FqwLsSqWIBU/maxresdefault.jpg",
    videoId: "FqwLsSqWIBU",
    description: "Learn five different levels of passing chord sophistication.",
    level: "Advanced",
    rating: 4.7,
  },
  {
    id: "19",
    title: "PASSING CHORDS",
    channelName: "Piano Lessons",
    duration: "24:20",
    views: "134K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/XeYUI-6QZZo/maxresdefault.jpg",
    videoId: "XeYUI-6QZZo",
    description: "Comprehensive guide to using passing chords in piano playing.",
    level: "Advanced",
    rating: 4.8,
  },
  {
    id: "20",
    title: "ADVANCED GOSPEL PIANO CHORDS",
    channelName: "Piano Lessons",
    duration: "20:15",
    views: "98K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/FlMaIq_eRSU/maxresdefault.jpg",
    videoId: "FlMaIq_eRSU",
    description: "Advanced gospel piano chord techniques and voicings.",
    level: "Advanced",
    rating: 4.6,
  },
  {
    id: "21",
    title: "ADVANCED CHORD PROGRESSIONS",
    channelName: "Piano Lessons",
    duration: "29:30",
    views: "76K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/kn9dfj2RAU8/maxresdefault.jpg",
    videoId: "kn9dfj2RAU8",
    description: "Master complex chord progressions for advanced piano playing.",
    level: "Advanced",
    rating: 4.7,
  },
  {
    id: "22",
    title: "ADVANCED HARMONY",
    channelName: "Piano Lessons",
    duration: "18:45",
    views: "89K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/XWzdNp7HGME/maxresdefault.jpg",
    videoId: "XWzdNp7HGME",
    description: "Advanced harmonic concepts for piano players.",
    level: "Advanced",
    rating: 4.8,
  },
  {
    id: "23",
    title: "ADVANCED CHORD SUBSTITUTION",
    channelName: "Piano Lessons",
    duration: "21:45",
    views: "123K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/D6q6rnOP_js/maxresdefault.jpg",
    videoId: "D6q6rnOP_js",
    description: "Learn advanced chord substitution techniques for piano.",
    level: "Advanced",
    rating: 4.7,
  },
  {
    id: "24",
    title: "NO MORE BASIC PIANO CHORDS",
    channelName: "Piano Lessons",
    duration: "25:30",
    views: "78K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/NYggR31WCpI/maxresdefault.jpg",
    videoId: "NYggR31WCpI",
    description: "Move beyond basic chords to advanced piano techniques.",
    level: "Advanced",
    rating: 4.6,
  },
  {
    id: "25",
    title: "FLIP PIANO CHORDS",
    channelName: "Piano Lessons",
    duration: "32:15",
    views: "95K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/UdIq900ouB0/maxresdefault.jpg",
    videoId: "UdIq900ouB0",
    description: "Learn chord inversions and flipping techniques for piano.",
    level: "Advanced",
    rating: 4.8,
  },
  {
    id: "26",
    title: "REHARMONIZATION",
    channelName: "Piano Lessons",
    duration: "28:45",
    views: "112K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/MR9aSfWekw8/maxresdefault.jpg",
    videoId: "MR9aSfWekw8",
    description: "Master the art of reharmonization on piano.",
    level: "Advanced",
    rating: 4.9,
  },
  {
    id: "27",
    title: "TRANSPOSE LIKE A PRO",
    channelName: "Piano Lessons",
    duration: "26:30",
    views: "87K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/ZA5ZyJqmuvM/maxresdefault.jpg",
    videoId: "ZA5ZyJqmuvM",
    description: "Professional transposition techniques for piano players.",
    level: "Advanced",
    rating: 4.7,
  },
  {
    id: "28",
    title: "USING CHROMATIC SCALES",
    channelName: "Piano Lessons",
    duration: "24:20",
    views: "134K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/f9rJxnwhsKY/maxresdefault.jpg",
    videoId: "f9rJxnwhsKY",
    description: "Advanced techniques for using chromatic scales in piano playing.",
    level: "Advanced",
    rating: 4.8,
  },

  // DRUM LESSONS
  {
    id: "29",
    title: "DRUM FILLS FOR BEGINNERS",
    channelName: "Drum Lessons",
    duration: "15:30",
    views: "145K",
    uploadDate: "2 weeks ago",
    thumbnail: "https://img.youtube.com/vi/-KTsK29SDGI/maxresdefault.jpg",
    videoId: "-KTsK29SDGI",
    description: "Learn essential drum fills for beginners with easy patterns.",
    level: "Beginner",
    rating: 4.7,
  },
  {
    id: "30",
    title: "DRUM PRACTICE 1",
    channelName: "Drum Lessons",
    duration: "18:45",
    views: "198K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/HADXTkl6PY0/maxresdefault.jpg",
    videoId: "HADXTkl6PY0",
    description: "First practice session focusing on basic drum techniques.",
    level: "Beginner",
    rating: 4.8,
  },
  {
    id: "31",
    title: "DRUM PRACTICE 2",
    channelName: "Drum Lessons",
    duration: "20:15",
    views: "156K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/_Nes38Vdch4/maxresdefault.jpg",
    videoId: "_Nes38Vdch4",
    description: "Second practice session building on basic drum skills.",
    level: "Beginner",
    rating: 4.6,
  },
  {
    id: "32",
    title: "DRUM PRACTICE 3",
    channelName: "Drum Lessons",
    duration: "22:30",
    views: "134K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/0bFPaEwuZBU/maxresdefault.jpg",
    videoId: "0bFPaEwuZBU",
    description: "Third practice session with intermediate drum patterns.",
    level: "Beginner",
    rating: 4.7,
  },
  {
    id: "33",
    title: "DRUM PRACTICE 4",
    channelName: "Drum Lessons",
    duration: "25:45",
    views: "112K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/WlmRf8alZb4/maxresdefault.jpg",
    videoId: "WlmRf8alZb4",
    description: "Fourth practice session with more complex drum techniques.",
    level: "Intermediate",
    rating: 4.8,
  },
  {
    id: "34",
    title: "DRUM PRACTICE 5",
    channelName: "Drum Lessons",
    duration: "28:20",
    views: "98K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/o9iBJT2gqOw/maxresdefault.jpg",
    videoId: "o9iBJT2gqOw",
    description: "Fifth practice session with advanced drum patterns.",
    level: "Advanced",
    rating: 4.9,
  },
  {
    id: "35",
    title: "DRUM PRACTICE 6",
    channelName: "Drum Lessons",
    duration: "30:15",
    views: "87K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/iAB1Tu3YVh0/maxresdefault.jpg",
    videoId: "iAB1Tu3YVh0",
    description: "Sixth practice session with professional drum techniques.",
    level: "Advanced",
    rating: 4.7,
  },
  {
    id: "36",
    title: "DRUM ACCESSORIES",
    channelName: "Drum Lessons",
    duration: "16:30",
    views: "123K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/7RpTSGjFbvA/maxresdefault.jpg",
    videoId: "7RpTSGjFbvA",
    description: "Essential drum accessories every drummer should know about.",
    level: "Intermediate",
    rating: 4.6,
  },
  {
    id: "37",
    title: "DRUM GHOST NOTES",
    channelName: "Drum Lessons",
    duration: "19:45",
    views: "156K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/usqi5Hncv9k/maxresdefault.jpg",
    videoId: "usqi5Hncv9k",
    description: "Master the art of ghost notes for dynamic drumming.",
    level: "Advanced",
    rating: 4.8,
  },
  {
    id: "38",
    title: "3 ESSENTIAL KICK DRUM EXERCISES",
    channelName: "Drum Lessons",
    duration: "14:20",
    views: "189K",
    uploadDate: "2 weeks ago",
    thumbnail: "https://img.youtube.com/vi/ycyfFeGu33w/maxresdefault.jpg",
    videoId: "ycyfFeGu33w",
    description: "Three essential exercises to improve your kick drum technique.",
    level: "Beginner",
    rating: 4.9,
  },
  {
    id: "39",
    title: "3 EASY FILLS",
    channelName: "Drum Lessons",
    duration: "12:15",
    views: "167K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/1ep_XG0GIOs/maxresdefault.jpg",
    videoId: "1ep_XG0GIOs",
    description: "Learn three easy drum fills perfect for beginners.",
    level: "Beginner",
    rating: 4.7,
  },
  {
    id: "40",
    title: "NEW SECRET TO FASTER HANDS",
    channelName: "Drum Lessons",
    duration: "17:30",
    views: "234K",
    uploadDate: "3 weeks ago",
    thumbnail: "https://img.youtube.com/vi/X1DxPjvq6wI/maxresdefault.jpg",
    videoId: "X1DxPjvq6wI",
    description: "Discover the secret technique to develop faster hand speed.",
    level: "Beginner",
    rating: 4.8,
  },
  {
    id: "41",
    title: "5 EASY DRUM FILLS",
    channelName: "Drum Lessons",
    duration: "15:45",
    views: "178K",
    uploadDate: "2 months ago",
    thumbnail: "https://img.youtube.com/vi/6VPdImJFa_U/maxresdefault.jpg",
    videoId: "6VPdImJFa_U",
    description: "Five easy drum fills that every beginner should master.",
    level: "Beginner",
    rating: 4.6,
  },
  {
    id: "42",
    title: "HOW TO PLAY DRUMS",
    channelName: "Drum Lessons",
    duration: "21:30",
    views: "312K",
    uploadDate: "1 month ago",
    thumbnail: "https://img.youtube.com/vi/lql92_54KrQ/maxresdefault.jpg",
    videoId: "lql92_54KrQ",
    description: "Complete beginner's guide to playing drums from scratch.",
    level: "Beginner",
    rating: 4.9,
  },
  {
    id: "43",
    title: "HI HAT LESSONS",
    channelName: "Drum Lessons",
    duration: "18:20",
    views: "145K",
    uploadDate: "2 weeks ago",
    thumbnail: "https://img.youtube.com/vi/P2mgPmQsnJ8/maxresdefault.jpg",
    videoId: "P2mgPmQsnJ8",
    description: "Master hi-hat techniques and patterns for drummers.",
    level: "Beginner",
    rating: 4.7,
  },
]

export default function YouTubeLessonsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [filteredLessons, setFilteredLessons] = useState(youtubeLessons)

  useEffect(() => {
    let filtered = youtubeLessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    
    if (selectedLevel !== "All") {
      filtered = filtered.filter(lesson => lesson.level === selectedLevel)
    }
    
    setFilteredLessons(filtered)
  }, [searchQuery, selectedLevel])

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const openYouTubeVideo = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <div className="container px-4 py-8">
      {/* YouTube Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
            >
              ✕ Close
            </button>
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">YouTube Piano Lessons</h1>
        <p className="text-muted-foreground mb-4">Learn piano with free lessons from our featured YouTube channel</p>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Channel ID: UCFAT--7r641oRcLf6RKHP2Qget</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search YouTube lessons..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLevel === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLevel("All")}
          >
            All ({youtubeLessons.length})
          </Button>
          <Button
            variant={selectedLevel === "Beginner" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLevel("Beginner")}
          >
            Beginner ({youtubeLessons.filter(l => l.level === "Beginner").length})
          </Button>
          <Button
            variant={selectedLevel === "Intermediate" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLevel("Intermediate")}
          >
            Intermediate ({youtubeLessons.filter(l => l.level === "Intermediate").length})
          </Button>
          <Button
            variant={selectedLevel === "Advanced" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLevel("Advanced")}
          >
            Advanced ({youtubeLessons.filter(l => l.level === "Advanced").length})
          </Button>
        </div>
      </div>

      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <div
                  className="relative h-[180px] w-full group cursor-pointer"
                  onClick={() => openYouTubeVideo(lesson.videoId)}
                >
                  <Image
                    src={lesson.thumbnail || "/placeholder.svg"}
                    alt={lesson.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {lesson.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                    YouTube
                  </div>
                </div>
                <div className="p-4">
                  <Badge
                    className={`mb-2 ${
                      lesson.level === "Beginner"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : lesson.level === "Intermediate"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    }`}
                  >
                    {lesson.level}
                  </Badge>
                  <h3
                    className="font-medium line-clamp-2 h-12 cursor-pointer hover:underline"
                    onClick={() => openYouTubeVideo(lesson.videoId)}
                  >
                    {lesson.title}
                  </h3>
                  <div className="mt-1 text-sm text-muted-foreground">{lesson.channelName}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {lesson.views} views • {lesson.uploadDate}
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{lesson.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lesson.description}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => openYouTubeVideo(lesson.videoId)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch on YouTube
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No lessons found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search to find what you're looking for.</p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("")
            setSelectedLevel("All")
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Want more lessons?</h3>
          <p className="text-muted-foreground mb-4">
            Check out our premium video lessons with interactive features and downloadable resources.
          </p>
          <Button asChild>
            <Link href="/lessons">Browse Premium Lessons</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
