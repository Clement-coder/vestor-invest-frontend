'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassModal } from '@/components/glass/glass-modal'
import { getAllProfiles, adminUpdateBalance, adminUpdateTransactionStatus, getAllTransactions, getChatUsers, getChatMessages, insertChatMessage, uploadChatImage } from '@/lib/supabase/db'
import { useAuth } from '@/context/auth-context'
import type { Profile, Transaction, ChatMessage } from '@/lib/supabase/db'
import { Users, MessageSquare, ArrowLeftRight, DollarSign, Check, X, Send, Bot, ImagePlus } from 'lucide-react'
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
  const [chatUsers, setChatUsers] = useState<{ user_id: string; profiles: { email: string; full_name: string | null; avatar_url: string | null } | null }[]>([])
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null)
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>([])
  const [replyText, setReplyText] = useState('')
  const [seenCounts, setSeenCounts] = useState<Record<string, number>>({})
  const bottomRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [allMsgCounts, setAllMsgCounts] = useState<Record<string, number>>({})
  const [lightbox, setLightbox] = useState<string | null>(null)

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
            return { user_id: cu.user_id, profiles: p ? { email: p.email, full_name: p.full_name, avatar_url: p.avatar_url } : null }
          })
          setChatUsers(enriched)
        })
      })
    }
  }, [tab])

  // Poll selected chat every 5s
  useEffect(() => {
    if (!selectedChatUser) return
    getChatMessages(selectedChatUser).then(msgs => {
      setChatMsgs(msgs)
      setSeenCounts(prev => ({ ...prev, [selectedChatUser]: msgs.filter(m => m.role === 'user').length }))
    })
    const id = setInterval(() => {
      getChatMessages(selectedChatUser).then(msgs => {
        setChatMsgs(msgs)
        setSeenCounts(prev => ({ ...prev, [selectedChatUser]: msgs.filter(m => m.role === 'user').length }))
      })
    }, 5000)
    return () => clearInterval(id)
  }, [selectedChatUser])

  // Poll all users for new message badge every 8s
  useEffect(() => {
    if (tab !== 'messages' || chatUsers.length === 0) return
    const poll = () => chatUsers.forEach(cu =>
      getChatMessages(cu.user_id).then(msgs =>
        setAllMsgCounts(prev => ({ ...prev, [cu.user_id]: msgs.filter(m => m.role === 'user').length }))
      )
    )
    poll()
    const id = setInterval(poll, 8000)
    return () => clearInterval(id)
  }, [tab, chatUsers])

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

  const sendImage = async (file: File) => {
    if (!selectedChatUser) return
    const url = await uploadChatImage(selectedChatUser, file)
    if (!url) return
    const msg: Omit<ChatMessage, 'id' | 'created_at'> = { user_id: selectedChatUser, role: 'agent', text: null, image_url: url }
    setChatMsgs(prev => [...prev, { ...msg, id: Date.now(), created_at: new Date().toISOString() }])
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
            {chatUsers.map((cu: any) => {
              const total = allMsgCounts[cu.user_id] ?? 0
              const seen = seenCounts[cu.user_id] ?? 0
              const hasNew = selectedChatUser !== cu.user_id && total > seen
              const name = cu.profiles?.full_name || cu.profiles?.email?.split('@')[0] || cu.user_id.slice(0, 8)
              const initials = name[0].toUpperCase()
              return (
                <div key={cu.user_id}
                  onClick={() => setSelectedChatUser(cu.user_id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedChatUser === cu.user_id ? 'border-[#00a8ff]/40 bg-[#00a8ff]/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                  <div className="relative shrink-0">
                    {cu.profiles?.avatar_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={cu.profiles.avatar_url} alt={name} className="w-10 h-10 rounded-full object-cover" />
                      : <div className="w-10 h-10 rounded-full bg-[#00a8ff]/20 flex items-center justify-center text-sm font-bold text-[#00a8ff]">{initials}</div>}
                    {hasNew && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00a8ff] border-2 border-[#0a0f25]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-white text-sm font-semibold truncate">{name}</p>
                      {hasNew && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00a8ff] text-white font-bold shrink-0">New</span>}
                    </div>
                    <p className="text-white/40 text-xs truncate">{cu.profiles?.email}</p>
                  </div>
                </div>
              )
            })}
            {chatUsers.length === 0 && <p className="text-white/30 text-sm text-center py-6">No messages yet</p>}
          </div>

          {/* Chat window */}
          <div className="md:col-span-2">
            {selectedChatUser ? (() => {
              const cu = chatUsers.find((c: any) => c.user_id === selectedChatUser)
              const name = cu?.profiles?.full_name || cu?.profiles?.email?.split('@')[0] || selectedChatUser.slice(0, 8)
              return (
                <GlassCard variant="elevated" className="flex flex-col h-[520px] p-0 overflow-hidden">
                  {/* Chat header with profile */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0 bg-white/[0.03]">
                    {cu?.profiles?.avatar_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={cu.profiles.avatar_url} alt={name} className="w-8 h-8 rounded-full object-cover" />
                      : <div className="w-8 h-8 rounded-full bg-[#00a8ff]/20 flex items-center justify-center text-xs font-bold text-[#00a8ff]">{name[0].toUpperCase()}</div>}
                    <div>
                      <p className="text-white text-sm font-semibold">{name}</p>
                      <p className="text-white/40 text-xs">{cu?.profiles?.email}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
                    {chatMsgs.map(msg => (
                      <div key={msg.id} className={`flex gap-2 ${msg.role === 'agent' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                          style={{ background: msg.role === 'agent' ? 'color-mix(in srgb, var(--primary) 25%, transparent)' : 'rgba(255,255,255,0.1)' }}>
                          {msg.role === 'agent'
                            ? <Bot size={13} style={{ color: 'var(--primary)' }} />
                            : cu?.profiles?.avatar_url
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={cu.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                              : <span className="text-xs text-white/60">{name[0].toUpperCase()}</span>}
                        </div>
                        <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === 'agent' ? 'items-end' : 'items-start'}`}>
                          {msg.image_url
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={msg.image_url} alt="img" onClick={() => setLightbox(msg.image_url)} style={{ borderRadius: 8, maxWidth: 160, maxHeight: 160, objectFit: 'cover', cursor: 'zoom-in' }} />
                            : <div style={msg.role === 'agent'
                                ? { borderRadius: '12px 4px 12px 12px', background: 'var(--primary)' }
                                : { borderRadius: '4px 12px 12px 4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                                className="px-3 py-2 text-sm text-white/90">{msg.text}</div>}
                          <span className="text-white/30 text-xs px-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 p-3 border-t border-white/10 shrink-0">
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) sendImage(f); e.target.value = '' }} />
                    <button onClick={() => imageInputRef.current?.click()}
                      className="w-9 h-9 rounded-lg bg-white/[0.07] border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all">
                      <ImagePlus size={15} />
                    </button>
                    <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()}
                      placeholder="Reply as agent..." style={{ borderRadius: 8, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                      className="flex-1 text-white text-sm px-3 py-2 placeholder:text-white/30 focus:outline-none" />
                    <button onClick={sendReply} disabled={!replyText.trim()} style={{ borderRadius: 8, background: 'var(--primary)' }}
                      className="w-9 h-9 text-white flex items-center justify-center disabled:opacity-40">
                      <Send size={15} />
                    </button>
                  </div>
                </GlassCard>
              )
            })() : (
              <GlassCard variant="nested" className="flex items-center justify-center h-[520px] text-white/30">
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

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="expanded" className="max-w-[90vw] max-h-[80vh] rounded-2xl object-contain shadow-2xl" onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
