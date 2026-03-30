'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Mic, MicOff } from 'lucide-react'
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
  text: "Hi! I'm your Vestor Invest assistant. How can I help you today? You can ask me about investment plans, withdrawals, account settings, or anything else.",
  time: now(),
}

// Bypass global button border-radius rule for chat UI
const r = (radius: string) => ({ borderRadius: radius })

export default function ChatAgent() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
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
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = (text = input) => {
    const t = text.trim()
    if (!t) return
    const userMsg: Message = { id: Date.now(), role: 'user', text: t, time: now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'agent',
        text: 'Thanks for reaching out! Our team will get back to you shortly. For urgent matters, please contact support@vestorinvest.com.',
        time: now(),
      }])
    }, 800)
  }

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <>
      {/* Floating Glass Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          ...r('50%'),
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 text-white flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} className="text-[#2563eb]" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          style={{
            background: 'rgba(10,15,37,0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          className="fixed inset-0 z-50 flex flex-col sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:max-h-[520px] sm:rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(37,99,235,0.1))' }}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/10 sm:rounded-t-2xl"
          >
            <div style={r('50%')} className="w-9 h-9 bg-[#2563eb]/30 border border-[#2563eb]/40 flex items-center justify-center">
              <Bot size={18} className="text-[#2563eb]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Vestor Support</p>
              <p className="text-white/50 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online · Always here to help
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:max-h-[340px]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  style={r('50%')}
                  className={`w-7 h-7 flex items-center justify-center shrink-0 ${msg.role === 'agent' ? 'bg-[#2563eb]/20 border border-[#2563eb]/30' : 'bg-white/10 border border-white/15'}`}
                >
                  {msg.role === 'agent'
                    ? <Bot size={13} className="text-[#2563eb]" />
                    : <User size={13} className="text-white/60" />}
                </div>
                <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    style={msg.role === 'agent'
                      ? { ...r('4px 12px 12px 4px'), background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }
                      : { ...r('12px 4px 12px 12px'), background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }
                    }
                    className="px-3 py-2 text-sm text-white/90"
                  >
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
              style={r('8px')}
              className="flex-1 bg-white/[0.07] border border-white/10 text-white text-sm px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-[#2563eb]/50"
            />
            <button
              onClick={toggleVoice}
              style={r('8px')}
              className={`w-9 h-9 flex items-center justify-center transition-all ${listening ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-white/[0.07] border border-white/10 text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              {listening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              style={r('8px')}
              className="w-9 h-9 bg-[#2563eb] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#1d4ed8] transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
