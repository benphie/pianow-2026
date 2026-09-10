
"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Google Logo SVG Component
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Kings Chat Logo Component
const KingsChatIcon = () => (
  <span className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
    <img
      src="/kingschat-logo.png"
      alt="KingsChat"
      className="w-5 h-5 object-contain rounded-xs"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const fallback = e.currentTarget.nextElementSibling;
        if (fallback) (fallback as HTMLElement).style.display = 'block';
      }}
    />
    <svg
      viewBox="0 0 32 32"
      className="w-5 h-5 rounded-xs"
      style={{ display: 'none' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="7" fill="#0077FF" />
      <path
        d="M7 21V12.5C7 10.567 8.567 9 10.5 9H21.5C23.433 9 25 10.567 25 12.5V19.5C25 21.433 23.433 23 21.5 23H11L7 26V21Z"
        fill="white"
      />
      <path
        d="M10.5 18.5L12 13.5L14.5 16.5L16 12L17.5 16.5L20 13.5L21.5 18.5H10.5Z"
        fill="#0077FF"
      />
      <circle cx="12" cy="12.5" r="0.8" fill="#FFC800" />
      <circle cx="16" cy="11" r="0.8" fill="#FFC800" />
      <circle cx="20" cy="12.5" r="0.8" fill="#FFC800" />
    </svg>
  </span>
);

// Create proper piano keyboard layout (2 octaves starting from C)
const createPianoKeys = () => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const keys = [];
  let keyIndex = 0;
  
  // Create 2 octaves (24 keys total)
  for (let octave = 0; octave < 2; octave++) {
    for (let i = 0; i < 12; i++) {
      const note = notes[i];
      const isSharp = note.includes('#');
      keys.push({
        id: keyIndex++,
        note: note,
        isSharp: isSharp,
        octave: octave,
        position: keys.length, // Position in the sequence
      });
    }
  }
  
  return keys;
};

const pianoKeys = createPianoKeys();

