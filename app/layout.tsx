import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/common/theme-provider'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#0A0F25',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Vestor Invest — Premium Crypto Investing Platform',
  description: 'Grow your wealth with Vestor Invest. AI-powered crypto investment plans, real-time portfolio analytics, and bank-level security. Start with as little as $100.',
  keywords: ['crypto investing', 'cryptocurrency', 'investment platform', 'portfolio analytics', 'bitcoin', 'ethereum'],
  authors: [{ name: 'Vestor Invest' }],
  creator: 'Vestor Invest',
  publisher: 'Vestor Invest',
  icons: {
    icon: [
      { url: '/VestorLog.png', type: 'image/png' },
    ],
    apple: '/VestorLog.png',
    shortcut: '/VestorLog.png',
  },
  openGraph: {
    title: 'Vestor Invest — Premium Crypto Investing Platform',
    description: 'Grow your wealth with AI-powered crypto investment plans and real-time analytics.',
    type: 'website',
    siteName: 'Vestor Invest',
    images: [{ url: '/VestorLog.png', width: 512, height: 512, alt: 'Vestor Invest' }],
  },
  twitter: {
    card: 'summary',
    title: 'Vestor Invest — Premium Crypto Investing',
    description: 'AI-powered crypto investment plans with real-time analytics and bank-level security.',
    images: ['/VestorLog.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" richColors duration={3000} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
