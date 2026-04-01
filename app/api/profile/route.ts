import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { id, email, full_name, avatar_url } = await req.json()
  if (!id || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const sb = createAdminClient()

  // Check if profile already exists
  const { data: existing } = await sb.from('profiles').select('*').eq('id', id).single()

  if (existing) {
    // Profile exists — only update display fields, NEVER touch role or balance
    const { data, error } = await sb
      .from('profiles')
      .update({ email, full_name, avatar_url })
      .eq('id', id)
      .select('*')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  // New user — insert with defaults (role = 'user', balance = 0)
  const { data, error } = await sb
    .from('profiles')
    .insert({ id, email, full_name, avatar_url })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
