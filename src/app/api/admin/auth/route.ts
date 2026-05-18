import { NextRequest, NextResponse } from 'next/server'
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

/** POST /api/admin/auth — validate PIN, create session, set httpOnly cookie */
export async function POST(req: NextRequest) {
  const { pin, remember = true } = await req.json()

  let adminPin: string
  try {
    adminPin = getAdminPin()
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Admin PIN is not configured.')
    return NextResponse.json({ error: 'Admin PIN is not configured' }, { status: 500 })
  }

  if (pin !== adminPin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

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

  if (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

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
