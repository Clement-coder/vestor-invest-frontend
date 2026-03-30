'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassInput } from '@/components/glass/glass-input'
import { useAuth } from '@/context/auth-context'
import { getFirebase } from '@/lib/firebase'
import { updateProfile, updateEmail, sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const displayName = user?.displayName || ''
  const [firstName, setFirstName] = useState(displayName.split(' ')[0] || '')
  const [lastName, setLastName] = useState(displayName.split(' ').slice(1).join(' ') || '')
  const [email, setEmail] = useState(user?.email || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() || '?'

  const memberSince = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—'

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { auth } = getFirebase()
      const currentUser = auth.currentUser
      if (!currentUser) return

      const newName = `${firstName} ${lastName}`.trim()
      if (newName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: newName })
      }
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email)
      }
      setSuccess('Profile updated successfully')
      setEditing(false)
    } catch {
      setError('Failed to update profile. You may need to re-login to change email.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    const { auth } = getFirebase()
    await sendPasswordResetEmail(auth, user.email)
    setResetSent(true)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      {/* Avatar & Name */}
      <GlassCard variant="elevated" className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#00a8ff] flex items-center justify-center text-3xl font-bold text-white shrink-0 overflow-hidden">
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
            : initials}
        </div>
        <div>
          <p className="text-xl font-bold text-white">{user?.displayName || 'No name set'}</p>
          <p className="text-white/50 text-sm">{user?.email}</p>
          <p className="text-neon-green text-xs mt-1">
            {user?.providerData[0]?.providerId === 'google.com' ? 'Google Account' : 'Email Account'}
          </p>
        </div>
      </GlassCard>

      {/* Personal Info */}
      <GlassCard variant="elevated">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Personal Information</h2>
          <GlassButton variant="outline" size="sm" onClick={() => { setEditing(!editing); setError(''); setSuccess('') }}>
            {editing ? 'Cancel' : 'Edit'}
          </GlassButton>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">First Name</label>
              <GlassInput value={firstName} onChange={e => setFirstName(e.target.value)} disabled={!editing} placeholder="First name" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Last Name</label>
              <GlassInput value={lastName} onChange={e => setLastName(e.target.value)} disabled={!editing} placeholder="Last name" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Email</label>
            <GlassInput type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!editing || user?.providerData[0]?.providerId === 'google.com'} />
            {user?.providerData[0]?.providerId === 'google.com' && (
              <p className="text-white/30 text-xs mt-1">Email managed by Google</p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-neon-green text-sm">{success}</p>}

          {editing && (
            <GlassButton variant="primary" className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </GlassButton>
          )}
        </div>
      </GlassCard>

      {/* Account Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Member Since', value: memberSince },
          { label: 'Email Verified', value: user?.emailVerified ? '✓ Yes' : '✗ No' },
          { label: 'Provider', value: user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email' },
        ].map((stat, i) => (
          <GlassCard key={i} variant="nested" className="text-center">
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-xs mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Security */}
      <GlassCard variant="elevated">
        <h2 className="text-lg font-semibold text-white mb-4">Security</h2>
        <div className="space-y-3">
          {user?.providerData[0]?.providerId !== 'google.com' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Password</p>
                <p className="text-white/40 text-xs">{resetSent ? 'Reset email sent!' : 'Send a password reset email'}</p>
              </div>
              <GlassButton variant="outline" size="sm" onClick={handlePasswordReset} disabled={resetSent}>
                {resetSent ? 'Sent ✓' : 'Reset'}
              </GlassButton>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Account ID</p>
              <p className="text-white/40 text-xs font-mono">{user?.uid?.slice(0, 16)}...</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
