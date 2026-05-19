import { supabase } from '@/lib/supabase'
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
  const { data: trees } = await supabase
    .from('bonsai_trees')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedTrees trees={trees ?? []} />
        <HowItWorks />
        <CareGuidePreview />
        <VisitSection />
        <ConnectSimple />
      </main>
      <Footer />
    </>
  )
}
