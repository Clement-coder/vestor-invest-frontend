import Link from 'next/link'
import { Logo } from '@/components/common/logo'

export default function SupportPage() {
  const faqs = [
    { q: 'How do I start investing?', a: 'Sign up, verify your email, choose an investment plan, and fund your account. The whole process takes under 5 minutes.' },
    { q: 'What is the minimum investment?', a: 'You can start with as little as $100 on our Starter plan.' },
    { q: 'How are returns calculated?', a: 'Returns are calculated daily based on your plan\'s APY and compounded monthly.' },
    { q: 'How do I withdraw funds?', a: 'Go to Wallet → Withdraw, enter your amount and wallet address. Withdrawals are processed within 24 hours.' },
    { q: 'Is my investment insured?', a: 'We use bank-level security and cold storage for assets. However, crypto investments carry inherent market risk.' },
    { q: 'How do I contact support?', a: 'Email us at support@vestorinvest.com or use the live chat below. We respond within 2 hours.' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f25] text-white">
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/signup" className="px-4 py-2 rounded-lg text-sm font-semibold gradient-btn text-white">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Support Center</h1>
          <p className="text-white/60">Find answers or reach out to our team</p>
        </div>

        <div className="space-y-3 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Still need help?</h2>
          <p className="text-white/60 text-sm mb-4">Our support team is available 24/7</p>
          <a href="mailto:support@vestorinvest.com" className="inline-block px-6 py-3 gradient-btn text-white font-semibold rounded-xl text-sm">
            Email Support
          </a>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 px-4 text-center text-white/30 text-sm">
        © 2025 Vestor Invest · <Link href="/privacy" className="hover:text-white transition">Privacy</Link> · <Link href="/terms" className="hover:text-white transition">Terms</Link>
      </footer>
    </div>
  )
}
