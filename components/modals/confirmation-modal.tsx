'use client'

import { GlassModal } from '@/components/glass/glass-modal'
import { GlassButton } from '@/components/glass/glass-button'
import React from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  icon?: 'warning' | 'info' | 'success' | 'error'
  variant?: 'primary' | 'destructive'
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = 'info',
  variant = 'primary',
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) {
  const iconMap = {
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
    error: '❌',
  }

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      neonBorder={variant === 'destructive' ? 'cyan' : 'green'}
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="text-4xl text-center">{iconMap[icon]}</div>

        {/* Title and Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white text-center">{title}</h3>
          <p className="text-white/70 text-center">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <GlassButton
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </GlassButton>
          <GlassButton
            variant={variant === 'destructive' ? 'secondary' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  )
}
