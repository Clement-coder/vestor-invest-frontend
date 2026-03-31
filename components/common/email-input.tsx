'use client'

import { useState, useRef } from 'react'
import { GlassInput } from '@/components/glass/glass-input'
import { Mail } from 'lucide-react'

const DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com']

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  name?: string
}

export function EmailInput({ value, onChange, error, disabled, name = 'email' }: EmailInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)

    const atIndex = val.indexOf('@')
    if (atIndex !== -1) {
      const typed = val.slice(atIndex + 1)
      const local = val.slice(0, atIndex)
      const filtered = DOMAINS.filter(d => d.startsWith(typed) && d !== typed)
      setSuggestions(filtered.map(d => `${local}@${d}`))
    } else {
      setSuggestions([])
    }
  }

  const handleSuggest = (suggestion: string) => {
    onChange(suggestion)
    setSuggestions([])
  }

  return (
    <div className="relative" ref={inputRef}>
      <GlassInput
        label="Email Address"
        type="email"
        name={name}
        placeholder="you@example.com"
        value={value}
        onChange={handleChange}
        error={error}
        disabled={disabled}
        icon={<Mail size={16} />}
        autoComplete="email"
        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-[9999] w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          {suggestions.map(s => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={() => handleSuggest(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/85 hover:bg-white/[0.12] hover:text-white transition-colors"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
