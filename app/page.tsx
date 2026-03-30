'use client'

import Link from 'next/link'
import { Logo } from '@/components/common/logo'
import { LiveMarket } from '@/components/common/live-market'
import { useAuth } from '@/context/auth-context'
import {
  TrendingUp, Shield, Zap, BarChart2, Globe, Lock,
  ArrowRight, Star, ChevronRight, Cpu, Wallet, Bell,
  CheckCircle, Users, DollarSign, Activity,
} from 'lucide-react'

const features = [
  { icon: Cpu, title: 'AI-Powered Insights', desc: 'Advanced algorithms analyze market trends 24/7 to maximize your returns and minimize risk exposure.' },
  { icon: BarChart2, title: 'Real-Time Analytics', desc: 'Live portfolio tracking with interactive charts, P&L breakdowns, and performance benchmarks.' },
  { icon: Shield, title: 'Bank-Level Security', desc: 'Military-grade encryption, cold storage, and multi-factor authentication protect every asset.' },
  { icon: DollarSign, title: 'Multiple Plans', desc: 'From Starter to Exclusive — tiered investment plans designed for every budget and goal.' },
  { icon: Zap, title: 'Instant Transactions', desc: 'Deposit and withdraw funds instantly with zero hidden fees and real-time confirmations.' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Invest across 50+ cryptocurrencies and view your balance in 10+ fiat currencies.' },
]

const plans = [
  { name: 'Starter', apy: '8.5%', min: '$100', max: '$999', color: '#00a8ff', features: ['Daily returns', 'Basic analytics', 'Email support'] },
  { name: 'Growth', apy: '12.5%', min: '$1,000', max: '$9,999', color: '#39ff9e', popular: true, features: ['Daily returns', 'Advanced analytics', 'Priority support', 'Auto-reinvest'] },
  { name: 'Premium', apy: '16.5%', min: '$10,000', max: '$99,999', color: '#00a8ff', features: ['Daily returns', 'Full analytics suite', '24/7 support', 'Auto-reinvest', 'Dedicated manager'] },
  { name: 'Exclusive', apy: '20.5%', min: '$100,000', max: 'Unlimited', color: '#39ff9e', features: ['Daily returns', 'Custom analytics', 'VIP support', 'Auto-reinvest', 'Personal advisor', 'Custom strategies'] },
]

const testimonials = [
  { name: 'Michael Chen', role: 'Software Engineer', text: 'I\'ve tried multiple crypto platforms but Vestor Invest stands out. The Growth plan has consistently delivered above the promised APY. My portfolio is up 34% in 8 months.', rating: 5, avatar: 'MC' },
  { name: 'Sarah Williams', role: 'Financial Analyst', text: 'The analytics dashboard is incredibly detailed. I can track every investment in real-time. The AI insights have helped me make smarter allocation decisions.', rating: 5, avatar: 'SW' },
  { name: 'James Okafor', role: 'Entrepreneur', text: 'Started with the Starter plan, now on Premium. The auto-reinvest feature is a game changer — my returns compound automatically without lifting a finger.', rating: 5, avatar: 'JO' },
  { name: 'Priya Sharma', role: 'Doctor', text: 'As someone with no crypto background, the platform made it incredibly easy to start. The support team walked me through everything. Best investment decision I\'ve made.', rating: 5, avatar: 'PS' },
]

const stats = [
  { value: '$2.4B+', label: 'Assets Under Management', icon: DollarSign },
  { value: '180K+', label: 'Active Investors', icon: Users },
  { value: '99.9%', label: 'Uptime Guarantee', icon: Activity },
  { value: '42%', label: 'Avg. Annual Return', icon: TrendingUp },
]

const howItWorks = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up in under 2 minutes with email or Google. No KYC required for starter plans.' },
  { step: '02', title: 'Choose a Plan', desc: 'Browse our tiered investment plans and select one that matches your goals and budget.' },
  { step: '03', title: 'Fund & Invest', desc: 'Deposit crypto or fiat, confirm your investment, and watch your portfolio grow daily.' },
  { step: '04', title: 'Track & Withdraw', desc: 'Monitor real-time performance and withdraw anytime with zero lock-in periods.' },
]

