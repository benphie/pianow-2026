"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { 
  Search, Bell, ShoppingCart, Sun, Moon, User, LogOut, BookOpen, 
  ShoppingBag, Users, Play, CheckCircle, Gift, MessageSquare, Clock, 
  GraduationCap, Check, LogIn, Menu, Radio, FileText, Briefcase, ChevronRight 
} from "lucide-react"
import Image from "next/image"
import { getStoredNotifications, markNotificationAsRead, markAllNotificationsAsRead, NotificationItem } from "@/lib/notifications"
import { getStoredCart, getCartTotalQuantity } from "@/lib/cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const Header = () => {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [cartCount, setCartCount] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
    // Initial sync
    setNotifications(getStoredNotifications())
    setCartCount(getCartTotalQuantity())

    // Event listeners for cross-component and tab sync
    const handleNotifUpdate = () => {
      setNotifications(getStoredNotifications())
    }
    const handleCartUpdate = () => {
      setCartCount(getCartTotalQuantity())
    }

    window.addEventListener("pianow_notifications_updated", handleNotifUpdate)
    window.addEventListener("pianow_cart_updated", handleCartUpdate)
    window.addEventListener("storage", () => {
      handleNotifUpdate()
      handleCartUpdate()
    })

    return () => {
      window.removeEventListener("pianow_notifications_updated", handleNotifUpdate)
      window.removeEventListener("pianow_cart_updated", handleCartUpdate)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  function handleNavigate(href: string) {
    router.push(href)
    if (typeof window !== "undefined") {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0)
    }
  }

  function handleNotificationClick(notification: NotificationItem) {
    if (!notification.read) {
      const updated = markNotificationAsRead(notification.id)
      setNotifications(updated)
    }
    handleNavigate(notification.href || "/account/notifications")
  }

  function handleMarkAllAsRead() {
    const updated = markAllNotificationsAsRead()
    setNotifications(updated)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return BookOpen
      case "purchase":
        return CheckCircle
      case "promotion":
        return Gift
      case "message":
        return MessageSquare
      case "application":
        return GraduationCap
      default:
        return Bell
    }
  }


  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const searchItems = [
    {
      title: "Lessons",
      href: "/lessons",
      icon: BookOpen,
      description: "Browse music lessons"
    },
    {
      title: "YouTube Lessons",
      href: "/lessons/youtube",
      icon: Play,
      description: "Watch YouTube lessons"
    },
    {
      title: "Teachers",
      href: "/teachers",
      icon: Users,
      description: "Find music teachers"
    },
    {
      title: "Shop - All Products",
      href: "/shop",
      icon: ShoppingBag,
      description: "Browse all products"
    },
    {
      title: "Shop - Pianos",
      href: "/shop/pianos",
      icon: ShoppingBag,
      description: "Browse pianos and keyboards"
    },
    {
      title: "Shop - Guitars",
      href: "/shop/guitars",
      icon: ShoppingBag,
      description: "Browse guitars"
    },
    {
      title: "Shop - Drums",
      href: "/shop/drums",
      icon: ShoppingBag,
      description: "Browse drums"
    },
    {
      title: "Shop - Audio Equipment",
      href: "/shop/audio",
      icon: ShoppingBag,
      description: "Browse audio equipment"
    },
  ]

  return (
    <header className="bg-purple-100/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-purple-200 dark:border-purple-900/50 px-3 sm:px-6 py-3 sticky top-0 z-40 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-2 sm:gap-4">
        {/* Left Side - Logo and Desktop Navigation */}
        <div className="flex items-center space-x-4 xl:space-x-8 flex-shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/pianow-logo.png" 
              alt="PIANOW Logo" 
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            <Link href="/" className="text-purple-900 dark:text-purple-100 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-sm transition-colors">
              Home
            </Link>
            <Link href="/lessons" className="text-purple-900 dark:text-purple-100 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-sm transition-colors">
              Lessons
            </Link>
            <Link href="/lessons/youtube" className="text-purple-900 dark:text-purple-100 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-sm transition-colors">
              YouTube Lessons
            </Link>
            <Link href="/teachers" className="text-purple-900 dark:text-purple-100 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-sm transition-colors">
              Teachers
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-purple-900 dark:text-purple-100 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-sm transition-colors flex items-center gap-1">
                  Shop
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => handleNavigate("/shop")} className="cursor-pointer font-medium">
                  All Products
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/shop/pianos")} className="cursor-pointer">
                  Pianos & Keyboards
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/guitars")} className="cursor-pointer">
                  Guitars & Bass
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/drums")} className="cursor-pointer">
                  Drums & Percussion
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/audio")} className="cursor-pointer">
                  Audio & Recording
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/live" className="text-purple-900 dark:text-purple-100 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-sm transition-colors">
              Live
            </Link>
            <Link href="/blog" className="text-purple-900 dark:text-purple-100 hover:text-purple-600 dark:hover:text-purple-300 font-semibold text-sm transition-colors">
              Blog
            </Link>
          </nav>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
            aria-label="Search"
            onClick={() => setOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.length === 0 ? (
                  <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-3 py-3 cursor-pointer transition-colors ${!notification.read ? "bg-purple-50/70 dark:bg-purple-950/20" : ""}`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${!notification.read ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900 dark:text-gray-100" : "font-normal text-gray-700 dark:text-gray-300"}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[11px] text-muted-foreground">{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    )
                  })
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleNavigate("/account/notifications")}
                    className="text-center justify-center text-sm text-purple-600 font-medium py-2"
                  >
                    View all notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Shopping Cart Button */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-200 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 relative"
            aria-label="Shopping Cart"
            id="header-cart-btn"
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[11px] font-bold rounded-full h-4 w-4 min-w-4 flex items-center justify-center shadow-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Theme Toggle Button (Desktop & Tablet) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex text-gray-700 dark:text-gray-200 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
            aria-label="Toggle Theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {mounted && resolvedTheme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User Profile Dropdown or Sign In */}
          {mounted && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border-purple-300 bg-white/95 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-xs transition-all flex-shrink-0"
                  aria-label="User Profile menu"
                  id="header-profile-button"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner ring-2 ring-purple-300">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "User Avatar"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                    <span>{(user.name || user.email || "P").charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col items-start text-left leading-none">
                    <span className="font-bold text-xs max-w-[70px] sm:max-w-[100px] truncate text-purple-950 dark:text-white">
                      {user.name?.split(' ')[0] || "Profile"}
                    </span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                      Account
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-2 shadow-2xl border-purple-200">
                <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-lg mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center text-white font-bold text-sm shadow ring-2 ring-purple-300">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || "Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (user.name || user.email || "P").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                        {user.name || "Music Student"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Navigation & Profile
                </div>
                <DropdownMenuItem onClick={() => handleNavigate("/account/profile")} className="cursor-pointer font-medium py-2">
                  <User className="h-4 w-4 mr-2.5 text-purple-600" />
                  My Profile & Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/lessons/tracker")} className="cursor-pointer font-medium py-2">
                  <BookOpen className="h-4 w-4 mr-2.5 text-purple-600" />
                  Learning Progress Tracker
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop")} className="cursor-pointer font-medium py-2">
                  <ShoppingBag className="h-4 w-4 mr-2.5 text-purple-600" />
                  Music Store
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/auth/login")} className="cursor-pointer font-medium py-2 text-purple-700 dark:text-purple-300">
                  <LogIn className="h-4 w-4 mr-2.5 text-purple-600" />
                  Switch Account / Sign In
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer font-semibold py-2">
                  <LogOut className="h-4 w-4 mr-2.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-purple-50 text-purple-900 dark:bg-gray-800 dark:text-purple-100 dark:border-purple-700 dark:hover:bg-purple-950/50 border border-purple-300 font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap"
                onClick={() => handleNavigate("/auth/login")}
                id="header-signin-btn"
              >
                <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                <span>Sign In</span>
              </Button>
              <Button
                size="sm"
                className="hidden md:inline-flex bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-xs text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
                onClick={() => handleNavigate("/auth/signup")}
                id="header-signup-btn"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger (Drawer) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-800 dark:text-gray-100 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 lg:hidden flex-shrink-0"
                aria-label="Open Navigation Menu"
                id="header-mobile-menu-btn"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col justify-between bg-white dark:bg-gray-900 border-l border-purple-200 dark:border-purple-900/50">
              <div className="flex-1 overflow-y-auto">
                <SheetHeader className="p-4 border-b border-purple-100 dark:border-gray-800 flex flex-row items-center justify-between">
                  <SheetTitle className="flex items-center space-x-2">
                    <img 
                      src="/pianow-logo.png" 
                      alt="PIANOW Logo" 
                      className="h-8 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Auth Banner */}
                <div className="p-4 border-b border-purple-100 dark:border-gray-800 bg-purple-50/50 dark:bg-purple-950/20">
                  {mounted && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-sm shadow">
                          {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            (user.name || user.email || "P").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                            {user.name || "Music Student"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            handleNavigate("/account/profile")
                            setMobileMenuOpen(false)
                          }}
                        >
                          <User className="h-3.5 w-3.5 mr-1 text-purple-600" />
                          My Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={() => {
                            logout()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-3.5 w-3.5 mr-1" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        Access your music lessons, practice tracker, and instruments store.
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 py-2 rounded-lg shadow-sm"
                          onClick={() => {
                            handleNavigate("/auth/login")
                            setMobileMenuOpen(false)
                          }}
                          id="mobile-drawer-signin-btn"
                        >
                          <LogIn className="h-4 w-4" />
                          <span>Sign In to PIANOW</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-purple-300 text-purple-900 dark:text-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-semibold py-2 rounded-lg"
                          onClick={() => {
                            handleNavigate("/auth/signup")
                            setMobileMenuOpen(false)
                          }}
                          id="mobile-drawer-signup-btn"
                        >
                          Create Free Account
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation List */}
                <div className="py-2 px-3 space-y-1">
                  <button
                    onClick={() => { handleNavigate("/"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span>Home</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { handleNavigate("/lessons"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      Browse Lessons
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { handleNavigate("/lessons/youtube"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-red-500" />
                      YouTube Lessons
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { handleNavigate("/teachers"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      Find Teachers
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { handleNavigate("/shop"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-purple-600" />
                      Music Instruments Store
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  <div className="pl-6 space-y-1">
                    <button
                      onClick={() => { handleNavigate("/shop/pianos"); setMobileMenuOpen(false) }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-purple-700 transition-colors"
                    >
                      Pianos & Keyboards
                    </button>
                    <button
                      onClick={() => { handleNavigate("/shop/guitars"); setMobileMenuOpen(false) }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-purple-700 transition-colors"
                    >
                      Guitars & Bass
                    </button>
                    <button
                      onClick={() => { handleNavigate("/shop/drums"); setMobileMenuOpen(false) }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-purple-700 transition-colors"
                    >
                      Drums & Percussion
                    </button>
                    <button
                      onClick={() => { handleNavigate("/shop/audio"); setMobileMenuOpen(false) }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-purple-700 transition-colors"
                    >
                      Audio Equipment
                    </button>
                  </div>
                  <button
                    onClick={() => { handleNavigate("/live"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-red-500" />
                      Live Sessions
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { handleNavigate("/blog"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      Music Blog & Guides
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { handleNavigate("/careers"); setMobileMenuOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      Careers
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Drawer Footer Controls */}
              <div className="p-4 border-t border-purple-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="text-xs text-muted-foreground hover:text-purple-700 flex items-center gap-2"
                >
                  {mounted && resolvedTheme === "dark" ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Theme</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Theme</span>
                    </>
                  )}
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1.5"
                  id="mobile-drawer-cart-btn"
                >
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart {mounted && cartCount > 0 ? `(${cartCount})` : ""}</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search lessons, products, teachers..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {searchItems.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    handleNavigate(item.href)
                    setOpen(false)
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}

export default Header
