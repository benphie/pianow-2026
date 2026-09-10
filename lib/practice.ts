// Practice Session and Practice Studio Utilities
export interface PracticeSessionItem {
  id: string
  date: string // YYYY-MM-DD
  duration: number // minutes
  instrument: string
  lesson: string // Piece / Lesson title
  section?: string // e.g. "Measures 12-24, left hand"
  bpm?: number // Tempo achieved
  targetBpm?: number
  techniques?: string[] // e.g. ["Scales", "Arpeggios", "Sight-reading", "Pedaling"]
  notes?: string
  rating?: number // 1 - 5 stars
  createdAt?: string
}

export interface PracticeGoal {
  id: string
  title: string
  targetMinutesPerWeek: number
  targetDaysPerWeek: number
}

const PRACTICE_STORAGE_KEY = "pianow_practice_sessions"

export const DEFAULT_PRACTICE_SESSIONS: PracticeSessionItem[] = [
  {
    id: "ps-1",
    date: new Date().toISOString().split("T")[0],
    duration: 45,
    instrument: "Piano",
    lesson: "Scales & Arpeggios (C Major & A Minor)",
    section: "Full 4-octave runs, hands together",
    bpm: 104,
    targetBpm: 120,
    techniques: ["Scales", "Arpeggios", "Technique Warm-up"],
    notes: "Maintained even finger weight. Left hand thumb tuck felt smoother at 104 BPM.",
    rating: 5,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "ps-2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    duration: 60,
    instrument: "Piano",
    lesson: "Chopin Prelude in E Minor (Op. 28 No. 4)",
    section: "Measures 1 - 12 (Rubato & Voicing)",
    bpm: 66,
    targetBpm: 72,
    techniques: ["Repertoire", "Dynamics & Voicing", "Pedal Control"],
    notes: "Focused on sustaining left hand chords softly while bringing out the top melody note.",
    rating: 4,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "ps-3",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0], // 2 days ago
    duration: 35,
    instrument: "Piano",
    lesson: "Bach Two-Part Invention No. 4 in D Minor",
    section: "Bars 1 - 18 hands separately then together",
    bpm: 88,
    targetBpm: 100,
    techniques: ["Counterpoint", "Sight Reading", "Finger Independence"],
    notes: "Strict articulation on sixteenth notes. Need to drill bars 14-16 with metronome tomorrow.",
    rating: 4,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "ps-4",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0], // 3 days ago
    duration: 50,
    instrument: "Piano",
    lesson: "Hanon Virtuoso Pianist Exercises 1-4",
    section: "Speed building with rhythmic variations",
    bpm: 112,
    targetBpm: 120,
    techniques: ["Technique Warm-up", "Finger Strength"],
    notes: "Dotted rhythm practice helped overcome tension in 4th and 5th fingers.",
    rating: 5,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
]

export function getStoredPracticeSessions(): PracticeSessionItem[] {
  if (typeof window === "undefined") return DEFAULT_PRACTICE_SESSIONS
  try {
    const raw = localStorage.getItem(PRACTICE_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(DEFAULT_PRACTICE_SESSIONS))
      return DEFAULT_PRACTICE_SESSIONS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return DEFAULT_PRACTICE_SESSIONS
  } catch (e) {
    return DEFAULT_PRACTICE_SESSIONS
  }
}

export function savePracticeSessions(sessions: PracticeSessionItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(sessions))
    window.dispatchEvent(new CustomEvent("pianow_practice_updated", { detail: sessions }))
  } catch (e) {
    console.error("Failed to save practice sessions", e)
  }
}

export function addPracticeSession(
  session: Omit<PracticeSessionItem, "id" | "createdAt">
): PracticeSessionItem[] {
  const current = getStoredPracticeSessions()
  const newSession: PracticeSessionItem = {
    ...session,
    id: `ps-${Date.now()}`,
    createdAt: new Date().toISOString()
  }
  const updated = [newSession, ...current]
  savePracticeSessions(updated)
  return updated
}

export function deletePracticeSession(id: string): PracticeSessionItem[] {
  const current = getStoredPracticeSessions()
  const updated = current.filter(s => s.id !== id)
  savePracticeSessions(updated)
  return updated
}

export function calculatePracticeStats(sessions: PracticeSessionItem[]) {
  const totalMinutes = sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0)

  // Current week (starting Monday)
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7 // Monday = 0
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek)
  monday.setHours(0, 0, 0, 0)

  const thisWeekSessions = sessions.filter(s => {
    const d = new Date(s.date + "T00:00:00")
    return d >= monday
  })
  const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0)

  // Calculate practice streak (consecutive days with at least one session up to today/yesterday)
  const uniqueDates = Array.from(new Set(sessions.map(s => s.date))).sort().reverse()
  let streak = 0
  const todayStr = new Date().toISOString().split("T")[0]
  const yesterdayDate = new Date(Date.now() - 86400000)
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0]

  let checkDate = uniqueDates.includes(todayStr) ? new Date() : (uniqueDates.includes(yesterdayStr) ? yesterdayDate : null)

  if (checkDate) {
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0]
      if (uniqueDates.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  return {
    totalMinutes,
    totalHours: (totalMinutes / 60).toFixed(1),
    thisWeekMinutes,
    thisWeekHours: (thisWeekMinutes / 60).toFixed(1),
    streak: Math.max(streak, 1),
    totalSessions: sessions.length
  }
}
