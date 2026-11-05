"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Clock,
  Trophy,
  Target,
  Play,
  CheckCircle,
  BookOpen,
  TrendingUp,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Search,
  Star,
  Pause,
  RotateCcw,
  Sparkles,
  Music,
  Sliders,
  Check,
  Flame
} from "lucide-react"
import FigmaChart from "@/components/figma-chart"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import {
  PracticeSessionItem,
  getStoredPracticeSessions,
  addPracticeSession,
  deletePracticeSession,
  calculatePracticeStats,
  savePracticeSessions
} from "@/lib/practice"
import { addNotification } from "@/lib/notifications"

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
  const { toast } = useToast()
  const { user } = useAuth()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [practiceSessions, setPracticeSessions] = useState<PracticeSessionItem[]>([])
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(5)

  // Filter & Search states
  const [filterInstrument, setFilterInstrument] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Log Practice Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [formDuration, setFormDuration] = useState<number>(30)
  const [formInstrument, setFormInstrument] = useState<string>("Piano")
  const [formLesson, setFormLesson] = useState<string>("")
  const [formSection, setFormSection] = useState<string>("")
  const [formBpm, setFormBpm] = useState<string>("")
  const [formRating, setFormRating] = useState<number>(5)
  const [formNotes, setFormNotes] = useState<string>("")

  // Live Practice Stopwatch State
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerInstrument, setTimerInstrument] = useState("Piano")
  const [timerPiece, setTimerPiece] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Lesson catalog state
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
      title: "Drum Basics & Groove",
      instructor: "Alex Thompson",
      duration: "40 min",
      progress: 100,
      completed: true,
      instrument: "Drums",
      difficulty: "Beginner",
      thumbnail: "/drum-lesson.png",
    },
  ])

  // Load sessions from local storage and backend API
  useEffect(() => {
    const localSessions = getStoredPracticeSessions()
    setPracticeSessions(localSessions)

    async function syncBackendSessions() {
      try {
        // Practice logs are private, so only a signed-in user has one on the server
        if (user) {
          const data = await apiClient.getPracticeSessions()
          if (Array.isArray(data.sessions) && data.sessions.length > 0) {
            // Merge with local sessions by ID
            const mergedMap = new Map<string, PracticeSessionItem>()
            localSessions.forEach(s => mergedMap.set(s.id, s))
            data.sessions.forEach((s: any) => {
              mergedMap.set(s.id, {
                id: s.id,
                date: s.date,
                duration: Number(s.duration) || 30,
                instrument: s.instrument || "Piano",
                lesson: s.lesson || "Practice",
                section: s.section,
                bpm: s.bpm,
                targetBpm: s.target_bpm || s.targetBpm,
                techniques: s.techniques || [],
                notes: s.notes,
                rating: s.rating || 5,
                createdAt: s.created_at || s.createdAt,
              })
            })
            const combined = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            setPracticeSessions(combined)
            savePracticeSessions(combined)
          }
        }
      } catch (err) {
        console.error("Practice sessions sync error:", err)
      }
    }

    syncBackendSessions()

    // Listen to local event updates
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setPracticeSessions(e.detail)
      } else {
        setPracticeSessions(getStoredPracticeSessions())
      }
    }

    window.addEventListener("pianow_practice_updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener("pianow_practice_updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [user])

  // Stopwatch interval
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTimerRunning])

  // Computed statistics
  const stats = useMemo(() => {
    return calculatePracticeStats(practiceSessions)
  }, [practiceSessions])

  // Filtered practice sessions
  const filteredSessions = useMemo(() => {
    return practiceSessions.filter(session => {
      const matchesInstrument =
        filterInstrument === "all" ||
        session.instrument.toLowerCase() === filterInstrument.toLowerCase()

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        session.lesson.toLowerCase().includes(query) ||
        (session.section && session.section.toLowerCase().includes(query)) ||
        (session.notes && session.notes.toLowerCase().includes(query)) ||
        session.instrument.toLowerCase().includes(query)

      return matchesInstrument && matchesSearch
    })
  }, [practiceSessions, filterInstrument, searchQuery])

  // Sessions for the currently selected calendar date
  const selectedDateString = useMemo(() => {
    if (!selectedDate) return ""
    // Format YYYY-MM-DD in local time
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const day = String(selectedDate.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }, [selectedDate])

  const sessionsForSelectedDate = useMemo(() => {
    if (!selectedDateString) return []
    return practiceSessions.filter(s => s.date === selectedDateString)
  }, [practiceSessions, selectedDateString])

  const totalMinutesForSelectedDate = useMemo(() => {
    return sessionsForSelectedDate.reduce((sum, s) => sum + (Number(s.duration) || 0), 0)
  }, [sessionsForSelectedDate])

  // Dates with practice sessions for calendar highlighting
  const datesWithPractice = useMemo(() => {
    return practiceSessions.map(s => {
      const [year, month, day] = s.date.split("-").map(Number)
      return new Date(year, month - 1, day)
    })
  }, [practiceSessions])

  // Handle saving a practice session
  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formLesson.trim()) {
      toast({
        title: "Lesson / Piece Required",
        description: "Please enter the piece, scale, or exercise you practiced.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        userId: user?.id,
        date: formDate,
        duration: Number(formDuration) || 30,
        instrument: formInstrument,
        lesson: formLesson.trim(),
        section: formSection.trim() || undefined,
        bpm: formBpm ? Number(formBpm) : undefined,
        notes: formNotes.trim() || undefined,
        rating: formRating,
      }

      // Save locally
      const updated = addPracticeSession(payload)
      setPracticeSessions(updated)

      // Post to backend API
      try {
        if (user) {
          await apiClient.logPracticeSession(payload)
        }
      } catch (err) {
        console.warn("Backend practice sync notice:", err)
      }

      // Notification
      addNotification({
        type: "system",
        title: "Practice Session Logged",
        message: `Logged ${payload.duration} mins on ${payload.instrument}: ${payload.lesson}. Keep up the momentum!`,
        href: "/lessons/tracker",
      })

      toast({
        title: "Practice Logged Successfully!",
        description: `Saved ${payload.duration}m of ${payload.instrument} practice.`,
      })

      // Reset form & close modal
      setIsLogModalOpen(false)
      setFormLesson("")
      setFormSection("")
      setFormBpm("")
      setFormNotes("")
      setFormRating(5)
    } catch (err) {
      toast({
        title: "Error Saving",
        description: "Could not save your session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting a session
  const handleDeleteSession = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const updated = deletePracticeSession(id)
    setPracticeSessions(updated)
    toast({
      title: "Session Removed",
      description: "Practice entry deleted from your log.",
    })
  }

  // Stop timer and open modal with duration
  const handleFinishTimer = () => {
    setIsTimerRunning(false)
    const minutes = Math.max(Math.round(timerSeconds / 60), 1)
    setFormDuration(minutes)
    setFormInstrument(timerInstrument)
    if (timerPiece) setFormLesson(timerPiece)
    setFormDate(new Date().toISOString().split("T")[0])
    setIsLogModalOpen(true)
  }

  const formatTimerTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const completedLessons = lessons.filter((lesson) => lesson.completed)
  const inProgressLessons = lessons.filter((lesson) => !lesson.completed && lesson.progress > 0)
  const notStartedLessons = lessons.filter((lesson) => lesson.progress === 0)

  // Weekly progress calculation
  const weeklyTargetMinutes = weeklyTargetHours * 60
  const weeklyProgressPercent = Math.min(
    Math.round((stats.thisWeekMinutes / weeklyTargetMinutes) * 100),
    100
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Music Practice & Progress Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Log your daily repertoire, track tempo milestones, and keep your consistency streak alive.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Log Practice</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Music className="h-5 w-5 text-purple-600" />
                  Log Practice Session
                </DialogTitle>
                <DialogDescription>
                  Record your practice details, tempos, and musical reflections.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveSession} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="practice-date">Date</Label>
                    <Input
                      id="practice-date"
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="practice-instrument">Instrument</Label>
                    <Select value={formInstrument} onValueChange={setFormInstrument}>
                      <SelectTrigger id="practice-instrument">
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Piano">Piano</SelectItem>
                        <SelectItem value="Guitar">Guitar</SelectItem>
                        <SelectItem value="Drums">Drums</SelectItem>
                        <SelectItem value="Violin">Violin</SelectItem>
                        <SelectItem value="Voice">Voice</SelectItem>
                        <SelectItem value="Bass">Bass</SelectItem>
                        <SelectItem value="Saxophone">Saxophone</SelectItem>
                        <SelectItem value="Flute">Flute</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration with quick presets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="practice-duration">Duration (Minutes)</Label>
                    <span className="text-xs font-semibold text-purple-600">{formDuration} min</span>
                  </div>
                  <Input
                    id="practice-duration"
                    type="number"
                    min="1"
                    max="600"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    required
                  />
                  <div className="flex items-center gap-2 pt-1">
                    {[15, 30, 45, 60, 90].map((mins) => (
                      <Button
                        key={mins}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`h-7 px-2.5 text-xs ${
                          formDuration === mins
                            ? "bg-purple-100 text-purple-800 border-purple-300 font-semibold dark:bg-purple-950 dark:text-purple-300"
                            : ""
                        }`}
                        onClick={() => setFormDuration(mins)}
                      >
                        +{mins}m
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Piece / Focus title */}
                <div className="space-y-1.5">
                  <Label htmlFor="practice-piece">Piece, Scale, or Course Name *</Label>
                  <Input
                    id="practice-piece"
                    placeholder="e.g. Chopin Nocturne Op. 9 No. 2, C Major Scales"
                    value={formLesson}
                    onChange={(e) => setFormLesson(e.target.value)}
                    required
                  />
                </div>

                {/* Specific Section & Tempo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="practice-section">Section / Bars (Optional)</Label>
                    <Input
                      id="practice-section"
                      placeholder="e.g. Bars 12-24, Left hand"
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="practice-bpm">Achieved Tempo (BPM)</Label>
                    <Input
                      id="practice-bpm"
                      type="number"
                      placeholder="e.g. 108"
                      value={formBpm}
                      onChange={(e) => setFormBpm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-1.5">
                  <Label>Practice Quality</Label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= formRating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">
                      {formRating === 5
                        ? "Exceptional Flow"
                        : formRating === 4
                        ? "Productive"
                        : formRating === 3
                        ? "Steady Progress"
                        : "Challenging"}
                    </span>
                  </div>
                </div>

                {/* Notes & Takeaways */}
                <div className="space-y-1.5">
                  <Label htmlFor="practice-notes">Reflections & Focus for Tomorrow</Label>
                  <Textarea
                    id="practice-notes"
                    placeholder="What felt comfortable? Which transitions need more slow metronome practice tomorrow?"
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLogModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isSubmitting ? "Saving..." : "Save Session"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Live Practice Timer Banner */}
      <Card className="mb-8 border-purple-200 dark:border-purple-900 bg-gradient-to-r from-purple-50/70 via-white to-pink-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Live Practice Stopwatch
                  </span>
                  {isTimerRunning && (
                    <Badge className="bg-emerald-500 text-white animate-pulse text-[10px] px-1.5 py-0 font-medium">
                      ACTIVE
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Time your active instrument practice and log it automatically when finished.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap w-full md:w-auto justify-between md:justify-end">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 dark:text-gray-100 px-3 py-1 bg-white dark:bg-gray-800 border rounded-lg shadow-inner">
                {formatTimerTime(timerSeconds)}
              </div>

              <div className="flex items-center gap-2">
                {!isTimerRunning ? (
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                    onClick={() => setIsTimerRunning(true)}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{timerSeconds > 0 ? "Resume" : "Start Session"}</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-400 text-amber-700 hover:bg-amber-50 dark:text-amber-300 gap-1.5"
                    onClick={() => setIsTimerRunning(false)}
                  >
                    <Pause className="h-3.5 w-3.5 fill-current" />
                    <span>Pause</span>
                  </Button>
                )}

                {timerSeconds > 0 && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                      onClick={() => {
                        setIsTimerRunning(false)
                        setTimerSeconds(0)
                      }}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      onClick={handleFinishTimer}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Finish & Log</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Practice Time
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.totalHours}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalSessions} sessions logged
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.thisWeekHours}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {weeklyProgressPercent}% of {weeklyTargetHours}h goal
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Practice Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.streak} {stats.streak === 1 ? "day" : "days"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Daily habit active!
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Course Progress
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {completedLessons.length} / {lessons.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {inProgressLessons.length} courses in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="practice" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Music className="h-3.5 w-3.5" />
            <span>Practice Log</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PRACTICE LOG */}
        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Practice History & Notes</CardTitle>
                  <CardDescription>
                    Review your pieces, exercises, metronome tempos, and daily practice reflections.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                    onClick={() => {
                      setFormDate(new Date().toISOString().split("T")[0])
                      setIsLogModalOpen(true)
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Entry</span>
                  </Button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t mt-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by piece, technique, or reflection notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {["all", "Piano", "Guitar", "Drums", "Violin", "Voice"].map((inst) => (
                    <Button
                      key={inst}
                      variant="outline"
                      size="sm"
                      className={`h-8 px-3 text-xs capitalize ${
                        filterInstrument === inst
                          ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:text-white"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setFilterInstrument(inst)}
                    >
                      {inst}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl my-4">
                  <Music className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    No Practice Sessions Found
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                    {searchQuery || filterInstrument !== "all"
                      ? "No sessions match your search filters. Try clearing your search."
                      : "Start tracking your musical growth by recording your first practice session today!"}
                  </p>
                  <Button
                    onClick={() => {
                      setFilterInstrument("all")
                      setSearchQuery("")
                      setIsLogModalOpen(true)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Log First Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 border rounded-xl hover:border-purple-200 dark:hover:border-purple-900/60 transition-colors bg-card"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-medium"
                          >
                            {session.instrument}
                          </Badge>
                          <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                            {session.lesson}
                          </h4>
                          {session.bpm && (
                            <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
                              ♩ = {session.bpm} BPM
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= (session.rating || 5)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-200 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold">
                            {session.duration} min
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            title="Delete session"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {session.section && (
                        <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">
                          Focus: {session.section}
                        </p>
                      )}

                      {session.notes && (
                        <p className="text-sm text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg mt-2">
                          "{session.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>{session.date}</span>
                        </div>
                        {Array.isArray(session.techniques) && session.techniques.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {session.techniques.map((t) => (
                              <span
                                key={t}
                                className="bg-gray-100 dark:bg-gray-800 text-[11px] px-2 py-0.5 rounded"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CALENDAR */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Calendar Widget (5 cols) */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    Practice Calendar
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {datesWithPractice.length} active days
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Select any date to inspect logged practice sessions or add an entry.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-2 sm:p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg border shadow-xs"
                />
              </CardContent>
            </Card>

            {/* Selected Date Details & Targets (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Daily Breakdown */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-base sm:text-lg">
                        {selectedDate
                          ? selectedDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Selected Date"}
                      </CardTitle>
                      <CardDescription>
                        {sessionsForSelectedDate.length > 0
                          ? `Total Practice: ${totalMinutesForSelectedDate} minutes across ${sessionsForSelectedDate.length} session(s)`
                          : "No practice recorded on this day"}
                      </CardDescription>
                    </div>

                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                      onClick={() => {
                        if (selectedDateString) {
                          setFormDate(selectedDateString)
                        }
                        setIsLogModalOpen(true)
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Log For This Day</span>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {sessionsForSelectedDate.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <p>You haven't logged any practice for this day.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 text-purple-600 border-purple-200"
                        onClick={() => {
                          if (selectedDateString) setFormDate(selectedDateString)
                          setIsLogModalOpen(true)
                        }}
                      >
                        + Add practice entry for this date
                      </Button>
                    </div>
                  ) : (
                    sessionsForSelectedDate.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 border rounded-lg bg-card/60 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {session.instrument}
                            </Badge>
                            <span className="font-semibold text-sm truncate">
                              {session.lesson}
                            </span>
                            {session.bpm && (
                              <span className="text-xs text-muted-foreground font-mono">
                                ♩={session.bpm}
                              </span>
                            )}
                          </div>
                          {session.section && (
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                              {session.section}
                            </p>
                          )}
                          {session.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              "{session.notes}"
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <Badge className="bg-emerald-100 text-emerald-800 font-semibold">
                            {session.duration}m
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Weekly Practice Goal Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Weekly Practice Target
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Target:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs"
                        onClick={() => setWeeklyTargetHours((prev) => Math.max(1, prev - 1))}
                      >
                        -
                      </Button>
                      <span className="text-xs font-bold">{weeklyTargetHours}h</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs"
                        onClick={() => setWeeklyTargetHours((prev) => prev + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Build consistency with dedicated weekly rehearsal goals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span>
                        {stats.thisWeekHours}h completed ({stats.thisWeekMinutes} mins)
                      </span>
                      <span className="text-purple-600 font-semibold">
                        {weeklyProgressPercent}%
                      </span>
                    </div>
                    <Progress value={weeklyProgressPercent} className="h-2.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-muted/40 rounded-lg text-xs">
                      <span className="text-muted-foreground">Time Remaining:</span>
                      <p className="text-sm font-semibold mt-0.5">
                        {Math.max(0, weeklyTargetHours * 60 - stats.thisWeekMinutes)} mins
                      </p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-lg text-xs">
                      <span className="text-muted-foreground">Current Habit Streak:</span>
                      <p className="text-sm font-semibold mt-0.5 text-amber-600">
                        {stats.streak} consecutive days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Practical Rehearsal Tips */}
              <Card className="border-blue-100 dark:border-blue-950 bg-blue-50/30 dark:bg-blue-950/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Pro-Musician Practice Tip
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        To build muscle memory reliably, isolate troublesome bars and play them 3 times consecutively without error at 70% tempo before clicking the metronome up by 4 BPM.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: LESSONS */}
        <TabsContent value="lessons" className="space-y-8">
          {/* In Progress */}
          {inProgressLessons.length > 0 && (
            <div>
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
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{lesson.progress}%</span>
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
          )}

          {/* Completed */}
          <div>
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

          {/* Available */}
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
        </TabsContent>

        {/* TAB 4: ANALYTICS */}
        <TabsContent value="analytics">
          <FigmaChart />
        </TabsContent>
      </Tabs>
    </div>
  )
}
