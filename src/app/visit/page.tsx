import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VisitBookingFlow from './VisitBookingFlow'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function VisitPage() {
  let logoUrl: string | null = null
  try {
    const db = createServerClient()
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
        <VisitBookingFlow />
      </main>
      <Footer />
    </>
  )
}
