'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

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
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const startY = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // open/close animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      const t = setTimeout(() => {
        document.body.style.overflow = 'unset'
        setDragY(0)
      }, 300)
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  // touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    setDragging(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0) setDragY(delta)
  }

  const onTouchEnd = () => {
    setDragging(false)
    if (dragY > 120) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  if (!isOpen && !visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          transform: visible
            ? `translateY(${dragY}px)`
            : 'translateY(100%)',
          transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
        }}
        className={cn(
          'relative z-10 w-full',
          // mobile: full width, leave ~60px gap at top
          'sm:max-w-md sm:mx-4 sm:rounded-xl',
          // on mobile: sheet from bottom, rounded top corners only
          'rounded-t-2xl sm:rounded-xl',
          'max-h-[calc(100dvh-60px)] sm:max-h-[90vh]',
          'flex flex-col',
          'glass border backdrop-blur-md shadow-2xl',
          neonBorder === 'cyan' && 'border-[#00a8ff]/30',
          neonBorder === 'green' && 'border-[#39ff9e]/30',
          neonBorder === 'none' && 'border-white/10',
        )}
      >
        {/* Drag handle — mobile only */}
        <div
          className="sm:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing shrink-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-white/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0">
          {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
