'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassInput } from '@/components/glass/glass-input'
import { useState } from 'react'
import React from 'react'

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      {/* Avatar & Name */}
      <GlassCard variant="elevated" className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00a8ff] to-[#39ff9e] flex items-center justify-center text-3xl font-bold text-white shrink-0">
          JD
        </div>
        <div>
          <p className="text-xl font-bold text-white">John Doe</p>
          <p className="text-white/50 text-sm">john.doe@example.com</p>
          <p className="text-neon-green text-xs mt-1">Premium Member</p>
        </div>
      </GlassCard>

      {/* Personal Info */}
      <GlassCard variant="elevated">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Personal Information</h2>
          <GlassButton variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </GlassButton>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">First Name</label>
              <GlassInput defaultValue="John" disabled={!editing} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Last Name</label>
              <GlassInput defaultValue="Doe" disabled={!editing} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Email</label>
            <GlassInput type="email" defaultValue="john.doe@example.com" disabled={!editing} />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Phone</label>
            <GlassInput type="tel" defaultValue="+1 (555) 000-0000" disabled={!editing} />
          </div>
          {editing && (
            <GlassButton variant="primary" className="w-full" onClick={() => setEditing(false)}>
              Save Changes
            </GlassButton>
          )}
        </div>
      </GlassCard>

      {/* Account Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Member Since', value: 'Jan 2024' },
          { label: 'Total Invested', value: '$45,230' },
          { label: 'Active Plans', value: '3' },
        ].map((stat, i) => (
          <GlassCard key={i} variant="nested" className="text-center">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-xs mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Security */}
      <GlassCard variant="elevated">
        <h2 className="text-lg font-semibold text-white mb-4">Security</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Password</p>
              <p className="text-white/40 text-xs">Last changed 3 months ago</p>
            </div>
            <GlassButton variant="outline" size="sm">Change</GlassButton>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-white/40 text-xs">Not enabled</p>
            </div>
            <GlassButton variant="outline" size="sm">Enable</GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
