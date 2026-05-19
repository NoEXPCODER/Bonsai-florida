import { supabase } from '@/lib/supabase'
import type { SpeciesWithSlug } from '@/lib/species'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CareGuidesClient from './CareGuidesClient'

export const dynamic = 'force-dynamic'

export default async function CareGuidesPage() {
  const { data } = await supabase
    .from('tree_species')
    .select('*')
    .order('name_en', { ascending: true })

  return (
    <>
      <Navbar />
      <main>
        <CareGuidesClient species={(data ?? []) as SpeciesWithSlug[]} />
      </main>
      <Footer />
    </>
  )
}
