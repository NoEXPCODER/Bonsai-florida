import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession } from '@/lib/session'

type Params = Promise<{ id: string }>

const VALID_STATUSES = ['confirmed', 'cancelled', 'completed', 'no_show']

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const rawToken = req.cookies.get('bf_staff')?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const status = typeof body.status === 'string' ? body.status : null
  const internal_notes = typeof body.internal_notes === 'string' ? body.internal_notes : undefined

  if (status && !VALID_STATUSES.includes(status))
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status
  if (internal_notes !== undefined) updates.internal_notes = internal_notes || null

  const db = createServerClient()
  const { error } = await db.from('visit_bookings').update(updates).eq('id', id)

  if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
