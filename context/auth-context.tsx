'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { getFirebase } from '@/lib/firebase'
import type { Profile } from '@/lib/supabase/db'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
  balanceVisible: boolean
  toggleBalanceVisible: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null, loading: true,
  refreshProfile: async () => {},
  balanceVisible: true, toggleBalanceVisible: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [balanceVisible, setBalanceVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('vestor_balance_visible') !== 'false'
  })

  const toggleBalanceVisible = useCallback(() => {
    setBalanceVisible(v => {
      localStorage.setItem('vestor_balance_visible', String(!v))
      return !v
    })
  }, [])

  const fetchProfile = useCallback(async (firebaseUser: User) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName,
          avatar_url: firebaseUser.photoURL,
        }),
      })
      if (res.ok) setProfile(await res.json())
    } catch {
      setProfile(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user)
  }, [user, fetchProfile])

  useEffect(() => {
    const { auth } = getFirebase()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) await fetchProfile(firebaseUser)
      else setProfile(null)
      setLoading(false)
    })
    return unsubscribe
  }, [fetchProfile])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, balanceVisible, toggleBalanceVisible }}>
      {children}
    </AuthContext.Provider>
  )
}
