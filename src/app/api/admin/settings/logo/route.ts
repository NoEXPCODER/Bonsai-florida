import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

/** POST /api/admin/settings/logo — upload brand logo, upsert to fixed path, save URL in site_settings */
export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Not an image' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'png'
  const path = `settings/logo.${ext}`

  const db = createServerClient()
  const bytes = await file.arrayBuffer()

  // Remove any existing logo first, then upload fresh
  await db.storage.from('bonsai-trees').remove([`settings/logo.png`, `settings/logo.jpg`, `settings/logo.jpeg`, `settings/logo.webp`, `settings/logo.svg`])

  const { error: upErr } = await db.storage
    .from('bonsai-trees')
    .upload(path, Buffer.from(bytes), { contentType: file.type, upsert: true })

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

  const { data } = db.storage.from('bonsai-trees').getPublicUrl(path)
  const logoUrl = data.publicUrl

  await db.from('site_settings').upsert(
    { key: 'logo_url', value: logoUrl, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  )

  return NextResponse.json({ url: logoUrl })
}

/** DELETE /api/admin/settings/logo — remove logo, revert to default SVG */
export async function DELETE(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServerClient()
  await db.storage.from('bonsai-trees').remove([
    `settings/logo.png`, `settings/logo.jpg`, `settings/logo.jpeg`,
    `settings/logo.webp`, `settings/logo.svg`,
  ])
  await db.from('site_settings').upsert(
    { key: 'logo_url', value: null, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  )

  return NextResponse.json({ ok: true })
}
