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
        'font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2',
        'focus:outline-none focus-visible:ring-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Size variants
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-10 px-6 text-sm sm:h-11 sm:text-base',
        size === 'lg' && 'h-11 px-8 text-sm sm:h-13 sm:text-lg',
        // Style variants
        variant === 'primary' && [
          'gradient-btn text-white',
        ],
        variant === 'secondary' && [
          'bg-[#39ff9e]/10 text-[#39ff9e] border border-[#39ff9e]/30',
          'hover:bg-[#39ff9e]/20 hover:border-[#39ff9e]/50',
        ],
        variant === 'outline' && [
          'bg-transparent text-foreground border border-white/20',
          'hover:bg-white/5 hover:border-white/40',
        ],
        variant === 'ghost' && [
          'bg-transparent text-foreground',
          'hover:bg-white/10',
        ],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
