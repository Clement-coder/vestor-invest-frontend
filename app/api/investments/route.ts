import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json([], { status: 200 })
  const sb = createAdminClient()
  const { data } = await sb.from('investments').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { userId, amount } = await req.json()
  if (!userId || !amount) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const sb = createAdminClient()
  const { data, error } = await sb
    .from('investments')
    .insert({ user_id: userId, amount })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { id, profitLoss } = await req.json()
  if (!id || profitLoss === undefined) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const sb = createAdminClient()

  // Fetch the investment to get user_id and amount
  const { data: inv, error: fetchErr } = await sb.from('investments').select('user_id, amount').eq('id', id).single()
  if (fetchErr || !inv) return NextResponse.json({ error: 'Investment not found' }, { status: 404 })

  // Mark investment completed
  const { error } = await sb.from('investments').update({ status: 'completed', profit_loss: profitLoss }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Credit balance: original amount + profit/loss
  const payout = Number(inv.amount) + Number(profitLoss)
  const { data: profile } = await sb.from('profiles').select('balance').eq('id', inv.user_id).single()
  const newBalance = Number(profile?.balance ?? 0) + payout
  await sb.from('profiles').update({ balance: newBalance }).eq('id', inv.user_id)

  return NextResponse.json({ ok: true })
}
