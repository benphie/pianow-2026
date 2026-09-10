"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  BookOpen,
  CheckCircle,
  Gift,
  MessageSquare,
  Clock,
  Check,
  Trash2,
  Filter,
  ArrowLeft,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  NotificationItem,
} from "@/lib/notifications"

export default function NotificationsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    setNotifications(getStoredNotifications())

    const handleUpdate = () => {
      setNotifications(getStoredNotifications())
    }

    window.addEventListener("pianow_notifications_updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener("pianow_notifications_updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications

  const handleMarkAsRead = (id: string) => {
    const updated = markNotificationAsRead(id)
    setNotifications(updated)
  }

  const handleMarkAllAsRead = () => {
    const updated = markAllNotificationsAsRead()
    setNotifications(updated)
  }

  const handleDelete = (id: string) => {
    const updated = deleteNotification(id)
    setNotifications(updated)
  }

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
    if (notification.href) {
      router.push(notification.href)
    }
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

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-blue-100 text-blue-700"
      case "purchase":
        return "bg-green-100 text-green-700"
      case "promotion":
        return "bg-purple-100 text-purple-700"
      case "message":
        return "bg-orange-100 text-orange-700"
      case "application":
        return "bg-amber-100 text-amber-800"
      case "system":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="h-8 w-8 text-purple-600" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-2">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : "All caught up! No unread notifications"
              }
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")} className="mb-6">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No notifications</p>
              <p className="text-muted-foreground">
                {filter === "unread" 
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            return (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-purple-200 bg-purple-50/50" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-full flex-shrink-0 ${
                      !notification.read 
                        ? "bg-purple-100" 
                        : "bg-gray-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        !notification.read 
                          ? "text-purple-600" 
                          : "text-gray-600"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-semibold ${
                            !notification.read 
                              ? "text-gray-900" 
                              : "text-gray-700"
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={getNotificationTypeColor(notification.type)}
                          >
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{notification.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="h-8"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(notification.id)
                            }}
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
