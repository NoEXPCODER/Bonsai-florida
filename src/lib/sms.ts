/**
 * Twilio SMS helper — server only.
 * Silently skips if env vars are not configured.
 *
 * Required Vercel env vars (server-only, no NEXT_PUBLIC_ prefix):
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_FROM_NUMBER   e.g. +15551234567  (your Twilio number)
 *   OWNER_PHONE          e.g. +15613129576  (dad's cell)
 */

const SID   = process.env.TWILIO_ACCOUNT_SID
const TOKEN = process.env.TWILIO_AUTH_TOKEN
const FROM  = process.env.TWILIO_FROM_NUMBER
const OWNER = process.env.OWNER_PHONE

function configured() {
  return SID && TOKEN && FROM && OWNER
}

export async function sendSms(to: string, body: string): Promise<void> {
  if (!configured()) return
  const url = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`
  const auth = Buffer.from(`${SID}:${TOKEN}`).toString('base64')
  const params = new URLSearchParams({ From: FROM!, To: to, Body: body })
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

export async function notifyOwnerNewBooking(opts: {
  customerName: string
  customerPhone: string
  reason: string
  savedTrees: Array<{ name: string; price: number }> | null
  notes: string | null
  treeName: string | null
}): Promise<void> {
  if (!configured()) return
  const lines: string[] = [
    'New booking — Bonsai Florida',
    `Name: ${opts.customerName}`,
    `Phone: ${opts.customerPhone}`,
    `Reason: ${opts.reason}`,
  ]
  if (opts.savedTrees && opts.savedTrees.length > 0) {
    lines.push(`Trees: ${opts.savedTrees.map(t => `${t.name} ($${t.price})`).join(', ')}`)
  }
  if (opts.treeName) lines.push(`Looking for: ${opts.treeName}`)
  if (opts.notes)    lines.push(`Notes: ${opts.notes}`)
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
  // Ensure phone is E.164 — prepend +1 if it looks like a 10-digit US number
  const to = opts.customerPhone.replace(/\D/g, '')
  const e164 = to.startsWith('1') ? `+${to}` : `+1${to}`
  await sendSms(e164, body)
}
