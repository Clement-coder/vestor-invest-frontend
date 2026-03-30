'use client'

import { useEffect, useState } from 'react'

interface Coin {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  sparkline_in_7d: { price: number[] }
}

function Sparkline({ prices, up }: { prices: number[]; up: boolean }) {
  if (!prices?.length) return null
  const w = 80, h = 32
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const pts = prices
    .filter((_, i) => i % Math.ceil(prices.length / 20) === 0)
    .map((p, i, arr) => `${(i / (arr.length - 1)) * w},${h - ((p - min) / range) * h}`)
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={up ? '#39ff9e' : '#f87171'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const COIN_IDS = 'bitcoin,ethereum,binancecoin,solana,ripple,cardano'
const SYMBOLS: Record<string, string> = {
  bitcoin: 'BTC', ethereum: 'ETH', binancecoin: 'BNB',
  solana: 'SOL', ripple: 'XRP', cardano: 'ADA',
}

export function LiveMarket() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS}&sparkline=true&price_change_percentage=24h`,
        { next: { revalidate: 60 } }
      )
      const data = await res.json()
      setCoins(data)
    } catch {
      // silently fail — keep showing last data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // refresh every 60s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-white/10 animate-pulse h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {coins.map((coin) => {
        const up = coin.price_change_percentage_24h >= 0
        const price = coin.current_price >= 1
          ? `$${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : `$${coin.current_price.toFixed(4)}`
        const change = `${up ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2)}%`

        return (
          <div key={coin.id} className="glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <img
                  src={`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons/32/color/${SYMBOLS[coin.id]?.toLowerCase()}.png`}
                  alt={coin.name}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-white/60 text-xs font-bold">{SYMBOLS[coin.id]}</span>
              </div>
              <span className={`text-xs font-semibold ${up ? 'text-[#39ff9e]' : 'text-red-400'}`}>{change}</span>
            </div>
            <p className="text-white font-bold text-sm mb-1">{price}</p>
            <Sparkline prices={coin.sparkline_in_7d?.price ?? []} up={up} />
          </div>
        )
      })}
    </div>
  )
}
