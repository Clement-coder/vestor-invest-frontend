'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassButton } from '@/components/glass/glass-button'
import { resetPassword } from '@/lib/auth'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return setError('Email is required')

    setIsLoading(true)
    try {
      await resetPassword(email)
      toast.success('Reset link sent! Check your inbox.')
      setSent(true)
    } catch {
      toast.error('Failed to send reset email. Check the address and try again.')
      setError('Failed to send reset email. Check the address and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="We'll send you a reset link">
      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white/70 text-sm">
            Reset link sent to <span className="text-white">{email}</span>. Check your inbox.
          </p>
          <Link href="/login" className="block text-neon-cyan hover:underline text-sm">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <GlassInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            error={error}
            disabled={isLoading}
          />

          <GlassButton type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </GlassButton>

          <p className="text-center text-white/70 text-sm">
            <Link href="/login" className="text-neon-cyan hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
