import { cn } from '@/lib/utils'
import React from 'react'

interface GlassChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  children: React.ReactNode
  hover?: boolean
}

export function GlassChart({
  title,
  subtitle,
  children,
  hover = true,
  className,
  ...props
}: GlassChartProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl p-6 border border-white/10 backdrop-blur-md',
        'shadow-glass shadow-black/20',
        hover && 'transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-primary/10',
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-white/60 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  )
}
