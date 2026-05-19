import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateSession } from '@/lib/session'
import { createServerClient } from '@/lib/supabase-server'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const store = await cookies()
  const rawToken = store.get('bf_staff')?.value
  const session = await validateSession(rawToken)
  if (!session) redirect('/admin')

  const db = createServerClient()
  const { data } = await db.from('site_settings').select('key, value')
  const settings: Record<string, string | null> = {}
  for (const row of data ?? []) settings[row.key] = row.value

  return <SettingsClient initialSettings={settings} />
}
