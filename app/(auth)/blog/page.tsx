import Link from 'next/link'
import { Logo } from '@/components/common/logo'

const posts = [
  { title: 'How to Maximize Returns with the Growth Plan', date: 'Mar 25, 2026', category: 'Strategy', read: '5 min read', desc: 'Learn how experienced investors use the Growth plan to compound returns over 12-month cycles.' },
  { title: 'Understanding Crypto Market Cycles', date: 'Mar 18, 2026', category: 'Education', read: '8 min read', desc: 'A deep dive into bull and bear market patterns and how Vestor Invest protects your portfolio.' },
  { title: 'Portfolio Diversification in 2026', date: 'Mar 10, 2026', category: 'Strategy', read: '6 min read', desc: 'Why spreading across BTC, ETH, and altcoins reduces risk while maintaining strong returns.' },
  { title: 'New Feature: Real-Time Portfolio Analytics', date: 'Mar 1, 2026', category: 'Product', read: '3 min read', desc: 'We launched advanced analytics with live P&L tracking, allocation charts, and performance benchmarks.' },
  { title: 'Beginner\'s Guide to Crypto Investing', date: 'Feb 20, 2026', category: 'Education', read: '10 min read', desc: 'Everything you need to know before making your first crypto investment on Vestor Invest.' },
  { title: 'Security Update: Enhanced 2FA & Cold Storage', date: 'Feb 10, 2026', category: 'Security', read: '4 min read', desc: 'How we upgraded our security infrastructure to protect over $2.4B in assets under management.' },
]

const categoryColor: Record<string, string> = {
  Strategy: 'text-[#00a8ff] bg-[#00a8ff]/10 border-[#00a8ff]/20',
  Education: 'text-[#39ff9e] bg-[#39ff9e]/10 border-[#39ff9e]/20',
  Product: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  Security: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/signup" className="px-4 py-2  text-sm font-semibold gradient-btn text-white hover:scale-[0.97]">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Vestor Invest Blog</h1>
          <p className="text-white/60">Insights, strategies, and updates from our team</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <div key={i} className="glass  border border-white/10 hover:border-[#00a8ff]/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer">
              <div className="h-2 w-full bg-[#00a8ff]" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryColor[post.category]}`}>{post.category}</span>
                  <span className="text-white/30 text-xs">{post.read}</span>
                </div>
                <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-[#00a8ff] transition-colors">{post.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-3">{post.desc}</p>
                <p className="text-white/30 text-xs">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 px-4 text-center text-white/30 text-sm">
        © 2025 Vestor Invest · <Link href="/privacy" className="hover:text-white transition">Privacy</Link> · <Link href="/terms" className="hover:text-white transition">Terms</Link>
      </footer>
    </div>
  )
}
