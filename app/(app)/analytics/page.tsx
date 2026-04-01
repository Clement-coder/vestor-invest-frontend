'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassChart } from '@/components/glass/glass-chart'
import { useAuth } from '@/context/auth-context'
import { getUserInvestments } from '@/lib/supabase/db'
import type { Investment } from '@/lib/supabase/db'
import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import React from 'react'

const RANGE_MS: Record<string, number> = {
  '1W': 7 * 86400000,
  '1M': 30 * 86400000,
  '3M': 90 * 86400000,
  '1Y': 365 * 86400000,
  'ALL': Infinity,
}

const PIE_COLORS = ['#00a8ff', '#39ff9e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('1M')
  const [investments, setInvestments] = useState<Investment[]>([])

  useEffect(() => {
    if (user) getUserInvestments(user.uid).then(setInvestments)
  }, [user])

  const filtered = useMemo(() => {
    const cutoff = Date.now() - RANGE_MS[timeRange]
    return investments.filter(i => i.status === 'completed' && new Date(i.created_at).getTime() >= cutoff)
  }, [investments, timeRange])

  // Metrics
  const totalInvested = filtered.reduce((s, i) => s + Number(i.amount), 0)
  const totalProfit = filtered.reduce((s, i) => s + Number(i.profit_loss ?? 0), 0)
  const currentValue = totalInvested + totalProfit
  const wins = filtered.filter(i => Number(i.profit_loss ?? 0) > 0)
  const losses = filtered.filter(i => Number(i.profit_loss ?? 0) < 0)
  const winRate = filtered.length > 0 ? ((wins.length / filtered.length) * 100).toFixed(1) : null
  const avgTrade = filtered.length > 0 ? (totalProfit / filtered.length).toFixed(2) : null
  const plValues = filtered.map(i => Number(i.profit_loss ?? 0))
  const bestDay = plValues.length > 0 ? Math.max(...plValues).toFixed(2) : null
  const worstDay = plValues.length > 0 ? Math.min(...plValues).toFixed(2) : null
  const roi = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : null

  // Volatility = std dev of profit_loss
  let volatility: string | null = null
  if (plValues.length > 1) {
    const mean = plValues.reduce((a, b) => a + b, 0) / plValues.length
    const variance = plValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / plValues.length
    volatility = Math.sqrt(variance).toFixed(2)
  }

  // Returns over time chart
  let running = 0
  const returnsData = filtered.slice().reverse().map((inv, idx) => {
    running += Number(inv.profit_loss ?? 0)
    return { name: `#${idx + 1}`, cumulative: parseFloat(running.toFixed(2)), pl: parseFloat(Number(inv.profit_loss ?? 0).toFixed(2)) }
  })

  // Monthly comparison
  const monthlyMap: Record<string, { profit: number; loss: number }> = {}
  filtered.forEach(inv => {
    const key = new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!monthlyMap[key]) monthlyMap[key] = { profit: 0, loss: 0 }
    const pl = Number(inv.profit_loss ?? 0)
    if (pl >= 0) monthlyMap[key].profit += pl
    else monthlyMap[key].loss += Math.abs(pl)
  })
  const monthlyData = Object.entries(monthlyMap).map(([name, v]) => ({ name, profit: parseFloat(v.profit.toFixed(2)), loss: parseFloat(v.loss.toFixed(2)) }))

  // Allocation pie: group by amount bucket
  const allocationMap: Record<string, number> = {}
  filtered.forEach(inv => {
    const key = `$${Number(inv.amount)}`
    allocationMap[key] = (allocationMap[key] ?? 0) + Number(inv.amount)
  })
  const allocationData = Object.entries(allocationMap).map(([name, value]) => ({ name, value }))

  const hasData = filtered.length > 0

  const metrics = [
    { label: 'Total ROI', value: roi ? `${roi}%` : '—', positive: roi ? Number(roi) >= 0 : null },
    { label: 'Win Rate', value: winRate ? `${winRate}%` : '—', positive: winRate ? Number(winRate) >= 50 : null },
    { label: 'Avg. Trade', value: avgTrade ? `$${avgTrade}` : '—', positive: avgTrade ? Number(avgTrade) >= 0 : null },
    { label: 'Best Day', value: bestDay ? `+$${bestDay}` : '—', positive: true },
    { label: 'Worst Day', value: worstDay ? `$${worstDay}` : '—', positive: worstDay ? Number(worstDay) >= 0 : null },
    { label: 'Volatility', value: volatility ? `$${volatility}` : '—', positive: null },
  ]

  const ttStyle = { background: '#0a0f25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Analytics</h1>
          <p className="text-white/60 mt-1">Detailed insights into your investment performance</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['1W', '1M', '3M', '1Y', 'ALL'].map(r => (
            <GlassButton key={r} variant={timeRange === r ? 'primary' : 'outline'} size="sm" onClick={() => setTimeRange(r)}>{r}</GlassButton>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((m, i) => (
          <GlassCard key={i} variant="nested">
            <p className="text-white/60 text-sm mb-2">{m.label}</p>
            <p className={`text-2xl font-bold ${m.positive === null ? 'text-white' : m.positive ? 'text-[#39ff9e]' : 'text-red-400'}`}>{m.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {m.positive === null ? <Minus size={12} className="text-white/30" /> : m.positive ? <TrendingUp size={12} className="text-[#39ff9e]" /> : <TrendingDown size={12} className="text-red-400" />}
              <span className="text-xs text-white/30">{hasData ? `${filtered.length} trades` : 'No data yet'}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Returns + Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassChart title="Returns Over Time" subtitle={`Last ${timeRange}`}>
            {hasData ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={returnsData}>
                  <defs>
                    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39ff9e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#39ff9e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={ttStyle} labelStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="cumulative" stroke="#39ff9e" fill="url(#retGrad)" strokeWidth={2} name="Cumulative P/L ($)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/30 text-sm">No investment data for this period</div>
            )}
          </GlassChart>
        </div>

        <GlassChart title="Portfolio Allocation">
          {allocationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {allocationData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={ttStyle} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Invested']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/30 text-sm">No allocation data yet</div>
          )}
        </GlassChart>
      </div>

      {/* Monthly Comparison */}
      <GlassChart title="Monthly Comparison">
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={ttStyle} labelStyle={{ color: '#fff' }} />
              <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
              <Bar dataKey="profit" fill="#39ff9e" name="Profit ($)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loss" fill="#ef4444" name="Loss ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-white/30 text-sm">Monthly data appears as you invest over time</div>
        )}
      </GlassChart>

      {/* Performance Summary + Best Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard variant="elevated">
          <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Invested</span>
              <span className="text-white font-semibold">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Current Value</span>
              <span className="text-white font-semibold">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Profit/Loss</span>
              <span className={`font-bold text-lg ${totalProfit >= 0 ? 'text-[#39ff9e]' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="elevated">
          <h3 className="text-xl font-bold text-white mb-4">Best Performers</h3>
          {wins.length > 0 ? (
            <div className="space-y-2">
              {wins.sort((a, b) => Number(b.profit_loss) - Number(a.profit_loss)).slice(0, 4).map(inv => (
                <div key={inv.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#39ff9e]" />
                    <span className="text-white/70 text-sm">${Number(inv.amount).toLocaleString()} plan</span>
                  </div>
                  <span className="text-[#39ff9e] font-semibold text-sm">+${Number(inv.profit_loss).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-white/30">
              <TrendingUp size={36} strokeWidth={1} />
              <p className="text-sm text-center">Top performers appear once investments complete</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
