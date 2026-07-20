"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Search, Bell, ShoppingCart, Sun, Moon, User, LogOut, BookOpen, ShoppingBag, Users, Play, CheckCircle, Gift, MessageSquare, Clock } from "lucide-react"
import Image from "next/image"
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
  const { resolvedTheme, setTheme } = useTheme()

  // Sample notifications - in a real app, this would come from an API
  const [notifications] = useState([
    {
      id: "1",
      type: "lesson",
      title: "New lesson available",
      message: "Introduction to Jazz Piano has been added to your courses",
      time: "2 hours ago",
      read: false,
      icon: BookOpen,
      href: "/lessons"
    },
    {
      id: "2",
      type: "purchase",
      title: "Order confirmed",
      message: "Your order #12345 has been confirmed and is being processed",
      time: "5 hours ago",
      read: false,
      icon: CheckCircle,
      href: "/checkout/success"
    },
    {
      id: "3",
      type: "promotion",
      title: "Special offer",
      message: "Get 20% off on all digital pianos this week!",
      time: "1 day ago",
      read: true,
      icon: Gift,
      href: "/shop/deals"
    },
    {
      id: "4",
      type: "message",
      title: "New message from instructor",
      message: "Sarah Johnson sent you a message about your progress",
      time: "2 days ago",
      read: true,
      icon: MessageSquare,
      href: "/teachers"
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  function handleNavigate(href: string) {
    router.push(href)
    if (typeof window !== "undefined") {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0)
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
      title: "Careers",
      href: "/careers",
      icon: Gift,
      description: "Join our team and explore career opportunities"
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
            <Link href="/live" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Live
            </Link>
            <Link href="/careers" className="text-purple-800 hover:text-purple-600 font-medium transition-colors">
              Careers
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
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                Notifications
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notification.icon
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() => handleNavigate(notification.href)}
                        className={`px-3 py-3 cursor-pointer ${!notification.read ? "bg-purple-50" : ""}`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`mt-0.5 p-1.5 rounded-full ${!notification.read ? "bg-purple-100" : "bg-gray-100"}`}>
                            <Icon className={`h-4 w-4 ${!notification.read ? "text-purple-600" : "text-gray-600"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
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
                    className="text-center justify-center text-sm text-purple-600"
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
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              3
            </span>
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            aria-label="Toggle Theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                aria-label="Account menu"
              >
                <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Signed in as {user?.name || user?.email}
              </div>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Learning</div>
              <DropdownMenuItem onClick={() => handleNavigate("/lessons/tracker")}>
                My Progress (Tracker)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground">Profile</div>
              <DropdownMenuItem onClick={() => handleNavigate("/account/profile")}>
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
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
