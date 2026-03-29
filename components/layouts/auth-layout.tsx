import { Logo } from '@/components/common/logo'
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Logo size="lg" className="justify-center mb-8" />
          {title && (
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          )}
          {subtitle && (
            <p className="text-white/60">{subtitle}</p>
          )}
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8 border border-white/10 backdrop-blur-md shadow-glass-lg shadow-black/30">
          {children}
        </div>

        {/* Footer Text */}
        <p className="text-center text-white/50 text-sm mt-8">
          Secure crypto investing platform powered by advanced AI
        </p>
      </div>
    </div>
  )
}
