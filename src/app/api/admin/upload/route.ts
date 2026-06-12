import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'
import { hasValidImageSignature, sanitizeStoragePath, validateImageFile } from '@/lib/upload-security'

/** POST /api/admin/upload — upload an image to bonsai-trees storage bucket (staff only) */
export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const path = formData.get('path') as string | null

  if (!file || !path) return NextResponse.json({ error: 'Missing file or path' }, { status: 400 })
  const validation = validateImageFile(file)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status })
  }

  const safePath = sanitizeStoragePath(path)
  if (!safePath) return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 })

  const db = createServerClient()
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  if (!hasValidImageSignature(buffer, file.type)) {
    return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })
  }

  const { error } = await db.storage
    .from('bonsai-trees')
    .upload(safePath, buffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = db.storage.from('bonsai-trees').getPublicUrl(safePath)
  return NextResponse.json({ url: data.publicUrl })
}
