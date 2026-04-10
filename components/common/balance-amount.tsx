'use client'

import { useAuth } from '@/context/auth-context'

// Logo URLs for each currency
const LOGOS: Record<string, string> = {
  USD: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png', // USD dollar coin logo
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  EUR: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/eu.svg',
}

interface Props {
  amount: number
  currency?: 'USD' | 'BTC' | 'ETH' | 'EUR'
  prefix?: string        // e.g. "+" or "-"
  className?: string
  logoSize?: number
  hideLogo?: boolean
}

export function BalanceAmount({ amount, currency = 'USD', prefix = '', className = '', logoSize = 18, hideLogo = false }: Props) {
  const { balanceVisible } = useAuth()
  const logo = LOGOS[currency]
  const isRound = currency === 'BTC' || currency === 'ETH'
  const formatted = currency === 'BTC' || currency === 'ETH'
    ? amount.toFixed(6)
    : amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'BTC' ? '₿' : 'Ξ'

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {!hideLogo && logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={currency}
          width={logoSize}
          height={logoSize}
          className={isRound ? 'rounded-full shrink-0' : 'rounded-sm shrink-0 object-cover'}
          style={{ width: logoSize, height: logoSize }}
        />
      )}
      {balanceVisible
        ? <span>{prefix}{symbol}{formatted}</span>
        : <span style={{ color: 'rgba(0,168,255,0.3)', letterSpacing: '0.15em' }}>████</span>
      }
    </span>
  )
}
