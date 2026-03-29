'use client'

import { Navigation } from '@/components/common/navigation'
import React, { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation variant="dashboard" />

      {/* Main Content */}
      <div className="pt-20 lg:flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed h-[calc(100vh-80px)] border-r border-white/10 glass">
          <nav className="p-6 space-y-2">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
              Menu
            </div>
            {/* Dashboard items will be added here */}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 lg:ml-64 px-4 lg:px-8 py-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
