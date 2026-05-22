import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

type Params = Promise<{ id: string }>

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (!n8nUrl) return NextResponse.json({ error: 'N8N_WEBHOOK_URL not configured' }, { status: 503 })

  const { id } = await params
  const db = createServerClient()
  const { data: tree, error } = await db
    .from('bonsai_trees')
    .select('tree_code')
    .eq('id', id)
    .single()

  if (error || !tree?.tree_code) return NextResponse.json({ error: 'Tree not found' }, { status: 404 })

  const n8nRes = await fetch(n8nUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tree_code: tree.tree_code }),
  })

  if (!n8nRes.ok) {
    return NextResponse.json({ error: `n8n returned ${n8nRes.status}` }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
