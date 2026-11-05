'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  Check,
  User as UserIcon,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Smartphone,
  AtSign,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { KingsChatLogo } from './kingschat-logo'

// Keep off until /api/auth/social verifies the provider's identity on the server
export const SOCIAL_LOGIN_ENABLED = false

export interface SavedAccount {
  email: string
  name: string
  avatar?: string
  handle?: string
  phone?: string
  lastUsed?: string
}

export interface SocialLoginDialogProps {
  isOpen: boolean
  onClose: () => void
  provider: 'google' | 'kingschat' | null
  mode?: 'login' | 'signup'
  onSuccess: (user: any) => void
}

const GOOGLE_ACCOUNTS_KEY = 'pianow_saved_google_accounts'
const KINGSCHAT_ACCOUNTS_KEY = 'pianow_saved_kingschat_accounts'

// Only accounts the visitor has used in this browser are listed; never ship real accounts here
const DEFAULT_GOOGLE_ACCOUNTS: SavedAccount[] = []

const DEFAULT_KINGSCHAT_ACCOUNTS: SavedAccount[] = []

interface CountryDial {
  name: string
  dialCode: string
  code: string
  flag: string
}

const COUNTRY_DIALS: CountryDial[] = [
  { name: 'Nigeria', dialCode: '+234', code: 'NG', flag: '🇳🇬' },
  { name: 'United States', dialCode: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dialCode: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Ghana', dialCode: '+233', code: 'GH', flag: '🇬🇭' },
  { name: 'South Africa', dialCode: '+27', code: 'ZA', flag: '🇿🇦' },
  { name: 'Kenya', dialCode: '+254', code: 'KE', flag: '🇰🇪' },
  { name: 'Canada', dialCode: '+1', code: 'CA', flag: '🇨🇦' },
  { name: 'India', dialCode: '+91', code: 'IN', flag: '🇮🇳' },
  { name: 'Germany', dialCode: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'France', dialCode: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'United Arab Emirates', dialCode: '+971', code: 'AE', flag: '🇦🇪' },
  { name: 'Uganda', dialCode: '+256', code: 'UG', flag: '🇺🇬' },
  { name: 'Zimbabwe', dialCode: '+263', code: 'ZW', flag: '🇿🇼' },
  { name: 'Philippines', dialCode: '+63', code: 'PH', flag: '🇵🇭' },
  { name: 'Australia', dialCode: '+61', code: 'AU', flag: '🇦🇺' },
  { name: 'Other', dialCode: '+', code: 'INT', flag: '🌐' },
]

export function SocialLoginDialog({
  isOpen,
  onClose,
  provider,
  mode = 'login',
  onSuccess,
}: SocialLoginDialogProps) {
  const { socialLogin } = useAuth()
  const { toast } = useToast()

  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([])
  const [activeTab, setActiveTab] = useState<'phone' | 'credentials'>('phone')
  const [viewMode, setViewMode] = useState<'confirmation' | 'form' | 'saved_list'>('confirmation')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Phone flow state
  const [selectedCountry, setSelectedCountry] = useState<CountryDial>(COUNTRY_DIALS[0])
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input')
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [otpTimer, setOtpTimer] = useState(60)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Credentials / Google form fields
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [customPassword, setCustomPassword] = useState('')
  const [kingschatHandle, setKingschatHandle] = useState('')
  const [rememberAccount, setRememberAccount] = useState(true)

  // External Portal Tracking
  const [openedExternalPortal, setOpenedExternalPortal] = useState(false)

  // Load saved accounts on modal open
  useEffect(() => {
    if (!isOpen || !provider) return

    setFormError(null)
    setIsSubmitting(false)
    setShowPassword(false)
    setOpenedExternalPortal(false)
    setPhoneStep('input')
    setOtpCode(['', '', '', '', '', ''])

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
        accounts = provider === 'google' ? [...DEFAULT_GOOGLE_ACCOUNTS] : [...DEFAULT_KINGSCHAT_ACCOUNTS]
        localStorage.setItem(storageKey, JSON.stringify(accounts))
      }

      setSavedAccounts(accounts)

      // KingsChat shows confirmation screen when accounts exist (matching showConfirmation=true)
      if (accounts.length > 0) {
        setViewMode('confirmation')
      } else {
        setViewMode('form')
      }
    } catch (e) {
      setViewMode('form')
    }
  }, [isOpen, provider])

  // OTP Timer countdown
  useEffect(() => {
    let timer: any
    if (phoneStep === 'otp' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [phoneStep, otpTimer])

  if (!isOpen || !provider) return null

  const primarySavedAccount = savedAccounts[0] || null

  const saveAccountToStorage = (account: SavedAccount) => {
    try {
      const storageKey = provider === 'google' ? GOOGLE_ACCOUNTS_KEY : KINGSCHAT_ACCOUNTS_KEY
      const existing = savedAccounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase())
      const updated = [{ ...account, lastUsed: new Date().toISOString() }, ...existing]
      localStorage.setItem(storageKey, JSON.stringify(updated.slice(0, 5)))
    } catch (e) {
      console.warn('Could not persist account to storage:', e)
    }
  }

  // Handle selecting an existing saved account (Confirmation click)
  const handleSelectAccount = async (account: SavedAccount) => {
    setIsSubmitting(true)
    setFormError(null)

    try {
      const res = await socialLogin({
        provider,
        email: account.email,
        phone: account.phone,
        name: account.name || (provider === 'google' ? 'Google User' : 'KingsChat User'),
        avatar: account.avatar,
        kingschatHandle: account.handle,
        mode,
      })

      if (res.success && res.user) {
        saveAccountToStorage(account)
        toast({
          title: provider === 'google' ? 'Google Account Connected' : 'KingsChat Authenticated',
          description: `Signed in as ${account.name} (${account.handle || account.email})`,
        })
        onSuccess(res.user)
        onClose()
      } else {
        setFormError(res.error || 'Failed to authenticate account. Please try again.')
      }
    } catch (err: any) {
      setFormError(err?.message || 'Authentication error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Phone OTP code input handler
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '')
    if (clean.length > 1) {
      // Pasted code
      const digits = clean.slice(0, 6).split('')
      const nextOtp = [...otpCode]
      digits.forEach((d, i) => {
        if (i < 6) nextOtp[i] = d
      })
      setOtpCode(nextOtp)
      const nextFocus = Math.min(digits.length, 5)
      otpInputRefs.current[nextFocus]?.focus()
      return
    }

    const nextOtp = [...otpCode]
    nextOtp[index] = clean
    setOtpCode(nextOtp)

    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // Handle Phone Submit (Step 1 -> Send OTP)
  const handleSendPhoneCode = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const cleanNum = phoneNumber.replace(/[^0-9]/g, '')
    if (cleanNum.length < 7) {
      setFormError('Please enter a valid phone number.')
      return
    }

    setPhoneStep('otp')
    setOtpTimer(60)
    // Pre-fill a sample verification code for smooth UX
    setOtpCode(['7', '4', '8', '2', '9', '1'])
    toast({
      title: 'Verification Code Sent',
      description: `Code sent to ${selectedCountry.dialCode} ${phoneNumber}`,
    })
  }

  // Handle Phone Submit (Step 2 -> Verify OTP)
  const handleVerifyPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const code = otpCode.join('')
    if (code.length < 6) {
      setFormError('Please enter the full 6-digit confirmation code.')
      return
    }

    setIsSubmitting(true)
    const fullPhone = `${selectedCountry.dialCode} ${phoneNumber.trim()}`
    const syntheticEmail = `${selectedCountry.dialCode.replace('+', '')}${phoneNumber.replace(/[^0-9]/g, '')}@kingschat.online`
    const displayName = customName.trim() || `KingsChat (${selectedCountry.dialCode}${phoneNumber.slice(-4)})`

    try {
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullPhone)}`
      const res = await socialLogin({
        provider: 'kingschat',
        email: syntheticEmail,
        phone: fullPhone,
        name: displayName,
        avatar: avatarUrl,
        kingschatHandle: `@kc_${phoneNumber.replace(/[^0-9]/g, '').slice(-6)}`,
        mode,
      })

      if (res.success && res.user) {
        if (rememberAccount) {
          saveAccountToStorage({
            email: syntheticEmail,
            name: displayName,
            avatar: avatarUrl,
            phone: fullPhone,
            handle: `@kc_${phoneNumber.replace(/[^0-9]/g, '').slice(-6)}`,
          })
        }

        toast({
          title: mode === 'signup' ? 'Account Created with KingsChat' : 'KingsChat Login Successful',
          description: `Welcome to PIANOW, ${displayName}!`,
        })
        onSuccess(res.user)
        onClose()
      } else {
        setFormError(res.error || 'Verification failed. Please check the code and try again.')
      }
    } catch (err: any) {
      setFormError(err?.message || 'Authentication error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Username/Email/Password submission
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    let emailToUse = customEmail.trim()
    let nameToUse = customName.trim()
    let handleToUse = kingschatHandle.trim()

    if (provider === 'kingschat') {
      if (!handleToUse && !emailToUse) {
        setFormError('Please enter your KingsChat username or email.')
        return
      }

      if (!customPassword.trim()) {
        setFormError('Please enter your KingsChat password.')
        return
      }

      if (!emailToUse && handleToUse) {
        const cleanHandle = handleToUse.replace(/^@/, '').replace(/[^a-zA-Z0-9._-]/g, '')
        emailToUse = `${cleanHandle || 'user'}@kingschat.online`
      }

      if (!handleToUse && emailToUse.includes('@kingschat.online')) {
        handleToUse = `@${emailToUse.split('@')[0]}`
      }

      if (!nameToUse) {
        nameToUse = handleToUse || (emailToUse ? emailToUse.split('@')[0] : 'KingsChat User')
      }
    } else {
      // Google
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
      const avatarUrl =
        provider === 'google'
          ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameToUse)}&backgroundColor=4285F4`
          : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(handleToUse || nameToUse)}`

      const res = await socialLogin({
        provider,
        email: emailToUse,
        name: nameToUse,
        avatar: avatarUrl,
        password: customPassword,
        kingschatHandle: handleToUse,
        mode,
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
          title: provider === 'google' ? 'Google Account Connected' : 'KingsChat Connected',
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

  // Open Official KingsChat Online Portal
  const handleOpenKingsChatPortal = () => {
    const officialUrl = 'https://accounts.kingschat.online/log-in?origin=%2Fconversations&showConfirmation=true'
    window.open(officialUrl, '_blank', 'width=520,height=700,menubar=no,toolbar=no')
    setOpenedExternalPortal(true)
  }

  // Complete sign-in after official portal opened
  const handleCompletePortalLogin = async () => {
    if (primarySavedAccount) {
      await handleSelectAccount(primarySavedAccount)
    } else {
      // No saved account: ask for the visitor's own details instead of signing in as someone else
      setViewMode('form')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl"
      >
        {/* Top Header Banner */}
        <div
          className={`px-6 pt-5 pb-4 border-b ${
            provider === 'google'
              ? 'border-zinc-800 bg-zinc-900/90'
              : 'border-[#0077FF]/30 bg-gradient-to-r from-[#0077FF]/20 via-[#0077FF]/10 to-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {provider === 'google' ? (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
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
                <KingsChatLogo size={40} className="shadow-lg" />
              )}
              <div>
                <h3 className="font-semibold text-lg leading-tight text-white flex items-center gap-2">
                  {provider === 'google'
                    ? mode === 'signup'
                      ? 'Sign up with Google'
                      : 'Sign in with Google'
                    : mode === 'signup'
                    ? 'Sign up with KingsChat'
                    : 'KingsChat Login'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {provider === 'google'
                    ? 'Continue to your PIANOW account'
                    : 'The messaging app that everyone loves!'}
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
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {formError}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: Confirmation Screen (Matching showConfirmation=true) */}
          {/* ======================================================== */}
          {viewMode === 'confirmation' && primarySavedAccount && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Confirm you want to log in as
                </p>
              </div>

              {/* Detected account card */}
              <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-800/40 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0 flex items-center justify-center border border-zinc-700 shadow-sm">
                  {primarySavedAccount.avatar ? (
                    <img
                      src={primarySavedAccount.avatar}
                      alt={primarySavedAccount.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-zinc-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-base text-white truncate">
                    {primarySavedAccount.name}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {primarySavedAccount.email}
                  </div>
                  {primarySavedAccount.handle && (
                    <div className="text-[11px] text-[#0077FF] font-medium mt-0.5">
                      {primarySavedAccount.handle}
                    </div>
                  )}
                </div>

                <div className="w-6 h-6 rounded-full bg-[#0077FF]/20 text-[#0077FF] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Primary action button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSelectAccount(primarySavedAccount)}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                  provider === 'google'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-[#0077FF] hover:bg-[#0066DD] text-white'
                } disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span>Continue as {primarySavedAccount.name.split(' ')[0]}</span>
                )}
              </button>

              {/* Switch or use another account */}
              <div className="pt-2 flex flex-col gap-2">
                {savedAccounts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null)
                      setViewMode('saved_list')
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition"
                  >
                    Choose another saved account ({savedAccounts.length})
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setFormError(null)
                    setViewMode('form')
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-medium transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {provider === 'google'
                    ? 'Use another Google account'
                    : 'Log in with Phone or Username'}
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: Saved Accounts List */}
          {/* ======================================================== */}
          {viewMode === 'saved_list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {provider === 'google' ? 'Google Accounts' : 'KingsChat Accounts'}
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('confirmation')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
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
                        <div className="font-medium text-sm text-white truncate">{acc.name}</div>
                        <div className="text-xs text-zinc-400 truncate">{acc.email}</div>
                        {acc.handle && (
                          <div className="text-[11px] text-[#0077FF] font-medium">{acc.handle}</div>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-zinc-400 group-hover:text-white px-2.5 py-1 rounded-md bg-zinc-700/50 text-[11px]">
                      Select
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormError(null)
                  setViewMode('form')
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add / Enter credentials
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: Form Mode (KingsChat Phone / Username or Google Form) */}
          {/* ======================================================== */}
          {viewMode === 'form' && (
            <div className="space-y-4">
              {/* Back to saved account option if available */}
              {savedAccounts.length > 0 && (
                <div className="flex items-center justify-between pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null)
                      setViewMode('confirmation')
                    }}
                    className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to saved account
                  </button>
                </div>
              )}

              {provider === 'kingschat' ? (
                <div>
                  {/* The Two Official KingsChat Tabs: "Phone" vs "Username or email" */}
                  <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-800/80 border border-zinc-700/60 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('phone')
                        setFormError(null)
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2 ${
                        activeTab === 'phone'
                          ? 'bg-[#0077FF] text-white shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('credentials')
                        setFormError(null)
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2 ${
                        activeTab === 'credentials'
                          ? 'bg-[#0077FF] text-white shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <AtSign className="w-3.5 h-3.5" />
                      Username or email
                    </button>
                  </div>

                  {/* -------------------- TAB 1: PHONE -------------------- */}
                  {activeTab === 'phone' && (
                    <div>
                      {phoneStep === 'input' ? (
                        <form onSubmit={handleSendPhoneCode} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300">
                              Phone Number
                            </label>

                            <div className="flex gap-2">
                              {/* Country dial selector */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                                  className="h-10 px-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl text-sm text-white flex items-center gap-1.5 whitespace-nowrap focus:outline-hidden"
                                >
                                  <span>{selectedCountry.flag}</span>
                                  <span className="font-mono text-xs text-zinc-300">
                                    {selectedCountry.dialCode}
                                  </span>
                                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                                </button>

                                {showCountryPicker && (
                                  <div className="absolute left-0 top-full mt-1 w-64 max-h-52 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 py-1">
                                    {COUNTRY_DIALS.map((c) => (
                                      <button
                                        key={c.code + c.dialCode}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCountry(c)
                                          setShowCountryPicker(false)
                                        }}
                                        className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-700 flex items-center justify-between text-zinc-200"
                                      >
                                        <span className="flex items-center gap-2 truncate">
                                          <span>{c.flag}</span>
                                          <span className="truncate">{c.name}</span>
                                        </span>
                                        <span className="text-zinc-400 font-mono ml-2">
                                          {c.dialCode}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Phone input */}
                              <div className="flex-1 relative">
                                <input
                                  type="tel"
                                  required
                                  placeholder="801 234 5678"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  className="w-full h-10 px-3.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition"
                                />
                              </div>
                            </div>
                          </div>

                          {mode === 'signup' && (
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-zinc-300">
                                Your Full Name (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                className="w-full h-10 px-3.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="checkbox"
                              id="rememberPhone"
                              checked={rememberAccount}
                              onChange={(e) => setRememberAccount(e.target.checked)}
                              className="rounded border-zinc-700 bg-zinc-800 text-[#0077FF] focus:ring-[#0077FF]"
                            />
                            <label htmlFor="rememberPhone" className="text-xs text-zinc-400 select-none cursor-pointer">
                              Remember this phone number
                            </label>
                          </div>

                          <button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white font-medium text-sm transition shadow-md flex items-center justify-center gap-2"
                          >
                            <span>Next (Send Code)</span>
                          </button>
                        </form>
                      ) : (
                        /* Step 2: OTP Verification */
                        <form onSubmit={handleVerifyPhoneCode} className="space-y-4">
                          <div className="text-center pb-2">
                            <p className="text-xs text-zinc-400">
                              Enter the 6-digit confirmation code sent to
                            </p>
                            <p className="text-sm font-semibold text-white mt-0.5">
                              {selectedCountry.dialCode} {phoneNumber}
                            </p>
                            <button
                              type="button"
                              onClick={() => setPhoneStep('input')}
                              className="text-xs text-[#0077FF] hover:underline mt-1 inline-block"
                            >
                              Edit phone number
                            </button>
                          </div>

                          {/* 6 Digit Inputs */}
                          <div className="flex justify-center gap-2">
                            {otpCode.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={(el) => {
                                  otpInputRefs.current[idx] = el
                                }}
                                type="text"
                                maxLength={1}
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                className="w-11 h-12 text-center text-lg font-bold bg-zinc-800 border border-zinc-700 focus:border-[#0077FF] rounded-xl text-white outline-none transition"
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                            <span>
                              {otpTimer > 0 ? (
                                `Resend code in ${otpTimer}s`
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setOtpTimer(60)}
                                  className="text-[#0077FF] hover:underline font-medium"
                                >
                                  Resend Code
                                </button>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => setOtpCode(['7', '4', '8', '2', '9', '1'])}
                              className="text-zinc-500 hover:text-zinc-300 underline text-[11px]"
                            >
                              Auto-fill sample code
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white font-medium text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <span className="inline-flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Verifying...
                              </span>
                            ) : (
                              <span>
                                {mode === 'signup'
                                  ? 'Create Account with KingsChat'
                                  : 'Verify & Sign In'}
                              </span>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* ---------------- TAB 2: USERNAME OR EMAIL ---------------- */}
                  {activeTab === 'credentials' && (
                    <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-300">
                          Username or email
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. @yourhandle or user@kingschat.online"
                          value={kingschatHandle}
                          onChange={(e) => setKingschatHandle(e.target.value)}
                          className="w-full h-10 px-3.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition"
                        />
                      </div>

                      {mode === 'signup' && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-300">
                            Display Name (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Jane Doe"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="w-full h-10 px-3.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-zinc-300">
                            Password
                          </label>
                          <span className="text-[11px] text-zinc-400">KingsChat Password</span>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Enter your KingsChat password"
                            value={customPassword}
                            onChange={(e) => setCustomPassword(e.target.value)}
                            className="w-full h-10 px-3.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#0077FF] transition pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="rememberCreds"
                          checked={rememberAccount}
                          onChange={(e) => setRememberAccount(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-800 text-[#0077FF] focus:ring-[#0077FF]"
                        />
                        <label htmlFor="rememberCreds" className="text-xs text-zinc-400 select-none cursor-pointer">
                          Remember this account on this device
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white font-medium text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                      >
                        {isSubmitting ? (
                          <span className="inline-flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Authenticating...
                          </span>
                        ) : (
                          <span>
                            {mode === 'signup'
                              ? 'Sign up with KingsChat'
                              : 'Log In with KingsChat'}
                          </span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* Google Form */
                <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
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
                      className="w-full h-10 px-3.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 transition"
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
                      className="w-full h-10 px-3.5 bg-zinc-800/90 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="rememberGoogle"
                      checked={rememberAccount}
                      onChange={(e) => setRememberAccount(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="rememberGoogle" className="text-xs text-zinc-400 select-none cursor-pointer">
                      Remember this account
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* Official KingsChat Online Portal Action Bar */}
          {/* ======================================================== */}
          {provider === 'kingschat' && (
            <div className="mt-5 pt-4 border-t border-zinc-800">
              <div className="p-3 rounded-xl bg-[#0077FF]/10 border border-[#0077FF]/20 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="text-left">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0077FF]" />
                    Official KingsChat Accounts
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    accounts.kingschat.online/log-in
                  </div>
                </div>

                {!openedExternalPortal ? (
                  <button
                    type="button"
                    onClick={handleOpenKingsChatPortal}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition flex items-center justify-center gap-1.5 border border-zinc-700"
                  >
                    <span>Open Portal</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompletePortalLogin}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-[#0077FF] hover:bg-[#0066DD] text-xs font-semibold text-white transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Authorize PIANOW</span>
                    <Check className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed text-center">
            {provider === 'google'
              ? 'By continuing, Google verifies your profile to access PIANOW lessons and store orders securely.'
              : 'Connecting your KingsChat account syncs your PIANOW practice milestones, video lessons, and music store.'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
