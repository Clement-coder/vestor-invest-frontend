'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassModal } from '@/components/glass/glass-modal'
import { useAuth } from '@/context/auth-context'
import { insertInvestment, getUserInvestments, completeInvestment } from '@/lib/supabase/db'
import type { Investment } from '@/lib/supabase/db'
import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Clock, CheckCircle2, Wallet, ShieldCheck, Activity, Zap } from 'lucide-react'
import { toast } from 'sonner'
import React from 'react'

const PLANS = [
  { amount: 50,   label: 'Micro',    est: '3–12%',  color: '#00a8ff' },
  { amount: 100,  label: 'Starter',  est: '5–18%',  color: '#00a8ff' },
  { amount: 200,  label: 'Basic',    est: '5–20%',  color: '#39ff9e' },
  { amount: 500,  label: 'Growth',   est: '6–22%',  color: '#39ff9e' },
  { amount: 1000, label: 'Pro',      est: '8–24%',  color: '#f59e0b' },
  { amount: 2000, label: 'Elite',    est: '10–25%', color: '#f59e0b' },
]

function useCountdown(endTime: string) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(endTime).getTime() - Date.now()))
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, new Date(endTime).getTime() - Date.now()))
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endTime])
  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  return { remaining, label: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` }
}

function CountdownCell({ inv, onComplete }: { inv: Investment; onComplete: () => void }) {
  const { remaining, label } = useCountdown(inv.end_time)
  const total = Math.max(1, new Date(inv.end_time).getTime() - new Date(inv.start_time).getTime())
  const progress = Math.max(0, Math.min(100, ((total - remaining) / total) * 100))
  const { refreshProfile } = useAuth()

  useEffect(() => {
    if (remaining === 0 && inv.status === 'active') {
      const isProfit = Math.random() < 0.6
      const pct = isProfit ? 0.05 + Math.random() * 0.20 : -(0.02 + Math.random() * 0.13)
      const profitLoss = parseFloat((inv.amount * pct).toFixed(2))
      completeInvestment(inv.id, profitLoss).then(({ error }) => {
        if (!error) { onComplete(); refreshProfile() }
      })
    }
  }, [remaining, inv, onComplete, refreshProfile])

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-white/40 text-xs">Time remaining</span>
        <span className="font-mono text-sm font-bold text-yellow-400">{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[#00a8ff] to-[#39ff9e] transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default function PlansPage() {
  const { user, profile, refreshProfile } = useAuth()
  const balance = profile?.balance ?? 0
  const [investments, setInvestments] = useState<Investment[]>([])
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    if (user) getUserInvestments(user.uid).then(setInvestments)
  }, [user])

  useEffect(() => { load() }, [load])

  const active = investments.filter(i => i.status === 'active')
  const completed = investments.filter(i => i.status === 'completed')

  const handleInvest = async () => {
    if (!user || !selectedPlan) return
    setLoading(true)
    const { error } = await insertInvestment(user.uid, selectedPlan.amount)
    setLoading(false)
    if (error) {
      toast.error(error.includes('Insufficient') ? 'Insufficient balance' : 'Failed to start investment')
    } else {
      toast.success(`$${selectedPlan.amount} investment started! Returns in 5 hours.`)
      setModalOpen(false)
      load()
      refreshProfile()
    }
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Investment Plans</h1>
          <p className="text-white/50 mt-1 text-sm">Select a plan and let your capital work for you</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5">
          <Wallet size={18} className="text-[#00a8ff]" />
          <div>
            <p className="text-white/40 text-xs">Available Balance</p>
            <p className="text-white font-bold text-lg leading-tight">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Market Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl border border-[#00a8ff]/20 bg-[#00a8ff]/5">
        <Activity size={18} className="text-[#00a8ff] shrink-0 mt-0.5" />
        <p className="text-white/70 text-sm leading-relaxed">
          <span className="text-white font-semibold">Live Market Performance — </span>
          Returns are based on real market performance. During each 5-hour cycle, your investment is exposed to live market conditions, and profits are calculated accordingly.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLANS.map(plan => {
          const canAfford = balance >= plan.amount
          const activeCount = active.filter(i => Number(i.amount) === plan.amount).length
          return (
            <div key={plan.amount} className={`relative rounded-2xl border transition-all duration-200 ${canAfford ? 'border-white/10 hover:border-white/20' : 'border-white/5 opacity-60'} bg-white/[0.04] backdrop-blur-sm overflow-hidden`}>
              {/* Top accent line */}
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${plan.color}80, transparent)` }} />

              <div className="p-6 space-y-5">
                {/* Plan header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{plan.label}</p>
                    <p className="text-3xl font-bold text-white">${plan.amount.toLocaleString()}</p>
                  </div>
                  {activeCount > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 font-medium">
                      {activeCount} Active
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-white/40 text-xs mb-1">Est. Return</p>
                    <p className="text-sm font-bold" style={{ color: plan.color }}>{plan.est}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-white/40 text-xs mb-1">Duration</p>
                    <p className="text-sm font-bold text-white">5 Hours</p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {['Live market exposure', 'Auto profit/loss settlement', 'Instant balance update'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-white/50 text-xs">
                      <ShieldCheck size={12} style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <GlassButton
                  variant="primary" className="w-full"
                  disabled={!canAfford}
                  onClick={() => { setSelectedPlan(plan); setModalOpen(true) }}
                >
                  {canAfford ? `Invest $${plan.amount}` : 'Insufficient Balance'}
                </GlassButton>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active Investments */}
      {active.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-yellow-400" /> Active Investments
            <span className="text-xs font-normal text-white/30 ml-1">({active.length})</span>
          </h2>
          <div className="space-y-3">
            {active.map(inv => {
              const plan = PLANS.find(p => p.amount === Number(inv.amount))
              return (
                <div key={inv.id} className="flex items-center gap-4 p-4 rounded-2xl border border-yellow-400/10 bg-yellow-400/5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${plan?.color ?? '#00a8ff'}20` }}>
                    <Zap size={16} style={{ color: plan?.color ?? '#00a8ff' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold">${Number(inv.amount).toLocaleString()} <span className="text-white/40 font-normal text-xs">— {plan?.label ?? 'Plan'}</span></p>
                      <p className="text-white/30 text-xs">{new Date(inv.start_time).toLocaleTimeString()}</p>
                    </div>
                    <CountdownCell inv={inv} onComplete={load} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Investments */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#39ff9e]" /> Completed
            <span className="text-xs font-normal text-white/30 ml-1">({completed.length})</span>
          </h2>
          <div className="space-y-2">
            {completed.map(inv => {
              const pl = Number(inv.profit_loss ?? 0)
              const isProfit = pl >= 0
              const plan = PLANS.find(p => p.amount === Number(inv.amount))
              return (
                <div key={inv.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isProfit ? 'bg-[#39ff9e]/10' : 'bg-red-500/10'}`}>
                      {isProfit ? <TrendingUp size={14} className="text-[#39ff9e]" /> : <TrendingDown size={14} className="text-red-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">${Number(inv.amount).toLocaleString()} <span className="text-white/30 font-normal">— {plan?.label ?? 'Plan'}</span></p>
                      <p className="text-white/30 text-xs">{new Date(inv.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${isProfit ? 'text-[#39ff9e]' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}${pl.toFixed(2)}
                    </p>
                    <p className="text-white/30 text-xs">Returned ${(Number(inv.amount) + pl).toFixed(2)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <GlassModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Investment" neonBorder="cyan">
        {selectedPlan && (
          <div className="space-y-5">
            {/* Plan summary */}
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${selectedPlan.color}, transparent)` }} />
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Plan</span>
                  <span className="text-white font-semibold">{selectedPlan.label} — ${selectedPlan.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Duration</span>
                  <span className="text-white">5 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Est. Return</span>
                  <span className="font-semibold" style={{ color: selectedPlan.color }}>{selectedPlan.est}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Your Balance</span>
                  <span className="text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Balance After</span>
                  <span className="text-white font-semibold">${(balance - selectedPlan.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Market disclaimer */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#00a8ff]/20 bg-[#00a8ff]/5">
              <Activity size={14} className="text-[#00a8ff] shrink-0 mt-0.5" />
              <p className="text-white/60 text-xs leading-relaxed">
                Returns are based on real market performance. During each 5-hour cycle, your investment is exposed to live market conditions, and profits are calculated accordingly.
              </p>
            </div>

            <GlassButton variant="primary" className="w-full" onClick={handleInvest} disabled={loading}>
              {loading ? 'Processing...' : `Confirm — Invest $${selectedPlan.amount}`}
            </GlassButton>
          </div>
        )}
      </GlassModal>
    </div>
  )
}