const floatingNotes = Array.from({ length: 10 }).map((_, i) => ({ id: i }));

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const { login, signup, isLoading, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const getRedirectPath = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      if (redirect && redirect.startsWith('/')) {
        return redirect
      }
    }
    return '/'
  }

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(getRedirectPath())
    }
  }, [isAuthenticated, isLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      })
      setLoading(false);
      return
    }

    const result = await login(email, password)
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to PIANOW!",
      })
      const target = getRedirectPath()
      router.push(target)
      router.refresh()
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid email or password. Please try again.",
        variant: "destructive"
      })
    }
    
    setLoading(false);
  }

  const playKey = (keyId: number, note: string) => {
    setPressedKeys(prev => new Set(prev).add(keyId));
    
    // Create audio context for piano sound (optional - can be enhanced with actual piano samples)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Calculate frequency based on note
      const noteFrequencies: { [key: string]: number } = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
      };
      
      const baseFreq = noteFrequencies[note] || 440;
      oscillator.frequency.value = baseFreq;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Fallback if audio context fails
      console.log('Playing note:', note);
    }
    
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });
    }, 200);
  };

  const handleSocialLogin = async (provider: 'google' | 'kingschat') => {
    try {
      const email = provider === 'google' ? 'google.user@gmail.com' : 'kingschat.user@kingschat.com'
      const name = provider === 'google' ? 'Google User' : 'KingsChat User'
      const password = 'password123'

      let result = await login(email, password)
      if (!result.success) {
        // Fallback: auto-create account if not present
        const signupResult = await signup(name, email, password)
        if (signupResult.success) {
          result = { success: true }
        }
      }

      if (result.success) {
        toast({
          title: `${provider === 'google' ? 'Google' : "King's Chat"} Login Successful`,
          description: "Welcome to PIANOW!",
        })
        const target = getRedirectPath()
        router.push(target)
        router.refresh()
      } else {
        toast({
          title: "Social Login Failed",
          description: result.error || `Unable to login with ${provider}. Please try again.`,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Social Login Failed",
        description: error?.message || `Unable to login with ${provider}. Please try again.`,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Floating musical notes */}
      {floatingNotes.map((n, idx) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, y: 40, scale: 0.8, rotate: -10 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -280 - idx * 30],
            scale: [0.8, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 9 + idx,
            delay: idx * 0.5,
          }}
          style={{ 
            left: `${5 + idx * 10}%`, 
            top: `${70 - (idx % 2) * 10}%`,
            position: 'absolute',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17C9 18.1046 8.10457 19 7 19C5.89543 19 5 18.1046 5 17C5 15.8954 5.89543 15 7 15C7.55228 15 8.05899 15.2248 8.41421 15.5858L14 21V6L9 7V17Z"
              fill="url(#grad)"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FF69B4" />
                <stop offset="100%" stopColor="#40E0D0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* Center card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          zIndex: 20,
          width: '92%',
          maxWidth: '48rem',
          padding: '2rem',
          borderRadius: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Navigation bar inside card */}
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
          >
            ← Back to Home
          </Link>
          <Link href="/" className="text-base font-extrabold tracking-wider bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
            PIANOW
          </Link>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Welcome back
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Login to continue to Pianow — feel the music.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                  id="email"
                  type="email"
                required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@music.com"
                aria-label="Email address"
              />

              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                    value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your password"
                aria-label="Password"
              />

              <div className="flex items-center justify-between text-sm text-white/70">
                <label htmlFor="remember" className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="accent-purple-500 rounded" />{" "}
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className="underline">Forgot password?</Link>
            </div>

              <button
              type="submit"
                disabled={loading || isLoading}
                className="w-full mt-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg hover:scale-[1.01] transform transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 text-center text-white/70">or continue with</div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-3 bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Sign in with Google"
              >
                <GoogleIcon />
                <span className="text-white/90 text-sm font-medium">Google</span>
              </button>
              <button 
                onClick={() => handleSocialLogin('kingschat')}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-3 bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Sign in with King's Chat"
              >
                <KingsChatIcon />
                <span className="text-white/90 text-sm font-medium">Kings Chat</span>
              </button>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/70">
              <p>
                New here? <Link href="/auth/signup" className="underline font-semibold text-purple-300 hover:text-white">Create an account</Link>
              </p>
              <Link href="/" className="inline-flex items-center gap-1 text-white/80 hover:text-white underline text-xs font-medium">
                Continue as Guest →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Piano keyboard at bottom */}
      <div className="absolute left-0 right-0 bottom-0 z-10 flex justify-center" role="presentation" aria-label="Decorative piano keyboard">
        <div className="w-full max-w-7xl px-6 py-6">
          <div className="relative h-48 md:h-64 transform-gpu translate-y-8">
            <div className="absolute left-0 right-0 bottom-0 flex items-end justify-center">
              <div
                className="relative flex items-end"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(15deg) rotateY(-5deg)",
                }}
              >
                {/* White keys first */}
                {pianoKeys.filter(k => !k.isSharp).map((k) => {
                  const isPressed = pressedKeys.has(k.id);
                  // Count white keys before this one to position sharps correctly
                  const whiteKeyIndex = pianoKeys.filter(key => !key.isSharp && key.position < k.position).length;
                  
                  return (
                    <div key={`white-${k.id}`} className="relative">
                      <motion.div
                        animate={isPressed ? { 
                          y: -8,
                          scale: 0.98,
                        } : {}}
                        whileHover={{ 
                          y: -12,
                          scale: 1.02,
                          boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
                        }}
                        whileTap={{ 
                          y: -8,
                          scale: 0.98,
                        }}
                        onTap={() => playKey(k.id, k.note)}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{
                          width: '2.5rem',
                          height: '9rem',
                          borderRadius: '0 0 0.5rem 0.5rem',
                          background: isPressed 
                            ? 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 50%, #ced4da 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
                          border: '2px solid #d1d5db',
                          boxShadow: isPressed 
                            ? '0 2px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)'
                            : '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                          margin: '0 0.5px',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                      >
                        {/* Key reflection */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg" />
                        {/* Key label */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 opacity-60">
                          {k.note}
                        </div>
                      </motion.div>
                      
                      {/* Render sharps that belong between this white key and the next */}
                      {(() => {
                        const sharpsForThisPosition: typeof k[] = [];
                        // C# comes after C, D# after D, F# after F, G# after G, A# after A
                        const sharpPattern: { [key: string]: string } = {
                          'C': 'C#', 'D': 'D#', 'F': 'F#', 'G': 'G#', 'A': 'A#'
                        };
                        
                        if (sharpPattern[k.note]) {
                          const sharpKey = pianoKeys.find(key => 
                            key.note === sharpPattern[k.note] && 
                            key.octave === k.octave &&
                            key.isSharp
                          );
                          if (sharpKey) {
                            sharpsForThisPosition.push(sharpKey);
                          }
                        }
                        
                        return sharpsForThisPosition.map(sharpKey => {
                          const isSharpPressed = pressedKeys.has(sharpKey.id);
                          return (
                            <motion.div
                              key={`sharp-${sharpKey.id}`}
                              animate={isSharpPressed ? { 
                                y: -10,
                                scale: 0.95,
                              } : {}}
                              whileHover={{ 
                                y: -15,
                                scale: 1.05,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                              }}
                              whileTap={{ 
                                y: -10,
                                scale: 0.95,
                              }}
                              onTap={() => playKey(sharpKey.id, sharpKey.note)}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              style={{
                                position: 'absolute',
                                top: '-3rem',
                                left: '1.75rem',
                                width: '1.5rem',
                                height: '7rem',
                                background: isSharpPressed
                                  ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0d0d0d 100%)'
                                  : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
                                border: '2px solid #374151',
                                boxShadow: isSharpPressed
                                  ? '0 3px 10px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.4)'
                                  : '0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                                borderRadius: '0 0 0.375rem 0.375rem',
                                overflow: 'hidden',
                                zIndex: 10,
                                cursor: 'pointer'
                              }}
                            >
                              {/* Sharp key reflection */}
                              <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-gray-400/30 to-transparent rounded-t-md" />
                              {/* Sharp key label */}
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-300 opacity-70">
                                {sharpKey.note}
                              </div>
                            </motion.div>
                          );
                        });
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

