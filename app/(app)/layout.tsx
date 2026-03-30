'use client'

import { useAuth } from '@/context/auth-context'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
    } else if (!user.emailVerified) {
      router.replace('/verify-email')
    }
  }, [user, loading, router])

  if (loading || !user || !user.emailVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
