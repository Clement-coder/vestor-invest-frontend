'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassSelect } from '@/components/glass/glass-select'
import { GlassModal } from '@/components/glass/glass-modal'
import { TransactionReceipt } from '@/components/common/transaction-receipt'
import { getTransactions } from '@/lib/supabase/db'
import { useAuth } from '@/context/auth-context'
import type { Transaction } from '@/lib/supabase/db'
import { TrendingDown, ArrowRightLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import React from 'react'

const statusColor: Record<string, string> = {
  Completed: 'text-[#39ff9e] bg-[#39ff9e]/10 border-[#39ff9e]/20',
  Pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Failed: 'text-red-400 bg-red-400/10 border-red-400/20',
}

function toTxRecord(tx: Transaction) {
  return {
    id: tx.id,
    type: tx.type as 'Withdrawal',
    method: (tx.method ?? 'bank') as 'bank' | 'crypto',
    amount: tx.amount.toString(),
    status: tx.status as 'Pending' | 'Completed' | 'Failed',
    date: new Date(tx.created_at).toLocaleString(),
    name: tx.beneficiary_name ?? undefined,
    bankName: tx.bank_name ?? undefined,
    swift: tx.swift ?? undefined,
    iban: tx.iban ?? undefined,
    routing: tx.routing ?? undefined,
    network: tx.network ?? undefined,
    address: tx.address ?? undefined,
  }
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const [txs, setTxs] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  useEffect(() => {
    if (!user) return
    getTransactions(user.uid).then(setTxs)
  }, [user])

  const filtered = txs.filter(tx => {
    const matchSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.beneficiary_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.address?.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchStatus = filterStatus === 'All' || tx.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-white/60">View and manage all your transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput placeholder="Search by ID, name or address..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <GlassSelect value={filterStatus} onChange={setFilterStatus} options={[
          { value: 'All', label: 'All Status' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Failed', label: 'Failed' },
        ]} />
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? filtered.map(tx => (
          <button key={tx.id} onClick={() => setSelectedTx(tx)} className="w-full text-left">
            <GlassCard variant="nested" hover className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <TrendingDown size={18} style={{ color: tx.type === 'Credit' ? '#39ff9e' : 'var(--primary)' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">
                      {tx.type === 'Credit' ? 'Account Credit' : tx.method === 'bank' ? 'Bank Wire' : 'Crypto'} {tx.type !== 'Credit' ? 'Withdrawal' : ''}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border whitespace-nowrap ${statusColor[tx.status]}`}>{tx.status}</span>
                  </div>
                  <p className="text-white/40 text-xs font-mono">{tx.id}</p>
                  <p className="text-white/30 text-xs">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-white font-bold text-lg whitespace-nowrap shrink-0">${tx.amount}</p>
            </GlassCard>
          </button>
        )) : (
          <GlassCard variant="nested" className="flex flex-col items-center justify-center py-20 gap-4 text-white/30">
            <ArrowRightLeft size={56} strokeWidth={1} />
            <p className="text-base font-medium text-white/50">No transactions found</p>
            <p className="text-sm text-center max-w-xs">
              {searchTerm || filterStatus !== 'All' ? 'Try adjusting your filters.' : 'Your transaction history will appear here once you make a withdrawal.'}
            </p>
          </GlassCard>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
        <GlassCard variant="nested" hover={false}>
          <p className="text-white/60 text-sm mb-1">Total Transactions</p>
          <p className="text-3xl font-bold text-white">{txs.length}</p>
        </GlassCard>
        <GlassCard variant="nested" hover={false}>
          <p className="text-white/60 text-sm mb-1">Total Withdrawn</p>
          <p className="text-3xl font-bold text-white">${txs.filter(t => t.type === 'Withdrawal').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </GlassCard>
        <GlassCard variant="nested" hover={false}>
          <p className="text-white/60 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-400">{txs.filter(t => t.status === 'Pending').length}</p>
        </GlassCard>
      </div>

      <GlassModal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Details" neonBorder="cyan">
        {selectedTx && <TransactionReceipt tx={toTxRecord(selectedTx)} onDone={() => setSelectedTx(null)} />}
      </GlassModal>
    </div>
  )
}
