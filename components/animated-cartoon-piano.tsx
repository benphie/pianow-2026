"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Volume2, VolumeX, Sparkles, Music, Play, Pause } from "lucide-react"

interface NoteDef {
  note: string
  label: string
  freq: number
  isBlack?: boolean
  color: string
  activeBg: string
  keyShortcut: string
}

const PIANO_NOTES: NoteDef[] = [
  { note: "C4", label: "Do", freq: 261.63, color: "#FF6B6B", activeBg: "from-rose-400 to-red-500", keyShortcut: "A" },
  { note: "C#4", label: "C#", freq: 277.18, isBlack: true, color: "#A855F7", activeBg: "from-purple-500 to-indigo-700", keyShortcut: "W" },
  { note: "D4", label: "Re", freq: 293.66, color: "#FF9F43", activeBg: "from-amber-400 to-orange-500", keyShortcut: "S" },
  { note: "D#4", label: "D#", freq: 311.13, isBlack: true, color: "#EC4899", activeBg: "from-pink-500 to-rose-700", keyShortcut: "E" },
  { note: "E4", label: "Mi", freq: 329.63, color: "#FECA57", activeBg: "from-yellow-300 to-amber-400", keyShortcut: "D" },
  { note: "F4", label: "Fa", freq: 349.23, color: "#1DD1A1", activeBg: "from-emerald-400 to-teal-500", keyShortcut: "F" },
  { note: "F#4", label: "F#", freq: 369.99, isBlack: true, color: "#06B6D4", activeBg: "from-cyan-500 to-blue-700", keyShortcut: "T" },
  { note: "G4", label: "Sol", freq: 392.00, color: "#48DBFB", activeBg: "from-sky-400 to-blue-500", keyShortcut: "G" },
  { note: "G#4", label: "G#", freq: 415.30, isBlack: true, color: "#8B5CF6", activeBg: "from-violet-500 to-purple-800", keyShortcut: "Y" },
  { note: "A4", label: "La", freq: 440.00, color: "#5F27CD", activeBg: "from-violet-400 to-indigo-500", keyShortcut: "H" },
  { note: "A#4", label: "A#", freq: 466.16, isBlack: true, color: "#F43F5E", activeBg: "from-rose-500 to-pink-800", keyShortcut: "U" },
  { note: "B4", label: "Ti", freq: 493.88, color: "#FF9FF3", activeBg: "from-pink-400 to-fuchsia-500", keyShortcut: "J" },
  { note: "C5", label: "Do+", freq: 523.25, color: "#54A0FF", activeBg: "from-blue-400 to-indigo-500", keyShortcut: "K" },
]

const MELODIES: Record<string, { name: string; sequence: string[]; tempo: number }> = {
  ode: {
    name: "Ode to Joy",
    sequence: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"],
    tempo: 380,
  },
  boogie: {
    name: "Cartoon Groove",
    sequence: ["C4", "E4", "G4", "A4", "A#4", "A4", "G4", "E4", "F4", "A4", "C5", "A4", "G4", "F4", "E4", "D4"],
    tempo: 310,
  },
  twinkle: {
    name: "Starlight Bounce",
    sequence: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
    tempo: 420,
  },
}

interface FloatingParticle {
  id: number
  note: string
  symbol: string
  color: string
  xPercent: number
}

const SYMBOLS = ["♪", "♫", "♬", "♩", "✨", "🎵"]

