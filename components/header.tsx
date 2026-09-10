"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Search, Bell, ShoppingCart, Sun, Moon, User, LogOut, BookOpen, ShoppingBag, Users, Play, CheckCircle, Gift, MessageSquare, Clock, GraduationCap, Check, Briefcase } from "lucide-react"
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
    {
      title: "Careers & Gigs",
      href: "/careers",
      icon: Briefcase,
      description: "Musician casting calls, live gigs, and career roadmaps"
    },
    {
      title: "Blog & Journal",
      href: "/blog",
      icon: BookOpen,
      description: "Masterclasses, chord voicings, and stagecraft articles"
    },
  ]

  return (
    <header className="bg-purple-100 border-b border-purple-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/pianow-logo.png" 
              alt="PIANOW Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/lessons" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Lessons
            </Link>
            <Link href="/lessons/youtube" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              YouTube Lessons
            </Link>
            <Link href="/teachers" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Teachers
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
                  Shop
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => handleNavigate("/shop")}>
                  All Products
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/shop/pianos")}>
                  Pianos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/guitars")}>
                  Guitars
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/drums")}>
                  Drums
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/audio")}>
                  Audio Equipment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/careers" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Careers & Gigs
            </Link>
            <Link href="/blog" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Blog
            </Link>
            <Link href="/live" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Live
            </Link>
          </nav>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50"
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
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative"
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
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative"
            aria-label="Shopping Cart"
            onClick={() => handleNavigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50"
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
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border-purple-300 bg-white/90 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-sm transition-all"
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
                    <span className="font-bold text-xs max-w-[100px] truncate text-purple-950 dark:text-white">
                      {user.name?.split(' ')[0] || "Profile"}
                    </span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                      Profile
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

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer font-semibold py-2">
                  <LogOut className="h-4 w-4 mr-2.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 px-3"
                onClick={() => handleNavigate("/auth/login")}
                id="header-signin-btn"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="hidden sm:inline-flex bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-sm text-xs font-semibold px-3.5 py-1.5 rounded-lg"
                onClick={() => handleNavigate("/auth/signup")}
                id="header-signup-btn"
              >
                Sign Up
              </Button>
            </div>
          )}
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
