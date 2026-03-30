'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassChart } from '@/components/glass/glass-chart'
import { TrendingUp, TrendingDown, Minus, BarChart2, PieChart as PieIcon, Activity } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

const metrics = [
  { label: 'Total ROI', value: '—', trend: 'neutral', color: 'text-white/40' },
  { label: 'Win Rate', value: '—', trend: 'neutral', color: 'text-white/40' },
  { label: 'Avg. Trade', value: '—', trend: 'neutral', color: 'text-white/40' },
  { label: 'Best Day', value: '—', trend: 'neutral', color: 'text-white/40' },
  { label: 'Worst Day', value: '—', trend: 'neutral', color: 'text-white/40' },
  { label: 'Volatility', value: '—', trend: 'neutral', color: 'text-white/40' },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('1M')

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Analytics</h1>
          <p className="text-white/60 mt-2">Detailed insights into your investment performance</p>
        </div>
        <div className="flex gap-2">
          {['1W', '1M', '3M', '1Y', 'ALL'].map(range => (
            <GlassButton key={range} variant={timeRange === range ? 'primary' : 'outline'} size="sm" onClick={() => setTimeRange(range)}>
              {range}
            </GlassButton>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((metric, idx) => (
          <GlassCard key={idx} variant="nested">
            <p className="text-white/60 text-sm mb-2">{metric.label}</p>
            <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <Minus size={12} className="text-white/30" />
              <span className="text-xs text-white/30">No data yet</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts — empty states */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassChart title="Returns Over Time" subtitle={`Last ${timeRange}`}>
            <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-white/30">
              <Activity size={48} strokeWidth={1} />
              <p className="text-sm text-center max-w-xs">Returns chart will populate once you have investment activity</p>
            </div>
          </GlassChart>
        </div>
        <GlassChart title="Portfolio Allocation">
          <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-white/30">
            <PieIcon size={48} strokeWidth={1} />
            <p className="text-sm text-center max-w-xs">Allocation breakdown appears after your first investment</p>
          </div>
        </GlassChart>
      </div>

      <GlassChart title="Monthly Comparison">
        <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-white/30">
          <BarChart2 size={48} strokeWidth={1} />
          <p className="text-sm text-center max-w-xs">Monthly comparison data will appear here as you invest over time</p>
        </div>
      </GlassChart>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard variant="elevated">
          <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Invested</span>
              <span className="text-white/40 font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Current Value</span>
              <span className="text-white/40 font-semibold">$0.00</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Profit</span>
              <span className="text-white/40 font-bold text-lg">$0.00</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="elevated">
          <h3 className="text-xl font-bold text-white mb-4">Best Performers</h3>
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-white/30">
            <TrendingUp size={36} strokeWidth={1} />
            <p className="text-sm text-center">Your top performing assets will appear here once you start investing</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
