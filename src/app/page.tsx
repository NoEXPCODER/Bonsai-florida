import { supabase } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturedTrees from '@/components/FeaturedTrees'
import HowItWorks from '@/components/HowItWorks'
import CareGuidePreview from '@/components/CareGuidePreview'
import VisitSection from '@/components/VisitSection'
import ConnectSimple from '@/components/ConnectSimple'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let logoUrl: string | null = null

  const { data: trees } = await supabase
    .from('bonsai_trees')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const { data: featuredSpecies } = await supabase
    .from('tree_species')
    .select('*')
    .order('name_en', { ascending: true })
    .limit(4)

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
        <Hero trees={trees ?? []} logoUrl={logoUrl} />
        <FeaturedTrees trees={trees ?? []} />
        <HowItWorks />
        <CareGuidePreview species={featuredSpecies ?? []} />
        <VisitSection />
        <ConnectSimple />
      </main>
      <Footer />
    </>
  )
}
