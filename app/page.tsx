'use client'

import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/common/navigation'
import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { Logo } from '@/components/common/logo'
import React from 'react'

export default function Home() {
  const router = useRouter()

  const handleAuth = (type: 'login' | 'signup') => {
    router.push(type === 'login' ? '/login' : '/signup')
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <Navigation variant="landing" onAuthClick={handleAuth} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Animated background shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-floating" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <Logo size="lg" className="justify-center" />

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            The Future of <span className="text-gradient-primary">Crypto Investing</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Experience premium cryptocurrency investments with AI-powered insights, 
            real-time analytics, and secure transactions on a futuristic platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => handleAuth('signup')}
            >
              Get Started
            </GlassButton>
            <GlassButton
              variant="outline"
              size="lg"
              onClick={() => handleAuth('login')}
            >
              Login
            </GlassButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Vestor Invest?
            </h2>
            <p className="text-white/60 text-lg">
              Premium features designed for modern investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Insights',
                description: 'Advanced machine learning algorithms analyze market trends and provide personalized investment recommendations.',
                icon: '🤖',
              },
              {
                title: 'Real-Time Analytics',
                description: 'Track your portfolio performance with live charts, detailed statistics, and comprehensive analytics dashboards.',
                icon: '📊',
              },
              {
                title: 'Secure Trading',
                description: 'Enterprise-grade security with encryption, multi-factor authentication, and secure transaction processing.',
                icon: '🔒',
              },
              {
                title: 'Multiple Investment Plans',
                description: 'Choose from Starter, Growth, Premium, or Exclusive plans tailored to your investment goals.',
                icon: '💎',
              },
              {
                title: 'Instant Transactions',
                description: 'Execute trades instantly with competitive rates and minimal transaction fees.',
                icon: '⚡',
              },
              {
                title: '24/7 Support',
                description: 'Access dedicated support team available around the clock to assist with your investment journey.',
                icon: '🎧',
              },
            ].map((feature, index) => (
              <GlassCard
                key={index}
                variant="elevated"
                hover
                glow={index % 2 === 0 ? 'cyan' : 'green'}
                className="group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <GlassCard
            variant="elevated"
            glow="cyan"
            className="text-center space-y-6 p-8 lg:p-12"
          >
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Investing?
            </h2>
            <p className="text-white/70 text-lg">
              Join thousands of investors who trust Vestor Invest with their cryptocurrency portfolio.
            </p>
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => handleAuth('signup')}
            >
              Create Your Account
            </GlassButton>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo size="sm" />
          <div className="flex items-center gap-8">
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <p className="text-white/50 text-sm">
            © 2024 Vestor Invest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
