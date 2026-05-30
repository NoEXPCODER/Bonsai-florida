import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import {
  buildRegularVisitSlots,
  toUtcFromEtDate,
  MAX_CONCURRENT_BOOKINGS,
} from '@/lib/booking-types'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const dateStr = searchParams.get('date') // YYYY-MM-DD
  const purpose = searchParams.get('purpose') ?? ''

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: 'date required (YYYY-MM-DD)' }, { status: 400 })
  }

  const slots = buildRegularVisitSlots(dateStr, purpose)
  if (slots.length === 0) {
    return NextResponse.json({ slots: [] })
  }

  let db: ReturnType<typeof createServerClient>
  try {
    db = createServerClient()
  } catch (error) {
    console.warn('Booking slot availability check skipped:', error)
    return NextResponse.json({ slots, availabilityLimited: true })
  }

  // Fetch existing confirmed bookings for this date (ET day = UTC day + offset)
  const dayStartUtc = toUtcFromEtDate(dateStr, 0, 0)
  const dayEndUtc = toUtcFromEtDate(dateStr, 24, 0)

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

  const availableSlots = slots.filter(slot => {
    const slotStart = new Date(slot.start)
    const slotEnd = new Date(slot.end)
    const overlappingBookings = booked.filter(
      b =>
        slotStart < new Date(b.appointment_end) &&
        slotEnd > new Date(b.appointment_start),
    ).length
    const overlapsBlocked = blocked.some(
      u =>
        slotStart < new Date(u.end_time) &&
        slotEnd > new Date(u.start_time),
    )

    return overlappingBookings < MAX_CONCURRENT_BOOKINGS && !overlapsBlocked
  })

  return NextResponse.json({ slots: availableSlots })
}
