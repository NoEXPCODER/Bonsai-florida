import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { sendCustomerConfirmation, sendAdminNotification } from '@/lib/email'
import { notifyOwnerNewBooking, confirmCustomer } from '@/lib/sms'
import { getVisitDuration, isValidAppointmentWindow, OPEN_DAYS_LABEL, OPEN_HOURS_LABEL } from '@/lib/booking-types'

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

export async function GET(req: NextRequest) {
  // Used by admin page to list bookings
  const rawToken = req.cookies.get('bf_staff')?.value
  if (!rawToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { validateSession } = await import('@/lib/session')
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServerClient()
  const { data } = await db
    .from('visit_bookings')
    .select('*')
    .order('appointment_start', { ascending: true })

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  // Size guard
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 20_000) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot
  if (body._hp) return NextResponse.json({ ok: true })

  const {
    full_name, email, phone, purpose,
    budget_range, experience_level, visit_goal,
    visitor_count, notes, selected_tree_ids,
    appointment_start,
  } = body as Record<string, unknown>

  // Required field validation
  if (!full_name || typeof full_name !== 'string' || !full_name.trim())
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  if (!email || typeof email !== 'string' || !isValidEmail(email.trim()))
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
  if (!phone || typeof phone !== 'string' || !phone.trim())
    return NextResponse.json({ error: 'Phone is required.' }, { status: 400 })
  if (!purpose || typeof purpose !== 'string' || !purpose.trim())
    return NextResponse.json({ error: 'Purpose is required.' }, { status: 400 })
  if (!appointment_start || typeof appointment_start !== 'string')
    return NextResponse.json({ error: 'Appointment time is required.' }, { status: 400 })

  // Must be in the future
  const startDate = new Date(appointment_start)
  if (isNaN(startDate.getTime()) || startDate <= new Date())
    return NextResponse.json({ error: 'Appointment must be in the future.' }, { status: 400 })

  const duration = getVisitDuration(purpose as string)
  if (!isValidAppointmentWindow(startDate, duration))
    return NextResponse.json({ error: `Please choose a visit time during ${OPEN_DAYS_LABEL}, ${OPEN_HOURS_LABEL}.` }, { status: 400 })

  const endDate = new Date(startDate.getTime() + duration * 60_000)

  const db = createServerClient()

  // Double-booking check
  const { data: conflicts } = await db
    .from('visit_bookings')
    .select('id')
    .eq('status', 'confirmed')
    .lt('appointment_start', endDate.toISOString())
    .gt('appointment_end', startDate.toISOString())
    .limit(1)

  if (conflicts && conflicts.length > 0)
    return NextResponse.json({ error: 'That time slot is no longer available.' }, { status: 409 })

  // Unavailable slot check
  const { data: blocked } = await db
    .from('unavailable_slots')
    .select('id')
    .lt('start_time', endDate.toISOString())
    .gt('end_time', startDate.toISOString())
    .limit(1)

  if (blocked && blocked.length > 0)
    return NextResponse.json({ error: 'That time slot is not available.' }, { status: 409 })

  // Rate limit: 3 bookings per email per day
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString()
  const { count } = await db
    .from('visit_bookings')
    .select('id', { count: 'exact', head: true })
    .eq('email', email.trim().toLowerCase())
    .gte('created_at', dayAgo)

  if ((count ?? 0) >= 10)
    return NextResponse.json({ error: 'Too many bookings from this email.' }, { status: 429 })

  // Insert
  const { data: inserted, error } = await db
    .from('visit_bookings')
    .insert({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      purpose: purpose.trim(),
      budget_range: typeof budget_range === 'string' && budget_range ? budget_range : null,
      experience_level: typeof experience_level === 'string' && experience_level ? experience_level : null,
      visit_goal: typeof visit_goal === 'string' && visit_goal ? visit_goal : null,
      visitor_count: typeof visitor_count === 'number' ? visitor_count : 1,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
      selected_tree_ids: Array.isArray(selected_tree_ids) && selected_tree_ids.length ? selected_tree_ids : null,
      appointment_start: startDate.toISOString(),
      appointment_end: endDate.toISOString(),
    })
    .select('id')
    .single()

  if (error || !inserted) {
    console.error('Booking insert error:', error)
    return NextResponse.json({ error: 'Could not save booking.' }, { status: 500 })
  }

  const emailData = {
    id: inserted.id,
    full_name: full_name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    purpose: purpose.trim(),
    budget_range: typeof budget_range === 'string' && budget_range ? budget_range : null,
    experience_level: typeof experience_level === 'string' && experience_level ? experience_level : null,
    visit_goal: typeof visit_goal === 'string' && visit_goal ? visit_goal : null,
    visitor_count: typeof visitor_count === 'number' ? visitor_count : 1,
    notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
    selected_tree_ids: Array.isArray(selected_tree_ids) && selected_tree_ids.length ? (selected_tree_ids as string[]) : null,
    appointment_start: startDate.toISOString(),
    appointment_end: endDate.toISOString(),
  }

  void Promise.all([
    sendCustomerConfirmation(emailData),
    sendAdminNotification(emailData),
    notifyOwnerNewBooking(emailData),
    confirmCustomer({ customerPhone: emailData.phone, customerName: emailData.full_name }),
  ])

  return NextResponse.json({ ok: true, id: inserted.id })
}
