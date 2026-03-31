export interface TxRecord {
  id: string
  type: 'Withdrawal'
  method: 'bank' | 'crypto'
  amount: string
  status: 'Pending' | 'Completed' | 'Failed'
  date: string
  // bank
  name?: string
  bankName?: string
  swift?: string
  iban?: string
  routing?: string
  // crypto
  network?: string
  address?: string
}

const KEY = 'vestor_transactions'

export function getTxs(): TxRecord[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function addTx(tx: TxRecord) {
  const all = getTxs()
  all.unshift(tx)
  localStorage.setItem(KEY, JSON.stringify(all))
}
