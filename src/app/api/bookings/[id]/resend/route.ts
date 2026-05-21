import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { sendCustomerConfirmation, sendAdminNotification } from '@/lib/email'
import { validateSession } from '@/lib/session'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rawToken = req.cookies.get('bf_staff')?.value
  if (!rawToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServerClient()
  const { data: b, error } = await db
    .from('visit_bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !b) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })

  await Promise.all([
    sendCustomerConfirmation(b),
    sendAdminNotification(b),
  ])

  return NextResponse.json({ ok: true })
}
