"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Trophy, Target, Play, CheckCircle, BookOpen, TrendingUp } from "lucide-react"
import FigmaChart from "@/components/figma-chart"
import Link from "next/link"

interface PracticeSession {
  id: number
  date: string
  duration: number
  instrument: string
  lesson: string
  notes?: string
}

interface Lesson {
  id: number
  title: string
  instructor: string
  duration: string
  progress: number
  completed: boolean
  instrument: string
  difficulty: string
  thumbnail: string
}

export default function LessonTracker() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [totalPracticeTime, setTotalPracticeTime] = useState(0)
  const [currentWeekTime, setCurrentWeekTime] = useState(0)
  const [streak, setStreak] = useState(7)

  const [practiceSessions] = useState<PracticeSession[]>([
    {
      id: 1,
      date: "2024-01-15",
      duration: 45,
      instrument: "Piano",
      lesson: "Scales Practice",
      notes: "Worked on C major scale",
    },
    {
      id: 2,
      date: "2024-01-14",
      duration: 30,
      instrument: "Guitar",
      lesson: "Chord Progressions",
      notes: "Mastered Am-F-C-G progression",
    },
    {
      id: 3,
      date: "2024-01-13",
      duration: 60,
      instrument: "Piano",
      lesson: "Chopin Etude",
      notes: "Slow practice, focus on fingering",
    },
  ])

  const [lessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Piano Fundamentals",
      instructor: "Sarah Johnson",
      duration: "45 min",
      progress: 100,
      completed: true,
      instrument: "Piano",
      difficulty: "Beginner",
      thumbnail: "/piano-lesson.png",
    },
    {
      id: 2,
      title: "Guitar Chord Mastery",
      instructor: "Mike Rodriguez",
      duration: "35 min",
      progress: 75,
      completed: false,
      instrument: "Guitar",
      difficulty: "Intermediate",
      thumbnail: "/guitar-lesson.png",
    },
    {
      id: 3,
      title: "Jazz Piano Improvisation",
      instructor: "Emma Davis",
      duration: "55 min",
      progress: 25,
      completed: false,
      instrument: "Piano",
      difficulty: "Advanced",
      thumbnail: "/jazz-piano.png",
    },
    {
      id: 4,
      title: "Drum Basics",
      instructor: "Alex Thompson",
      duration: "40 min",
      progress: 100,
      completed: true,
      instrument: "Drums",
      difficulty: "Beginner",
      thumbnail: "/drum-lesson.png",
    },
  ])

  const completedLessons = lessons.filter((lesson) => lesson.completed)
  const inProgressLessons = lessons.filter((lesson) => !lesson.completed && lesson.progress > 0)
  const notStartedLessons = lessons.filter((lesson) => lesson.progress === 0)

  useEffect(() => {
    const total = practiceSessions.reduce((sum, session) => sum + session.duration, 0)
    setTotalPracticeTime(total)

    const thisWeek = practiceSessions
      .filter((session) => {
        const sessionDate = new Date(session.date)
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        return sessionDate >= weekStart
      })
      .reduce((sum, session) => sum + session.duration, 0)
    setCurrentWeekTime(thisWeek)
  }, [practiceSessions])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">My Learning Progress</h1>
        <p className="text-xl text-muted-foreground">
          Track your practice time, lesson progress, and musical achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Practice Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(currentWeekTime / 60)}h {currentWeekTime % 60}m
            </div>
            <p className="text-xs text-muted-foreground">+2h from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons.length}</div>
            <p className="text-xs text-muted-foreground">out of {lessons.length} total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Lesson Progress</TabsTrigger>
          <TabsTrigger value="practice">Practice Log</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <div className="space-y-6">
            {/* In Progress Lessons */}
            <div id="in-progress">
              <h2 className="text-2xl font-bold mb-4">In Progress ({inProgressLessons.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inProgressLessons.map((lesson) => (
                  <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={lesson.thumbnail || "/placeholder.svg"}
                          alt={lesson.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.instructor}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary">{lesson.difficulty}</Badge>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Progress</span>
                              <span className="text-xs font-medium">{lesson.progress}%</span>
                            </div>
                            <Progress value={lesson.progress} className="h-2" />
                          </div>
                          <Link href={`/lessons/${lesson.id}`}>
                            <Button size="sm" className="w-full mt-3">
                              <Play className="h-3 w-3 mr-1" />
                              Continue
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Completed Lessons */}
            <div id="completed">
              <h2 className="text-2xl font-bold mb-4">Completed ({completedLessons.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedLessons.map((lesson) => (
                  <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <img
                            src={lesson.thumbnail || "/placeholder.svg"}
                            alt={lesson.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-green-600 bg-white rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.instructor}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary">{lesson.difficulty}</Badge>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </div>
                          <Badge className="mt-3 bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Not Started */}
            {notStartedLessons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Available Lessons ({notStartedLessons.length})</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {notStartedLessons.map((lesson) => (
                    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={lesson.thumbnail || "/placeholder.svg"}
                            alt={lesson.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">{lesson.instructor}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="secondary">{lesson.difficulty}</Badge>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            </div>
                            <Link href={`/lessons/${lesson.id}`}>
                              <Button size="sm" className="w-full mt-3">
                                <Play className="h-3 w-3 mr-1" />
                                Start Lesson
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Practice Sessions</CardTitle>
              <CardDescription>Track your daily practice and improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {practiceSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{session.instrument}</Badge>
                        <span className="font-medium">{session.lesson}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                      {session.notes && <p className="text-sm text-muted-foreground italic">"{session.notes}"</p>}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{session.duration} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <FigmaChart />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Practice Calendar</CardTitle>
                <CardDescription>Select a date to view practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Goals</CardTitle>
                <CardDescription>Your practice targets and milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Practice 5 hours this week</p>
                    <p className="text-sm text-muted-foreground">3h 45m completed</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Complete Jazz Piano course</p>
                    <p className="text-sm text-muted-foreground">2 lessons remaining</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Maintain 10-day streak</p>
                    <p className="text-sm text-muted-foreground">Currently at 7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
