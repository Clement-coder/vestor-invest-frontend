'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { GlassButton } from '@/components/glass/glass-button'
import { useAuth } from '@/context/auth-context'
import { logOut } from '@/lib/auth'
import {
  LayoutDashboard, TrendingUp, BarChart2, ArrowLeftRight,
  Wallet, User, Bell, Settings, Menu, X,
  CheckCheck, Gift, AlertTriangle, Info, LogOut, ShieldCheck,
} from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

interface NavigationProps {
  variant?: 'landing' | 'dashboard'
  onAuthClick?: (type: 'login' | 'signup') => void
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plans', label: 'Plans', icon: TrendingUp },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const initialNotifications: { id: number; type: string; title: string; message: string; time: string; read: boolean }[] = []

const notifIcon: Record<string, React.ReactNode> = {
  investment: <TrendingUp size={16} className="text-[#39ff9e]" />,
  dividend: <Gift size={16} className="text-[#00a8ff]" />,
  alert: <AlertTriangle size={16} className="text-yellow-400" />,
  info: <Info size={16} className="text-white/60" />,
}

// Reusable animated side-panel
function SlidePanel({
  open, onClose, side, children,
}: {
  open: boolean
  onClose: () => void
  side: 'left' | 'right'
  children: React.ReactNode
}) {
  const [visible, setVisible] = useState(false)
  const startX = useRef(0)
  const dragX = useRef(0)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      const t = setTimeout(() => { document.body.style.overflow = 'unset' }, 300)
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX }
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - startX.current
    dragX.current = delta
    if (!panelRef.current) return
    const shouldMove = side === 'left' ? delta < 0 : delta > 0
    if (shouldMove) {
      panelRef.current.style.transition = 'none'
      panelRef.current.style.transform = `translateX(${delta}px)`
    }
  }
  const onTouchEnd = () => {
    if (!panelRef.current) return
    panelRef.current.style.transition = ''
    panelRef.current.style.transform = ''
    const threshold = side === 'left' ? dragX.current < -80 : dragX.current > 80
    if (threshold) onClose()
    dragX.current = 0
  }

  if (!open && !visible) return null

  const translate = side === 'left' ? '-translate-x-full' : 'translate-x-full'

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={cn('absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={cn(
          'absolute top-0 h-full w-72 glass border-white/10 flex flex-col',
          'transition-transform duration-300 ease-out',
          side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          visible ? 'translate-x-0' : translate,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function Navigation({ variant = 'landing', onAuthClick }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const handleLogout = async () => {
    await logOut()
    router.push('/login')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() || '?'

  const unread = notifications.filter(n => !n.read).length
  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })))
  const markRead = (id: number) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  if (variant === 'dashboard') {
    return (
      <>
        <nav className="glass fixed top-0 left-0 right-0 z-40 border-b border-white/10 backdrop-blur-md">
          <div className="lg:ml-64 px-4 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Menu size={20} />
              </button>
              <Link href="/"><Logo size="sm" /></Link>
            </div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00a8ff]" />
                )}
              </button>
              <Link href="/settings" className={cn('p-2 rounded-lg transition-all', pathname === '/settings' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                <Settings size={18} />
              </Link>
              <Link href="/profile" className="flex items-center gap-2 pl-2 ml-1 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#00a8ff] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                  {user?.photoURL
                    ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                    : initials}
                </div>
                <span className="hidden sm:block text-sm text-white/70 max-w-[100px] truncate">
                  {user?.displayName || user?.email?.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:flex p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
                title="Sign out"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </nav>

        {/* Left sidebar drawer */}
        <SlidePanel open={sidebarOpen} onClose={() => setSidebarOpen(false)} side="left">
          <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
            <Logo size="sm" />
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  pathname === href ? 'bg-white/10 text-white border border-white/15' : 'text-white/55 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border',
                  pathname === '/admin'
                    ? 'bg-[#00a8ff]/20 text-[#00a8ff] border-[#00a8ff]/30'
                    : 'text-[#00a8ff]/70 hover:text-[#00a8ff] hover:bg-[#00a8ff]/10 border-[#00a8ff]/20'
                )}
              >
                <ShieldCheck size={17} /> Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all mt-2"
            >
              <LogOut size={17} />
              Sign Out
            </button>
          </nav>
        </SlidePanel>

        {/* Right notifications drawer */}
        <SlidePanel open={notifOpen} onClose={() => setNotifOpen(false)} side="right">
          <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
            <div>
              <p className="text-white font-semibold">Notifications</p>
              {unread > 0 && <p className="text-white/40 text-xs">{unread} unread</p>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all" title="Mark all read">
                  <CheckCheck size={16} />
                </button>
              )}
              <button onClick={() => setNotifOpen(false)} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-white/30 py-16">
                <Bell size={48} strokeWidth={1} />
                <p className="text-sm text-white/50 font-medium">No notifications yet</p>
                <p className="text-xs text-center text-white/30 max-w-[200px]">You'll be notified about investments, dividends, and account updates.</p>
              </div>
            ) : notifications.map(n => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  'w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all',
                  n.read ? 'bg-white/[0.03] border-white/5' : 'bg-white/[0.07] border-white/15'
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {notifIcon[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-white text-xs font-medium truncate">{n.title}</p>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00a8ff] shrink-0" />}
                  </div>
                  <p className="text-white/45 text-xs mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                  <p className="text-white/25 text-xs mt-1">{n.time}</p>
                </div>
              </button>
            ))}
          </div>
        </SlidePanel>
      </>
    )
  }

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-40 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/"><Logo size="sm" /></Link>
        <div className="flex items-center gap-4">
          <GlassButton variant="outline" size="sm" onClick={() => onAuthClick?.('login')}>Login</GlassButton>
          <GlassButton variant="primary" size="sm" onClick={() => onAuthClick?.('signup')}>Sign Up</GlassButton>
        </div>
      </div>
    </nav>
  )
}
