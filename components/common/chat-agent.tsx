'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import React from 'react'

interface Message {
  id: number
  role: 'agent' | 'user'
  text: string
  time: string
}

const STORAGE_KEY = 'vestor_chat_history'

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const initialMessage: Message = {
  id: 0,
  role: 'agent',
  text: 'Hi! I\'m your Vestor Invest assistant. How can I help you today? You can ask me about investment plans, withdrawals, account settings, or anything else.',
  time: now(),
}

export default function ChatAgent() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [initialMessage]
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : [initialMessage]
    } catch {
      return [initialMessage]
    }
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { id: Date.now(), role: 'user', text, time: now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulated agent reply — replace with real API call
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        role: 'agent',
        text: 'Thanks for reaching out! Our team will get back to you shortly. For urgent matters, please contact support@vestorinvest.com.',
        time: now(),
      }
      setMessages(prev => [...prev, reply])
    }, 800)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-btn text-white flex items-center justify-center shadow-lg hover:scale-[0.97] transition-transform"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col shadow-2xl border border-white/10 bg-[var(--background)]" style={{ maxHeight: '520px' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 gradient-btn">
            <div className="w-8 h-8 bg-white/20 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Vestor Support</p>
              <p className="text-white/60 text-xs">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0, maxHeight: '340px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 flex items-center justify-center shrink-0 ${msg.role === 'agent' ? 'bg-[#2563eb]/30' : 'bg-white/10'}`}>
                  {msg.role === 'agent' ? <Bot size={14} className="text-[#2563eb]" /> : <User size={14} className="text-white/60" />}
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-3 py-2 text-sm ${msg.role === 'agent' ? 'bg-white/[0.07] text-white/90 border border-white/10' : 'gradient-btn text-white'}`}>
                    {msg.text}
                  </div>
                  <span className="text-white/30 text-xs px-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 bg-white/[0.07] border border-white/10 text-white text-sm px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-[#2563eb]/50"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-9 h-9 gradient-btn text-white flex items-center justify-center disabled:opacity-40 hover:scale-[0.97] transition-transform"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
