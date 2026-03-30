'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassButton } from '@/components/glass/glass-button'
import { TrendingUp, TrendingDown, Gift, ArrowLeftRight, XCircle, ArrowRightLeft } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

interface Transaction {
  id: string
  type: 'Investment' | 'Withdrawal' | 'Dividend' | 'Transfer'
  asset: string
  amount: number
  amountUSD: number
  status: 'Completed' | 'Pending' | 'Failed'
  date: string
  txHash: string
  color: string
}

const txIcon = (type: string, status: string) => {
  if (status === 'Failed') return <XCircle size={18} className="text-red-400" />
  if (type === 'Investment') return <TrendingUp size={18} className="text-[#39ff9e]" />
  if (type === 'Withdrawal') return <TrendingDown size={18} className="text-[#00a8ff]" />
  if (type === 'Dividend') return <Gift size={18} className="text-[#39ff9e]" />
  return <ArrowLeftRight size={18} className="text-white/60" />
}

// No hardcoded transactions — real data would come from backend
const allTransactions: Transaction[] = []

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('All')
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch =
      tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'All' || tx.type === filterType
    const matchesStatus = filterStatus === 'All' || tx.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-white/60">View and manage all your investment transactions</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassInput
          placeholder="Search by asset or hash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 cursor-pointer"
        >
          <option className="bg-background text-white">All Types</option>
          <option className="bg-background text-white">Investment</option>
          <option className="bg-background text-white">Withdrawal</option>
          <option className="bg-background text-white">Dividend</option>
          <option className="bg-background text-white">Transfer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 cursor-pointer"
        >
          <option className="bg-background text-white">All Status</option>
          <option className="bg-background text-white">Completed</option>
          <option className="bg-background text-white">Pending</option>
          <option className="bg-background text-white">Failed</option>
        </select>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
            <GlassCard key={tx.id} variant="nested" hover className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer">
              <div className="flex items-start md:items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center shrink-0">
                  {txIcon(tx.type, tx.status)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1 mb-2">
                    <h3 className="text-white font-semibold">{tx.type}</h3>
                    <span className="text-white/50 text-sm">{tx.asset}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-white/50">
                    <span>{tx.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-mono text-white/40">{tx.txHash}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                <div className="text-right">
                  {tx.amount > 0 && <p className="text-white/70 text-sm">{tx.amount} {tx.asset.split(' ')[0]}</p>}
                  <p className={`font-bold text-lg ${tx.color}`}>
                    {tx.type === 'Investment' ? `+$${tx.amountUSD.toLocaleString()}` : tx.type === 'Withdrawal' ? `-$${tx.amountUSD.toLocaleString()}` : `+$${tx.amountUSD.toLocaleString()}`}
                  </p>
                </div>
                <div className={`px-3 py-1 text-xs font-semibold whitespace-nowrap ${tx.status === 'Completed' ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' : tx.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {tx.status}
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard variant="nested" className="flex flex-col items-center justify-center py-20 gap-4 text-white/30">
            <ArrowRightLeft size={56} strokeWidth={1} />
            <p className="text-base font-medium text-white/50">No transactions found</p>
            <p className="text-sm text-center max-w-xs">
              {searchTerm || filterType !== 'All' || filterStatus !== 'All'
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'Your transaction history will appear here once you make your first investment.'}
            </p>
          </GlassCard>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
        <GlassCard variant="nested">
          <p className="text-white/60 text-sm mb-2">Total Transactions</p>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-white/40 text-sm mt-2">All time</p>
        </GlassCard>
        <GlassCard variant="nested">
          <p className="text-white/60 text-sm mb-2">Volume Invested</p>
          <p className="text-3xl font-bold text-white">$0.00</p>
          <p className="text-white/40 text-sm mt-2">Year to date</p>
        </GlassCard>
        <GlassCard variant="nested">
          <p className="text-white/60 text-sm mb-2">Success Rate</p>
          <p className="text-3xl font-bold text-white">—</p>
          <p className="text-white/40 text-sm mt-2">No transactions yet</p>
        </GlassCard>
      </div>
    </div>
  )
}
