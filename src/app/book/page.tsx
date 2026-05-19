import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingFlow from './BookingFlow'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function BookPage() {
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
        <BookingFlow />
      </main>
      <Footer />
    </>
  )
}
