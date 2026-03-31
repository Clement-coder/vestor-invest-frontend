'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

interface Option {
  value: string
  label: string
}

interface GlassSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  label?: string
  className?: string
}

export function GlassSelect({ value, onChange, options, label, className }: GlassSelectProps) {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const selected = options.find(o => o.value === value) ?? options[0]

  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect())
    setOpen(o => !o)
  }

  const dropdown = open && rect ? createPortal(
    <ul
      ref={listRef}
      style={{
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid var(--glass-border)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {options.map(opt => (
        <li key={opt.value}>
          <button
            type="button"
            onMouseDown={() => { onChange(opt.value); setOpen(false) }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/85 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            <span>{opt.label}</span>
            {opt.value === value && <Check size={14} style={{ color: 'var(--primary)' }} />}
          </button>
        </li>
      ))}
    </ul>,
    document.body
  ) : null

  return (
    <div className={cn('relative', className)}>      {label && <label className="block text-xs text-white/50 mb-2">{label}</label>}
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04)',
        }}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all hover:brightness-125"
      >
        <span>{selected?.label}</span>
        <ChevronDown size={16} className={cn('text-white/40 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {dropdown}
    </div>
  )
}
