'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { GlassButton } from '@/components/glass/glass-button'
import { sendVerificationEmail, logOut } from '@/lib/auth'
import { useAuth } from '@/context/auth-context'
import { getFirebase } from '@/lib/firebase'
import { reload } from 'firebase/auth'

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [resent, setResent] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const handleResend = async () => {
    try {
      const { auth } = getFirebase()
      if (!auth.currentUser) throw new Error('No user')
      await sendVerificationEmail(auth.currentUser)
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch {
      setError('Failed to resend. Try again shortly.')
    }
  }

  const handleContinue = async () => {
    setChecking(true)
    setError('')
    try {
      const { auth } = getFirebase()
      if (auth.currentUser) {
        await reload(auth.currentUser)
        if (auth.currentUser.emailVerified) {
          router.push('/onboarding')
        } else {
          setError('Email not verified yet. Check your inbox and click the link.')
        }
      }
    } finally {
      setChecking(false)
    }
  }

  const handleLogout = async () => {
    await logOut()
    router.push('/login')
  }

  return (
    <AuthLayout title="Verify Your Email" subtitle="One more step to get started">
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <div>
          <p className="text-white/70 text-sm leading-relaxed">
            We sent a verification link to
          </p>
          <p className="text-white font-semibold mt-1">{user?.email}</p>
          <p className="text-white/50 text-xs mt-2">Click the link in the email, then come back and press Continue.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <GlassButton variant="primary" size="lg" className="w-full" onClick={handleContinue} disabled={checking}>
          {checking ? 'Checking...' : "I've Verified — Continue"}
        </GlassButton>

        <button
          onClick={handleResend}
          disabled={resent}
          className="text-sm text-neon-cyan hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {resent ? 'Email sent ✓' : 'Resend verification email'}
        </button>

        <button onClick={handleLogout} className="block w-full text-xs text-white/30 hover:text-white/60 transition-colors">
          Sign out and use a different account
        </button>
      </div>
    </AuthLayout>
  )
}