export function AnimatedCartoonPianoHero() {
  const [activeNotes, setActiveNotes] = useState<string[]>([])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [selectedMelody, setSelectedMelody] = useState<keyof typeof MELODIES>("boogie")
  const [particles, setParticles] = useState<FloatingParticle[]>([])
  const [eyeLook, setEyeLook] = useState({ x: 0, y: 0 })

  const audioCtxRef = useRef<AudioContext | null>(null)
  const stepRef = useRef(0)
  const particleIdRef = useRef(0)

  const playSynthTone = useCallback(
    (freq: number) => {
      if (!soundEnabled) return
      try {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          audioCtxRef.current = new AudioCtx()
        }
        const ctx = audioCtxRef.current
        if (ctx.state === "suspended") {
          ctx.resume()
        }

        const osc = ctx.createOscillator()
        const subOsc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "triangle"
        subOsc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        subOsc.frequency.setValueAtTime(freq * 2, ctx.currentTime)

        gain.gain.setValueAtTime(0.001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65)

        const subGain = ctx.createGain()
        subGain.gain.setValueAtTime(0.06, ctx.currentTime)
        subGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3)

        osc.connect(gain)
        subOsc.connect(subGain)
        subGain.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        subOsc.start()
        osc.stop(ctx.currentTime + 0.68)
        subOsc.stop(ctx.currentTime + 0.35)
      } catch {
        // Ignore audio context restrictions if not yet interacted
      }
    },
    [soundEnabled]
  )

  const triggerNote = useCallback(
    (noteObj: NoteDef, noteIndex: number) => {
      setActiveNotes((prev) => (prev.includes(noteObj.note) ? prev : [...prev, noteObj.note]))
      playSynthTone(noteObj.freq)

      // Move cartoon eyes toward the played key
      const normalizedX = ((noteIndex / (PIANO_NOTES.length - 1)) - 0.5) * 10
      setEyeLook({ x: normalizedX, y: 3 })

      // Spawn cartoon floating music note particle
      const nextId = ++particleIdRef.current
      const symbol = SYMBOLS[nextId % SYMBOLS.length]
      const xPercent = 10 + (noteIndex / (PIANO_NOTES.length - 1)) * 80

      setParticles((prev) => [
        ...prev.slice(-10),
        {
          id: nextId,
          note: noteObj.label,
          symbol,
          color: noteObj.color,
          xPercent,
        },
      ])

      setTimeout(() => {
        setActiveNotes((prev) => prev.filter((n) => n !== noteObj.note))
      }, 240)
    },
    [playSynthTone]
  )

  // Auto-play cartoon animation loop
  useEffect(() => {
    if (!isAutoPlaying) return

    const currentMelody = MELODIES[selectedMelody]
    const interval = setInterval(() => {
      const seq = currentMelody.sequence
      const targetNoteName = seq[stepRef.current % seq.length]
      stepRef.current += 1

      const idx = PIANO_NOTES.findIndex((n) => n.note === targetNoteName)
      if (idx !== -1) {
        triggerNote(PIANO_NOTES[idx], idx)
      }
    }, currentMelody.tempo)

    return () => clearInterval(interval)
  }, [isAutoPlaying, selectedMelody, triggerNote])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return
      const key = e.key.toUpperCase()
      const idx = PIANO_NOTES.findIndex((n) => n.keyShortcut === key)
      if (idx !== -1) {
        setIsAutoPlaying(false)
        triggerNote(PIANO_NOTES[idx], idx)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [triggerNote])

  const whiteKeys = PIANO_NOTES.filter((n) => !n.isBlack)

  // Map black key positions relative to 8 white keys
  const blackKeyPositions: { noteObj: NoteDef; leftPercent: number; globalIndex: number }[] = [
    { noteObj: PIANO_NOTES[1], leftPercent: 9.2, globalIndex: 1 },
    { noteObj: PIANO_NOTES[3], leftPercent: 21.8, globalIndex: 3 },
    { noteObj: PIANO_NOTES[6], leftPercent: 46.8, globalIndex: 6 },
    { noteObj: PIANO_NOTES[8], leftPercent: 59.3, globalIndex: 8 },
    { noteObj: PIANO_NOTES[10], leftPercent: 71.8, globalIndex: 10 },
  ]

  return (
    <div className="relative select-none w-full max-w-xl mx-auto">
      {/* Ambient Cartoon Glow Backdrop */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-amber-300/30 via-fuchsia-400/30 to-cyan-300/30 rounded-[2.5rem] blur-xl pointer-events-none" />

      {/* Floating Cartoon Music Notes Stage */}
      <div className="relative h-20 w-full overflow-visible pointer-events-none z-20 -mb-4">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40, scale: 0.4, rotate: -15 }}
              animate={{ opacity: 1, y: -32, scale: 1.15, rotate: 12 }}
              exit={{ opacity: 0, y: -65, scale: 0.6 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              style={{ left: `${p.xPercent}%` }}
              className="absolute bottom-0 -translate-x-1/2 flex items-center gap-1"
            >
              <span
                style={{ backgroundColor: p.color }}
                className="px-2.5 py-1 rounded-full text-slate-950 font-black text-sm shadow-[0_4px_0_#1e1b4b] border-2 border-indigo-950 flex items-center gap-1"
              >
                <span>{p.symbol}</span>
                <span className="text-xs">{p.note}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Cartoon Piano Body Shell */}
      <motion.div
        animate={{
          y: activeNotes.length > 0 ? [0, -3, 0] : [0, -2, 0],
        }}
        transition={{
          duration: activeNotes.length > 0 ? 0.22 : 2.5,
          repeat: activeNotes.length > 0 ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="relative bg-gradient-to-b from-amber-400 via-orange-400 to-rose-500 p-4 sm:p-6 rounded-[2.25rem] border-4 border-indigo-950 shadow-[0_14px_0_#1e1b4b,0_24px_40px_rgba(0,0,0,0.4)]"
      >
        {/* Top Glossy Cartoon Highlight */}
        <div className="absolute top-2.5 left-8 right-8 h-3 bg-white/35 rounded-full pointer-events-none" />

        {/* Cartoon Character Face & Control Dashboard Header */}
        <div className="bg-indigo-950 rounded-2xl p-3.5 mb-4 border-2 border-indigo-900 shadow-inner flex flex-wrap items-center justify-between gap-3">
          {/* Expressive Cartoon Eyes + Equalizer Mouth */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-indigo-900/90 px-3 py-1.5 rounded-xl border-2 border-indigo-800">
              {/* Left Eye */}
              <div className="w-7 h-7 rounded-full bg-white border-2 border-indigo-950 flex items-center justify-center overflow-hidden relative">
                <motion.div
                  animate={{ x: eyeLook.x, y: eyeLook.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="w-3.5 h-3.5 rounded-full bg-indigo-950 relative"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                </motion.div>
              </div>
              {/* Right Eye */}
              <div className="w-7 h-7 rounded-full bg-white border-2 border-indigo-950 flex items-center justify-center overflow-hidden relative">
                <motion.div
                  animate={{ x: eyeLook.x, y: eyeLook.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="w-3.5 h-3.5 rounded-full bg-indigo-950 relative"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                </motion.div>
              </div>
              {/* Bouncing Soundwave Bars */}
              <div className="flex items-end gap-1 h-5 ml-1">
                {[0, 1, 2, 3, 4].map((bar) => (
                  <motion.span
                    key={bar}
                    animate={{
                      height:
                        activeNotes.length > 0
                          ? ["35%", "100%", "45%", "90%", "35%"][(bar + stepRef.current) % 5]
                          : "30%",
                    }}
                    transition={{ duration: 0.18 }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-emerald-400 to-yellow-300"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                PiaBot Jam
              </div>
              <div className="text-[11px] text-purple-200 font-medium">
                Click keys or press A-K!
              </div>
            </div>
          </div>

          {/* Interactive Controls: Auto-Play & Sound */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border-2 border-indigo-950 shadow-[0_3px_0_#0f172a] active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                isAutoPlaying
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? "Auto Jam" : "Paused"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const nextState = !soundEnabled
                setSoundEnabled(nextState)
                if (nextState) {
                  // Play a cheerful welcome blip when enabling sound
                  setTimeout(() => {
                    triggerNote(PIANO_NOTES[0], 0)
                  }, 50)
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border-2 border-indigo-950 shadow-[0_3px_0_#0f172a] active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                soundEnabled
                  ? "bg-yellow-300 text-slate-950 hover:bg-yellow-200"
                  : "bg-indigo-800 text-indigo-100 hover:bg-indigo-700"
              }`}
              title={soundEnabled ? "Mute Piano Sound" : "Enable Piano Sound"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
            </button>
          </div>
        </div>

        {/* Melody Selector Tabs */}
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(Object.keys(MELODIES) as Array<keyof typeof MELODIES>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedMelody(key)
                  stepRef.current = 0
                  setIsAutoPlaying(true)
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border-2 border-indigo-950 transition-all ${
                  selectedMelody === key
                    ? "bg-white text-indigo-950 shadow-[0_3px_0_#1e1b4b] -translate-y-0.5"
                    : "bg-amber-200/80 text-indigo-950 hover:bg-white/90"
                }`}
              >
                🎵 {MELODIES[key].name}
              </button>
            ))}
          </div>
        </div>

        {/* Cartoon Red Velvet Felt Strip */}
        <div className="h-2.5 bg-rose-700 rounded-t-xl border-x-4 border-t-4 border-indigo-950" />

        {/* Piano Keyboard Bed */}
        <div className="relative bg-indigo-950 p-2 pt-0 rounded-b-2xl border-4 border-t-0 border-indigo-950 shadow-inner">
          {/* White Keys Row */}
          <div className="grid grid-cols-8 gap-1.5 relative z-10">
            {whiteKeys.map((keyObj) => {
              const isActive = activeNotes.includes(keyObj.note)
              const globalIdx = PIANO_NOTES.findIndex((n) => n.note === keyObj.note)

              return (
                <motion.button
                  key={keyObj.note}
                  type="button"
                  whileTap={{ scaleY: 0.95, y: 6 }}
                  animate={
                    isActive
                      ? {
                          y: 7,
                          scaleX: 1.03,
                          scaleY: 0.96,
                        }
                      : {
                          y: 0,
                          scaleX: 1,
                          scaleY: 1,
                        }
                  }
                  transition={{ type: "spring", stiffness: 550, damping: 22 }}
                  onMouseDown={() => {
                    setIsAutoPlaying(false)
                    triggerNote(keyObj, globalIdx)
                  }}
                  onMouseEnter={(e) => {
                    if (e.buttons === 1) {
                      triggerNote(keyObj, globalIdx)
                    }
                  }}
                  style={{ transformOrigin: "top center" }}
                  className={`relative h-44 sm:h-52 rounded-b-2xl border-3 border-indigo-950 flex flex-col items-center justify-end pb-3 transition-colors cursor-pointer select-none ${
                    isActive
                      ? `bg-gradient-to-b ${keyObj.activeBg} text-white shadow-[0_2px_0_#1e1b4b]`
                      : "bg-gradient-to-b from-white via-slate-50 to-amber-50/90 text-indigo-950 shadow-[0_9px_0_#cbd5e1,0_12px_0_#1e1b4b] hover:from-amber-50 hover:to-white"
                  }`}
                >
                  {/* Cute Cartoon Smiling Face on Active Key */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="mb-auto mt-6 flex flex-col items-center"
                      >
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-950" />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-950" />
                        </div>
                        <div className="w-3 h-1.5 border-b-2 border-indigo-950 rounded-full mt-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Color Note Dot */}
                  <span
                    style={{ backgroundColor: keyObj.color }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-indigo-950 flex items-center justify-center text-[10px] sm:text-xs font-black text-slate-950 shadow-sm mb-1.5 transition-transform ${
                      isActive ? "scale-125 bg-white" : ""
                    }`}
                  >
                    {keyObj.label}
                  </span>

                  {/* Keyboard Shortcut Hint */}
                  <span className="text-[10px] font-bold opacity-60 hidden sm:inline">
                    {keyObj.keyShortcut}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Black Keys Overlay */}
          <div className="absolute top-0 left-2 right-2 h-28 sm:h-32 pointer-events-none z-20">
            {blackKeyPositions.map(({ noteObj, leftPercent, globalIndex }) => {
              const isActive = activeNotes.includes(noteObj.note)
              return (
                <motion.button
                  key={noteObj.note}
                  type="button"
                  whileTap={{ scaleY: 0.94, y: 5 }}
                  animate={
                    isActive
                      ? { y: 6, scaleX: 1.06, scaleY: 0.95 }
                      : { y: 0, scaleX: 1, scaleY: 1 }
                  }
                  transition={{ type: "spring", stiffness: 550, damping: 22 }}
                  onMouseDown={() => {
                    setIsAutoPlaying(false)
                    triggerNote(noteObj, globalIndex)
                  }}
                  style={{
                    left: `${leftPercent}%`,
                    transformOrigin: "top center",
                  }}
                  className={`pointer-events-auto absolute top-0 w-[8.5%] h-full rounded-b-xl border-3 border-indigo-950 flex flex-col items-center justify-end pb-2.5 cursor-pointer select-none ${
                    isActive
                      ? `bg-gradient-to-b ${noteObj.activeBg} shadow-[0_2px_0_#0f172a]`
                      : "bg-gradient-to-b from-slate-800 via-indigo-950 to-slate-950 shadow-[0_7px_0_#090d16] hover:from-indigo-900 hover:to-slate-900"
                  }`}
                >
                  {/* Glossy Cartoon Highlight on Black Key */}
                  <div className="w-1.5 h-10 bg-white/20 rounded-full absolute top-2 left-1.5 pointer-events-none" />
                  <span
                    style={{ backgroundColor: noteObj.color }}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/80 text-[9px] font-black text-slate-950 flex items-center justify-center"
                  >
                    ♯
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function AnimatedCartoonPianoStrip() {
  const [activeIdx, setActiveIdx] = useState<number>(0)

  const miniKeys = [
    { label: "Do", color: "bg-rose-400", note: "♪" },
    { label: "Re", color: "bg-amber-400", note: "♫" },
    { label: "Mi", color: "bg-yellow-300", note: "♬" },
    { label: "Fa", color: "bg-emerald-400", note: "♩" },
    { label: "Sol", color: "bg-sky-400", note: "♪" },
    { label: "La", color: "bg-violet-400", note: "♫" },
    { label: "Ti", color: "bg-pink-400", note: "♬" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % miniKeys.length)
    }, 450)
    return () => clearInterval(timer)
  }, [miniKeys.length])

  return (
    <div className="mt-8 max-w-md mx-auto">
      <div className="bg-indigo-950/90 backdrop-blur-md p-3.5 rounded-2xl border-3 border-indigo-900 shadow-[0_8px_0_#1e1b4b] flex items-center justify-center gap-4 text-left">
        {/* Mini Bouncing Cartoon Keys */}
        <div className="flex items-end gap-1.5 bg-indigo-900/80 p-2 rounded-xl border-2 border-indigo-800">
          {miniKeys.map((k, idx) => {
            const isBouncing = idx === activeIdx
            return (
              <motion.button
                key={k.label}
                type="button"
                onClick={() => setActiveIdx(idx)}
                animate={
                  isBouncing
                    ? { y: [0, 5, 0], scaleY: [1, 0.9, 1] }
                    : { y: 0, scaleY: 1 }
                }
                transition={{ duration: 0.3 }}
                className={`w-6 h-12 rounded-b-lg border-2 border-indigo-950 flex flex-col items-center justify-end pb-1 cursor-pointer transition-colors ${
                  isBouncing
                    ? `${k.color} text-slate-950 shadow-[0_1px_0_#0f172a]`
                    : "bg-white text-indigo-950 shadow-[0_4px_0_#94a3b8]"
                }`}
              >
                <span className="text-[9px] font-black">{k.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Animated Cartoon Status Copy */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs uppercase tracking-wide">
            <Music className="w-3.5 h-3.5 animate-bounce" />
            <span>Interactive Rhythm</span>
          </div>
          <p className="text-xs text-purple-100 font-medium mt-0.5 leading-snug">
            Tap the cartoon keys to jam along with real-time musical notes!
          </p>
        </div>
      </div>
    </div>
  )
}
