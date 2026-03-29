'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { GlassButton } from '@/components/glass/glass-button'
import React from 'react'

interface NavigationProps {
  variant?: 'landing' | 'dashboard'
  onAuthClick?: (type: 'login' | 'signup') => void
}

export function Navigation({ variant = 'landing', onAuthClick }: NavigationProps) {
  const pathname = usePathname()

  if (variant === 'dashboard') {
    return (
      <nav className="glass fixed top-0 left-0 right-0 z-40 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === '/dashboard'
                  ? 'text-neon-cyan'
                  : 'text-white/70 hover:text-white'
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/plans"
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === '/plans'
                  ? 'text-neon-cyan'
                  : 'text-white/70 hover:text-white'
              )}
            >
              Plans
            </Link>
            <Link
              href="/analytics"
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === '/analytics'
                  ? 'text-neon-cyan'
                  : 'text-white/70 hover:text-white'
              )}
            >
              Analytics
            </Link>
            <Link
              href="/transactions"
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === '/transactions'
                  ? 'text-neon-cyan'
                  : 'text-white/70 hover:text-white'
              )}
            >
              Transactions
            </Link>
          </div>
          <button className="text-sm font-medium text-white/70 hover:text-white">
            Profile
          </button>
        </div>
      </nav>
    )
  }

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-40 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => onAuthClick?.('login')}
          >
            Login
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => onAuthClick?.('signup')}
          >
            Sign Up
          </GlassButton>
        </div>
      </div>
    </nav>
  )
}
