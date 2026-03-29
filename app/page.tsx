import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f25] text-white">
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gradient">Vestor Invest</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-[#00a8ff] text-[#0a0f25] rounded-lg hover:bg-[#00c4ff] transition font-semibold">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated background */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#00a8ff]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#39ff9e]/5 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold text-gradient leading-tight">
            The Future of Crypto Investing
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience seamless cryptocurrency investing with AI-powered insights, real-time analytics, and secure transactions.
          </p>

          <div className="flex gap-4 justify-center flex-wrap pt-8">
            <Link href="/signup" className="px-8 py-3 gradient-btn text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00a8ff]/50 transition">
              Get Started
            </Link>
            <button className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gradient">Premium Features</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'AI-Powered Insights', desc: 'Advanced algorithms analyze market trends' },
              { title: 'Real-Time Analytics', desc: 'Track your portfolio performance live' },
              { title: 'Secure Transactions', desc: 'Bank-level security for all trades' },
            ].map((feature, idx) => (
              <div key={idx} className="glass p-6 rounded-lg hover:border-[#00a8ff]/50 transition">
                <h3 className="text-xl font-semibold mb-3 text-[#00a8ff]">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="glass max-w-4xl mx-auto rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start investing?</h2>
          <p className="text-white/80 mb-8">Join thousands of investors using Vestor Invest today.</p>
          <Link href="/signup" className="inline-block px-8 py-3 gradient-btn text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00a8ff]/50 transition">
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/15 py-8 px-4 text-center text-white/60">
        <p>&copy; 2024 Vestor Invest. All rights reserved.</p>
      </footer>
    </div>
  )
}
