'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, User as UserIcon, Plus, Eye, EyeOff, Lock, Mail, Smartphone, AtSign } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'

interface SavedAccount {
  email: string
  name: string
  avatar?: string
  handle?: string
  lastUsed?: string
}

interface SocialLoginDialogProps {
  isOpen: boolean
  onClose: () => void
  provider: 'google' | 'kingschat' | null
  onSuccess: (user: any) => void
}

const GOOGLE_ACCOUNTS_KEY = 'pianow_saved_google_accounts'
const KINGSCHAT_ACCOUNTS_KEY = 'pianow_saved_kingschat_accounts'

// Default starter accounts so the user has authentic accounts to pick immediately
const DEFAULT_GOOGLE_ACCOUNTS: SavedAccount[] = [
  {
    email: 'kyomyayishe328@gmail.com',
    name: 'Kyo Myay Ishe',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kyo+Myay+Ishe&backgroundColor=4285F4',
  },
]

const DEFAULT_KINGSCHAT_ACCOUNTS: SavedAccount[] = [
  {
    email: 'kyomyayishe@kingschat.online',
    handle: '@kyomyayishe',
    name: 'Kyo Myay Ishe',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kyomyayishe',
  },
]

export function SocialLoginDialog({
  isOpen,
  onClose,
  provider,
  onSuccess,
}: SocialLoginDialogProps) {
  const { socialLogin } = useAuth()
  const { toast } = useToast()

  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'custom'>('list')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Custom Form fields
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [customPassword, setCustomPassword] = useState('')
  const [kingschatHandle, setKingschatHandle] = useState('')
  const [rememberAccount, setRememberAccount] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)

  // Load saved accounts on modal open
  useEffect(() => {
    if (!isOpen || !provider) return

    setFormError(null)
    setIsSubmitting(false)
    setShowPassword(false)

    try {
      const storageKey = provider === 'google' ? GOOGLE_ACCOUNTS_KEY : KINGSCHAT_ACCOUNTS_KEY
      const stored = localStorage.getItem(storageKey)
      let accounts: SavedAccount[] = []

      if (stored) {
        try {
          accounts = JSON.parse(stored)
        } catch (e) {
          accounts = []
        }
      }

      if (accounts.length === 0) {
        // Pre-populate with defaults
        accounts = provider === 'google' ? [...DEFAULT_GOOGLE_ACCOUNTS] : [...DEFAULT_KINGSCHAT_ACCOUNTS]
        localStorage.setItem(storageKey, JSON.stringify(accounts))
      }

      setSavedAccounts(accounts)
      // If we have accounts, start in 'list' mode, otherwise go straight to 'custom' input
      setViewMode(accounts.length > 0 ? 'list' : 'custom')
    } catch (e) {
      setViewMode('custom')
    }
  }, [isOpen, provider])

  if (!isOpen || !provider) return null

  const saveAccountToStorage = (account: SavedAccount) => {
    try {
      const storageKey = provider === 'google' ? GOOGLE_ACCOUNTS_KEY : KINGSCHAT_ACCOUNTS_KEY
      const existing = savedAccounts.filter(a => a.email.toLowerCase() !== account.email.toLowerCase())
      const updated = [{ ...account, lastUsed: new Date().toISOString() }, ...existing]
      localStorage.setItem(storageKey, JSON.stringify(updated.slice(0, 5)))
    } catch (e) {
      console.warn('Could not persist account to storage:', e)
    }
  }

  // Handle selecting an existing saved account
  const handleSelectAccount = async (account: SavedAccount) => {
    setIsSubmitting(true)
    setFormError(null)

    try {
      const res = await socialLogin({
        provider,
        email: account.email,
        name: account.name || (provider === 'google' ? 'Google User' : 'KingsChat User'),
        avatar: account.avatar,
        kingschatHandle: account.handle,
      })

      if (res.success && res.user) {
        saveAccountToStorage(account)
        toast({
          title: provider === 'google' ? 'Google Account Connected' : 'King\'s Chat Connected',
          description: `Signed in as ${account.email}`,
        })
        onSuccess(res.user)
        onClose()
      } else {
        setFormError(res.error || 'Failed to sign in. Please try again.')
      }
    } catch (err: any) {
      setFormError(err?.message || 'Authentication error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle custom account credentials submission
  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    let emailToUse = customEmail.trim()
    let nameToUse = customName.trim()
    let handleToUse = kingschatHandle.trim()

    if (provider === 'kingschat') {
      // Allow entering handle or phone or email
      if (!handleToUse && !emailToUse) {
        setFormError('Please enter your King\'s Chat username, phone number, or email.')
        return
      }

      if (!customPassword.trim()) {
        setFormError('Please enter your King\'s Chat password.')
        return
      }

      if (!emailToUse && handleToUse) {
        // Derive valid email if user entered handle or phone
        const cleanHandle = handleToUse.replace(/^@/, '')
        emailToUse = `${cleanHandle.replace(/[^a-zA-Z0-9._-]/g, '')}@kingschat.online`
      }

      if (!nameToUse) {
        nameToUse = handleToUse || 'KingsChat User'
      }
    } else {
      // Google Provider
      if (!emailToUse) {
        setFormError('Please enter your Google email address.')
        return
      }

      if (!emailToUse.includes('@')) {
        emailToUse = `${emailToUse}@gmail.com`
      }

      if (!nameToUse) {
        const prefix = emailToUse.split('@')[0]
        nameToUse = prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[._]/g, ' ')
      }
    }

    setIsSubmitting(true)

    try {
      const avatarUrl = provider === 'google'
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameToUse)}&backgroundColor=4285F4`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(handleToUse || nameToUse)}`

      const res = await socialLogin({
        provider,
        email: emailToUse,
        name: nameToUse,
        avatar: avatarUrl,
        password: customPassword,
        kingschatHandle: handleToUse,
      })

      if (res.success && res.user) {
        if (rememberAccount) {
          saveAccountToStorage({
            email: emailToUse,
            name: nameToUse,
            avatar: avatarUrl,
            handle: handleToUse,
          })
        }

        toast({
          title: provider === 'google' ? 'Google Sign-In Successful' : 'King\'s Chat Connected',
          description: `Welcome to PIANOW, ${nameToUse}!`,
        })
        onSuccess(res.user)
        onClose()
      } else {
        setFormError(res.error || 'Authentication failed. Please verify your credentials.')
      }
    } catch (err: any) {
      setFormError(err?.message || 'Authentication error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl"
      >
        {/* Top Header Banner */}
        <div className={`px-6 pt-6 pb-4 border-b ${
          provider === 'google'
            ? 'border-zinc-800 bg-zinc-900/90'
            : 'border-[#0077FF]/30 bg-[#0077FF]/10'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {provider === 'google' ? (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs">
                  <svg width="22" height="22" viewBox="0 0 24 24">
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
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#0077FF] flex items-center justify-center text-white shadow-xs">
                  <span className="text-xl font-bold tracking-tight">K</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {provider === 'google' ? 'Sign in with Google' : 'King\'s Chat Login'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {provider === 'google'
                    ? 'Choose an account to continue to PIANOW'
                    : 'Enter your credentials to connect with PIANOW'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {formError}
            </div>
          )}

          {/* VIEW: List of Accounts */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                {provider === 'google' ? 'Select Google Account' : 'Connected King\'s Chat Accounts'}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {savedAccounts.map((acc, index) => (
                  <button
                    key={index}
                    disabled={isSubmitting}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/90 hover:border-zinc-700 transition text-left group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0 flex items-center justify-center">
                        {acc.avatar ? (
                          <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-zinc-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-white truncate">
                          {acc.name}
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {acc.email}
                        </div>
                        {acc.handle && (
                          <div className="text-[11px] text-[#0077FF] font-medium">
                            {acc.handle}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-zinc-400 group-hover:text-white px-2 py-1 rounded bg-zinc-700/50 text-[11px]">
                      Select
                    </span>
                  </button>
                ))}
              </div>

              {/* Button to use another account */}
              <button
                type="button"
                onClick={() => {
                  setFormError(null)
                  setViewMode('custom')
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-medium transition"
              >
                <Plus className="w-4 h-4" />
                {provider === 'google'
                  ? 'Use another Google account'
                  : 'Use another King\'s Chat account or credentials'}
              </button>
            </div>
          )}

          {/* VIEW: Custom Credentials Form */}
          {viewMode === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {provider === 'google' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                      Full Name (as on your Google Profile)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                        Password (Optional / Verification)
                      </span>
                      <span className="text-[11px] text-zinc-500">Security Check</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password or leave blank for instant SSO"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* King's Chat Form */
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      <AtSign className="w-3.5 h-3.5 text-[#0077FF]" />
                      King&apos;s Chat Username, Email, or Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. @pastor_john or user@kingschat.online"
                      value={kingschatHandle}
                      onChange={(e) => {
                        setKingschatHandle(e.target.value)
                        if (e.target.value.includes('@') && e.target.value.includes('.')) {
                          setCustomEmail(e.target.value)
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#0077FF]" />
                      King&apos;s Chat Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your King's Chat password"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                      Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Brother John"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="rememberAccount"
                  type="checkbox"
                  checked={rememberAccount}
                  onChange={(e) => setRememberAccount(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-0 w-4 h-4 accent-blue-500"
                />
                <label htmlFor="rememberAccount" className="text-xs text-zinc-400 select-none cursor-pointer">
                  Remember this account on this device
                </label>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {savedAccounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null)
                      setViewMode('list')
                    }}
                    className="py-2.5 px-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition"
                  >
                    Back to Accounts
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition shadow-md flex items-center justify-center gap-2 ${
                    provider === 'google'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-[#0077FF] hover:bg-[#0066DD] text-white'
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    provider === 'google' ? 'Sign in with Google' : 'Connect King\'s Chat'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 leading-relaxed">
            {provider === 'google'
              ? 'By continuing, Google will securely verify your profile to log in to PIANOW. Your email and preferences will be securely synchronized.'
              : 'By signing in, you authenticate through King\'s Chat to access your PIANOW practice sessions, courses, and instrument orders.'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
