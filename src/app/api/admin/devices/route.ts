import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

/** GET /api/admin/devices — list all staff sessions (active + revoked) */
export async function GET(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServerClient()
  const { data, error } = await db
    .from('staff_sessions')
    .select('id, device_name, created_at, last_used_at, expires_at, revoked_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json({ devices: data })
}
