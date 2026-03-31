'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassSelect } from '@/components/glass/glass-select'
import { Bell, Shield, Palette, Globe, Trash2, Check } from 'lucide-react'
import { useTheme } from '@/components/common/theme-provider'
import { getSettings, upsertSettings } from '@/lib/supabase/db'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
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
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, marketing: false })
  const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true, sessionTimeout: true })
  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    getSettings(user.uid).then(s => {
      if (!s) return
      setNotifs({ email: s.notif_email, push: s.notif_push, sms: s.notif_sms, marketing: s.notif_marketing })
      setSecurity({ twoFactor: s.security_2fa, loginAlerts: s.security_login_alerts, sessionTimeout: s.security_session_timeout })
      setCurrency(s.currency)
      setLanguage(s.language)
      if (s.theme) setTheme(s.theme as 'dark' | 'darker' | 'midnight')
    })
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await upsertSettings({
      user_id: user.uid,
      currency, language, theme,
      notif_email: notifs.email, notif_push: notifs.push, notif_sms: notifs.sms, notif_marketing: notifs.marketing,
      security_2fa: security.twoFactor, security_login_alerts: security.loginAlerts, security_session_timeout: security.sessionTimeout,
    })
    setSaving(false)
  }

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
            <GlassSelect
              label="Default Currency"
              value={currency}
              onChange={setCurrency}
              options={['USD','EUR','GBP','JPY','CAD','AUD','BTC','ETH'].map(c => ({ value: c, label: c }))}
            />
            <GlassSelect
              label="Language"
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'Français' },
                { value: 'es', label: 'Español' },
                { value: 'de', label: 'Deutsch' },
              ]}
            />
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard variant="elevated">
        <div className="flex items-center gap-2 mb-5">
          <Palette size={18} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([
            { id: 'dark',     label: 'Dark',     bg: '#0a0f25', accent: '#00a8ff' },
            { id: 'darker',   label: 'Darker',   bg: '#05080f', accent: '#00a8ff' },
            { id: 'midnight', label: 'Midnight', bg: '#000000', accent: '#7c6fff' },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                theme === t.id ? 'border-[var(--primary)] bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              {/* Mini preview */}
              <div className="w-full h-14 rounded-lg overflow-hidden border border-white/10" style={{ background: t.bg }}>
                <div className="h-3 w-full border-b border-white/10" style={{ background: t.bg }} />
                <div className="flex gap-1 p-1.5">
                  <div className="w-6 h-6 rounded" style={{ background: `${t.accent}33` }} />
                  <div className="flex-1 space-y-1 pt-0.5">
                    <div className="h-1.5 rounded-full bg-white/20 w-3/4" />
                    <div className="h-1.5 rounded-full bg-white/10 w-1/2" />
                  </div>
                </div>
                <div className="mx-1.5 h-3 rounded" style={{ background: `${t.accent}22` }} />
              </div>
              <span className="text-sm font-medium text-white">{t.label}</span>
              {theme === t.id && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: t.accent }}>
                  <Check size={11} className="text-black" />
                </span>
              )}
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

      <GlassButton variant="primary" className="w-full" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </GlassButton>
    </div>
  )
}
