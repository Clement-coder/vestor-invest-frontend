'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassButton } from '@/components/glass/glass-button'
import { signUpWithEmail, signInWithGoogle, sendVerificationEmail } from '@/lib/auth'
import { FirebaseError } from 'firebase/app'
import { Mail, Lock, User, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-neon-green']

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', agreeTerms: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const strength = getPasswordStrength(formData.password)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.fullName.trim()) e.fullName = 'Full name is required'
    if (!formData.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email'
    if (!formData.password) e.password = 'Password is required'
    else if (formData.password.length < 6) e.password = 'At least 6 characters required'
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!formData.agreeTerms) e.agreeTerms = 'You must agree to the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const { user } = await signUpWithEmail(formData.email, formData.password)
      await updateProfile(user, { displayName: formData.fullName.trim() })
      try {
        await sendVerificationEmail(user)
        toast.success('Account created! Check your email to verify.')
      } catch (verifyErr) {
        const code = (verifyErr as FirebaseError).code
        console.error('Verification email error:', code, verifyErr)
        toast.warning('Account created but verification email failed. You can resend it on the next page.')
      }
      router.push('/verify-email')
    } catch (err) {
      const code = (err as FirebaseError).code
      const msg = code === 'auth/email-already-in-use' ? 'This email is already registered' : 'Failed to create account. Try again.'
      toast.error(msg)
      setErrors({ submit: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error('Google sign-in failed. Please try again.')
      setErrors({ submit: 'Google sign-in failed. Please try again.' })
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join Vestor Invest today">
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          disabled={isLoading}
          icon={<User size={16} />}
        />

        <GlassInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          icon={<Mail size={16} />}
        />

        <div>
          <GlassInput
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            icon={<Lock size={16} />}
          />
          {formData.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-white/10'}`} />
                ))}
              </div>
              <p className="text-xs text-white/50">
                Strength: <span className={`font-medium ${strength >= 3 ? 'text-neon-green' : strength === 2 ? 'text-yellow-400' : 'text-red-400'}`}>{strengthLabel[strength]}</span>
              </p>
              <ul className="text-xs space-y-0.5">
                {([
                  [formData.password.length >= 8, '8+ characters'],
                  [/[A-Z]/.test(formData.password), 'Uppercase letter'],
                  [/[0-9]/.test(formData.password), 'Number'],
                  [/[^A-Za-z0-9]/.test(formData.password), 'Special character'],
                ] as [boolean, string][]).map(([met, label], i) => (
                  <li key={i} className={`flex items-center gap-1.5 ${met ? 'text-neon-green' : 'text-white/30'}`}>
                    {met ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <GlassInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
          icon={<Lock size={16} />}
        />

        <div>
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="terms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded accent-neon-cyan flex-shrink-0"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-white/70 leading-snug">
              I agree to the{' '}
              <a href="#" className="text-neon-cyan hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-neon-cyan hover:underline">Privacy Policy</a>
            </label>
          </div>
          {errors.agreeTerms && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-400" />{errors.agreeTerms}</p>}
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
            <span className="bg-[#0A0F25] px-2 text-white/40">Or continue with</span>
          </div>
        </div>

        <GlassButton type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogle} disabled={isLoading}>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </GlassButton>

        <p className="text-center text-white/60 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-neon-cyan hover:underline font-medium">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
