import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  const userId = form.get('userId') as string | null

  if (!file || !userId) return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })

  const sb = createAdminClient()
  const path = `${userId}/${Date.now()}_${file.name}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await sb.storage.from('chat-images').upload(path, buffer, { contentType: file.type })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = sb.storage.from('chat-images').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
