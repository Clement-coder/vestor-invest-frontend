'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

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
  type,
  ...props
}: GlassInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

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
          type={inputType}
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
            isPassword && 'pr-11',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
        {error}
      </p>}
      {helperText && !error && (
        <p className="text-white/50 text-xs mt-1.5">{helperText}</p>
      )}
    </div>
  )
}
