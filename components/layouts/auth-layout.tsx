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
      {/* Navbar */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 sm:px-5 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition">
              Login
            </Link>
            <Link href="/signup" className="px-3 sm:px-5 py-2 rounded-lg text-sm font-semibold gradient-btn text-white transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#00a8ff]/6 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#39ff9e]/6 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md py-8 pt-24">
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
