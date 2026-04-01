'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassChart } from '@/components/glass/glass-chart'
import { useAuth } from '@/context/auth-context'
import { getUserInvestments } from '@/lib/supabase/db'
import type { Investment } from '@/lib/supabase/db'
import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, ArrowRightLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const balance = profile?.balance ?? 0
  const [investments, setInvestments] = useState<Investment[]>([])

  useEffect(() => {
    if (user) getUserInvestments(user.uid).then(setInvestments)
  }, [user])

  const completed = investments.filter(i => i.status === 'completed')
  const active = investments.filter(i => i.status === 'active')

  const totalInvested = investments.reduce((s, i) => s + Number(i.amount), 0)
  const totalProfit = completed.reduce((s, i) => s + Number(i.profit_loss ?? 0), 0)
  const activeValue = active.reduce((s, i) => s + Number(i.amount), 0)

  // Build performance chart data from completed investments
  const perfData = completed.slice().reverse().map((inv, idx) => ({
    name: `#${idx + 1}`,
    value: parseFloat((Number(inv.amount) + Number(inv.profit_loss ?? 0)).toFixed(2)),
    profit: parseFloat(Number(inv.profit_loss ?? 0).toFixed(2)),
  }))

  // Build trend data: cumulative balance over time
  let running = 0
  const trendData = completed.slice().reverse().map((inv, idx) => {
    running += Number(inv.profit_loss ?? 0)
    return { name: `#${idx + 1}`, cumulative: parseFloat(running.toFixed(2)) }
  })

  const hasData = completed.length > 0

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Portfolio Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <GlassCard variant="elevated" glow="cyan">
          <p className="text-white/60 text-sm mb-2">Total Balance</p>
          <p className="text-2xl sm:text-4xl font-bold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-white/40 text-sm mt-2">{active.length > 0 ? `${active.length} active investment${active.length > 1 ? 's' : ''}` : 'Available balance'}</p>
        </GlassCard>
        <GlassCard variant="elevated">
          <p className="text-white/60 text-sm mb-2">Active Investments</p>
          <p className="text-2xl sm:text-4xl font-bold text-white">${activeValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-white/40 text-sm mt-2">{active.length} plan{active.length !== 1 ? 's' : ''} running</p>
        </GlassCard>
        <GlassCard variant="elevated" glow={totalProfit >= 0 ? 'green' : 'none'}>
          <p className="text-white/60 text-sm mb-2">Total Returns</p>
          <p className={`text-2xl sm:text-4xl font-bold ${totalProfit > 0 ? 'text-[#39ff9e]' : totalProfit < 0 ? 'text-red-400' : 'text-white'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-white/40 text-sm mt-2">{completed.length} completed</p>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassChart title="Portfolio Performance" subtitle={hasData ? `${completed.length} completed investments` : 'No data yet'}>
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={perfData}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a8ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00a8ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0a0f25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#00a8ff" fill="url(#perfGrad)" strokeWidth={2} name="Returned ($)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-white/30">
              <p className="text-sm">Chart appears after your first investment completes</p>
              <Link href="/plans"><span className="text-[#00a8ff] text-sm underline">Start investing →</span></Link>
            </div>
          )}
        </GlassChart>

        <GlassChart title="Profit / Loss Trend" subtitle={hasData ? 'Cumulative returns' : 'No data yet'}>
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0a0f25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="cumulative" stroke="#39ff9e" strokeWidth={2} dot={{ fill: '#39ff9e', r: 4 }} name="Cumulative P/L ($)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-white/30">
              <p className="text-sm">Trend appears after investments complete</p>
            </div>
          )}
        </GlassChart>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <Link href="/plans"><GlassCard variant="nested" className="px-4 py-2 text-sm text-[#00a8ff] cursor-pointer hover:bg-white/10 transition-all">+ New Investment</GlassCard></Link>
        </div>

        {investments.length === 0 ? (
          <GlassCard variant="nested" className="flex flex-col items-center justify-center py-16 gap-4 text-white/30">
            <ArrowRightLeft size={48} strokeWidth={1} />
            <p className="text-base font-medium">No investments yet</p>
            <Link href="/plans"><span className="text-[#00a8ff] text-sm underline">Browse investment plans →</span></Link>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {investments.slice(0, 8).map(inv => {
              const pl = Number(inv.profit_loss ?? 0)
              const isActive = inv.status === 'active'
              const isProfit = pl >= 0
              return (
                <GlassCard key={inv.id} variant="nested" className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {isActive
                      ? <Clock size={16} className="text-yellow-400 shrink-0" />
                      : isProfit
                        ? <TrendingUp size={16} className="text-[#39ff9e] shrink-0" />
                        : <TrendingDown size={16} className="text-red-400 shrink-0" />}
                    <div>
                      <p className="text-white text-sm font-semibold">${Number(inv.amount).toLocaleString()} investment</p>
                      <p className="text-white/40 text-xs">{new Date(inv.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isActive ? (
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full">Active</span>
                    ) : (
                      <>
                        <p className={`font-bold text-sm ${isProfit ? 'text-[#39ff9e]' : 'text-red-400'}`}>
                          {isProfit ? '+' : ''}${pl.toFixed(2)}
                        </p>
                        <p className="text-white/40 text-xs">Returned ${(Number(inv.amount) + pl).toFixed(2)}</p>
                      </>
                    )}
                  </div>
                </GlassCard>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