export default function Home() {
  const { user } = useAuth()
  const cta = user ? '/dashboard' : '/signup'
  const ctaLabel = user ? 'Go to Dashboard' : 'Get Started'
  return (
    <div className="min-h-screen bg-[#0a0f25] text-white overflow-x-hidden">

      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#plans" className="hover:text-white transition">Plans</a>
            <a href="#how" className="hover:text-white transition">How It Works</a>
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
          </div>
          <Link href={cta} className="px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold bg-[#00a8ff] hover:bg-[#0090dd] text-white transition hover:shadow-lg hover:shadow-[#00a8ff]/30 hover:scale-105">
            {ctaLabel}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00a8ff]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#39ff9e]/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00a8ff]/60 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animation: `floating ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Infinite scrolling ticker */}
        <div className="absolute top-16 left-0 right-0 overflow-hidden border-b border-white/5 bg-white/[0.02] py-2">
          <div className="flex gap-8 animate-[ticker_30s_linear_infinite] whitespace-nowrap">
            {[...Array(3)].flatMap((_, r) =>
              ['BTC','ETH','BNB','SOL','XRP','ADA','DOGE','MATIC','DOT','AVAX'].map((sym, i) => (
                <div key={`${r}-${i}`} className="flex items-center gap-2 text-xs shrink-0">
                  <img src={`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons/32/color/${sym.toLowerCase()}.png`} alt={sym} width={14} height={14} className="w-3.5 h-3.5 rounded-full" />
                  <span className="font-bold text-white/70">{sym}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#39ff9e]/20 text-xs text-[#39ff9e] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39ff9e] animate-pulse" />
            Live · 180,000+ investors · $2.4B+ managed
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight">
            <span className="text-white">Invest Smarter.</span>
            <br />
            <span className="text-white">Grow Faster.</span>
          </h1>

          <p className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            The most advanced crypto investment platform. AI-powered insights, real-time analytics, and plans starting at just $100.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href={cta} className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#00a8ff] hover:bg-[#0090dd] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#00a8ff]/30 transition-all hover:scale-105 text-sm sm:text-base">
              {ctaLabel}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white/80 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all text-sm sm:text-base font-medium">
              How It Works
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 border-t border-white/10 mt-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center group">
                <p className="text-2xl sm:text-3xl font-bold text-[#00a8ff] group-hover:scale-110 transition-transform inline-block">{s.value}</p>
                <p className="text-white/40 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Prices */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Live Market Prices</h2>
            <span className="flex items-center gap-1.5 text-xs text-[#39ff9e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39ff9e] animate-pulse" />
              Live · updates every 60s
            </span>
          </div>
          <LiveMarket />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[#00a8ff] text-sm font-semibold uppercase tracking-widest mb-3">Why Vestor Invest</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-white/50 max-w-xl mx-auto">A complete investment platform built for both beginners and seasoned crypto investors.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="glass p-6 rounded-2xl border border-white/10 hover:border-[#00a8ff]/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00a8ff]/10">
                <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/20 flex items-center justify-center mb-4 group-hover:bg-[#00a8ff]/20 transition-colors">
                  <f.icon size={22} className="text-[#00a8ff]" />
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-[#00a8ff] transition-colors">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#39ff9e] text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start in 4 Easy Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative group">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-white/10 z-10" />
                )}
                <div className="glass rounded-2xl p-6 border border-white/10 hover:border-[#39ff9e]/30 transition-all hover:-translate-y-1">
                  <div className="text-3xl font-black text-[#00a8ff] mb-4 opacity-60">{step.step}</div>
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={cta} className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00a8ff] hover:bg-[#0090dd] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#00a8ff]/30 transition-all hover:scale-105">
              {ctaLabel} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#00a8ff] text-sm font-semibold uppercase tracking-widest mb-3">Investment Plans</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Choose Your Growth Path</h2>
            <p className="text-white/50 max-w-xl mx-auto">Transparent returns, no hidden fees. Upgrade or downgrade anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((p, i) => (
              <div key={i} className={`glass rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group overflow-hidden ${p.popular ? 'border-[#39ff9e]/40 hover:shadow-[#39ff9e]/20' : 'border-white/10 hover:shadow-[#00a8ff]/10'}`}>
                {p.popular && (
                  <div className="bg-[#00a8ff] text-center py-1.5 text-xs font-bold text-[#0a0f25]">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black" style={{ color: p.color }}>{p.apy}</span>
                    <span className="text-white/40 text-sm mb-1">APY</span>
                  </div>
                  <p className="text-white/40 text-xs mb-5">${p.min} – {p.max}</p>
                  <ul className="space-y-2 mb-6">
                    {p.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle size={14} style={{ color: p.color }} className="shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href={cta} className="block text-center py-2.5 rounded-xl text-sm font-semibold border transition-all hover:scale-105" style={{ borderColor: p.color + '40', color: p.color, backgroundColor: p.color + '10' }}>
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#39ff9e] text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Trusted by 180,000+ Investors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#00a8ff] flex items-center justify-center text-xs font-bold text-[#0a0f25]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[#00a8ff]/5" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-[#00a8ff]/30" />
            <div className="relative z-10 p-10 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Grow Your Wealth?</h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">Join 180,000+ investors already earning with Vestor Invest. Start with as little as $100 — no experience needed.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={cta} className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#00a8ff] hover:bg-[#0090dd] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#00a8ff]/30 transition-all hover:scale-105">
                  {ctaLabel} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/support" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/15 text-white/80 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all font-medium">
                  Talk to Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <Logo size="sm" className="mb-4" />
              <p className="text-white/40 text-sm leading-relaxed">The most advanced crypto investment platform. Trusted by 180,000+ investors worldwide.</p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Platform</p>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#plans" className="hover:text-white transition">Plans</a></li>
                <li><a href="#how" className="hover:text-white transition">How It Works</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Company</p>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Security</p>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2"><Lock size={12} /> 256-bit SSL Encryption</li>
                <li className="flex items-center gap-2"><Shield size={12} /> Cold Storage Assets</li>
                <li className="flex items-center gap-2"><Bell size={12} /> 24/7 Monitoring</li>
                <li className="flex items-center gap-2"><Wallet size={12} /> Multi-sig Wallets</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2026 Vestor Invest. All rights reserved.</p>
            <p className="text-white/20 text-xs">Crypto investments carry risk. Past performance does not guarantee future results.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}
