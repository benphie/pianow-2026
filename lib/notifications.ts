// Notification Management Utility
export interface NotificationItem {
  id: string
  type: "lesson" | "purchase" | "promotion" | "message" | "system" | "application"
  title: string
  message: string
  time: string
  read: boolean
  href: string
  createdAt?: string
}

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "lesson",
    title: "New lesson available",
    message: "Introduction to Jazz Piano has been added to your courses. Start learning now!",
    time: "2 hours ago",
    read: false,
    href: "/lessons",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: "notif-2",
    type: "purchase",
    title: "Order confirmed",
    message: "Your order #12345 has been confirmed and is being processed.",
    time: "5 hours ago",
    read: false,
    href: "/checkout/success",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: "notif-3",
    type: "promotion",
    title: "Special offer",
    message: "Get 20% off on all digital pianos this week! Limited time offer.",
    time: "1 day ago",
    read: true,
    href: "/shop",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "notif-4",
    type: "message",
    title: "New message from instructor",
    message: "Sarah Johnson sent you a message about your practice progress.",
    time: "2 days ago",
    read: true,
    href: "/teachers",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    id: "notif-5",
    type: "lesson",
    title: "Practice Reminder",
    message: "Time to log today's piano practice session! Keep your streak going.",
    time: "3 days ago",
    read: true,
    href: "/lessons/tracker",
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString()
  }
]

const NOTIFICATIONS_STORAGE_KEY = "pianow_notifications"

export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS))
      return DEFAULT_NOTIFICATIONS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return DEFAULT_NOTIFICATIONS
  } catch (e) {
    return DEFAULT_NOTIFICATIONS
  }
}

export function saveNotifications(notifications: NotificationItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
    window.dispatchEvent(new CustomEvent("pianow_notifications_updated", { detail: notifications }))
  } catch (e) {
    console.error("Failed to save notifications to localStorage", e)
  }
}

export function markNotificationAsRead(id: string): NotificationItem[] {
  const current = getStoredNotifications()
  const updated = current.map(item => item.id === id ? { ...item, read: true } : item)
  saveNotifications(updated)
  return updated
}

export function markAllNotificationsAsRead(): NotificationItem[] {
  const current = getStoredNotifications()
  const updated = current.map(item => ({ ...item, read: true }))
  saveNotifications(updated)
  return updated
}

export function deleteNotification(id: string): NotificationItem[] {
  const current = getStoredNotifications()
  const updated = current.filter(item => item.id !== id)
  saveNotifications(updated)
  return updated
}

export function addNotification(notification: Omit<NotificationItem, "id" | "read" | "time"> & { time?: string }): NotificationItem[] {
  const current = getStoredNotifications()
  const newItem: NotificationItem = {
    ...notification,
    id: `notif-${Date.now()}`,
    read: false,
    time: notification.time || "Just now",
    createdAt: new Date().toISOString()
  }
  const updated = [newItem, ...current]
  saveNotifications(updated)
  return updated
}
