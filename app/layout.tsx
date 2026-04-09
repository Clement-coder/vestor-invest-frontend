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
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Vestor Invest — Premium Crypto Investing Platform',
  description: 'Grow your wealth with Vestor Invest. AI-powered crypto investment plans, real-time portfolio analytics, and bank-level security. Start with as little as $100.',
  keywords: ['crypto investing', 'cryptocurrency', 'investment platform', 'portfolio analytics', 'bitcoin', 'ethereum'],
  authors: [{ name: 'Vestor Invest' }],
  creator: 'Vestor Invest',
  publisher: 'Vestor Invest',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vestor Invest',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32x32.png',
  },
  openGraph: {
    title: 'Vestor Invest — Premium Crypto Investing Platform',
    description: 'Grow your wealth with AI-powered crypto investment plans and real-time analytics.',
    type: 'website',
    siteName: 'Vestor Invest',
    images: [{ url: '/icon-512x512.png', width: 512, height: 512, alt: 'Vestor Invest' }],
  },
  twitter: {
    card: 'summary',
    title: 'Vestor Invest — Premium Crypto Investing',
    description: 'AI-powered crypto investment plans with real-time analytics and bank-level security.',
    images: ['/icon-512x512.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Vestor" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" richColors duration={3000} />
        </ThemeProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}`,
          }}
        />
      </body>
    </html>
  )
}
