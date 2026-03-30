'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { TrendingUp, Gift, AlertTriangle, Info, CheckCheck, Bell } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

// No hardcoded notifications — real data comes from backend
const initialNotifications: {
  id: number
  type: 'investment' | 'dividend' | 'alert' | 'info'
  title: string
  message: string
  time: string
  read: boolean
}[] = []

const iconMap = {
  investment: <TrendingUp size={18} className="text-[#39ff9e]" />,
  dividend: <Gift size={18} className="text-[#00a8ff]" />,
  alert: <AlertTriangle size={18} className="text-yellow-400" />,
  info: <Info size={18} className="text-white/60" />,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length
  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })))
  const markRead = (id: number) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && <p className="text-white/50 text-sm mt-1">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <GlassButton variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-2">
            <CheckCheck size={15} />
            Mark all read
          </GlassButton>
        )}
      </div>

      {notifications.length === 0 ? (
        <GlassCard variant="nested" className="flex flex-col items-center justify-center py-20 gap-4 text-white/30">
          <Bell size={56} strokeWidth={1} />
          <p className="text-base font-medium text-white/50">No notifications yet</p>
          <p className="text-sm text-center max-w-xs">
            You'll receive alerts here for investments, dividends, withdrawals, and important account updates.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <GlassCard
              key={n.id}
              variant="nested"
              hover={false}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 cursor-pointer transition-all ${!n.read ? 'border-white/20 bg-white/[0.07]' : ''}`}
            >
              <div className="w-9 h-9 bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                {iconMap[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-semibold text-sm ${!n.read ? 'text-white' : 'text-white/60'}`}>{n.title}</p>
                  <span className="text-white/30 text-xs shrink-0">{n.time}</span>
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
