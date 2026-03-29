'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassInput } from '@/components/glass/glass-input'
import { Bell, Shield, Palette, Globe, Trash2 } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-[#00a8ff]' : 'bg-white/20'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-white/40 text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, marketing: false })
  const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true, sessionTimeout: true })
  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')
  const [theme, setTheme] = useState('dark')

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      {/* Notifications */}
      <GlassCard variant="elevated">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-[#00a8ff]" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <div className="divide-y divide-white/10">
          <Row label="Email Notifications" description="Receive updates via email">
            <Toggle enabled={notifs.email} onChange={v => setNotifs(p => ({ ...p, email: v }))} />
          </Row>
          <Row label="Push Notifications" description="Browser & mobile push alerts">
            <Toggle enabled={notifs.push} onChange={v => setNotifs(p => ({ ...p, push: v }))} />
          </Row>
          <Row label="SMS Alerts" description="Text messages for critical events">
            <Toggle enabled={notifs.sms} onChange={v => setNotifs(p => ({ ...p, sms: v }))} />
          </Row>
          <Row label="Marketing Emails" description="News, offers and promotions">
            <Toggle enabled={notifs.marketing} onChange={v => setNotifs(p => ({ ...p, marketing: v }))} />
          </Row>
        </div>
      </GlassCard>

      {/* Security */}
      <GlassCard variant="elevated">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-[#39ff9e]" />
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>
        <div className="divide-y divide-white/10">
          <Row label="Two-Factor Authentication" description="Add an extra layer of security">
            <Toggle enabled={security.twoFactor} onChange={v => setSecurity(p => ({ ...p, twoFactor: v }))} />
          </Row>
          <Row label="Login Alerts" description="Get notified of new sign-ins">
            <Toggle enabled={security.loginAlerts} onChange={v => setSecurity(p => ({ ...p, loginAlerts: v }))} />
          </Row>
          <Row label="Auto Session Timeout" description="Log out after 30 min of inactivity">
            <Toggle enabled={security.sessionTimeout} onChange={v => setSecurity(p => ({ ...p, sessionTimeout: v }))} />
          </Row>
          <div className="pt-3">
            <GlassButton variant="outline" size="sm">Change Password</GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Preferences */}
      <GlassCard variant="elevated">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-2">Default Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50"
            >
              {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'BTC', 'ETH'].map(c => (
                <option key={c} className="bg-[#0a0f25]">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-2">Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/50"
            >
              <option value="en" className="bg-[#0a0f25]">English</option>
              <option value="fr" className="bg-[#0a0f25]">Français</option>
              <option value="es" className="bg-[#0a0f25]">Español</option>
              <option value="de" className="bg-[#0a0f25]">Deutsch</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard variant="elevated">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={18} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
        </div>
        <div className="flex gap-3">
          {['dark', 'darker', 'midnight'].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium capitalize transition-all border ${
                theme === t
                  ? 'bg-white/10 text-white border-white/30'
                  : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/8'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard variant="nested" className="border-red-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 size={18} className="text-red-400" />
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <GlassButton variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            Deactivate Account
          </GlassButton>
          <GlassButton variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            Delete Account
          </GlassButton>
        </div>
      </GlassCard>

      <GlassButton variant="primary" className="w-full">Save Changes</GlassButton>
    </div>
  )
}
