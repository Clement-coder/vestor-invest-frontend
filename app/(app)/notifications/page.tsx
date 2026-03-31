'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/supabase/db'
import { useAuth } from '@/context/auth-context'
import type { Notification } from '@/lib/supabase/db'
import { TrendingUp, Gift, AlertTriangle, Info, CheckCheck, Bell, DollarSign, ArrowUpFromLine } from 'lucide-react'
import { useState, useEffect } from 'react'
import React from 'react'

const iconMap: Record<string, React.ReactNode> = {
  investment: <TrendingUp size={18} className="text-[#39ff9e]" />,
  dividend:   <Gift size={18} className="text-[#00a8ff]" />,
  alert:      <AlertTriangle size={18} className="text-yellow-400" />,
  info:       <Info size={18} className="text-white/60" />,
  credit:     <DollarSign size={18} className="text-[#39ff9e]" />,
  withdrawal: <ArrowUpFromLine size={18} className="text-[#00a8ff]" />,
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!user) return
    getNotifications(user.uid).then(setNotifications)
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = async (id: number) => {
    await markNotificationRead(id)
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  }

  const markAllRead = async () => {
    if (!user) return
    await markAllNotificationsRead(user.uid)
    setNotifications(n => n.map(x => ({ ...x, read: true })))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && <p className="text-white/50 text-sm mt-1">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <GlassButton variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-2">
            <CheckCheck size={15} /> Mark all read
          </GlassButton>
        )}
      </div>

      {notifications.length === 0 ? (
        <GlassCard variant="nested" className="flex flex-col items-center justify-center py-20 gap-4 text-white/30">
          <Bell size={56} strokeWidth={1} />
          <p className="text-base font-medium text-white/50">No notifications yet</p>
          <p className="text-sm text-center max-w-xs">You'll receive alerts here for investments, dividends, withdrawals, and important account updates.</p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <GlassCard key={n.id} variant="nested" hover={false} onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 cursor-pointer transition-all ${!n.read ? 'border-white/20 bg-white/[0.07]' : ''}`}>
              <div className="w-9 h-9 bg-white/10 flex items-center justify-center shrink-0 mt-0.5 rounded-lg">
                {iconMap[n.type] ?? <Info size={18} className="text-white/60" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-semibold text-sm ${!n.read ? 'text-white' : 'text-white/60'}`}>{n.title}</p>
                  <span className="text-white/30 text-xs shrink-0">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <p className="text-white/50 text-sm mt-1">{n.message}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-[#00a8ff] shrink-0 mt-2" />}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
