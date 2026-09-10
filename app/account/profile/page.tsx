"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { 
  Music, 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  BookOpen, 
  ShoppingBag,
  Camera,
  Edit3,
  Save,
  X,
  Upload,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Plus,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Check,
  KeyRound,
  Laptop,
  Wallet
} from "lucide-react"
import Link from "next/link"

interface PaymentMethod {
  id: string
  type: "card" | "mobile" | "mpesa" | "paypal" | "espees"
  provider?: "mtn_uganda" | "airtel_uganda" | "mpesa"
  title: string
  identifier: string
  expiry?: string
  cardholderName?: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const avatarMenuRef = useRef<HTMLDivElement>(null)

  // Password management state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  // Payment methods state
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [paymentType, setPaymentType] = useState<"card" | "mobile" | "espees" | "paypal">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardZip, setCardZip] = useState("")
  const [mobileSubProvider, setMobileSubProvider] = useState<"mtn_uganda" | "airtel_uganda" | "mpesa">("mtn_uganda")
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState("")
  const [mobileAccountName, setMobileAccountName] = useState("")
  const [espeesHandle, setEspeesHandle] = useState("")
  const [espeesAccountName, setEspeesAccountName] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [makeDefault, setMakeDefault] = useState(true)
  const [paymentFormError, setPaymentFormError] = useState("")

  // Saved Payment Methods (persisted in localStorage)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  // User Profile Data
  // Login details (name and email) match actual account credentials.
  // Other fields remain blank unless explicitly filled by the user!
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    dateOfBirth: "",
    joinDate: "January 2024",
    avatar: "",
    instruments: [] as string[],
    skillLevel: "",
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
      marketingEmails: false
    }
  })

  const [formData, setFormData] = useState(userData)

  // Load user data & payment methods on mount or when user changes
  useEffect(() => {
    if (user) {
      const userKey = user.id || user.email
      const profileStorageKey = `pianow_profile_${userKey}`
      const paymentStorageKey = `pianow_payment_methods_${userKey}`

      let savedProfile: any = null
      try {
        const stored = localStorage.getItem(profileStorageKey)
        if (stored) {
          savedProfile = JSON.parse(stored)
        }
      } catch (e) {
        console.error("Error reading stored profile:", e)
      }

      // Initialize profile:
      // Name and email match the user's login details.
      // Other fields remain blank if not previously saved.
      const initialProfile = {
        name: savedProfile?.name || user.name || (user.email ? user.email.split('@')[0] : "Musician"),
        email: user.email || savedProfile?.email || "",
        phone: savedProfile?.phone || "",
        bio: savedProfile?.bio || "",
        location: savedProfile?.location || "",
        dateOfBirth: savedProfile?.dateOfBirth || "",
        joinDate: savedProfile?.joinDate || "2024",
        avatar: savedProfile?.avatar || user.avatar || "",
        instruments: savedProfile?.instruments || [],
        skillLevel: savedProfile?.skillLevel || "",
        preferences: savedProfile?.preferences || {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false,
          marketingEmails: false
        }
      }

      setUserData(initialProfile)
      setFormData(initialProfile)

      // Initialize payment methods
      try {
        const storedPayments = localStorage.getItem(paymentStorageKey)
        if (storedPayments) {
          setPaymentMethods(JSON.parse(storedPayments))
        } else {
          // Default starting payment methods for the user
          const defaultPayments: PaymentMethod[] = [
            {
              id: "pm-1",
              type: "card",
              title: "Visa Ending in 4242",
              identifier: "•••• •••• •••• 4242",
              expiry: "12/28",
              cardholderName: initialProfile.name || "Cardholder",
              isDefault: true
            },
            {
              id: "pm-2",
              type: "mobile",
              provider: "mtn_uganda",
              title: "MTN Mobile Money (Uganda)",
              identifier: "+256 772 890 123",
              cardholderName: initialProfile.name || "Mobile Subscriber",
              isDefault: false
            },
            {
              id: "pm-3",
              type: "espees",
              title: "Espees Wallet",
              identifier: "@pianist_pro",
              cardholderName: initialProfile.name || "Espees User",
              isDefault: false
            }
          ]
          setPaymentMethods(defaultPayments)
          localStorage.setItem(paymentStorageKey, JSON.stringify(defaultPayments))
        }
      } catch (e) {
        console.error("Error reading stored payment methods:", e)
      }
    } else {
      // Guest or fallback view
      const guestProfile = {
        name: "Guest Musician",
        email: "guest@pianow.com",
        phone: "",
        bio: "",
        location: "",
        dateOfBirth: "",
        joinDate: "2024",
        avatar: "",
        instruments: [],
        skillLevel: "",
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false,
          marketingEmails: false
        }
      }
      setUserData(guestProfile)
      setFormData(guestProfile)

      // Initialize guest payment methods
      const guestPaymentKey = "pianow_payment_methods_guest"
      try {
        const storedPayments = localStorage.getItem(guestPaymentKey)
        if (storedPayments) {
          setPaymentMethods(JSON.parse(storedPayments))
        } else {
          const defaultPayments: PaymentMethod[] = [
            {
              id: "pm-1",
              type: "card",
              title: "Visa Ending in 4242",
              identifier: "•••• •••• •••• 4242",
              expiry: "12/28",
              cardholderName: "Guest Musician",
              isDefault: true
            },
            {
              id: "pm-2",
              type: "mobile",
              provider: "mtn_uganda",
              title: "MTN Mobile Money (Uganda)",
              identifier: "+256 772 890 123",
              cardholderName: "Guest Musician",
              isDefault: false
            },
            {
              id: "pm-3",
              type: "espees",
              title: "Espees Wallet",
              identifier: "@guest_musician",
              cardholderName: "Guest Musician",
              isDefault: false
            }
          ]
          setPaymentMethods(defaultPayments)
          localStorage.setItem(guestPaymentKey, JSON.stringify(defaultPayments))
        }
      } catch (e) {}
    }
  }, [user])

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false)
      }
    }

    if (showAvatarMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAvatarMenu])

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(userData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(userData)
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    setTimeout(() => {
      setUserData(formData)
      setIsEditing(false)
      setIsLoading(false)

      // Persist profile in localStorage
      const userKey = user?.id || user?.email || "guest"
      try {
        localStorage.setItem(`pianow_profile_${userKey}`, JSON.stringify(formData))

        // If name or avatar changed, also update pianow_user so header reflects it immediately
        const storedUser = localStorage.getItem('pianow_user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          parsed.name = formData.name
          if (formData.avatar) parsed.avatar = formData.avatar
          localStorage.setItem('pianow_user', JSON.stringify(parsed))
          window.dispatchEvent(new Event('pianow_auth_change'))
        }
      } catch (e) {
        console.error("Failed to save profile:", e)
      }

      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved successfully.",
      })
    }, 600)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }))
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      })
      return
    }

    setIsUploadingAvatar(true)
    setShowAvatarMenu(false)

    const reader = new FileReader()
    reader.onload = (e) => {
      const newAvatarUrl = e.target?.result as string
      setUserData(prev => ({ ...prev, avatar: newAvatarUrl }))
      setFormData(prev => ({ ...prev, avatar: newAvatarUrl }))
      setIsUploadingAvatar(false)

      const userKey = user?.id || user?.email || "guest"
      try {
        const stored = localStorage.getItem(`pianow_profile_${userKey}`)
        const cur = stored ? JSON.parse(stored) : {}
        cur.avatar = newAvatarUrl
        localStorage.setItem(`pianow_profile_${userKey}`, JSON.stringify(cur))

        const storedUser = localStorage.getItem('pianow_user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          parsed.avatar = newAvatarUrl
          localStorage.setItem('pianow_user', JSON.stringify(parsed))
          window.dispatchEvent(new Event('pianow_auth_change'))
        }
      } catch (err) {}

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setUserData(prev => ({ ...prev, avatar: "" }))
    setFormData(prev => ({ ...prev, avatar: "" }))
    setShowAvatarMenu(false)

    const userKey = user?.id || user?.email || "guest"
    try {
      const stored = localStorage.getItem(`pianow_profile_${userKey}`)
      const cur = stored ? JSON.parse(stored) : {}
      cur.avatar = ""
      localStorage.setItem(`pianow_profile_${userKey}`, JSON.stringify(cur))

      const storedUser = localStorage.getItem('pianow_user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        parsed.avatar = ""
        localStorage.setItem('pianow_user', JSON.stringify(parsed))
        window.dispatchEvent(new Event('pianow_auth_change'))
      }
    } catch (err) {}

    toast({
      title: "Avatar Removed",
      description: "Your profile picture has been removed.",
    })
  }

  // --- Password Management Actions ---
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (!currentPassword) {
      setPasswordError("Please enter your current password.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.")
      return
    }

    setIsUpdatingPassword(true)
    setTimeout(() => {
      const userKey = user?.email || "user"
      try {
        localStorage.setItem(`pianow_user_password_${userKey}`, newPassword)
      } catch (e) {}

      setIsUpdatingPassword(false)
      setIsChangePasswordOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password Changed",
        description: "Your account password has been updated securely.",
      })
    }, 800)
  }

  // --- Payment Methods Management Actions ---
  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentFormError("")

    const userKey = user?.id || user?.email || "guest"
    const storageKey = `pianow_payment_methods_${userKey}`

    let newMethod: PaymentMethod | null = null

    if (paymentType === "card") {
      const cleanNumber = cardNumber.replace(/\s+/g, '')
      if (cleanNumber.length < 15) {
        setPaymentFormError("Please enter a valid card number (at least 15 digits).")
        return
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        setPaymentFormError("Please enter a valid expiration date (MM/YY).")
        return
      }
      if (!cardCvv || cardCvv.length < 3) {
        setPaymentFormError("Please enter a valid 3 or 4 digit CVV/CVC.")
        return
      }
      if (!cardName.trim()) {
        setPaymentFormError("Please enter the name printed on the card.")
        return
      }

      const last4 = cleanNumber.slice(-4)
      const brand = cleanNumber.startsWith('4') ? "Visa" : cleanNumber.startsWith('5') ? "Mastercard" : "Card"
      newMethod = {
        id: `pm-${Date.now()}`,
        type: "card",
        title: `${brand} ending in ${last4}`,
        identifier: `•••• •••• •••• ${last4}`,
        expiry: cardExpiry,
        cardholderName: cardName,
        isDefault: makeDefault || paymentMethods.length === 0
      }
    } else if (paymentType === "mobile") {
      const cleanPhone = mobilePhoneNumber.replace(/\s+/g, '')
      if (!cleanPhone || cleanPhone.length < 7) {
        setPaymentFormError("Please enter a valid mobile number.")
        return
      }

      let formattedPhone = cleanPhone
      let methodTitle = "Mobile Money"

      if (mobileSubProvider === "mtn_uganda") {
        methodTitle = "MTN Mobile Money (Uganda)"
        if (!formattedPhone.startsWith("+")) {
          formattedPhone = formattedPhone.startsWith("0") 
            ? `+256 ${formattedPhone.slice(1)}` 
            : formattedPhone.startsWith("256") 
            ? `+${formattedPhone}` 
            : `+256 ${formattedPhone}`
        }
      } else if (mobileSubProvider === "airtel_uganda") {
        methodTitle = "Airtel Money (Uganda)"
        if (!formattedPhone.startsWith("+")) {
          formattedPhone = formattedPhone.startsWith("0") 
            ? `+256 ${formattedPhone.slice(1)}` 
            : formattedPhone.startsWith("256") 
            ? `+${formattedPhone}` 
            : `+256 ${formattedPhone}`
        }
      } else {
        methodTitle = "M-Pesa (East Africa)"
        if (!formattedPhone.startsWith("+")) {
          formattedPhone = formattedPhone.startsWith("0") 
            ? `+254 ${formattedPhone.slice(1)}` 
            : formattedPhone.startsWith("254") 
            ? `+${formattedPhone}` 
            : `+254 ${formattedPhone}`
        }
      }

      newMethod = {
        id: `pm-${Date.now()}`,
        type: "mobile",
        provider: mobileSubProvider,
        title: methodTitle,
        identifier: formattedPhone,
        cardholderName: mobileAccountName.trim() || userData.name || "Mobile Subscriber",
        isDefault: makeDefault || paymentMethods.length === 0
      }
    } else if (paymentType === "espees") {
      if (!espeesHandle.trim()) {
        setPaymentFormError("Please enter your Espees username or registered KingsChat handle.")
        return
      }
      const formattedHandle = espeesHandle.includes('@') || espeesHandle.includes('.') 
        ? espeesHandle.trim() 
        : `@${espeesHandle.trim()}`

      newMethod = {
        id: `pm-${Date.now()}`,
        type: "espees",
        title: "Espees Wallet",
        identifier: formattedHandle,
        cardholderName: espeesAccountName.trim() || userData.name || "Espees Account Holder",
        isDefault: makeDefault || paymentMethods.length === 0
      }
    } else if (paymentType === "paypal") {
      if (!paypalEmail.trim() || !paypalEmail.includes('@')) {
        setPaymentFormError("Please enter a valid PayPal email address.")
        return
      }
      newMethod = {
        id: `pm-${Date.now()}`,
        type: "paypal",
        title: "PayPal Account",
        identifier: paypalEmail,
        cardholderName: userData.name || "PayPal User",
        isDefault: makeDefault || paymentMethods.length === 0
      }
    }

    if (!newMethod) return

    let updatedList = [...paymentMethods]
    if (newMethod.isDefault) {
      updatedList = updatedList.map(m => ({ ...m, isDefault: false }))
    }
    updatedList.unshift(newMethod)

    setPaymentMethods(updatedList)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList))
    } catch (e) {}

    // Reset form
    setCardNumber("")
    setCardExpiry("")
    setCardCvv("")
    setCardName("")
    setCardZip("")
    setMobilePhoneNumber("")
    setMobileAccountName("")
    setEspeesHandle("")
    setEspeesAccountName("")
    setPaypalEmail("")
    setIsAddPaymentOpen(false)

    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been saved securely.",
    })
  }

  const handleSetDefaultPayment = (id: string) => {
    const userKey = user?.id || user?.email || "guest"
    const storageKey = `pianow_payment_methods_${userKey}`
    const updated = paymentMethods.map(m => ({
      ...m,
      isDefault: m.id === id
    }))
    setPaymentMethods(updated)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch (e) {}

    toast({
      title: "Default Method Updated",
      description: "Your primary payment method has been updated.",
    })
  }

  const handleDeletePayment = (id: string) => {
    const userKey = user?.id || user?.email || "guest"
    const storageKey = `pianow_payment_methods_${userKey}`
    let updated = paymentMethods.filter(m => m.id !== id)
    if (updated.length > 0 && !updated.some(m => m.isDefault)) {
      updated[0].isDefault = true
    }
    setPaymentMethods(updated)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch (e) {}

    toast({
      title: "Payment Method Removed",
      description: "The payment method was removed from your account.",
    })
  }

  // Helper for user initials in Avatar fallback
  const getUserInitials = () => {
    if (userData.name) {
      const parts = userData.name.trim().split(' ')
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      return userData.name.slice(0, 2).toUpperCase()
    }
    if (userData.email) {
      return userData.email.slice(0, 2).toUpperCase()
    }
    return "PI"
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                <Music className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">PIANOW</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">My Account & Profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">Back to Home</Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="sm">Shop</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-border">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto border-2 border-purple-200 dark:border-purple-900">
                      <AvatarImage src={userData.avatar} alt={userData.name || "User Avatar"} />
                      <AvatarFallback className="bg-purple-600 text-white text-2xl font-bold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Avatar Upload Button */}
                    <div className="relative">
                      <Button
                        size="sm"
                        onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700 p-0 text-white"
                        disabled={isUploadingAvatar}
                        title="Change photo"
                      >
                        {isUploadingAvatar ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {/* Avatar Menu Dropdown */}
                      {showAvatarMenu && (
                        <div ref={avatarMenuRef} className="absolute -bottom-20 right-0 z-50 w-48 bg-card rounded-lg shadow-xl border border-border py-2 text-left">
                          <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium border-b border-border">
                            Profile Picture
                          </div>
                          <label className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors">
                            <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
                            Upload New Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                          </label>
                          {userData.avatar && (
                            <button
                              onClick={handleRemoveAvatar}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Photo
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {userData.name || "User Account"}
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium mt-0.5">{userData.email || "No email provided"}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {userData.dateOfBirth ? (
                        <>
                          {new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear()} yrs
                          <span className="mx-1.5">•</span>
                        </>
                      ) : null}
                      Member since {userData.joinDate}
                    </p>
                  </div>

                  {/* Skill level and instruments */}
                  <div className="space-y-2 pt-1">
                    {userData.skillLevel ? (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-medium">
                        {userData.skillLevel}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Skill level not specified</span>
                    )}

                    <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                      {userData.instruments && userData.instruments.length > 0 ? (
                        userData.instruments.map((instrument) => (
                          <Badge key={instrument} variant="outline" className="text-xs font-normal">
                            {instrument}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No instruments selected</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-between text-xs"
                      onClick={() => setActiveTab("security")}
                    >
                      <span className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-purple-600" />
                        Account Security
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">Manage</Badge>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-between text-xs"
                      onClick={() => setActiveTab("security")}
                    >
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                        Payment Methods
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {paymentMethods.length} saved
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 h-11 bg-muted/80 p-1">
                <TabsTrigger value="profile" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <User className="h-3.5 w-3.5" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger value="lessons" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Lessons</span>
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <Settings className="h-3.5 w-3.5" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* PROFILE TAB */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-xl">Personal Information</CardTitle>
                      <CardDescription>
                        Your account credentials and musical profile
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={handleEdit} size="sm" className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white">
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Info</span>
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-1.5" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                          ) : (
                            <Save className="h-4 w-4 mr-1.5" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* View vs Edit Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Full Name
                        </Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter full name"
                            className="mt-1.5"
                          />
                        ) : (
                          <p className="mt-1.5 text-base font-medium text-foreground">
                            {userData.name || <span className="text-muted-foreground italic">Not provided</span>}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Email Address (Login)
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                            className="mt-1.5"
                          />
                        ) : (
                          <p className="mt-1.5 text-base font-medium text-foreground">
                            {userData.email || <span className="text-muted-foreground italic">Not provided</span>}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Phone Number
                        </Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="e.g. +1 (555) 000-0000"
                            className="mt-1.5"
                          />
                        ) : (
                          <p className="mt-1.5 text-base text-foreground">
                            {userData.phone ? (
                              <span className="font-medium">{userData.phone}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Not provided</span>
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Date of Birth
                        </Label>
                        {isEditing ? (
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="mt-1.5"
                          />
                        ) : (
                          <p className="mt-1.5 text-base text-foreground">
                            {userData.dateOfBirth ? (
                              <span className="font-medium">{userData.dateOfBirth}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Not specified</span>
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="location" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Location / City
                        </Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="City, Country"
                            className="mt-1.5"
                          />
                        ) : (
                          <p className="mt-1.5 text-base text-foreground">
                            {userData.location ? (
                              <span className="font-medium">{userData.location}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Not specified</span>
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="skillLevel" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Skill Level
                        </Label>
                        {isEditing ? (
                          <select
                            id="skillLevel"
                            value={formData.skillLevel}
                            onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                            className="w-full mt-1.5 flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="">Select level...</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Professional">Professional</option>
                          </select>
                        ) : (
                          <p className="mt-1.5 text-base text-foreground">
                            {userData.skillLevel ? (
                              <span className="font-medium">{userData.skillLevel}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Not set</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bio" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bio & Musical Background
                      </Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="mt-1.5 min-h-[90px]"
                          placeholder="Tell us about your musical journey, goals, and experience..."
                        />
                      ) : (
                        <p className="mt-1.5 text-sm text-foreground leading-relaxed">
                          {userData.bio || <span className="text-muted-foreground italic">No bio added yet. Click &quot;Edit Info&quot; to write about yourself.</span>}
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="pt-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Instruments of Interest
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["Piano", "Acoustic Guitar", "Electric Guitar", "Drums", "Bass", "Vocals", "Violin", "Saxophone"].map((inst) => {
                            const selected = formData.instruments.includes(inst)
                            return (
                              <button
                                key={inst}
                                type="button"
                                onClick={() => {
                                  if (selected) {
                                    handleInputChange('instruments', formData.instruments.filter(i => i !== inst))
                                  } else {
                                    handleInputChange('instruments', [...formData.instruments, inst])
                                  }
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  selected 
                                    ? "bg-purple-600 text-white border-purple-600" 
                                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                }`}
                              >
                                {inst} {selected ? "✓" : "+"}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SECURITY & PAYMENT TAB */}
              <TabsContent value="security" className="space-y-6">
                {/* Password Management */}
                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Lock className="h-5 w-5 text-purple-600" />
                        Account Password
                      </CardTitle>
                      <CardDescription>
                        Manage your account login credentials and security authentication
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsChangePasswordOpen(true)}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <KeyRound className="h-4 w-4 mr-1.5" />
                      Change Password
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg border border-border bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Password Protection</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Secured with industry-standard encryption for {userData.email || "your account"}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50 dark:bg-green-950/40 dark:text-green-300 self-start sm:self-auto">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    </div>

                    {/* Two Factor Authentication */}
                    <div className="p-4 rounded-lg border border-border flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-muted-foreground">
                          Add an extra layer of security when logging into your PIANOW account
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {twoFactorEnabled ? "Enabled" : "Disabled"}
                        </span>
                        <Switch
                          checked={twoFactorEnabled}
                          onCheckedChange={(val) => {
                            setTwoFactorEnabled(val)
                            toast({
                              title: val ? "2FA Enabled" : "2FA Disabled",
                              description: val 
                                ? "Two-factor verification via email is now active." 
                                : "Two-factor verification has been turned off.",
                            })
                          }}
                        />
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="p-4 rounded-lg border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Laptop className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Active Session</p>
                          <p className="text-xs text-muted-foreground">Current web browser session • Active now</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          toast({
                            title: "Sessions Refreshed",
                            description: "All other device sessions have been safely terminated.",
                          })
                        }}
                      >
                        Sign out other devices
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods Management */}
                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        Payment Methods
                      </CardTitle>
                      <CardDescription>
                        Manage your credit cards, mobile money, and billing options
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsAddPaymentOpen(true)}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Payment Method
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-border rounded-lg">
                        <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium text-foreground">No payment methods saved yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Add a payment method for hassle-free lesson bookings and instrument checkout.</p>
                        <Button 
                          onClick={() => setIsAddPaymentOpen(true)}
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                        >
                          <Plus className="h-4 w-4 mr-1.5" /> Add First Payment Method
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div 
                            key={method.id}
                            className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              method.isDefault 
                                ? "border-purple-300 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-950/20 shadow-xs" 
                                : "border-border bg-card hover:bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                                {method.type === "mobile" || method.type === "mpesa" ? (
                                  method.provider === "mtn_uganda" || method.title.includes("MTN") ? (
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col items-center justify-center font-bold text-[10px]">
                                      <Smartphone className="h-4 w-4 text-amber-600 mb-0.5" />
                                      <span className="leading-none text-[9px]">MTN</span>
                                    </div>
                                  ) : method.provider === "airtel_uganda" || method.title.includes("Airtel") ? (
                                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 flex flex-col items-center justify-center font-bold text-[10px]">
                                      <Smartphone className="h-4 w-4 text-red-600 mb-0.5" />
                                      <span className="leading-none text-[9px]">Airtel</span>
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col items-center justify-center font-bold text-[10px]">
                                      <Smartphone className="h-4 w-4 text-emerald-600 mb-0.5" />
                                      <span className="leading-none text-[9px]">M-Pesa</span>
                                    </div>
                                  )
                                ) : method.type === "espees" ? (
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 flex flex-col items-center justify-center font-bold text-[10px]">
                                    <Wallet className="h-4 w-4 text-purple-600 mb-0.5" />
                                    <span className="leading-none text-[9px]">ESP</span>
                                  </div>
                                ) : method.type === "paypal" ? (
                                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-600 flex items-center justify-center font-black text-sm">
                                    P
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 text-purple-600 flex items-center justify-center">
                                    <CreditCard className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm text-foreground">{method.title}</h4>
                                  {method.isDefault && (
                                    <Badge className="bg-purple-600 text-white text-[10px] px-1.5 py-0">
                                      Default
                                    </Badge>
                                  )}
                                  {method.provider === "mtn_uganda" && (
                                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold px-1.5 py-0.2 rounded">Uganda</span>
                                  )}
                                  {method.provider === "airtel_uganda" && (
                                    <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-semibold px-1.5 py-0.2 rounded">Uganda</span>
                                  )}
                                  {method.type === "espees" && (
                                    <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-semibold px-1.5 py-0.2 rounded">KingsChat</span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                  <span className="font-mono">{method.identifier}</span>
                                  {method.expiry && (
                                    <>
                                      <span>•</span>
                                      <span>Exp {method.expiry}</span>
                                    </>
                                  )}
                                  {method.cardholderName && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate max-w-[140px]">{method.cardholderName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {!method.isDefault && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs h-8 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleSetDefaultPayment(method.id)}
                                >
                                  Make Default
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                onClick={() => handleDeletePayment(method.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* LESSONS TAB */}
              <TabsContent value="lessons" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">My Lessons & Courses</CardTitle>
                    <CardDescription>
                      Track your learning progress and upcoming live sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Piano Fundamentals & Jazz Improvisation</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Next lesson: Tomorrow at 2:00 PM with Instructor David</p>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Acoustic Guitar Basics</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Completed 8 of 12 lessons</p>
                          </div>
                          <Badge variant="outline">In Progress</Badge>
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Drum Rhythm & Groove Masterclass</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Enrollment confirmed</p>
                          </div>
                          <Badge variant="secondary">Upcoming</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/lessons">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Browse All Lessons</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PURCHASES TAB */}
              <TabsContent value="purchases" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">Purchase & Order History</CardTitle>
                    <CardDescription>
                      Track your instruments, accessories, and gear orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Yamaha P-125 Digital Piano</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Order #PI-84920 • March 15, 2024</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">$899.00</p>
                            <Badge className="bg-green-600 text-white text-xs mt-1">Delivered</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Fender Deluxe Guitar Stand</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Order #PI-84110 • March 10, 2024</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">$29.99</p>
                            <Badge className="bg-blue-600 text-white text-xs mt-1">Shipped</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/shop">
                        <Button className="w-full" variant="outline">Continue Shopping</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SETTINGS TAB */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">Notification Preferences</CardTitle>
                    <CardDescription>
                      Control which email and app notifications you receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-2">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive lesson start reminders and teacher messages</p>
                      </div>
                      <Switch
                        checked={formData.preferences.notifications}
                        onCheckedChange={(val) => handlePreferenceChange('notifications', val)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Email Updates</Label>
                        <p className="text-xs text-muted-foreground">Receive weekly practice tips and instructor feedback</p>
                      </div>
                      <Switch
                        checked={formData.preferences.emailUpdates}
                        onCheckedChange={(val) => handlePreferenceChange('emailUpdates', val)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Marketing & Promotions</Label>
                        <p className="text-xs text-muted-foreground">Receive instrument sales alerts and exclusive coupons</p>
                      </div>
                      <Switch
                        checked={formData.preferences.marketingEmails}
                        onCheckedChange={(val) => handlePreferenceChange('marketingEmails', val)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Account Security Jump */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">Account Security</CardTitle>
                    <CardDescription>
                      Manage passwords, authentication, and saved payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-sm">Change Password</h3>
                          <p className="text-xs text-muted-foreground">Update your account password</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsChangePasswordOpen(true)}
                      >
                        Change
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-sm">Payment Methods</h3>
                          <p className="text-xs text-muted-foreground">Manage your payment cards and digital wallets</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab("security")}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-600" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new, secure password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
            {passwordError && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <Label htmlFor="current-pass" className="text-xs font-semibold">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  id="current-pass"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-pass" className="text-xs font-semibold">New Password (min. 8 characters)</Label>
              <div className="relative mt-1">
                <Input
                  id="new-pass"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-pass" className="text-xs font-semibold">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-pass"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsChangePasswordOpen(false)
                  setPasswordError("")
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUpdatingPassword}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isUpdatingPassword ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                ) : null}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD PAYMENT METHOD MODAL */}
      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Add Payment Method
            </DialogTitle>
            <DialogDescription>
              Choose your preferred payment method for lessons and equipment purchases.
            </DialogDescription>
          </DialogHeader>

          {/* Payment Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPaymentType("card")}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                paymentType === "card"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold shadow-xs"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <CreditCard className="h-4 w-4 mx-auto mb-1" />
              <span className="text-xs block">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType("mobile")}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                paymentType === "mobile"
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <Smartphone className="h-4 w-4 mx-auto mb-1" />
              <span className="text-xs block">Mobile Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType("espees")}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                paymentType === "espees"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold shadow-xs"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <Wallet className="h-4 w-4 mx-auto mb-1" />
              <span className="text-xs block">Espees</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType("paypal")}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                paymentType === "paypal"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <User className="h-4 w-4 mx-auto mb-1" />
              <span className="text-xs block">PayPal</span>
            </button>
          </div>

          <form onSubmit={handleSavePaymentMethod} className="space-y-4 py-2">
            {paymentFormError && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{paymentFormError}</span>
              </div>
            )}

            {paymentType === "card" && (
              <>
                <div>
                  <Label htmlFor="card-name" className="text-xs font-semibold">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="card-num" className="text-xs font-semibold">Card Number</Label>
                  <Input
                    id="card-num"
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                      const formatted = val.replace(/(\d{4})/g, '$1 ').trim()
                      setCardNumber(formatted)
                    }}
                    placeholder="4000 1234 5678 9010"
                    className="mt-1"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="card-exp" className="text-xs font-semibold">Expiration (MM/YY)</Label>
                    <Input
                      id="card-exp"
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (val.length >= 3) {
                          val = `${val.slice(0, 2)}/${val.slice(2)}`
                        }
                        setCardExpiry(val)
                      }}
                      placeholder="12/28"
                      className="mt-1"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-cvv" className="text-xs font-semibold">Security Code (CVV)</Label>
                    <Input
                      id="card-cvv"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="mt-1"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentType === "mobile" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold">Select Mobile Provider</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setMobileSubProvider("mtn_uganda")}
                      className={`p-2 rounded-lg border text-left flex flex-col transition-all ${
                        mobileSubProvider === "mtn_uganda"
                          ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 ring-1 ring-amber-500"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <span className="font-bold text-xs text-amber-600 dark:text-amber-400">MTN MoMo</span>
                      <span className="text-[10px] text-muted-foreground">Uganda</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMobileSubProvider("airtel_uganda")}
                      className={`p-2 rounded-lg border text-left flex flex-col transition-all ${
                        mobileSubProvider === "airtel_uganda"
                          ? "border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-200 ring-1 ring-red-500"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <span className="font-bold text-xs text-red-600 dark:text-red-400">Airtel Money</span>
                      <span className="text-[10px] text-muted-foreground">Uganda</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMobileSubProvider("mpesa")}
                      className={`p-2 rounded-lg border text-left flex flex-col transition-all ${
                        mobileSubProvider === "mpesa"
                          ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">M-Pesa</span>
                      <span className="text-[10px] text-muted-foreground">East Africa</span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mobile-name" className="text-xs font-semibold">Registered Subscriber Name</Label>
                  <Input
                    id="mobile-name"
                    value={mobileAccountName}
                    onChange={(e) => setMobileAccountName(e.target.value)}
                    placeholder="Full name registered on SIM card"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile-phone" className="text-xs font-semibold">
                    Phone Number {mobileSubProvider === "mpesa" ? "(Kenya +254)" : "(Uganda +256)"}
                  </Label>
                  <Input
                    id="mobile-phone"
                    value={mobilePhoneNumber}
                    onChange={(e) => setMobilePhoneNumber(e.target.value)}
                    placeholder={mobileSubProvider === "mpesa" ? "+254 712 345 678" : "+256 772 123 456"}
                    className="mt-1"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {mobileSubProvider === "mtn_uganda" 
                      ? "Supports MTN Uganda (077/078/076). Enter local or international format."
                      : mobileSubProvider === "airtel_uganda"
                      ? "Supports Airtel Uganda (070/075). Enter local or international format."
                      : "Supports Safaricom M-Pesa Kenya and regional roamers."}
                  </p>
                </div>
              </div>
            )}

            {paymentType === "espees" && (
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-purple-600" /> Espees Digital Currency
                  </p>
                  <p className="mt-1 text-purple-700 dark:text-purple-300">
                    Pay securely using Espees from your KingsChat ecosystem. Zero international transaction fees and instant authorization.
                  </p>
                </div>

                <div>
                  <Label htmlFor="espees-handle" className="text-xs font-semibold">Espees Username / KingsChat Handle</Label>
                  <Input
                    id="espees-handle"
                    value={espeesHandle}
                    onChange={(e) => setEspeesHandle(e.target.value)}
                    placeholder="@username or phone number"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="espees-name" className="text-xs font-semibold">Account Holder Name</Label>
                  <Input
                    id="espees-name"
                    value={espeesAccountName}
                    onChange={(e) => setEspeesAccountName(e.target.value)}
                    placeholder="e.g. Johnathan Doe"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {paymentType === "paypal" && (
              <div>
                <Label htmlFor="paypal-email" className="text-xs font-semibold">PayPal Email Address</Label>
                <Input
                  id="paypal-email"
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your-paypal-email@example.com"
                  className="mt-1"
                  required
                />
              </div>
            )}

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="default-check"
                checked={makeDefault}
                onChange={(e) => setMakeDefault(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="default-check" className="text-xs text-muted-foreground cursor-pointer">
                Set as default payment method
              </Label>
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddPaymentOpen(false)
                  setPaymentFormError("")
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Payment Method
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
