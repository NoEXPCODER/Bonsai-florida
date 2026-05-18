import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

/** POST /api/admin/upload — upload an image to bonsai-trees storage bucket (staff only) */
export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const path = formData.get('path') as string | null

  if (!file || !path) return NextResponse.json({ error: 'Missing file or path' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Not an image' }, { status: 400 })

  const db = createServerClient()
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await db.storage
    .from('bonsai-trees')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = db.storage.from('bonsai-trees').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
