import { Logo } from '@/components/common/logo'
import Link from 'next/link'
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#00a8ff]/6 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#39ff9e]/6 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Logo size="md" className="justify-center" />
          </Link>
          {title && <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{title}</h1>}
          {subtitle && <p className="text-white/50 text-sm sm:text-base">{subtitle}</p>}
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 backdrop-blur-md shadow-xl shadow-black/30">
          {children}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Secure crypto investing · Bank-level encryption
        </p>
      </div>
    </div>
  )
}
