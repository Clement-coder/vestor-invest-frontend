import Link from 'next/link'
import { Logo } from '@/components/common/logo'

const features = [
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Advanced algorithms analyze market trends in real-time to maximize your returns.' },
  { icon: '📊', title: 'Real-Time Analytics', desc: 'Track your portfolio performance with live charts and detailed breakdowns.' },
  { icon: '🔐', title: 'Bank-Level Security', desc: 'Your assets are protected with military-grade encryption and 2FA.' },
  { icon: '💰', title: 'Multiple Plans', desc: 'From Starter to Exclusive — investment plans for every budget.' },
  { icon: '⚡', title: 'Instant Transactions', desc: 'Deposit and withdraw funds instantly with zero hidden fees.' },
  { icon: '🌍', title: 'Multi-Currency', desc: 'View your balance in 10+ currencies including BTC and ETH.' },
]

const stats = [
  { value: '$2.4B+', label: 'Assets Under Management' },
  { value: '180K+', label: 'Active Investors' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '42%', label: 'Avg. Annual Return' },
]

const plans = [
  { name: 'Starter', apy: '8.5%', min: '$100', color: '#00a8ff' },
  { name: 'Growth', apy: '12.5%', min: '$1,000', color: '#39ff9e', popular: true },
  { name: 'Premium', apy: '16.5%', min: '$10,000', color: '#00a8ff' },
  { name: 'Exclusive', apy: '20.5%', min: '$100,000', color: '#39ff9e' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f25] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="px-3 sm:px-5 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition">
              Login
            </Link>
            <Link href="/signup" className="px-3 sm:px-5 py-2 rounded-lg text-sm font-semibold gradient-btn text-white transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20">
        <div className="absolute top-20 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#00a8ff]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#39ff9e]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-white/70 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#39ff9e] animate-pulse" />
            Live trading · 180,000+ investors
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
            <span className="text-gradient">The Future of</span>
            <br />
            <span className="text-white">Crypto Investing</span>
          </h1>

          <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Experience seamless cryptocurrency investing with AI-powered insights, real-time analytics, and bank-level security.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <Link href="/signup" className="px-8 py-3.5 gradient-btn text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00a8ff]/30 transition text-base">
              Start Investing Free
            </Link>
            <Link href="/login" className="px-8 py-3.5 border border-white/20 text-white rounded-xl hover:bg-white/5 transition font-semibold text-base">
              View Dashboard →
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-12 sm:pt-16 border-t border-white/10 mt-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gradient-primary">{s.value}</p>
                <p className="text-white/50 text-xs sm:text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">Everything You Need</h2>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">A complete platform built for serious crypto investors.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass p-6 rounded-xl border border-white/10 hover:border-[#00a8ff]/40 transition-all duration-300 group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00a8ff] transition-colors">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Investment Plans</h2>
            <p className="text-white/60 text-base sm:text-lg">Choose a plan that fits your goals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {plans.map((p, i) => (
              <div key={i} className={`glass p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${p.popular ? 'border-[#39ff9e]/40' : 'border-white/10'}`}>
                {p.popular && (
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-[#39ff9e]/20 text-[#39ff9e] border border-[#39ff9e]/30 mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                <p className="text-3xl font-bold mb-1" style={{ color: p.color }}>{p.apy}</p>
                <p className="text-white/40 text-xs mb-4">Annual Yield</p>
                <p className="text-white/60 text-sm">From <span className="text-white font-medium">{p.min}</span></p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/signup" className="inline-block px-8 py-3.5 gradient-btn text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00a8ff]/30 transition">
              View All Plans
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-14 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00a8ff]/5 to-[#39ff9e]/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to grow your wealth?</h2>
              <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl mx-auto">Join 180,000+ investors already earning with Vestor Invest. Start with as little as $100.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup" className="px-8 py-3.5 gradient-btn text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00a8ff]/30 transition">
                  Create Free Account
                </Link>
                <Link href="/login" className="px-8 py-3.5 border border-white/20 text-white rounded-xl hover:bg-white/5 transition font-semibold">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Support</a>
              <a href="#" className="hover:text-white transition">Blog</a>
            </div>
            <p className="text-white/30 text-sm">© 2025 Vestor Invest</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
