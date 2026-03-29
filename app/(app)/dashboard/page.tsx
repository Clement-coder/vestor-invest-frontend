'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassChart } from '@/components/glass/glass-chart'
import { GlassModal } from '@/components/glass/glass-modal'
import { useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import React from 'react'

const chartData = [
  { name: 'Jan', value: 4000, investment: 2400 },
  { name: 'Feb', value: 3000, investment: 1398 },
  { name: 'Mar', value: 2000, investment: 9800 },
  { name: 'Apr', value: 2780, investment: 3908 },
  { name: 'May', value: 1890, investment: 4800 },
  { name: 'Jun', value: 2390, investment: 3800 },
  { name: 'Jul', value: 3490, investment: 4300 },
]

const transactions = [
  {
    id: 1,
    type: 'Investment',
    amount: '+$1,250.00',
    status: 'Completed',
    date: 'Today',
    color: 'text-neon-green',
  },
  {
    id: 2,
    type: 'Withdrawal',
    amount: '-$500.00',
    status: 'Pending',
    date: 'Yesterday',
    color: 'text-neon-cyan',
  },
  {
    id: 3,
    type: 'Dividend',
    amount: '+$342.50',
    status: 'Completed',
    date: '2 days ago',
    color: 'text-neon-green',
  },
  {
    id: 4,
    type: 'Investment',
    amount: '+$2,100.00',
    status: 'Completed',
    date: '3 days ago',
    color: 'text-neon-green',
  },
]

export default function DashboardPage() {
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Portfolio Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard variant="elevated" glow="cyan">
            <p className="text-white/60 text-sm mb-2">Total Balance</p>
            <p className="text-4xl font-bold text-white">$12,450.50</p>
            <p className="text-neon-green text-sm mt-2">+12.5% this month</p>
          </GlassCard>

          <GlassCard variant="elevated">
            <p className="text-white/60 text-sm mb-2">Portfolio Value</p>
            <p className="text-4xl font-bold text-white">$45,230.00</p>
            <p className="text-neon-cyan text-sm mt-2">+5.2% this year</p>
          </GlassCard>

          <GlassCard variant="elevated" glow="green">
            <p className="text-white/60 text-sm mb-2">Monthly Returns</p>
            <p className="text-4xl font-bold text-white">$1,245.50</p>
            <p className="text-neon-green text-sm mt-2">+18.3% growth</p>
          </GlassCard>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassChart title="Portfolio Performance" subtitle="Last 7 months">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A8FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00A8FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.3)" />
              <YAxis stroke="rgba(255,255,255,0.3)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 15, 37, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#00A8FF"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassChart>

        <GlassChart title="Investment Trend" subtitle="Monthly comparison">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.3)" />
              <YAxis stroke="rgba(255,255,255,0.3)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 15, 37, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="investment"
                stroke="#39FF9E"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassChart>
      </div>

      {/* Investment Plans */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Investment Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter',
              apy: '8.5%',
              min: '$100',
              features: ['Basic Analytics', 'Daily Updates', 'Email Support'],
              glow: 'cyan',
            },
            {
              name: 'Growth',
              apy: '12.5%',
              min: '$1,000',
              features: [
                'Advanced Analytics',
                'Real-time Updates',
                'Priority Support',
              ],
              glow: 'none',
            },
            {
              name: 'Premium',
              apy: '16.5%',
              min: '$10,000',
              features: [
                'AI Insights',
                'Live Trading',
                'Dedicated Manager',
              ],
              glow: 'green',
            },
          ].map((plan, index) => (
            <GlassCard
              key={index}
              variant="elevated"
              hover
              glow={plan.glow as 'cyan' | 'green' | 'none'}
              className="flex flex-col"
            >
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-neon-cyan mb-4">{plan.apy}</p>
              <p className="text-white/60 text-sm mb-4">Min. Investment: {plan.min}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                    <span className="text-neon-green">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <GlassButton
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setInvestmentModalOpen(true)}
              >
                Invest Now
              </GlassButton>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.map(tx => (
            <GlassCard
              key={tx.id}
              variant="nested"
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  {tx.type === 'Investment' && '📈'}
                  {tx.type === 'Withdrawal' && '📉'}
                  {tx.type === 'Dividend' && '💰'}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.type}</p>
                  <p className="text-white/50 text-sm">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.color}`}>{tx.amount}</p>
                <p className="text-white/50 text-sm">{tx.status}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Investment Modal */}
      <GlassModal
        isOpen={investmentModalOpen}
        onClose={() => setInvestmentModalOpen(false)}
        title="Start Investment"
        neonBorder="cyan"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Investment Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount in USD"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Select Plan
            </label>
            <select className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50">
              <option className="bg-background text-white">Starter - 8.5% APY</option>
              <option className="bg-background text-white">Growth - 12.5% APY</option>
              <option className="bg-background text-white">Premium - 16.5% APY</option>
            </select>
          </div>
          <GlassButton
            variant="primary"
            className="w-full"
          >
            Confirm Investment
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  )
}
