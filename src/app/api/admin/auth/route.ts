import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { getAdminPin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase-server'
import {
  generateToken,
  hashToken,
  getDeviceName,
  validateSession,
  COOKIE_NAME,
  REMEMBER_DAYS,
} from '@/lib/session'

// In-memory brute-force guard — 5 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || rec.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (rec.count >= MAX_ATTEMPTS) return true
  rec.count++
  return false
}

/** POST /api/admin/auth — validate PIN, create session, set httpOnly cookie */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 },
    )
  }

  const { pin, remember = true } = await req.json()

  let adminPin: string
  try {
    adminPin = getAdminPin()
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Admin PIN is not configured.')
    return NextResponse.json({ error: 'Admin PIN is not configured' }, { status: 500 })
  }

  // Hash both sides and use constant-time comparison to prevent timing attacks
  const incoming = createHash('sha256').update(String(pin ?? '')).digest()
  const expected = createHash('sha256').update(adminPin).digest()
  const pinValid = timingSafeEqual(incoming, expected)

  if (!pinValid) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  // Clear rate limit on success
  attempts.delete(ip)

  const db = createServerClient()
  const rawToken = generateToken()
  const tokenHash = hashToken(rawToken)
  const ua = req.headers.get('user-agent') ?? ''
  const deviceName = getDeviceName(ua)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (remember ? REMEMBER_DAYS : 1))

  const { error } = await db.from('staff_sessions').insert({
    device_name: deviceName,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  })

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: COOKIE_NAME,
    value: rawToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(remember ? { maxAge: REMEMBER_DAYS * 24 * 60 * 60 } : {}),
  })
  return res
}

/** GET /api/admin/auth — check if current cookie is a valid session */
export async function GET(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  return NextResponse.json({ authenticated: session !== null, session })
}
