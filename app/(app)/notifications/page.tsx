'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { TrendingUp, Gift, AlertTriangle, Info, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

const initialNotifications = [
  { id: 1, type: 'investment', title: 'Investment Confirmed', message: 'Your $1,250 investment in the Growth plan has been confirmed.', time: '2 min ago', read: false },
  { id: 2, type: 'dividend', title: 'Dividend Received', message: 'You received a $342.50 dividend from your Premium plan.', time: '1 hour ago', read: false },
  { id: 3, type: 'alert', title: 'Price Alert', message: 'Bitcoin has dropped 5% in the last 24 hours.', time: '3 hours ago', read: false },
  { id: 4, type: 'info', title: 'Plan Upgraded', message: 'Your account has been upgraded to Premium membership.', time: 'Yesterday', read: true },
  { id: 5, type: 'investment', title: 'Withdrawal Processed', message: 'Your withdrawal of $500 has been processed successfully.', time: '2 days ago', read: true },
  { id: 6, type: 'info', title: 'New Plan Available', message: 'The Exclusive investment plan is now available for eligible accounts.', time: '3 days ago', read: true },
  { id: 7, type: 'alert', title: 'Security Notice', message: 'A new device logged into your account. If this wasn\'t you, contact support.', time: '5 days ago', read: true },
]

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
          {unreadCount > 0 && (
            <p className="text-white/50 text-sm mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <GlassButton variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-2">
            <CheckCheck size={15} />
            Mark all read
          </GlassButton>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => (
          <GlassCard
            key={n.id}
            variant="nested"
            hover={false}
            onClick={() => markRead(n.id)}
            className={`flex items-start gap-4 cursor-pointer transition-all ${!n.read ? 'border-white/20 bg-white/[0.07]' : ''}`}
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              {iconMap[n.type as keyof typeof iconMap]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium">{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-[#00a8ff] shrink-0" />}
              </div>
              <p className="text-white/50 text-sm mt-0.5 leading-relaxed">{n.message}</p>
              <p className="text-white/30 text-xs mt-1">{n.time}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
