export interface VisitBooking {
  id: string
  created_at: string
  updated_at: string
  full_name: string
  email: string
  phone: string
  purpose: string
  budget_range: string | null
  experience_level: string | null
  visit_goal: string | null
  visitor_count: number
  notes: string | null
  selected_tree_ids: string[] | null
  appointment_start: string
  appointment_end: string
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  source: string
  internal_notes: string | null
}

export interface TimeSlot {
  start: string // ISO UTC
  end: string   // ISO UTC
}

export const PURPOSE_DURATION: Record<string, number> = {
  'Buy a Bonsai': 30,
  'Just Browsing': 20,
  'Need Care Help': 20,
  'Looking for a Gift': 30,
  'Looking for a Specific Tree': 15,
  'Pickup / Delivery Question': 15,
  'Help Me Choose': 30,
}

// Business hours: Monday-Sunday, 10am-5pm ET
export const OPEN_DAYS = new Set([0, 1, 2, 3, 4, 5, 6]) // JS day-of-week
export const OPEN_HOUR_ET = 10
export const CLOSE_HOUR_ET = 17
export const OPEN_DAYS_LABEL = 'Monday - Sunday'
export const OPEN_HOURS_LABEL = '10 AM - 5 PM'

// Florida is UTC-4 in summer (EDT). Hardcoded for MVP.
export const ET_UTC_OFFSET = -4

export function toUtcFromEtDate(dateStr: string, hourET: number, minET: number): Date {
  const d = new Date(`${dateStr}T00:00:00.000Z`)
  d.setUTCHours(hourET - ET_UTC_OFFSET, minET, 0, 0)
  return d
}

function toEtWallClock(date: Date): Date {
  return new Date(date.getTime() + ET_UTC_OFFSET * 60 * 60 * 1000)
}

function etDateKey(date: Date): string {
  const et = toEtWallClock(date)
  const y = et.getUTCFullYear()
  const m = String(et.getUTCMonth() + 1).padStart(2, '0')
  const d = String(et.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getVisitDuration(purpose: string): number {
  return PURPOSE_DURATION[purpose] ?? 30
}

export function buildRegularVisitSlots(dateStr: string, purpose: string, now = new Date()): TimeSlot[] {
  const dayOfWeek = new Date(`${dateStr}T12:00:00Z`).getUTCDay()
  if (!OPEN_DAYS.has(dayOfWeek)) return []

  const duration = getVisitDuration(purpose)
  const slots: TimeSlot[] = []

  for (let minOffset = 0; minOffset < (CLOSE_HOUR_ET - OPEN_HOUR_ET) * 60; minOffset += 30) {
    const totalMinET = OPEN_HOUR_ET * 60 + minOffset
    const hourET = Math.floor(totalMinET / 60)
    const minET = totalMinET % 60
    const slotStart = toUtcFromEtDate(dateStr, hourET, minET)
    const slotEnd = new Date(slotStart.getTime() + duration * 60_000)
    const closeUtc = toUtcFromEtDate(dateStr, CLOSE_HOUR_ET, 0)

    if (slotEnd > closeUtc) break
    if (slotStart <= now) continue

    slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() })
  }

  return slots
}

export function isValidAppointmentWindow(startDate: Date, durationMinutes: number): boolean {
  if (isNaN(startDate.getTime())) return false

  const endDate = new Date(startDate.getTime() + durationMinutes * 60_000)
  const startEt = toEtWallClock(startDate)
  const endEt = toEtWallClock(endDate)
  const startMinutes = startEt.getUTCHours() * 60 + startEt.getUTCMinutes()
  const endMinutes = endEt.getUTCHours() * 60 + endEt.getUTCMinutes()
  const openMinutes = OPEN_HOUR_ET * 60
  const closeMinutes = CLOSE_HOUR_ET * 60

  return (
    OPEN_DAYS.has(startEt.getUTCDay()) &&
    etDateKey(startDate) === etDateKey(endDate) &&
    startMinutes >= openMinutes &&
    startMinutes < closeMinutes &&
    startMinutes % 30 === 0 &&
    endMinutes <= closeMinutes
  )
}
