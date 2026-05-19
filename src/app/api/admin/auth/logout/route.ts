import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { hashToken, validateSession, COOKIE_NAME } from '@/lib/session'

/** POST /api/admin/auth/logout — revoke session in DB and clear cookie */
export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value

  if (rawToken) {
    const session = await validateSession(rawToken)
    if (session) {
      const db = createServerClient()
      await db
        .from('staff_sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('token_hash', hashToken(rawToken))
    }
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
