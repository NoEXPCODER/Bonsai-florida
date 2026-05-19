import { supabase } from '@/lib/supabase'
import type { DbSpecies } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CarePageClient from './CarePageClient'

export const dynamic = 'force-dynamic'

export default async function CarePage() {
  const { data } = await supabase
    .from('tree_species')
    .select('*')
    .order('name_en', { ascending: true })

  return (
    <>
      <Navbar />
      <main>
        <CarePageClient species={(data ?? []) as DbSpecies[]} />
      </main>
      <Footer />
    </>
  )
}
