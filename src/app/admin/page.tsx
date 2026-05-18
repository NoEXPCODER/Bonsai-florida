import { cookies } from 'next/headers'
import { validateSession } from '@/lib/session'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const store = await cookies()
  const rawToken = store.get('bf_staff')?.value
  const session = await validateSession(rawToken)

  return <AdminClient initialAuth={session !== null} />
}
