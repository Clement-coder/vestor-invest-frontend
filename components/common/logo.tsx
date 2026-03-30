import { cn } from '@/lib/utils'
import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizeMap = {
    sm: 'text-base sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-4xl',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('font-bold', sizeMap[size])}>
        <span className="text-white">Vestor</span>
        <span className="text-gradient-primary"> INVEST</span>
      </div>
    </div>
  )
}
