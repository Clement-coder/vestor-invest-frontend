'use client'

import { Navigation } from '@/components/common/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  TrendingUp,
  BarChart2,
  ArrowLeftRight,
  Wallet,
  User,
  Bell,
  Settings,
} from 'lucide-react'
import { Logo } from '@/components/common/logo'
import React from 'react'

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plans', label: 'Plans', icon: TrendingUp },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-white/10 glass z-50">
        <div className="p-6 border-b border-white/10">
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
          {sidebarItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === href
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-white/55 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Top Nav */}
      <Navigation variant="dashboard" />

      {/* Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto lg:mx-0">
          {children}
        </div>
      </main>
    </div>
  )
}
