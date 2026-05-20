import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import {
  PURPOSE_DURATION,
  OPEN_DAYS,
  OPEN_HOUR_ET,
  CLOSE_HOUR_ET,
  ET_UTC_OFFSET,
  type TimeSlot,
} from '@/lib/booking-types'

// Convert a local ET hour+min on a given YYYY-MM-DD to UTC ISO string
function toUtc(dateStr: string, hourET: number, minET: number): Date {
  const d = new Date(`${dateStr}T00:00:00.000Z`)
  d.setUTCHours(hourET - ET_UTC_OFFSET, minET, 0, 0)
  return d
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const dateStr = searchParams.get('date') // YYYY-MM-DD
  const purpose = searchParams.get('purpose') ?? ''

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: 'date required (YYYY-MM-DD)' }, { status: 400 })
  }

  // Check business day
  const dayOfWeek = new Date(`${dateStr}T12:00:00Z`).getUTCDay()
  if (!OPEN_DAYS.has(dayOfWeek)) {
    return NextResponse.json({ slots: [] })
  }

  const duration = PURPOSE_DURATION[purpose] ?? 30
  const db = createServerClient()

  // Fetch existing confirmed bookings for this date (ET day = UTC day + offset)
  const dayStartUtc = toUtc(dateStr, 0, 0)
  const dayEndUtc = toUtc(dateStr, 24, 0)

  const [bookingsRes, unavailableRes] = await Promise.all([
    db
      .from('visit_bookings')
      .select('appointment_start, appointment_end')
      .eq('status', 'confirmed')
      .gte('appointment_start', dayStartUtc.toISOString())
      .lt('appointment_start', dayEndUtc.toISOString()),
    db
      .from('unavailable_slots')
      .select('start_time, end_time')
      .gte('start_time', dayStartUtc.toISOString())
      .lt('start_time', dayEndUtc.toISOString()),
  ])

  const booked = bookingsRes.data ?? []
  const blocked = unavailableRes.data ?? []
  const now = new Date()

  const slots: TimeSlot[] = []

  // 30-minute increments from open to last possible start
  for (let minOffset = 0; minOffset < (CLOSE_HOUR_ET - OPEN_HOUR_ET) * 60; minOffset += 30) {
    const totalMinET = OPEN_HOUR_ET * 60 + minOffset
    const hourET = Math.floor(totalMinET / 60)
    const minET = totalMinET % 60

    const slotStart = toUtc(dateStr, hourET, minET)
    const slotEnd = new Date(slotStart.getTime() + duration * 60_000)

    // Slot must end by close time
    const closeUtc = toUtc(dateStr, CLOSE_HOUR_ET, 0)
    if (slotEnd > closeUtc) break

    // Must be in the future
    if (slotStart <= now) continue

    // Check overlap with existing bookings
    const overlapsBooked = booked.some(
      b =>
        slotStart < new Date(b.appointment_end) &&
        slotEnd > new Date(b.appointment_start),
    )
    const overlapsBlocked = blocked.some(
      u =>
        slotStart < new Date(u.end_time) &&
        slotEnd > new Date(u.start_time),
    )

    if (!overlapsBooked && !overlapsBlocked) {
      slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() })
    }
  }

  return NextResponse.json({ slots })
}
