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
import { useToast } from "@/hooks/use-toast"
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
  Trash2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const avatarMenuRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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

  // Mock user data - replace with actual user data from your auth system
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate musician and piano enthusiast. Love learning new pieces and sharing music with others.",
    location: "New York, NY",
    dateOfBirth: "1990-05-15",
    joinDate: "January 2024",
    avatar: "/images/default-avatar.png",
    instruments: ["Piano", "Guitar", "Drums"],
    skillLevel: "Intermediate",
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
      marketingEmails: false
    }
  })

  const [formData, setFormData] = useState(userData)

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
    
    // Simulate API call
    setTimeout(() => {
      setUserData(formData)
      setIsEditing(false)
      setIsLoading(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, or GIF).",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 5MB)
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

    // Simulate file upload
    setTimeout(() => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newAvatarUrl = e.target?.result as string
        setUserData(prev => ({ ...prev, avatar: newAvatarUrl }))
        setFormData(prev => ({ ...prev, avatar: newAvatarUrl }))
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been successfully updated.",
        })
      }
      reader.readAsDataURL(file)
      setIsUploadingAvatar(false)
    }, 2000)
  }

  const handleRemoveAvatar = () => {
    setUserData(prev => ({ ...prev, avatar: "" }))
    setFormData(prev => ({ ...prev, avatar: "" }))
    setShowAvatarMenu(false)
    toast({
      title: "Avatar Removed",
      description: "Your profile picture has been removed.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PIANOW</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-purple-600">
                <Button variant="ghost">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white text-2xl">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Avatar Upload Button */}
                    <div className="relative">
                      <Button
                        size="sm"
                        onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
                        disabled={isUploadingAvatar}
                      >
                        {isUploadingAvatar ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {/* Avatar Menu Dropdown */}
                      {showAvatarMenu && (
                        <div ref={avatarMenuRef} className="absolute -bottom-16 right-0 z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                            Change Avatar
                          </div>
                          <label className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
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
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
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
                    <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                    <p className="text-gray-600">{userData.email}</p>
                    <p className="text-sm text-gray-500">
                      {userData.dateOfBirth && (
                        <>
                          {new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear()} years old
                          <span className="mx-2">•</span>
                        </>
                      )}
                      Member since {userData.joinDate}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {userData.skillLevel}
                    </Badge>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {userData.instruments.map((instrument) => (
                        <Badge key={instrument} variant="outline" className="text-xs">
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">12</div>
                        <div className="text-gray-600">Lessons</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">3</div>
                        <div className="text-gray-600">Instruments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="lessons" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Lessons</span>
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Purchases</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and bio
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={handleEdit} className="flex items-center space-x-2">
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading} size="sm">
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={isEditing ? formData.name : userData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={isEditing ? formData.email : userData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={isEditing ? formData.phone : userData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={isEditing ? formData.dateOfBirth : userData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={isEditing ? formData.location : userData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={isEditing ? formData.bio : userData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 min-h-[100px]"
                        placeholder="Tell us about yourself and your musical journey..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lessons Tab */}
              <TabsContent value="lessons" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Lessons</CardTitle>
                    <CardDescription>
                      Track your learning progress and upcoming lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Piano Fundamentals</h3>
                            <p className="text-sm text-gray-600">Next lesson: Tomorrow at 2:00 PM</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Guitar Basics</h3>
                            <p className="text-sm text-gray-600">Completed 8/12 lessons</p>
                          </div>
                          <Badge variant="outline">In Progress</Badge>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Drum Techniques</h3>
                            <p className="text-sm text-gray-600">Starts next week</p>
                          </div>
                          <Badge variant="secondary">Scheduled</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/lessons">
                        <Button className="w-full">Browse All Lessons</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Purchases Tab */}
              <TabsContent value="purchases" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>
                      View your past purchases and orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Yamaha P-125 Digital Piano</h3>
                            <p className="text-sm text-gray-600">Order #12345 • March 15, 2024</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">$599.99</p>
                            <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Guitar Lesson Package</h3>
                            <p className="text-sm text-gray-600">Order #12344 • March 10, 2024</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">$99.99</p>
                            <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/shop">
                        <Button className="w-full">Continue Shopping</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications about lessons and updates</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications}
                          onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Email Updates</Label>
                          <p className="text-sm text-gray-600">Get lesson reminders and progress updates via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.preferences.emailUpdates}
                          onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>SMS Updates</Label>
                          <p className="text-sm text-gray-600">Receive text message reminders</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.preferences.smsUpdates}
                          onChange={(e) => handlePreferenceChange('smsUpdates', e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Marketing Emails</Label>
                          <p className="text-sm text-gray-600">Receive promotional content and special offers</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.preferences.marketingEmails}
                          onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-semibold">Change Password</h3>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </div>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-semibold">Payment Methods</h3>
                          <p className="text-sm text-gray-600">Manage your payment information</p>
                        </div>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}


