'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassModal } from '@/components/glass/glass-modal'
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import React from 'react'

const USD_BALANCE = 12450.50

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.5, flag: '🇯🇵' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.36, flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53, flag: '🇦🇺' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.88, flag: '🇨🇭' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.1, flag: '🇮🇳' },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin', rate: 0.000021, flag: '🟠' },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', rate: 0.0052, flag: '🔷' },
]

const walletAddress = '0x4a7B3c9D2e1F8a6b5C0d4E7f2A9b3C6d8E1f4A7b'

export default function WalletPage() {
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Wallet</h1>

      {/* Main Balance */}
      <GlassCard variant="elevated" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00a8ff]/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Wallet size={20} className="text-[#00a8ff]" />
            </div>
            <p className="text-white/60 text-sm">Total Balance</p>
          </div>
          <p className="text-5xl font-bold text-white mb-1">
            ${USD_BALANCE.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[#39ff9e] text-sm mb-6">+$1,245.50 this month (+11.1%)</p>

          <div className="flex gap-3">
            <GlassButton variant="primary" onClick={() => setDepositOpen(true)} className="flex items-center gap-2">
              <ArrowDownToLine size={16} />
              Deposit
            </GlassButton>
            <GlassButton variant="outline" onClick={() => setWithdrawOpen(true)} className="flex items-center gap-2">
              <ArrowUpFromLine size={16} />
              Withdraw
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Wallet Address */}
      <GlassCard variant="nested">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Wallet Address</p>
        <div className="flex items-center gap-3">
          <p className="text-white/80 text-sm font-mono flex-1 truncate">{walletAddress}</p>
          <button
            onClick={copyAddress}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white shrink-0"
          >
            {copied ? <Check size={16} className="text-[#39ff9e]" /> : <Copy size={16} />}
          </button>
        </div>
      </GlassCard>

      {/* Balance in All Currencies */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw size={15} className="text-white/40" />
          <h2 className="text-lg font-semibold text-white">Balance in All Currencies</h2>
          <span className="text-white/30 text-xs ml-auto">Live rates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {currencies.map((cur) => {
            const converted = USD_BALANCE * cur.rate
            const formatted = cur.code === 'BTC' || cur.code === 'ETH'
              ? converted.toFixed(6)
              : converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            return (
              <GlassCard key={cur.code} variant="nested" hover={false} className="flex items-center justify-between py-3 px-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cur.flag}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{cur.code}</p>
                    <p className="text-white/40 text-xs">{cur.name}</p>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm">
                  {cur.symbol}{formatted}
                </p>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      <GlassModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} title="Deposit Funds" neonBorder="cyan">
        <div className="space-y-5">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-white/50 text-xs mb-2">Send funds to this address</p>
            <p className="text-white text-xs font-mono break-all">{walletAddress}</p>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-2">Select Network</label>
            <select className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50">
              <option className="bg-[#0a0f25]">Ethereum (ERC-20)</option>
              <option className="bg-[#0a0f25]">Bitcoin (BTC)</option>
              <option className="bg-[#0a0f25]">BNB Smart Chain (BEP-20)</option>
              <option className="bg-[#0a0f25]">Polygon (MATIC)</option>
            </select>
          </div>
          <p className="text-white/40 text-xs text-center">
            Minimum deposit: $10 · Funds arrive within 1–3 confirmations
          </p>
        </div>
      </GlassModal>

      {/* Withdraw Modal */}
      <GlassModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Withdraw Funds" neonBorder="cyan">
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-white/50 mb-2">Amount (USD)</label>
            <GlassInput
              type="number"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <p className="text-white/40 text-xs mt-1">
              Available: ${USD_BALANCE.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-2">Destination Address</label>
            <GlassInput
              placeholder="0x..."
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-2">Network</label>
            <select className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50">
              <option className="bg-[#0a0f25]">Ethereum (ERC-20)</option>
              <option className="bg-[#0a0f25]">Bitcoin (BTC)</option>
              <option className="bg-[#0a0f25]">BNB Smart Chain (BEP-20)</option>
            </select>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between text-sm">
            <span className="text-white/50">Network fee</span>
            <span className="text-white">~$2.50</span>
          </div>
          <GlassButton variant="primary" className="w-full flex items-center justify-center gap-2">
            <ArrowUpFromLine size={16} />
            Confirm Withdrawal
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  )
}
