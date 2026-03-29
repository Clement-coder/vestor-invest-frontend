import { cn } from '@/lib/utils'
import React from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'nested'
  hover?: boolean
  glow?: 'cyan' | 'green' | 'none'
  children: React.ReactNode
}

export function GlassCard({
  variant = 'default',
  hover = true,
  glow = 'none',
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl p-6 border border-white/10 backdrop-blur-md',
        variant === 'elevated' && 'shadow-glass-lg shadow-black/30',
        variant === 'nested' && 'bg-white/[0.05] border-white/5',
        hover && 'transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-primary/10 cursor-pointer',
        glow === 'cyan' && 'glow-cyan',
        glow === 'green' && 'glow-green',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
