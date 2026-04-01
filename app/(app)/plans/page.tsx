'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassModal } from '@/components/glass/glass-modal'
import { useAuth } from '@/context/auth-context'
import { insertInvestment, getUserInvestments, completeInvestment } from '@/lib/supabase/db'
import type { Investment } from '@/lib/supabase/db'
import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import React from 'react'

const PLANS = [50, 100, 200, 500, 1000, 2000]
const DURATION_MS = 5 * 60 * 60 * 1000 // 5 hours

function useCountdown(endTime: string) {
  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, new Date(endTime).getTime() - Date.now()))
    tick()
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

  useEffect(() => {
    if (remaining === 0 && inv.status === 'active') {
      // Random profit/loss: 60% chance profit (5–25%), 40% chance loss (2–15%)
      const isProfit = Math.random() < 0.6
      const pct = isProfit
        ? 0.05 + Math.random() * 0.20
        : -(0.02 + Math.random() * 0.13)
      const profitLoss = parseFloat((inv.amount * pct).toFixed(2))
      completeInvestment(inv.id, profitLoss).then(({ error }) => {
        if (!error) onComplete()
      })
    }
  }, [remaining, inv, onComplete])

  return <span className="font-mono text-yellow-400">{label}</span>
}

export default function PlansPage() {
  const { user, profile } = useAuth()
  const balance = profile?.balance ?? 0
  const [investments, setInvestments] = useState<Investment[]>([])
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    if (user) getUserInvestments(user.uid).then(setInvestments)
  }, [user])

  useEffect(() => { load() }, [load])

  const active = investments.filter(i => i.status === 'active')
  const completed = investments.filter(i => i.status === 'completed')

  const handleInvest = async () => {
    if (!user || !selectedAmount) return
    setLoading(true)
    const { error } = await insertInvestment(user.uid, selectedAmount)
    setLoading(false)
    if (error) {
      toast.error(error.includes('Insufficient') ? 'Insufficient balance' : 'Failed to invest')
    } else {
      toast.success(`$${selectedAmount} investment started! Returns in 5 hours.`)
      setModalOpen(false)
      load()
      // Refresh profile balance via page reload context
      window.location.reload()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Investment Plans</h1>
          <p className="text-white/60 mt-1">5-hour investment cycles with real market returns</p>
        </div>
        <GlassCard variant="nested" className="flex items-center gap-3 px-5 py-3">
          <span className="text-white/50 text-sm">Balance</span>
          <span className="text-white font-bold text-lg">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </GlassCard>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {PLANS.map(amount => {
          const canAfford = balance >= amount
          return (
            <GlassCard key={amount} variant="elevated" hover={canAfford}
              className={`flex flex-col items-center text-center gap-3 py-6 ${!canAfford ? 'opacity-50' : ''}`}>
              <p className="text-white/50 text-xs uppercase tracking-widest">Invest</p>
              <p className="text-2xl font-bold text-white">${amount}</p>
              <p className="text-xs text-white/40">5 hour cycle</p>
              <GlassButton
                variant="primary" size="sm" className="w-full mt-2"
                disabled={!canAfford}
                onClick={() => { setSelectedAmount(amount); setModalOpen(true) }}
              >
                {canAfford ? 'Select' : 'Low Balance'}
              </GlassButton>
            </GlassCard>
          )
        })}
      </div>

      {/* Active Investments */}
      {active.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-yellow-400" /> Active Investments
          </h2>
          <div className="space-y-3">
            {active.map(inv => (
              <GlassCard key={inv.id} variant="nested" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <div>
                    <p className="text-white font-semibold">${Number(inv.amount).toLocaleString()}</p>
                    <p className="text-white/40 text-xs">Started {new Date(inv.start_time).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs mb-1">Time remaining</p>
                  <CountdownCell inv={inv} onComplete={load} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Completed Investments */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#39ff9e]" /> Completed Investments
          </h2>
          <div className="space-y-3">
            {completed.map(inv => {
              const pl = Number(inv.profit_loss ?? 0)
              const isProfit = pl >= 0
              return (
                <GlassCard key={inv.id} variant="nested" className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {isProfit
                      ? <TrendingUp size={18} className="text-[#39ff9e] shrink-0" />
                      : <TrendingDown size={18} className="text-red-400 shrink-0" />}
                    <div>
                      <p className="text-white font-semibold">${Number(inv.amount).toLocaleString()} invested</p>
                      <p className="text-white/40 text-xs">{new Date(inv.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isProfit ? 'text-[#39ff9e]' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}${pl.toFixed(2)}
                    </p>
                    <p className="text-white/40 text-xs">
                      Returned: ${(Number(inv.amount) + pl).toFixed(2)}
                    </p>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <GlassModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Investment" neonBorder="cyan">
        {selectedAmount && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Amount</span>
                <span className="text-white font-bold">${selectedAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Duration</span>
                <span className="text-white">5 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Your Balance</span>
                <span className="text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Balance After</span>
                <span className={balance - selectedAmount < 0 ? 'text-red-400' : 'text-white'}>
                  ${(balance - selectedAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-white/40 bg-white/5 rounded-lg p-3">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              Returns are based on market performance. Profit or loss will be applied after 5 hours.
            </div>
            <GlassButton variant="primary" className="w-full" onClick={handleInvest} disabled={loading}>
              {loading ? 'Processing...' : `Invest $${selectedAmount}`}
            </GlassButton>
          </div>
        )}
      </GlassModal>
    </div>
  )
}
