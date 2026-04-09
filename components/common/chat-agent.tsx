'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, ImagePlus } from 'lucide-react'
import { getChatMessages, insertChatMessage, uploadChatImage } from '@/lib/supabase/db'
import { subscribeToTable } from '@/lib/supabase/realtime'
import { useAuth } from '@/context/auth-context'
import type { ChatMessage } from '@/lib/supabase/db'
import React from 'react'

const r = (radius: string) => ({ borderRadius: radius })

const initialMessage: ChatMessage = {
  id: 0,
  user_id: '',
  role: 'agent',
  text: "Hi! I'm your Vestor Invest assistant. How can I help you today? You can ask me about investment plans, withdrawals, account settings, or anything else.",
  image_url: null,
  created_at: new Date().toISOString(),
}

export default function ChatAgent() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [unreadAgent, setUnreadAgent] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const openRef = useRef(open)
  openRef.current = open

  // Load initial messages
  useEffect(() => {
    if (!user) return
    getChatMessages(user.uid).then(msgs => {
      if (msgs.length > 0) setMessages(msgs)
    })
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [user])

  // Realtime subscription — replaces all polling intervals
  useEffect(() => {
    if (!user) return
    const unsub = subscribeToTable<ChatMessage>(
      'chat_messages',
      'INSERT',
      (row) => {
        // Deduplicate: ignore if we already have this id (optimistic insert)
        setMessages(prev => {
          if (prev.some(m => m.id === row.id)) return prev
          return [...prev, row]
        })
        // Badge + notification for agent replies when chat is closed
        if (row.role === 'agent' && row.id !== 0 && !openRef.current) {
          setUnreadAgent(n => n + 1)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Vestor Support', {
              body: 'You have a new message from your agent.',
              icon: '/VestorLog.png',
            })
          }
        }
      },
      { col: 'user_id', val: user.uid },
    )
    return unsub
  }, [user])

  // Draggable FAB
  const [fabSide, setFabSide] = useState<'left' | 'right'>('right')
  const [fabY, setFabY] = useState(24)
  const fabDragging = useRef(false)
  const fabMoved = useRef(false)
  const fabStart = useRef({ clientX: 0, clientY: 0, fabY: 24 })

  const onFabPointerDown = (e: React.PointerEvent) => {
    fabDragging.current = true
    fabMoved.current = false
    fabStart.current = { clientX: e.clientX, clientY: e.clientY, fabY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onFabPointerMove = (e: React.PointerEvent) => {
    if (!fabDragging.current) return
    const dy = fabStart.current.clientY - e.clientY
    if (Math.abs(dy) > 4 || Math.abs(e.clientX - fabStart.current.clientX) > 4) fabMoved.current = true
    setFabY(Math.max(16, Math.min(window.innerHeight - 72, fabStart.current.fabY + dy)))
  }
  const onFabPointerUp = (e: React.PointerEvent) => {
    if (!fabDragging.current) return
    fabDragging.current = false
    setFabSide(e.clientX < window.innerWidth / 2 ? 'left' : 'right')
    if (!fabMoved.current) setOpen(o => !o)
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setUnreadAgent(0)
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      const t = setTimeout(() => { document.body.style.overflow = 'unset'; setDragY(0) }, 300)
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-chat-agent', handler)
    return () => window.removeEventListener('open-chat-agent', handler)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; setDragging(true) }
  const onTouchMove = (e: React.TouchEvent) => { const d = e.touches[0].clientY - startY.current; if (d > 0) setDragY(d) }
  const onTouchEnd = () => { setDragging(false); if (dragY > 120) close(); else setDragY(0) }

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async (text = input) => {
    const t = text.trim()
    if (!t || !user) return
    const msg: Omit<ChatMessage, 'id' | 'created_at'> = { user_id: user.uid, role: 'user', text: t, image_url: null }
    const optimistic: ChatMessage = { ...msg, id: Date.now(), created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    setInput('')
    await insertChatMessage(msg)

    // Auto-reply only on the very first user message
    const isFirst = messages.filter(m => m.id !== 0 && m.role === 'user').length === 0
    if (isFirst) {
      setTimeout(async () => {
        const agentMsg: Omit<ChatMessage, 'id' | 'created_at'> = {
          user_id: user.uid, role: 'agent', image_url: null,
          text: 'Thanks for reaching out! Our support team has been notified and will reply to you shortly.',
        }
        await insertChatMessage(agentMsg)
        // Realtime will push it back — no need to setMessages here
      }, 800)
    }
  }

  const sendImage = async (file: File) => {
    if (!user) return
    const url = await uploadChatImage(user.uid, file)
    if (!url) return
    const msg: Omit<ChatMessage, 'id' | 'created_at'> = { user_id: user.uid, role: 'user', text: null, image_url: url }
    const optimistic: ChatMessage = { ...msg, id: Date.now(), created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    await insertChatMessage(msg)
    setTimeout(async () => {
      await insertChatMessage({
        user_id: user.uid, role: 'agent', image_url: null,
        text: 'Thanks for sharing the image! Our team will review it and get back to you shortly.',
      })
    }, 800)
  }

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    const rec = new SR()
    rec.lang = 'en-US'; rec.interimResults = false
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false) }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start(); setListening(true)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onPointerDown={onFabPointerDown}
        onPointerMove={onFabPointerMove}
        onPointerUp={onFabPointerUp}
        style={{
          ...r('50%'),
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 8px 32px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)',
          bottom: fabY,
          ...(fabSide === 'right' ? { right: 24, left: 'auto' } : { left: 24, right: 'auto' }),
          transition: fabDragging.current ? 'none' : 'left 0.25s ease, right 0.25s ease',
          touchAction: 'none',
          cursor: fabDragging.current ? 'grabbing' : 'grab',
        }}
        className="fixed z-50 w-14 h-14 text-white flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} style={{ color: 'var(--primary)' }} />}
        {!open && unreadAgent > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00a8ff] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0a0f25]">
            {unreadAgent}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {(open || visible) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-end justify-center sm:justify-end sm:pb-24 sm:pr-6">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={close}
          />
          <div
            style={{
              transform: visible ? `translateY(${dragY}px)` : 'translateY(100%)',
              transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
              background: 'var(--background)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
            className="relative z-10 w-full max-h-[calc(100dvh-60px)] rounded-t-2xl sm:rounded-2xl sm:w-[380px] sm:max-h-[520px] flex flex-col overflow-hidden"
          >
            {/* Drag handle */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 cursor-grab shrink-0" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
              <div style={r('9999px')} className="w-10 h-1 bg-white/30" />
            </div>

            {/* Header */}
            <div style={{ background: 'color-mix(in srgb, var(--primary) 20%, transparent)' }} className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
              <div style={{ ...r('50%'), background: 'color-mix(in srgb, var(--primary) 25%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)' }} className="w-9 h-9 flex items-center justify-center">
                <Bot size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Vestor Support</p>
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online · Always here to help
                </p>
              </div>
              <button onClick={close} style={r('8px')} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    style={{ ...r('50%'), background: msg.role === 'agent' ? 'color-mix(in srgb, var(--primary) 20%, transparent)' : 'rgba(255,255,255,0.1)', border: `1px solid ${msg.role === 'agent' ? 'color-mix(in srgb, var(--primary) 30%, transparent)' : 'rgba(255,255,255,0.15)'}` }}
                    className="w-7 h-7 flex items-center justify-center shrink-0 mt-1"
                  >
                    {msg.role === 'agent' ? <Bot size={13} style={{ color: 'var(--primary)' }} /> : <User size={13} className="text-white/60" />}
                  </div>
                  <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={msg.image_url} alt="shared" onClick={() => setLightbox(msg.image_url)} style={{ ...r('10px'), maxWidth: 200, maxHeight: 200, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', cursor: 'zoom-in' }} />
                    ) : (
                      <div
                        style={msg.role === 'agent'
                          ? { ...r('4px 12px 12px 4px'), background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }
                          : { ...r('12px 4px 12px 12px'), background: 'var(--primary)' }}
                        className="px-3 py-2 text-sm text-white/90"
                      >
                        {msg.text}
                      </div>
                    )}
                    <span className="text-white/30 text-xs px-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10 shrink-0">
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) sendImage(f); e.target.value = '' }} />
              <button onClick={() => imageInputRef.current?.click()} style={r('8px')} className="w-9 h-9 flex items-center justify-center bg-white/[0.07] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all" title="Send image">
                <ImagePlus size={15} />
              </button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                style={{ ...r('8px'), background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                className="flex-1 text-white text-sm px-3 py-2 placeholder:text-white/30 focus:outline-none"
              />
              <button onClick={toggleVoice} style={r('8px')} className={`w-9 h-9 flex items-center justify-center transition-all ${listening ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-white/[0.07] border border-white/10 text-white/50 hover:text-white hover:bg-white/10'}`}>
                {listening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
              <button onClick={() => send()} disabled={!input.trim()} style={{ ...r('8px'), background: 'var(--primary)' }} className="w-9 h-9 text-white flex items-center justify-center disabled:opacity-40 hover:brightness-110 transition-all">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="expanded" className="max-w-[90vw] max-h-[80vh] rounded-2xl object-contain shadow-2xl" onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} style={{ borderRadius: '50%' }} className="absolute top-4 right-4 w-9 h-9 bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  )
}
