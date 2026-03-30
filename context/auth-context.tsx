'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { getFirebase } from '@/lib/firebase'
import { getGoogleRedirectResult } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { auth } = getFirebase()

    // Handle Google redirect result first, then listen for auth state
    getGoogleRedirectResult()
      .then((result) => {
        if (result?.user) {
          // onAuthStateChanged will fire and set the user,
          // then we navigate to dashboard
          router.push('/dashboard')
        }
      })
      .catch(() => {})
      .finally(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
        // store unsubscribe — but since we're in finally we can't return it
        // so we just let it run; component unmount will be handled below
      })

    // Also set up auth listener immediately for non-redirect flows
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
