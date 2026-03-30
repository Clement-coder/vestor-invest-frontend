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
          'text-white bg-[length:200%_200%] bg-left',
          'bg-[linear-gradient(135deg,#0a0f25_0%,#00a8ff_50%,#0a0f25_100%)]',
          'hover:bg-right hover:shadow-[0_0_20px_rgba(0,168,255,0.4)] active:scale-95',
          'transition-all duration-400',
          glow && 'shadow-[0_0_20px_rgba(0,168,255,0.4)]',
        ],
        variant === 'secondary' && [
          'bg-[#39ff9e]/10 text-[#39ff9e] border border-[#39ff9e]/30',
          'hover:bg-[#39ff9e]/20 hover:border-[#39ff9e]/50',
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
