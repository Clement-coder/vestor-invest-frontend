import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Generic admin-client proxy — bypasses RLS for Firebase users
// Body: { table, action, payload, filters, order, single }
export async function POST(req: NextRequest) {
  const { table, action, payload, filters, order, single: isSingle } = await req.json()
  if (!table || !action) return NextResponse.json({ error: 'Missing table or action' }, { status: 400 })

  const sb = createAdminClient()
  let query: any = sb.from(table)

  try {
    if (action === 'select') {
      query = query.select(payload ?? '*')
      if (filters) filters.forEach(([col, val]: [string, any]) => { query = query.eq(col, val) })
      if (order) query = query.order(order.col, { ascending: order.asc ?? false })
      if (isSingle) query = query.single()
    } else if (action === 'insert') {
      query = query.insert(payload).select('*')
      if (isSingle) query = query.single()
    } else if (action === 'update') {
      query = query.update(payload)
      if (filters) filters.forEach(([col, val]: [string, any]) => { query = query.eq(col, val) })
      if (isSingle) query = query.select('*').single()
    } else if (action === 'upsert') {
      query = query.upsert(payload)
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? { ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
