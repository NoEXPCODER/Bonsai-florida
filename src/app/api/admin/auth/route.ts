import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { getAdminCredentials } from '@/config/auth'
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

/** POST /api/admin/auth — validate username + password, create session, set httpOnly cookie */
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

  let body: { username?: unknown; password?: unknown; remember?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  let credentials
  try {
    credentials = getAdminCredentials()
  } catch {
    return NextResponse.json({ error: 'Server auth is not configured' }, { status: 500 })
  }

  const { username, password, remember = true } = body

  // Timing-safe comparison for both fields
  const usernameMatch = timingSafeEqual(
    createHash('sha256').update(String(username ?? '')).digest(),
    createHash('sha256').update(credentials.username).digest(),
  )
  const passwordMatch = timingSafeEqual(
    createHash('sha256').update(String(password ?? '')).digest(),
    createHash('sha256').update(credentials.password).digest(),
  )

  if (!usernameMatch || !passwordMatch) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  // Clear rate limit on success
  attempts.delete(ip)

  let db
  try {
    db = createServerClient()
  } catch {
    return NextResponse.json({ error: 'Server error — check Vercel env vars (SUPABASE_SERVICE_ROLE_KEY).' }, { status: 500 })
  }

  const rawToken = generateToken()
  const tokenHash = hashToken(rawToken)
  const ua = req.headers.get('user-agent') ?? ''
  const deviceName = getDeviceName(ua)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (remember === true ? REMEMBER_DAYS : 1))

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
    ...(remember === true ? { maxAge: REMEMBER_DAYS * 24 * 60 * 60 } : {}),
  })
  return res
}

/** GET /api/admin/auth — check if current cookie is a valid session */
export async function GET(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  return NextResponse.json({ authenticated: session !== null, session })
}
