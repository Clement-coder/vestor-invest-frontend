import { cn } from '@/lib/utils'
import React from 'react'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export function GlassInput({
  label,
  error,
  helperText,
  icon,
  className,
  ...props
}: GlassInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-white/[0.08] border border-white/15',
            'text-white placeholder:text-white/40',
            'backdrop-blur-md',
            'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/30',
            'focus:bg-white/[0.12]',
            'transition-all duration-300',
            error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/30',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-white/50 text-sm mt-2">{helperText}</p>
      )}
    </div>
  )
}
