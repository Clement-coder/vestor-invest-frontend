import { cn } from '@/lib/utils'
import React from 'react'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  children: React.ReactNode
}

export function GlassButton({
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  children,
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2',
        'focus:outline-none focus-visible:ring-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Size variants
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
        size === 'lg' && 'px-5 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-lg',
        // Style variants
        variant === 'primary' && [
          'bg-gradient-to-r from-neon-cyan via-blue-600 to-neon-green text-white',
          'hover:shadow-glow-cyan active:scale-95',
          glow && 'shadow-glow-cyan',
        ],
        variant === 'secondary' && [
          'bg-neon-green/10 text-neon-green border border-neon-green/30',
          'hover:bg-neon-green/20 hover:border-neon-green/50 hover:shadow-glow-green',
          glow && 'shadow-glow-green',
        ],
        variant === 'outline' && [
          'bg-transparent text-foreground border border-white/20',
          'hover:bg-white/5 hover:border-white/40',
        ],
        variant === 'ghost' && [
          'bg-transparent text-foreground',
          'hover:bg-white/10',
        ],
        !disabled && 'active:scale-95',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
