'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassButton } from '@/components/glass/glass-button'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'
import { FirebaseError } from 'firebase/app'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await signUpWithEmail(formData.email, formData.password)
      router.push('/onboarding')
    } catch (error) {
      const err = error as FirebaseError
      setErrors({ submit: err.code === 'auth/email-already-in-use' ? 'Email already in use' : 'Failed to create account' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()
      const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime
      router.push(isNew ? '/onboarding' : '/dashboard')
    } catch (error) {
      setErrors({ submit: 'Failed to sign in with Google' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join Vestor Invest today">
      <form onSubmit={handleSubmit} className="space-y-5">
        <GlassInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
        />

        <GlassInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter a strong password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText="At least 6 characters"
          disabled={isLoading}
        />

        <GlassInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
        />

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded accent-neon-cyan"
            disabled={isLoading}
          />
          <label htmlFor="terms" className="text-sm text-white/70">
            I agree to the{' '}
            <a href="#" className="text-neon-cyan hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-neon-cyan hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        {errors.submit && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <GlassButton type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </GlassButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-white/50">Or continue with</span>
          </div>
        </div>

        <GlassButton
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </GlassButton>

        <p className="text-center text-white/70 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-neon-cyan hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
