"use client"

import { useRef, useState } from "react"

interface PianoKey {
  name: string
  spokenName: string
  frequency: number
}

// One octave up from middle C. The white keys carry their tonic sol-fa names.
const WHITE_KEYS: (PianoKey & { solfa: string; note: string })[] = [
  { solfa: "Do", note: "C4", frequency: 261.63 },
  { solfa: "Re", note: "D4", frequency: 293.66 },
  { solfa: "Mi", note: "E4", frequency: 329.63 },
  { solfa: "Fa", note: "F4", frequency: 349.23 },
  { solfa: "Sol", note: "G4", frequency: 392.0 },
  { solfa: "La", note: "A4", frequency: 440.0 },
  { solfa: "Ti", note: "B4", frequency: 493.88 },
  { solfa: "Do", note: "C5", frequency: 523.25 },
].map(key => ({ ...key, name: `${key.solfa} (${key.note})`, spokenName: `${key.solfa} (${key.note})` }))

// Each black key sits on the line after white key number `after`
const BLACK_KEYS: (PianoKey & { after: number })[] = [
  { after: 0, name: "C♯4", spokenName: "C sharp 4", frequency: 277.18 },
  { after: 1, name: "D♯4", spokenName: "D sharp 4", frequency: 311.13 },
  { after: 3, name: "F♯4", spokenName: "F sharp 4", frequency: 369.99 },
  { after: 4, name: "G♯4", spokenName: "G sharp 4", frequency: 415.3 },
  { after: 5, name: "A♯4", spokenName: "A sharp 4", frequency: 466.16 },
]

const WHITE_KEY_WIDTH = 100 / WHITE_KEYS.length

export function TryTheKeys() {
  const audio = useRef<AudioContext | null>(null)
  const [pressed, setPressed] = useState<string | null>(null)
  const [lastPlayed, setLastPlayed] = useState<string | null>(null)

  function play(key: PianoKey) {
    const AudioContextClass =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    audio.current ??= new AudioContextClass()
    const context = audio.current
    if (context.state === "suspended") void context.resume()

    const start = context.currentTime
    const volume = context.createGain()
    volume.gain.setValueAtTime(0.0001, start)
    volume.gain.exponentialRampToValueAtTime(0.3, start + 0.01)
    volume.gain.exponentialRampToValueAtTime(0.0001, start + 1.6)
    volume.connect(context.destination)

    // The note plus a quieter octave above gives a soft, piano-like tone
    for (const [multiple, level] of [[1, 1], [2, 0.25]]) {
      const tone = context.createOscillator()
      const toneVolume = context.createGain()
      tone.type = "triangle"
      tone.frequency.value = key.frequency * multiple
      toneVolume.gain.value = level
      tone.connect(toneVolume).connect(volume)
      tone.start(start)
      tone.stop(start + 1.7)
    }

    setPressed(key.name)
    setLastPlayed(key.name)
    window.setTimeout(() => setPressed(current => (current === key.name ? null : current)), 250)
  }

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold-400"

  return (
    <div>
      <div className="relative h-44 select-none overflow-hidden rounded-md border-t-4 border-gold-400 bg-purple-950 sm:h-56">
        <div className="flex h-full">
          {WHITE_KEYS.map(key => (
            <button
              key={key.note}
              type="button"
              aria-label={`Play ${key.spokenName}`}
              onClick={() => play(key)}
              className={`flex flex-1 flex-col items-center justify-end border-r border-purple-950/25 pb-3 text-purple-950 transition-colors duration-100 last:border-r-0 ${
                pressed === key.name ? "bg-gold-200" : "bg-[#FFFEFA] hover:bg-purple-50"
              } ${focusRing}`}
            >
              <span className="text-sm font-semibold sm:text-base">{key.solfa}</span>
              <span className="text-xs text-purple-700">{key.note}</span>
            </button>
          ))}
        </div>

        {BLACK_KEYS.map(key => (
          <button
            key={key.name}
            type="button"
            aria-label={`Play ${key.spokenName}`}
            onClick={() => play(key)}
            style={{ left: `${(key.after + 1) * WHITE_KEY_WIDTH}%`, width: `${WHITE_KEY_WIDTH * 0.6}%` }}
            className={`absolute top-0 h-[58%] -translate-x-1/2 rounded-b-md transition-colors duration-100 ${
              pressed === key.name ? "bg-gold-400" : "bg-purple-950 hover:bg-purple-900"
            } ${focusRing}`}
          />
        ))}
      </div>

      <p aria-live="polite" className="mt-4 min-h-6 text-gold-300">
        {lastPlayed ? `That was ${lastPlayed}.` : "Tap a key to hear it."}
      </p>
    </div>
  )
}
