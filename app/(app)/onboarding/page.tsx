'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { GlassButton } from '@/components/glass/glass-button'
import { Logo } from '@/components/common/logo'

const steps = [
  {
    title: 'Welcome to Vestor Invest 🎉',
    description: 'Your premium crypto investing platform. Let\'s get you set up in just a few steps.',
    icon: '🚀',
  },
  {
    title: 'Explore Investment Plans',
    description: 'Choose from Starter, Growth, Premium, or Exclusive plans tailored to your goals.',
    icon: '📊',
  },
  {
    title: 'Track Your Portfolio',
    description: 'Real-time analytics, performance charts, and transaction history — all in one place.',
    icon: '💰',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const { user } = useAuth()

  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      router.push('/dashboard')
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00a8ff]/6 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#39ff9e]/6 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md text-center">
        <Logo size="md" className="justify-center mb-10" />

        <div className="glass rounded-2xl p-8 border border-white/10 backdrop-blur-md shadow-xl shadow-black/30 space-y-6">
          <div className="text-6xl">{steps[step].icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{steps[step].title}</h1>
            <p className="text-white/60 text-sm leading-relaxed">{steps[step].description}</p>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-neon-cyan' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <GlassButton variant="primary" size="lg" className="w-full" onClick={handleNext}>
            {isLast ? 'Go to Dashboard' : 'Next'}
          </GlassButton>

          {!isLast && (
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
