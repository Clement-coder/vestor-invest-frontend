import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { txId, status } = await req.json()
  if (!txId || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const sb = createAdminClient()

  // Fetch the transaction
  const { data: tx, error: txErr } = await sb.from('transactions').select('user_id, amount, type, status').eq('id', txId).single()
  if (txErr || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

  // Only act on Pending transactions
  if (tx.status !== 'Pending') return NextResponse.json({ error: 'Already settled' }, { status: 400 })

  // Mark the transaction
  const { error: updateErr } = await sb.from('transactions').update({ status }).eq('id', txId)
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // If it's a Withdrawal being Approved → deduct balance
  // If it's a Deposit/Credit being Approved → credit balance
  if (status === 'Completed') {
    const { data: profile } = await sb.from('profiles').select('balance').eq('id', tx.user_id).single()
    const current = Number(profile?.balance ?? 0)
    const amount = Number(tx.amount)
    const newBalance = tx.type === 'Withdrawal' || tx.type === 'Debit'
      ? current - amount
      : current + amount
    await sb.from('profiles').update({ balance: Math.max(0, newBalance) }).eq('id', tx.user_id)
  }

  return NextResponse.json({ ok: true })
}
