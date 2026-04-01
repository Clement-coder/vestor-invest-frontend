import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { id, email, full_name, avatar_url } = await req.json()
  if (!id || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const sb = createAdminClient()

  const { data, error } = await sb
    .from('profiles')
    .upsert({ id, email, full_name, avatar_url }, { onConflict: 'id' })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
