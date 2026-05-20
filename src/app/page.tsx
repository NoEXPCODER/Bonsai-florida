import { supabase } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturedTrees from '@/components/FeaturedTrees'
import HowItWorks from '@/components/HowItWorks'
import WhyBonsaiFlorida from '@/components/WhyBonsaiFlorida'
import CareGuidePreview from '@/components/CareGuidePreview'
import AppointmentSection from '@/components/AppointmentSection'
import FinalCTA from '@/components/FinalCTA'
import ConnectSimple from '@/components/ConnectSimple'
import Footer from '@/components/Footer'
import StickyMobileCTA from '@/components/StickyMobileCTA'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [treesResult, speciesResult] = await Promise.all([
    supabase
      .from('bonsai_trees')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('tree_species')
      .select('*')
      .order('name_en', { ascending: true })
      .limit(4),
  ])

  const trees = treesResult.data ?? []
  const featuredSpecies = speciesResult.data ?? []

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
      <main>
        <Hero trees={trees} logoUrl={logoUrl} />
        <FeaturedTrees trees={trees} />
        <HowItWorks />
        <WhyBonsaiFlorida />
        <CareGuidePreview species={featuredSpecies} />
        <AppointmentSection />
        <FinalCTA />
        <ConnectSimple />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  )
}
