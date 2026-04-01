'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassModal } from '@/components/glass/glass-modal'
import { getAllProfiles, adminUpdateBalance, adminUpdateTransactionStatus, getAllTransactions, getChatUsers, getChatMessages, insertChatMessage } from '@/lib/supabase/db'
import { useAuth } from '@/context/auth-context'
import type { Profile, Transaction, ChatMessage } from '@/lib/supabase/db'
import { Users, MessageSquare, ArrowLeftRight, DollarSign, Check, X, Send, Bot } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'

const r = (radius: string) => ({ borderRadius: radius })

const statusColor: Record<string, string> = {
  Completed: 'text-[#39ff9e] bg-[#39ff9e]/10',
  Pending: 'text-yellow-400 bg-yellow-400/10',
  Failed: 'text-red-400 bg-red-400/10',
}

export default function AdminPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'users' | 'transactions' | 'messages'>('users')

  // Users
  const [users, setUsers] = useState<Profile[]>([])
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [newBalance, setNewBalance] = useState('')
  const [balanceSaving, setBalanceSaving] = useState(false)

  // Transactions
  const [transactions, setTransactions] = useState<(Transaction & { profiles?: { email: string; full_name: string | null } })[]>([])

  // Messages
  const [chatUsers, setChatUsers] = useState<{ user_id: string; profiles: { email: string; full_name: string | null } | null }[]>([])
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null)
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>([])
  const [replyText, setReplyText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Guard: admin only
  useEffect(() => {
    if (profile && profile.role !== 'admin') router.replace('/dashboard')
  }, [profile, router])

  useEffect(() => { getAllProfiles().then(setUsers) }, [])
  useEffect(() => { if (tab === 'transactions') getAllTransactions().then(setTransactions) }, [tab])
  useEffect(() => {
    if (tab === 'messages') {
      getChatUsers().then((rawUsers: any[]) => {
        // enrich with profile data from already-loaded users list
        getAllProfiles().then(profiles => {
          const enriched = rawUsers.map((cu: any) => {
            const p = profiles.find(u => u.id === cu.user_id)
            return { user_id: cu.user_id, profiles: p ? { email: p.email, full_name: p.full_name } : null }
          })
          setChatUsers(enriched)
        })
      })
    }
  }, [tab])

  // Poll for new messages every 5s when messages tab is open
  useEffect(() => {
    if (!selectedChatUser) return
    getChatMessages(selectedChatUser).then(setChatMsgs)
    const id = setInterval(() => getChatMessages(selectedChatUser).then(setChatMsgs), 5000)
    return () => clearInterval(id)
  }, [selectedChatUser])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMsgs])

  const handleUpdateBalance = async () => {
    if (!selectedUser || !newBalance) return
    setBalanceSaving(true)
    await adminUpdateBalance(selectedUser.id, parseFloat(newBalance))
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, balance: parseFloat(newBalance) } : u))
    setSelectedUser(prev => prev ? { ...prev, balance: parseFloat(newBalance) } : null)
    setBalanceSaving(false)
    setNewBalance('')
  }

  const handleTxStatus = async (txId: string, status: 'Completed' | 'Failed') => {
    await adminUpdateTransactionStatus(txId, status)
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status } : t))
  }

  const sendReply = async () => {
    if (!replyText.trim() || !selectedChatUser) return
    const msg: Omit<ChatMessage, 'id' | 'created_at'> = { user_id: selectedChatUser, role: 'agent', text: replyText, image_url: null }
    const optimistic: ChatMessage = { ...msg, id: Date.now(), created_at: new Date().toISOString() }
    setChatMsgs(prev => [...prev, optimistic])
    setReplyText('')
    await insertChatMessage(msg)
  }

  if (!profile || profile.role !== 'admin') return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Admin Panel</h1>
        <p className="text-white/50 text-sm">Manage users, transactions and messages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard variant="nested">
          <p className="text-white/50 text-xs mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </GlassCard>
        <GlassCard variant="nested">
          <p className="text-white/50 text-xs mb-1">Pending Withdrawals</p>
          <p className="text-2xl font-bold text-yellow-400">{transactions.filter(t => t.status === 'Pending' && t.type === 'Withdrawal').length}</p>
        </GlassCard>
        <GlassCard variant="nested">
          <p className="text-white/50 text-xs mb-1">Total Balance (All)</p>
          <p className="text-2xl font-bold text-[#39ff9e]">${users.reduce((s, u) => s + Number(u.balance), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-white/[0.05] border border-white/10 w-fit">
        {([['users', Users, 'Users'], ['transactions', ArrowLeftRight, 'Transactions'], ['messages', MessageSquare, 'Messages']] as const).map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={tab === id ? { background: 'var(--primary)', color: 'var(--background)' } : { color: 'rgba(255,255,255,0.5)' }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <div className="space-y-2">
          {users.map(u => (
            <GlassCard key={u.id} variant="nested" hover className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => { setSelectedUser(u); setNewBalance(u.balance.toString()) }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00a8ff]/20 flex items-center justify-center text-sm font-bold text-[#00a8ff]">
                  {(u.full_name || u.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{u.full_name || '—'}</p>
                  <p className="text-white/40 text-xs">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.role === 'admin' ? 'bg-[#00a8ff]/20 text-[#00a8ff]' : 'bg-white/10 text-white/50'}`}>{u.role}</span>
                <p className="text-white font-bold">${Number(u.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── TRANSACTIONS TAB ── */}
      {tab === 'transactions' && (
        <div className="space-y-2">
          {transactions.map(tx => (
            <GlassCard key={tx.id} variant="nested" className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white text-sm font-semibold">{(tx as any).profiles?.email ?? tx.user_id.slice(0, 8)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[tx.status]}`}>{tx.status}</span>
                  <span className="text-white/30 text-xs">{tx.type}</span>
                </div>
                <p className="text-white/40 text-xs font-mono">{tx.id} · {new Date(tx.created_at).toLocaleString()}</p>
              </div>
              <p className="text-white font-bold shrink-0">${Number(tx.amount).toLocaleString()}</p>
              {tx.status === 'Pending' && tx.type === 'Withdrawal' && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleTxStatus(tx.id, 'Completed')} className="w-8 h-8 rounded-lg bg-[#39ff9e]/20 text-[#39ff9e] flex items-center justify-center hover:bg-[#39ff9e]/30 transition-all"><Check size={14} /></button>
                  <button onClick={() => handleTxStatus(tx.id, 'Failed')} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-all"><X size={14} /></button>
                </div>
              )}
            </GlassCard>
          ))}
          {transactions.length === 0 && <p className="text-white/30 text-center py-10">No transactions yet</p>}
        </div>
      )}

      {/* ── MESSAGES TAB ── */}
      {tab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User list */}
          <div className="space-y-2">
            {chatUsers.map((cu: any) => (
              <GlassCard key={cu.user_id} variant="nested" hover className={`cursor-pointer transition-all ${selectedChatUser === cu.user_id ? 'border-[#00a8ff]/40' : ''}`}
                onClick={() => setSelectedChatUser(cu.user_id)}>
                <p className="text-white text-sm font-semibold">{cu.profiles?.full_name || cu.profiles?.email || cu.user_id.slice(0, 8)}</p>
                <p className="text-white/40 text-xs">{cu.profiles?.email}</p>
              </GlassCard>
            ))}
            {chatUsers.length === 0 && <p className="text-white/30 text-sm text-center py-6">No messages yet</p>}
          </div>

          {/* Chat window */}
          <div className="md:col-span-2">
            {selectedChatUser ? (
              <GlassCard variant="elevated" className="flex flex-col h-[500px] p-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
                  {chatMsgs.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === 'agent' ? 'flex-row-reverse' : ''}`}>
                      <div style={{ ...r('50%'), background: msg.role === 'agent' ? 'color-mix(in srgb, var(--primary) 25%, transparent)' : 'rgba(255,255,255,0.1)' }}
                        className="w-7 h-7 flex items-center justify-center shrink-0">
                        {msg.role === 'agent' ? <Bot size={13} style={{ color: 'var(--primary)' }} /> : <span className="text-xs text-white/60">U</span>}
                      </div>
                      <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === 'agent' ? 'items-end' : 'items-start'}`}>
                        {msg.image_url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={msg.image_url} alt="img" style={{ ...r('8px'), maxWidth: 160, maxHeight: 160, objectFit: 'cover' }} />
                          : <div style={msg.role === 'agent'
                              ? { ...r('12px 4px 12px 12px'), background: 'var(--primary)' }
                              : { ...r('4px 12px 12px 4px'), background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                              className="px-3 py-2 text-sm text-white/90">{msg.text}</div>}
                        <span className="text-white/30 text-xs px-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div className="flex gap-2 p-3 border-t border-white/10">
                  <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()}
                    placeholder="Reply as agent..." style={{ ...r('8px'), background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                    className="flex-1 text-white text-sm px-3 py-2 placeholder:text-white/30 focus:outline-none" />
                  <button onClick={sendReply} disabled={!replyText.trim()} style={{ ...r('8px'), background: 'var(--primary)' }}
                    className="w-9 h-9 text-white flex items-center justify-center disabled:opacity-40">
                    <Send size={15} />
                  </button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard variant="nested" className="flex items-center justify-center h-[500px] text-white/30">
                <p>Select a user to view messages</p>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {/* Balance Update Modal */}
      <GlassModal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Update User Balance" neonBorder="cyan">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.05] border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] font-bold">
                {(selectedUser.full_name || selectedUser.email)[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{selectedUser.full_name || '—'}</p>
                <p className="text-white/50 text-sm">{selectedUser.email}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm px-1">
              <span className="text-white/50">Current Balance</span>
              <span className="text-white font-bold">${Number(selectedUser.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">New Balance (USD)</label>
              <GlassInput type="number" placeholder="Enter new balance" value={newBalance} onChange={e => setNewBalance(e.target.value)} />
              <p className="text-white/30 text-xs mt-1">Setting a higher balance will auto-create a Credit transaction.</p>
            </div>
            <GlassButton variant="primary" className="w-full flex items-center justify-center gap-2" onClick={handleUpdateBalance} disabled={balanceSaving || !newBalance}>
              <DollarSign size={15} /> {balanceSaving ? 'Saving...' : 'Update Balance'}
            </GlassButton>
          </div>
        )}
      </GlassModal>
    </div>
  )
}
