import { useState, useEffect } from 'react'

export function useCountdown(endTime: string) {
  const getRemaining = () => Math.max(0, new Date(endTime).getTime() - Date.now())
  const [remaining, setRemaining] = useState(getRemaining)

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [endTime])

  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return { remaining, label, done: remaining === 0 }
}
