"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

// External logos (public CDNs so preview works right away)
const GoogleLogo =
  "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";
const KingsChatLogo =
  "https://play-lh.googleusercontent.com/rERFj6fHlrj93K58onejR8j_e_SggeWwn0J85XqLUXgP6iNp70clI_UALyO72eVcVG97=w240-h480";

const pianoKeys = Array.from({ length: 21 }).map((_, i) => ({
  id: i,
  isSharp: [1, 3, 6, 8, 10, 13, 15, 18, 20].includes(i % 12),
  note: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][i % 12],
}));

const floatingNotes = Array.from({ length: 10 }).map((_, i) => ({ id: i }));

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signup, isLoading, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect to home page if user is already authenticated
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, isLoading });
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to home page');
      window.location.href = '/';
    }
  }, [isAuthenticated])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      setLoading(false);
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      })
      setLoading(false);
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      })
      setLoading(false);
      return
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive"
      })
      setLoading(false);
      return
    }

    console.log('Attempting signup with:', { name, email });
    const result = await signup(name, email, password)
    console.log('Signup result:', result);
    
    if (result.success) {
      console.log('Signup successful, redirecting to home page');
      toast({
        title: "Account Created",
        description: "Welcome to PIANOW! Your account has been created successfully.",
      })
      // Redirect to home page after successful signup
      setTimeout(() => {
        console.log('Attempting redirect to home page');
        window.location.href = '/';
      }, 1000); // Small delay to show the toast
    } else {
      console.log('Signup failed:', result.error);
      toast({
        title: "Signup Failed",
        description: result.error || "Unable to create account. Please try again.",
        variant: "destructive"
      })
    }
    
    setLoading(false);
  }

  const handleSocialLogin = async (provider: 'google' | 'kingschat') => {
    try {
      if (provider === 'google') {
        toast({
          title: "Google Signup",
          description: "Google authentication would open here. For demo, creating account with mock data.",
        })
        
        const success = await signup('Google User', 'google.user@gmail.com', 'google_user')
        if (success) {
          toast({
            title: "Google Signup Successful",
            description: "Welcome to PIANOW!",
          })
          window.location.href = '/';
        }
      } else if (provider === 'kingschat') {
        toast({
          title: "King's Chat Signup",
          description: "King's Chat authentication would open here. For demo, creating account with mock data.",
        })
        
        const success = await signup('Kings Chat User', 'kingschat.user@kingschat.com', 'kingschat_user')
        if (success) {
          toast({
            title: "King's Chat Signup Successful",
            description: "Welcome to PIANOW!",
          })
          window.location.href = '/';
        }
      }
    } catch (error) {
      toast({
        title: "Social Signup Failed",
        description: `Unable to create account with ${provider}. Please try again.`,
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
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Create Account
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Join Pianow and start your musical journey today.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your full name"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@music.com"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/70">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="accent-purple-500 rounded" 
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="underline hover:text-white">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-white">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || isLoading}
                className="w-full mt-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg hover:scale-[1.01] transform transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-white/70">or continue with</div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-3 bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={GoogleLogo} alt="Google" className="w-6 h-6" />
                <span className="text-white/90 text-sm font-medium">Google</span>
              </button>
              <button 
                onClick={() => handleSocialLogin('kingschat')}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-3 bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={KingsChatLogo} alt="Kings Chat" className="w-6 h-6" />
                <span className="text-white/90 text-sm font-medium">Kings Chat</span>
              </button>
            </div>

            <p className="mt-6 text-sm text-white/60">
              Already have an account? <Link href="/auth/login" className="underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Piano keyboard at bottom */}
      <div className="absolute left-0 right-0 bottom-0 z-10 flex justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-6 py-6">
          <div className="relative h-48 md:h-64 transform-gpu translate-y-8">
            <div className="absolute left-0 right-0 bottom-0 flex items-end justify-center gap-0">
              <div
                className="relative flex gap-0 items-end"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(15deg) rotateY(-5deg)",
                }}
              >
                {pianoKeys.map((k, index) => (
                  <div key={k.id} className="relative">
                    {!k.isSharp && (
                      <motion.div
                        whileHover={{ 
                          y: -12,
                          scale: 1.02,
                          boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{
                          width: '2rem',
                          height: '9rem',
                          borderRadius: '0 0 0.5rem 0.5rem',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
                          border: '2px solid #d1d5db',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                          margin: '0 0.5px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Key reflection */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg" />
                        {/* Key label */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 opacity-60">
                          {k.note}
                        </div>
                      </motion.div>
                    )}
                    {k.isSharp && (
                      <motion.div
                        whileHover={{ 
                          y: -15,
                          scale: 1.05,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{
                          position: 'absolute',
                          top: '-3rem',
                          left: '0.75rem',
                          width: '1.25rem',
                          height: '7rem',
                          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
                          border: '2px solid #374151',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                          borderRadius: '0 0 0.375rem 0.375rem',
                          overflow: 'hidden',
                          zIndex: 10
                        }}
                      >
                        {/* Sharp key reflection */}
                        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-gray-400/30 to-transparent rounded-t-md" />
                        {/* Sharp key label */}
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-300 opacity-70">
                          {k.note}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}