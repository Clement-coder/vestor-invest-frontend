'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassChart } from '@/components/glass/glass-chart'
import { GlassModal } from '@/components/glass/glass-modal'
import { useState } from 'react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Check, BarChart2, ArrowRightLeft, Wallet } from 'lucide-react'
import React from 'react'

const plans = [
  { name: 'Starter', apy: '8.5%', min: '$100', features: ['Basic Analytics', 'Daily Updates', 'Email Support'], glow: 'cyan' },
  { name: 'Growth', apy: '12.5%', min: '$1,000', features: ['Advanced Analytics', 'Real-time Updates', 'Priority Support'], glow: 'none' },
  { name: 'Premium', apy: '16.5%', min: '$10,000', features: ['AI Insights', 'Live Trading', 'Dedicated Manager'], glow: 'green' },
]

export default function DashboardPage() {
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Portfolio Overview */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Portfolio Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <GlassCard variant="elevated" glow="cyan">
            <p className="text-white/60 text-sm mb-2">Total Balance</p>
            <p className="text-2xl sm:text-4xl font-bold text-white">$0.00</p>
            <p className="text-white/40 text-sm mt-2">No activity yet</p>
          </GlassCard>
          <GlassCard variant="elevated">
            <p className="text-white/60 text-sm mb-2">Portfolio Value</p>
            <p className="text-2xl sm:text-4xl font-bold text-white">$0.00</p>
            <p className="text-white/40 text-sm mt-2">No investments yet</p>
          </GlassCard>
          <GlassCard variant="elevated" glow="green">
            <p className="text-white/60 text-sm mb-2">Monthly Returns</p>
            <p className="text-2xl sm:text-4xl font-bold text-white">$0.00</p>
            <p className="text-white/40 text-sm mt-2">Start investing to earn</p>
          </GlassCard>
        </div>
      </div>

      {/* Charts — empty state */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassChart title="Portfolio Performance" subtitle="No data yet">
          <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-white/30">
            <BarChart2 size={48} strokeWidth={1} />
            <p className="text-sm">Your performance chart will appear here once you invest</p>
          </div>
        </GlassChart>
        <GlassChart title="Investment Trend" subtitle="No data yet">
          <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-white/30">
            <TrendingUp size={48} strokeWidth={1} />
            <p className="text-sm">Investment trends will show here after your first deposit</p>
          </div>
        </GlassChart>
      </div>

      {/* Investment Plans */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Investment Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan, index) => (
            <GlassCard key={index} variant="elevated" hover glow={plan.glow as 'cyan' | 'green' | 'none'} className="flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-neon-cyan mb-4">{plan.apy}</p>
              <p className="text-white/60 text-sm mb-4">Min. Investment: {plan.min}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                    <Check size={13} className="text-[#39ff9e] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <GlassButton variant="primary" size="sm" className="w-full" onClick={() => setInvestmentModalOpen(true)}>
                Invest Now
              </GlassButton>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent Transactions — empty state */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
        <GlassCard variant="nested" className="flex flex-col items-center justify-center py-16 gap-4 text-white/30">
          <ArrowRightLeft size={48} strokeWidth={1} />
          <p className="text-base font-medium">No transactions yet</p>
          <p className="text-sm text-center max-w-xs">Your recent investment activity will appear here once you make your first transaction.</p>
        </GlassCard>
      </div>

      {/* Investment Modal */}
      <GlassModal isOpen={investmentModalOpen} onClose={() => setInvestmentModalOpen(false)} title="Start Investment" neonBorder="cyan">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Investment Amount</label>
            <input type="number" placeholder="Enter amount in USD" className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Select Plan</label>
            <select className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50">
              <option className="bg-background text-white">Starter - 8.5% APY</option>
              <option className="bg-background text-white">Growth - 12.5% APY</option>
              <option className="bg-background text-white">Premium - 16.5% APY</option>
            </select>
          </div>
          <GlassButton variant="primary" className="w-full">Confirm Investment</GlassButton>
        </div>
      </GlassModal>
    </div>
  )
}
