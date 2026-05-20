import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/session'
import { createServerClient } from '@/lib/supabase-server'
import BookingsClient from './BookingsClient'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const jar = await cookies()
  const rawToken = jar.get('bf_staff')?.value
  const session = await validateSession(rawToken)
  if (!session) redirect('/admin')

  const db = createServerClient()
  const { data: bookings } = await db
    .from('visit_bookings')
    .select('*')
    .order('appointment_start', { ascending: true })

  let logoUrl: string | null = null
  try {
    const { data } = await db
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_url')
      .maybeSingle()
    logoUrl = data?.value ?? null
  } catch {
    logoUrl = null
  }

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <main className="min-h-screen bg-cream">
        <BookingsClient initialBookings={bookings ?? []} />
      </main>
    </>
  )
}
