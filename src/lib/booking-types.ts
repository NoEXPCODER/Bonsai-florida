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

// Business hours: Wed(3)–Sun(0), 10am–5pm ET
export const OPEN_DAYS = new Set([0, 3, 4, 5, 6]) // JS day-of-week
export const OPEN_HOUR_ET = 10
export const CLOSE_HOUR_ET = 17

// Florida is UTC-4 in summer (EDT). Hardcoded for MVP.
export const ET_UTC_OFFSET = -4
