import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(req: NextRequest) {
  // Basic size guard — reject oversized payloads
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10_000) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot — bots fill hidden fields, humans don't
  if (body._hp) {
    return NextResponse.json({ ok: true }) // silent accept to fool bots
  }

  const { reason, name, email, phone, notes, tree_name, saved_trees } = body as Record<string, unknown>

  if (!reason || !name || !email || !phone || typeof reason !== 'string' || typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // Basic field length guards
  if (
    (reason as string).length > 120 ||
    (name as string).length > 120 ||
    (email as string).length > 200 ||
    (phone as string).length > 30 ||
    (notes && typeof notes === 'string' && notes.length > 1000)
  ) {
    return NextResponse.json({ error: 'Field too long.' }, { status: 400 })
  }

  const db = createServerClient()

  // Rate limit: same email can't submit more than 3 times per hour
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString()
  const { count } = await db
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('email', email.trim().toLowerCase())
    .gte('created_at', since)

  if ((count ?? 0) >= 3) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later or text us directly.' },
      { status: 429 },
    )
  }

  const { error } = await db.from('bookings').insert({
    reason: (reason as string).trim(),
    name: (name as string).trim(),
    email: (email as string).trim().toLowerCase(),
    phone: (phone as string).trim(),
    notes: typeof notes === 'string' ? notes.trim() || null : null,
    tree_name: typeof tree_name === 'string' ? tree_name.trim() || null : null,
    saved_trees: Array.isArray(saved_trees) && saved_trees.length > 0 ? saved_trees : null,
    status: 'pending',
  })

  if (error) {
    console.error('Booking insert error:', error)
    return NextResponse.json({ error: 'Could not save booking.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
