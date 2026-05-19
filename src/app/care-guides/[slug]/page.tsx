import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { findSpeciesBySlug, type SpeciesWithSlug } from '@/lib/species'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SpeciesGuideArticle } from '../CareGuidesClient'

export const dynamic = 'force-dynamic'

export default async function SpeciesCareGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await supabase
    .from('tree_species')
    .select('*')
    .order('name_en', { ascending: true })

  const species = findSpeciesBySlug((data ?? []) as SpeciesWithSlug[], slug)
  if (!species) notFound()

  return (
    <>
      <Navbar />
      <main className="bg-cream">
        <section className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
          <Link href="/care-guides" className="mb-5 inline-flex font-sans text-sm font-semibold text-ink-light hover:text-forest">
            ← Care Guides
          </Link>
          <SpeciesGuideArticle species={species} />
        </section>
      </main>
      <Footer />
    </>
  )
}
