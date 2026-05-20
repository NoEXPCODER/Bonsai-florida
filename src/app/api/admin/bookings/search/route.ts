import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

export async function GET(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const db = createServerClient()
  const { data } = await db
    .from('bookings')
    .select('id, name, phone, email, reason, created_at')
    .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
    .order('created_at', { ascending: false })
    .limit(10)

  return NextResponse.json(data ?? [])
}
