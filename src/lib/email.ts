/**
 * Resend email helper — server only.
 * Silently skips if RESEND_API_KEY is not set.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.BOOKING_ADMIN_EMAIL
const FROM = 'Bonsai Florida <bookings@bonsaiflorida.com>'

function configured(): boolean {
  return !!(RESEND_API_KEY && ADMIN_EMAIL)
}

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!configured()) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
  } catch (err) {
    console.error('Email send failed:', err)
  }
}

function formatDateET(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTimeET(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export interface BookingEmailData {
  id: string
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
}

export async function sendCustomerConfirmation(b: BookingEmailData): Promise<void> {
  const firstName = b.full_name.split(' ')[0]
  const dateStr = formatDateET(b.appointment_start)
  const timeStr = `${formatTimeET(b.appointment_start)} – ${formatTimeET(b.appointment_end)}`

  const treesLine = b.selected_tree_ids?.length
    ? `<p><strong>Selected trees:</strong> ${b.selected_tree_ids.join(', ')}</p>`
    : ''

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a2e1a">
      <h2 style="color:#2d5a27">Bonsai Florida — Your visit is confirmed 🌿</h2>
      <p>Hi ${firstName},</p>
      <p>Your Bonsai Florida garden visit is confirmed.</p>
      <hr style="border:none;border-top:1px solid #e8e4d9;margin:20px 0">
      <p><strong>Date:</strong> ${dateStr}</p>
      <p><strong>Time:</strong> ${timeStr} Eastern</p>
      <p><strong>Purpose:</strong> ${b.purpose}</p>
      ${b.visitor_count > 1 ? `<p><strong>Visitors:</strong> ${b.visitor_count}</p>` : ''}
      ${treesLine}
      ${b.notes ? `<p><strong>Your notes:</strong> ${b.notes}</p>` : ''}
      <hr style="border:none;border-top:1px solid #e8e4d9;margin:20px 0">
      <p>Before you arrive, please text us with:</p>
      <ol>
        <li>Any tree codes/photos you like</li>
        <li>Your budget range</li>
        <li>Beginner or experienced?</li>
        <li>Whether this is for yourself or a gift</li>
      </ol>
      <p style="background:#f5f0e8;padding:16px;border-radius:8px;font-size:14px;color:#5a6b5a">
        Saved trees are prepared for your visit but are not fully reserved until confirmed.
        A specific tree can be held until your appointment time.
        Premium or high-demand trees may require a small deposit.
      </p>
      <p>Text is preferred so we can send photos, care info, pricing, and visit details clearly.</p>
      <p>— Bonsai Florida, Palm Beach, Florida</p>
    </div>
  `

  await send(b.email, 'Your Bonsai Florida garden visit is confirmed 🌿', html)
}

export async function sendAdminNotification(b: BookingEmailData): Promise<void> {
  if (!ADMIN_EMAIL) return
  const dateStr = formatDateET(b.appointment_start)
  const timeStr = `${formatTimeET(b.appointment_start)} – ${formatTimeET(b.appointment_end)}`

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2>New Booking — ${b.full_name}</h2>
      <p><strong>Date/Time:</strong> ${dateStr} · ${timeStr} ET</p>
      <p><strong>Purpose:</strong> ${b.purpose}</p>
      <hr>
      <p><strong>Name:</strong> ${b.full_name}</p>
      <p><strong>Email:</strong> ${b.email}</p>
      <p><strong>Phone:</strong> ${b.phone}</p>
      <p><strong>Budget:</strong> ${b.budget_range ?? 'Not provided'}</p>
      <p><strong>Experience:</strong> ${b.experience_level ?? 'Not provided'}</p>
      <p><strong>Visit goal:</strong> ${b.visit_goal ?? 'Not provided'}</p>
      <p><strong>Visitors:</strong> ${b.visitor_count}</p>
      <p><strong>Selected trees:</strong> ${b.selected_tree_ids?.join(', ') || 'None'}</p>
      <p><strong>Notes:</strong> ${b.notes || 'None'}</p>
      <p><strong>Source:</strong> website</p>
      <p><strong>Booking ID:</strong> ${b.id}</p>
    </div>
  `

  await send(
    ADMIN_EMAIL,
    `New Bonsai Florida booking — ${b.full_name} — ${dateStr}`,
    html,
  )
}
