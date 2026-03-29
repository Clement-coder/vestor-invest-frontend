'use client'

import { cn } from '@/lib/utils'
import React, { useEffect } from 'react'

interface GlassModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  neonBorder?: 'cyan' | 'green' | 'none'
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  neonBorder = 'cyan',
}: GlassModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div
          className={cn(
            'glass rounded-xl p-6 border backdrop-blur-md',
            'shadow-glass-lg shadow-black/40',
            neonBorder === 'cyan' && 'border-neon-cyan/30 glow-cyan',
            neonBorder === 'green' && 'border-neon-green/30 glow-green',
            neonBorder === 'none' && 'border-white/10'
          )}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Title */}
          {title && (
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          )}

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
