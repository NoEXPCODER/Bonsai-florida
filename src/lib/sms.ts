/**
 * Twilio SMS helper — server only.
 * Silently skips if env vars are not configured.
 *
 * Required Vercel env vars (server-only, no NEXT_PUBLIC_ prefix):
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_FROM_NUMBER   e.g. +15551234567  (your Twilio number)
 *   OWNER_PHONE          e.g. +15613011586  (dad's cell)
 */

import 'server-only'
import type { BookingEmailData } from '@/lib/email'

const SID = process.env.TWILIO_ACCOUNT_SID
const TOKEN = process.env.TWILIO_AUTH_TOKEN
const FROM = process.env.TWILIO_FROM_NUMBER
const OWNER = process.env.OWNER_PHONE

function configured() {
  return SID && TOKEN && FROM && OWNER
}

function formatDateET(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return phone
  if (digits.length === 10) return `+1${digits}`
  if (digits.startsWith('1')) return `+${digits}`
  return `+${digits}`
}

export async function sendSms(to: string, body: string): Promise<void> {
  if (!configured()) return
  const url = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`
  const auth = Buffer.from(`${SID}:${TOKEN}`).toString('base64')
  const params = new URLSearchParams({ From: FROM!, To: toE164(to), Body: body })
  try {
    await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
  } catch (err) {
    console.error('SMS send failed:', err)
  }
}

export async function notifyOwnerNewBooking(b: BookingEmailData): Promise<void> {
  if (!configured()) return

  const lines: string[] = [
    'New Bonsai Florida visit',
    `${formatDateET(b.appointment_start)} ${formatTimeET(b.appointment_start)}-${formatTimeET(b.appointment_end)} ET`,
    `${b.full_name} • ${b.phone}`,
    `Email: ${b.email}`,
    `Purpose: ${b.purpose}`,
  ]

  if (b.budget_range) lines.push(`Budget: ${b.budget_range}`)
  if (b.experience_level) lines.push(`Experience: ${b.experience_level}`)
  if (b.visit_goal) lines.push(`Goal: ${b.visit_goal}`)
  if (b.visitor_count > 1) lines.push(`Visitors: ${b.visitor_count}`)
  if (b.selected_tree_ids?.length) lines.push(`Trees: ${b.selected_tree_ids.join(', ')}`)
  if (b.notes) lines.push(`Notes: ${b.notes}`)
  lines.push(`Ref: ${b.id.slice(0, 8).toUpperCase()}`)

  await sendSms(OWNER!, lines.join('\n'))
}

export async function confirmCustomer(opts: {
  customerPhone: string
  customerName: string
}): Promise<void> {
  if (!configured()) return
  const firstName = opts.customerName.split(' ')[0]
  const body =
    `Hi ${firstName}! Your visit request to Bonsai Florida is confirmed.\n` +
    `We'll prepare your trees before you arrive.\n` +
    `Text 561-312-9576 any time with questions!`
  await sendSms(opts.customerPhone, body)
}
