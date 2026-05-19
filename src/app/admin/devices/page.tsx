import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateSession } from '@/lib/session'
import { createServerClient } from '@/lib/supabase-server'
import DevicesClient from './DevicesClient'

export const dynamic = 'force-dynamic'

export interface DeviceRow {
  id: string
  device_name: string
  created_at: string
  last_used_at: string
  expires_at: string
  revoked_at: string | null
}

export default async function DevicesPage() {
  const store = await cookies()
  const rawToken = store.get('bf_staff')?.value
  const session = await validateSession(rawToken)
  if (!session) redirect('/admin')

  const db = createServerClient()
  const { data } = await db
    .from('staff_sessions')
    .select('id, device_name, created_at, last_used_at, expires_at, revoked_at')
    .order('created_at', { ascending: false })

  return (
    <DevicesClient
      devices={(data as DeviceRow[]) ?? []}
      currentSessionId={session.id}
    />
  )
}
