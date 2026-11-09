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
import { apiClient } from "@/lib/api-client"
import { 
  Music, 
  User, 
  Settings, 
  Bell, 
  Shield, 
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
  CheckCircle2,
  AlertCircle,
  Check,
  KeyRound,
  GraduationCap
} from "lucide-react"
import Link from "next/link"

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

  const [teacherApp, setTeacherApp] = useState<any>(null)

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

  // Load user data on mount or when user changes
  useEffect(() => {
    if (user) {
      const userKey = user.id || user.email
      const profileStorageKey = `pianow_profile_${userKey}`

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
    }
  }, [user])

  // Load teacher application status
  useEffect(() => {
    const loadTeacherApp = async () => {
      try {
        const saved = localStorage.getItem("pianow_teacher_application")
        if (saved) {
          try {
            setTeacherApp(JSON.parse(saved))
          } catch (e) {}
        }

        // The server only shares an application with the signed-in applicant
        if (user?.email) {
          const data = await apiClient.getMyTeacherApplication(user.email)
          if (data.application) {
            setTeacherApp(data.application)
            localStorage.setItem("pianow_teacher_application", JSON.stringify(data.application))
          }
        }
      } catch (e) {}
    }

    loadTeacherApp()

    const handleTeacherAppUpdate = (e: any) => {
      if (e?.detail) {
        setTeacherApp(e.detail)
      } else {
        const saved = localStorage.getItem("pianow_teacher_application")
        if (saved) {
          try { setTeacherApp(JSON.parse(saved)) } catch (err) {}
        }
      }
    }

    window.addEventListener("pianow_teacher_application_updated", handleTeacherAppUpdate)
    window.addEventListener("storage", handleTeacherAppUpdate)

    return () => {
      window.removeEventListener("pianow_teacher_application_updated", handleTeacherAppUpdate)
      window.removeEventListener("storage", handleTeacherAppUpdate)
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
  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
    try {
      await apiClient.changePassword(currentPassword, newPassword)

      setIsChangePasswordOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password Changed",
        description: "Your account password has been updated.",
      })
    } catch (error: any) {
      setPasswordError(error?.message || "We couldn't change your password. Please try again.")
    } finally {
      setIsUpdatingPassword(false)
    }
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

                    {/* Teacher Application Status Widget */}
                    {teacherApp ? (
                      <div className="pt-2 text-left">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                              <GraduationCap className="h-4 w-4 text-amber-600" />
                              Instructor App
                            </span>
                            <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0 border-amber-300 font-medium">
                              {teacherApp.status === 'approved' ? 'Approved' : 'Under Review'}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            Applied to teach: {Array.isArray(teacherApp.instruments) ? teacherApp.instruments.join(", ") : "Music"}
                          </p>
                          <Link href="/teachers/apply">
                            <Button variant="link" size="sm" className="p-0 h-auto text-[11px] text-amber-700 dark:text-amber-400 mt-1.5 font-medium">
                              View application details →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 text-left">
                        <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-lg">
                          <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-purple-900 dark:text-purple-300">
                            <GraduationCap className="h-4 w-4 text-purple-600" />
                            Become a Teacher
                          </div>
                          <p className="text-[11px] text-muted-foreground mb-2">
                            Teach students worldwide & earn on your schedule.
                          </p>
                          <Link href="/teachers/apply">
                            <Button size="sm" variant="outline" className="w-full text-xs h-7 border-purple-200 text-purple-700 hover:bg-purple-100/50">
                              Apply to Teach
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
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

              {/* SECURITY TAB */}
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
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      You have no orders yet.
                    </p>
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
                      Manage passwords and authentication
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
    </div>
  )
}
