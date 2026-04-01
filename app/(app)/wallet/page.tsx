'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassModal } from '@/components/glass/glass-modal'
import { GlassSelect } from '@/components/glass/glass-select'
import { TransactionReceipt } from '@/components/common/transaction-receipt'
import { insertTransaction, getTransactions, getPaymentPin, savePaymentPin } from '@/lib/supabase/db'
import { useAuth } from '@/context/auth-context'
import type { Transaction } from '@/lib/supabase/db'
import Link from 'next/link'
import {
  Wallet, ArrowDownToLine, ArrowUpFromLine, MessageCircle,
  DollarSign, Zap, Eye, EyeOff, RefreshCw,
  TrendingUp, TrendingDown, Gift, ArrowLeftRight, XCircle,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import React from 'react'

const TOP4 = [
  { code: 'USD', name: 'US Dollar', symbol: '$', logo: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/us.svg', round: false },
  { code: 'EUR', name: 'Euro', symbol: '€', logo: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/eu.svg', round: false },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', round: true },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', round: true },
]

// Map Transaction to TxRecord shape for receipt
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

const statusColor: Record<string, string> = {
  Completed: 'text-[#39ff9e] bg-[#39ff9e]/10',
  Pending: 'text-yellow-400 bg-yellow-400/10',
  Failed: 'text-red-400 bg-red-400/10',
}

const RECENT_TXS: never[] = []
const txIcon = (type: string, status: string) => {
  if (status === 'Failed') return null
  if (type === 'Withdrawal') return null
  return null
}

export default function WalletPage() {
  const { user, profile } = useAuth()
  const balance = profile?.balance ?? 0

  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawTab, setWithdrawTab] = useState<'bank' | 'crypto'>('bank')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawNetwork, setWithdrawNetwork] = useState('erc20')
  const [bankFields, setBankFields] = useState({ name: '', bankName: '', swift: '', iban: '', routing: '', purpose: 'personal' })
  const [confirmed, setConfirmed] = useState(false)
  const [withdrawStep, setWithdrawStep] = useState<'form' | 'confirm' | 'pin' | 'pin-confirm' | 'success'>('form')
  // persist PIN — load from DB, fall back to localStorage
  const [savedPin, setSavedPin] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('vestor_payment_pin')
  })

  // Load PIN from DB on mount
  useEffect(() => {
    if (!user) return
    getPaymentPin(user.uid).then(pin => {
      if (pin) {
        setSavedPin(pin)
        localStorage.setItem('vestor_payment_pin', pin)
      }
    })
  }, [user])
  const [pin, setPin] = useState(['', '', '', ''])
  const [pinConfirm, setPinConfirm] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState('')
  const [currentTx, setCurrentTx] = useState<ReturnType<typeof toTxRecord> | null>(null)
  const [recentTxs, setRecentTxs] = useState<Transaction[]>([])
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  // Load transactions from Supabase
  useEffect(() => {
    if (!user) return
    getTransactions(user.uid).then(setRecentTxs)
  }, [user])
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const pinConfirmRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const resetWithdraw = () => {
    setWithdrawStep('form'); setConfirmed(false)
    setPin(['', '', '', '']); setPinConfirm(['', '', '', '']); setPinError('')
  }

  const handlePinInput = (i: number, val: string, refs: React.RefObject<HTMLInputElement | null>[], setter: React.Dispatch<React.SetStateAction<string[]>>, onComplete?: (full: string) => void) => {
    if (!/^\d?$/.test(val)) return
    setter(prev => {
      const n = [...prev]; n[i] = val
      if (val && i < 3) refs[i + 1].current?.focus()
      if (val && i === 3) {
        const full = n.join('')
        if (full.length === 4) setTimeout(() => onComplete?.(full), 50)
      }
      return n
    })
    setPinError('')
  }

  const handlePinKeyDown = (i: number, e: React.KeyboardEvent, arr: string[], refs: React.RefObject<HTMLInputElement | null>[]) => {
    if (e.key === 'Backspace' && !arr[i] && i > 0) refs[i - 1].current?.focus()
  }

  const submitCreatePin = (full?: string) => {
    const entered = full ?? pin.join('')
    if (entered.length < 4) { setPinError('Enter all 4 digits'); return }
    setWithdrawStep('pin-confirm')
    setPinConfirm(['', '', '', ''])
    setTimeout(() => pinConfirmRefs[0].current?.focus(), 120)
  }

  const saveTxAndSuccess = async () => {
    if (!user) return
    const txId = 'VTX-' + Math.random().toString(36).slice(2, 10).toUpperCase()
    const newTx: Omit<Transaction, 'created_at'> = {
      id: txId,
      user_id: user.uid,
      type: 'Withdrawal',
      method: withdrawTab,
      amount: parseFloat(withdrawAmount),
      status: 'Pending',
      ...(withdrawTab === 'bank'
        ? { beneficiary_name: bankFields.name, bank_name: bankFields.bankName, swift: bankFields.swift, iban: bankFields.iban, routing: bankFields.routing }
        : { network: withdrawNetwork, address: withdrawAddress }
      ),
    }
    await insertTransaction(newTx)
    const full = { ...newTx, created_at: new Date().toISOString() }
    setCurrentTx(toTxRecord(full))
    setRecentTxs(prev => [full, ...prev])
    setWithdrawStep('success')
  }

  const submitConfirmPin = (full?: string) => {
    const entered = full ?? pinConfirm.join('')
    if (entered.length < 4) { setPinError('Enter all 4 digits'); return }
    if (entered !== pin.join('')) { setPinError("PINs don't match"); setPinConfirm(['', '', '', '']); setTimeout(() => pinConfirmRefs[0].current?.focus(), 50); return }
    const newPin = pin.join('')
    localStorage.setItem('vestor_payment_pin', newPin)
    setSavedPin(newPin)
    if (user) savePaymentPin(user.uid, newPin)
    saveTxAndSuccess()
  }

  const submitEnterPin = (full?: string) => {
    const entered = full ?? pin.join('')
    if (entered.length < 4) { setPinError('Enter all 4 digits'); return }
    if (entered !== savedPin) { setPinError('Incorrect PIN'); setPin(['', '', '', '']); setTimeout(() => pinRefs[0].current?.focus(), 50); return }
    saveTxAndSuccess()
  }
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1, EUR: 0.92, BTC: 0.000015, ETH: 0.00045 })

  // Fetch live rates from CoinGecko (free, no key needed)
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur')
      .then(r => r.json())
      .then(data => {
        const btcUsd = data?.bitcoin?.usd ?? 0
        const ethUsd = data?.ethereum?.usd ?? 0
        const eurUsd = data?.bitcoin?.eur && btcUsd ? (data.bitcoin.eur / btcUsd) : 0.92
        setRates({
          USD: 1,
          EUR: eurUsd || 0.92,
          BTC: btcUsd ? 1 / btcUsd : 0.000015,
          ETH: ethUsd ? 1 / ethUsd : 0.00045,
        })
      })
      .catch(() => {}) // keep defaults on error
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Wallet</h1>

      {/* Main Balance */}
      <GlassCard variant="elevated" className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'color-mix(in srgb, var(--primary) 5%, transparent)' }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Wallet size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <p className="text-white/60 text-sm">Total Balance</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBalanceVisible(v => !v)}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Toggle balance visibility"
              >
                {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Refresh balance"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

      <p className="text-4xl sm:text-5xl font-bold text-white mb-1">
            {balanceVisible ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
          </p>
          <p className="text-white/40 text-sm mb-6">{balance === 0 ? 'No activity yet — make a deposit to get started' : 'Available balance'}</p>

          <div className="flex gap-3">
            <GlassButton variant="outline" onClick={() => setWithdrawOpen(true)} className="flex items-center gap-2">
              <ArrowUpFromLine size={16} />
              Withdraw
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Balance in Top 4 Currencies */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TOP4.map((cur) => {
          const rate = rates[cur.code] ?? 1
          const converted = balance * rate
          const formatted = cur.code === 'BTC' || cur.code === 'ETH'
            ? converted.toFixed(6)
            : converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          return (
            <GlassCard key={cur.code} variant="nested" hover={false} className="flex flex-col gap-2 py-4 px-4">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cur.logo} alt={cur.code} width={22} height={22} className={cur.round ? 'rounded-full' : 'rounded-sm object-cover'} style={{ width: 22, height: 22 }} />
                <p className="text-white/50 text-xs truncate">{cur.name}</p>
              </div>
              <p className="text-white font-bold text-base sm:text-lg truncate">
                {balanceVisible ? `${cur.symbol}${formatted}` : '••••'}
              </p>
              <p className="text-white/30 text-xs">{cur.code}</p>
            </GlassCard>
          )
        })}
      </div>

      {/* Recent Transactions */}
      <GlassCard variant="elevated">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          <Link href="/transactions">
            <GlassButton variant="outline" size="sm">See All</GlassButton>
          </Link>
        </div>
        {recentTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-white/30">
            <ArrowLeftRight size={36} strokeWidth={1} />
            <p className="text-sm text-white/40">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTxs.slice(0, 4).map(tx => (
              <button key={tx.id} onClick={() => setSelectedTx(tx)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <TrendingDown size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{tx.method === 'bank' ? 'Bank Wire' : tx.type === 'Credit' ? 'Account Credit' : 'Crypto'} {tx.type}</p>
                  <p className="text-white/40 text-xs">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-sm font-semibold">${tx.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[tx.status]}`}>{tx.status}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </GlassCard>

      {/* How to Deposit */}
      <GlassCard variant="elevated">
        <div className="flex items-center gap-2 mb-5">
          <ArrowDownToLine size={20} style={{ color: 'var(--primary)' }} />
          <h2 className="text-xl font-bold text-white">How to Deposit Funds</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 p-5 rounded-xl bg-white/[0.05] border border-white/10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ background: 'var(--primary)', color: 'var(--background)' }}>1</div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={16} style={{ color: 'var(--primary)' }} />
                <p className="text-white font-bold text-base">Contact an Agent</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Open the live chat and reach out to a Vestor support agent. Provide your full name and registered email to verify your account.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 rounded-xl bg-white/[0.05] border border-white/10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ background: 'var(--primary)', color: 'var(--background)' }}>2</div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} style={{ color: 'var(--primary)' }} />
                <p className="text-white font-bold text-base">State Your Amount</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Tell the agent exactly how much you want to deposit. They will send you the payment details and wallet address to transfer funds to.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 rounded-xl bg-white/[0.05] border border-white/10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ background: 'var(--secondary)', color: 'var(--background)' }}>3</div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} style={{ color: 'var(--secondary)' }} />
                <p className="text-white font-bold text-base">Get Credited Instantly</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Send the funds to the provided address. Your Vestor account will be credited immediately once the transfer is confirmed.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <GlassButton variant="primary" className="flex items-center gap-2" onClick={() => window.dispatchEvent(new Event('open-chat-agent'))}>
            <MessageCircle size={16} />
            Chat with an Agent Now
          </GlassButton>
        </div>
      </GlassCard>

      {/* Withdraw Modal */}
      <GlassModal
        isOpen={withdrawOpen}
        onClose={() => { setWithdrawOpen(false); resetWithdraw() }}
        title={withdrawStep === 'form' ? 'Withdraw Funds' : withdrawStep === 'confirm' ? 'Confirm Transaction' : withdrawStep === 'pin' ? (savedPin ? 'Enter PIN' : 'Create Payment PIN') : withdrawStep === 'pin-confirm' ? 'Confirm Your PIN' : 'Transaction Complete'}
        neonBorder="cyan"
      >
        {/* ── STEP 1: FORM ── */}
        {withdrawStep === 'form' && (
          <>
            <div className="flex gap-2 mb-5 p-1 rounded-xl bg-white/[0.05] border border-white/10">
              {(['bank', 'crypto'] as const).map(tab => (
                <button key={tab} onClick={() => setWithdrawTab(tab)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={withdrawTab === tab ? { background: 'var(--primary)', color: 'var(--background)' } : { color: 'rgba(255,255,255,0.5)' }}>
                  {tab === 'bank' ? '🏦 Bank Wire' : '🔗 Crypto Wallet'}
                </button>
              ))}
            </div>

            {withdrawTab === 'bank' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Amount (USD) <span className="text-red-400">*</span></label>
                  <GlassInput type="number" placeholder="0.00" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                  <p className="text-white/30 text-xs mt-1">Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} · Min: $50</p>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Beneficiary Full Name <span className="text-red-400">*</span></label>
                  <GlassInput placeholder="As it appears on your bank account" value={bankFields.name} onChange={e => setBankFields(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Bank Name <span className="text-red-400">*</span></label>
                  <GlassInput placeholder="e.g. Chase, Barclays, Deutsche Bank" value={bankFields.bankName} onChange={e => setBankFields(p => ({ ...p, bankName: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">SWIFT / BIC <span className="text-red-400">*</span></label>
                    <GlassInput placeholder="e.g. CHASUS33" value={bankFields.swift} onChange={e => setBankFields(p => ({ ...p, swift: e.target.value.toUpperCase() }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">IBAN / Account No. <span className="text-red-400">*</span></label>
                    <GlassInput placeholder="e.g. GB29NWBK..." value={bankFields.iban} onChange={e => setBankFields(p => ({ ...p, iban: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Routing / Sort Code <span className="text-white/30 font-normal">(optional)</span></label>
                  <GlassInput placeholder="US: 9-digit · UK: 6-digit" value={bankFields.routing} onChange={e => setBankFields(p => ({ ...p, routing: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Transfer Purpose <span className="text-white/30 font-normal">(optional)</span></label>
                  <GlassSelect value={bankFields.purpose} onChange={v => setBankFields(p => ({ ...p, purpose: v }))} options={[
                    { value: 'personal', label: 'Personal Transfer' },
                    { value: 'investment', label: 'Investment Returns' },
                    { value: 'savings', label: 'Savings' },
                    { value: 'business', label: 'Business Payment' },
                    { value: 'other', label: 'Other' },
                  ]} />
                </div>
                <div className="rounded-lg bg-white/[0.04] border border-white/10 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-white/50">Processing time</span><span className="text-white">2–5 business days</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Wire fee</span><span className="text-white">$15–$25</span></div>
                </div>
                {/* Confirm checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[var(--primary)] shrink-0" />
                  <span className="text-white/60 text-xs leading-relaxed">I confirm all the details above are correct. I understand that incorrect bank details may result in lost funds.</span>
                </label>
                <GlassButton variant="primary" className="w-full flex items-center justify-center gap-2"
                  disabled={!confirmed || !withdrawAmount || !bankFields.name || !bankFields.bankName || !bankFields.swift || !bankFields.iban}
                  onClick={() => setWithdrawStep('confirm')}>
                  <ArrowUpFromLine size={16} /> Review Withdrawal
                </GlassButton>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Amount (USD) <span className="text-red-400">*</span></label>
                  <GlassInput type="number" placeholder="0.00" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                  <p className="text-white/30 text-xs mt-1">Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} · Min: $10</p>
                </div>
                <GlassSelect label="Network *" value={withdrawNetwork} onChange={setWithdrawNetwork} options={[
                  { value: 'erc20', label: 'Ethereum (ERC-20)' },
                  { value: 'btc', label: 'Bitcoin (BTC)' },
                  { value: 'bep20', label: 'BNB Smart Chain (BEP-20)' },
                  { value: 'trc20', label: 'Tron (TRC-20)' },
                  { value: 'matic', label: 'Polygon (MATIC)' },
                ]} />
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Wallet Address <span className="text-red-400">*</span></label>
                  <GlassInput placeholder="Paste recipient wallet address" value={withdrawAddress} onChange={e => setWithdrawAddress(e.target.value)} />
                  <p className="text-yellow-400/70 text-xs mt-1">⚠ Double-check the address. Crypto transfers are irreversible.</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] border border-white/10 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-white/50">Processing time</span><span className="text-white">10–30 minutes</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Network fee</span><span className="text-white">~$1–$5</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Confirmations</span><span className="text-white">3 blocks</span></div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[var(--primary)] shrink-0" />
                  <span className="text-white/60 text-xs leading-relaxed">I confirm the wallet address and amount are correct. I understand crypto transactions cannot be reversed.</span>
                </label>
                <GlassButton variant="primary" className="w-full flex items-center justify-center gap-2"
                  disabled={!confirmed || !withdrawAmount || !withdrawAddress}
                  onClick={() => setWithdrawStep('confirm')}>
                  <ArrowUpFromLine size={16} /> Review Withdrawal
                </GlassButton>
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: CONFIRM ── */}
        {withdrawStep === 'confirm' && (
          <div className="space-y-4">
            <p className="text-white/50 text-sm">Please review your transaction details before proceeding.</p>
            <div className="rounded-xl bg-white/[0.05] border border-white/10 divide-y divide-white/10 text-sm overflow-hidden">
              <div className="flex justify-between px-4 py-3"><span className="text-white/50">Method</span><span className="text-white font-medium">{withdrawTab === 'bank' ? 'Bank Wire Transfer' : 'Crypto Wallet'}</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-white/50">Amount</span><span className="text-white font-bold">${withdrawAmount || '0.00'}</span></div>
              {withdrawTab === 'bank' ? (<>
                <div className="flex justify-between px-4 py-3"><span className="text-white/50">Beneficiary</span><span className="text-white">{bankFields.name}</span></div>
                <div className="flex justify-between px-4 py-3"><span className="text-white/50">Bank</span><span className="text-white">{bankFields.bankName}</span></div>
                <div className="flex justify-between px-4 py-3"><span className="text-white/50">SWIFT/BIC</span><span className="text-white font-mono">{bankFields.swift}</span></div>
                <div className="flex justify-between px-4 py-3"><span className="text-white/50">IBAN/Account</span><span className="text-white font-mono truncate max-w-[160px]">{bankFields.iban}</span></div>
                {bankFields.routing && <div className="flex justify-between px-4 py-3"><span className="text-white/50">Routing</span><span className="text-white font-mono">{bankFields.routing}</span></div>}
              </>) : (<>
                <div className="flex justify-between px-4 py-3"><span className="text-white/50">Network</span><span className="text-white">{withdrawNetwork.toUpperCase()}</span></div>
                <div className="flex justify-between px-4 py-3"><span className="text-white/50">Address</span><span className="text-white font-mono truncate max-w-[160px]">{withdrawAddress}</span></div>
              </>)}
            </div>
            <div className="flex gap-3">
              <GlassButton variant="outline" className="flex-1" onClick={() => setWithdrawStep('form')}>Edit</GlassButton>
              <GlassButton variant="primary" className="flex-1" onClick={() => setWithdrawStep('pin')}>Confirm & Continue</GlassButton>
            </div>
          </div>
        )}

        {/* ── STEP 3: PIN ── */}
        {withdrawStep === 'pin' && (
          <div className="space-y-6">
            <p className="text-white/50 text-sm text-center">
              {savedPin ? 'Enter your 4-digit payment PIN to authorize this transaction.' : 'Create a 4-digit PIN to secure your withdrawals.'}
            </p>
            <div className="flex justify-center gap-3">
              {pin.map((d, i) => (
                <input key={i} ref={pinRefs[i]} type="password" inputMode="numeric" maxLength={1} value={d}
                  autoFocus={i === 0}
                  onChange={e => handlePinInput(i, e.target.value, pinRefs, setPin, savedPin ? submitEnterPin : submitCreatePin)}
                  onKeyDown={e => handlePinKeyDown(i, e, pin, pinRefs)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl text-white focus:outline-none transition-all"
                  style={{ background: 'var(--glass-bg)', border: `2px solid ${d ? 'var(--primary)' : 'var(--glass-border)'}` }}
                />
              ))}
            </div>
            {pinError && <p className="text-red-400 text-xs text-center">{pinError}</p>}
            <GlassButton variant="outline" className="w-full" onClick={() => setWithdrawStep('confirm')}>Back</GlassButton>
          </div>
        )}

        {/* ── STEP 3b: CONFIRM PIN ── */}
        {withdrawStep === 'pin-confirm' && (
          <div className="space-y-6">
            <p className="text-white/50 text-sm text-center">Re-enter your PIN to confirm it.</p>
            <div className="flex justify-center gap-3">
              {pinConfirm.map((d, i) => (
                <input key={i} ref={pinConfirmRefs[i]} type="password" inputMode="numeric" maxLength={1} value={d}
                  autoFocus={i === 0}
                  onChange={e => handlePinInput(i, e.target.value, pinConfirmRefs, setPinConfirm, submitConfirmPin)}
                  onKeyDown={e => handlePinKeyDown(i, e, pinConfirm, pinConfirmRefs)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl text-white focus:outline-none transition-all"
                  style={{ background: 'var(--glass-bg)', border: `2px solid ${d ? 'var(--primary)' : 'var(--glass-border)'}` }}
                />
              ))}
            </div>
            {pinError && <p className="text-red-400 text-xs text-center">{pinError}</p>}
            <GlassButton variant="outline" className="w-full" onClick={() => { setWithdrawStep('pin'); setPinError('') }}>Back</GlassButton>
          </div>
        )}

        {/* ── STEP 4: SUCCESS + RECEIPT ── */}
        {withdrawStep === 'success' && currentTx && (
          <TransactionReceipt tx={currentTx} showSuccess onDone={() => { setWithdrawOpen(false); resetWithdraw() }} />
        )}
      </GlassModal>

      {/* Transaction Detail Modal */}
      <GlassModal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Details" neonBorder="cyan">
        {selectedTx && <TransactionReceipt tx={toTxRecord(selectedTx)} onDone={() => setSelectedTx(null)} />}
      </GlassModal>
    </div>
  )
}
