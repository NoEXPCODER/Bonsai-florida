'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth, useMessages } from '@/lib/i18n'
import { getSpeciesDifficulty, getSpeciesLatin, makeSpeciesSlug, type SpeciesWithSlug } from '@/lib/species'
import { LeafIcon, QuestionIcon, SunIcon, WaterIcon } from '@/components/Icons'

const sectionFields = [
  ['quickFacts', 'quick_facts_en', 'quick_facts_vi'],
  ['light', 'light_en', 'light_vi'],
  ['watering', 'watering_en', 'watering_vi'],
  ['fertilizer', 'fertilizer_en', 'fertilizer_vi'],
  ['pruning', 'pruning_en', 'pruning_vi'],
  ['repotting', 'repotting_en', 'repotting_vi'],
  ['watchFor', 'watch_for_en', 'watch_for_vi'],
  ['floridaTips', 'florida_tips_en', 'florida_tips_vi'],
  ['weeklyChecklist', 'weekly_checklist_en', 'weekly_checklist_vi'],
] as const

function text(value: string | null | undefined) {
  return value?.trim() || ''
}

export function SpeciesGuideArticle({ species, compact = false }: { species: SpeciesWithSlug; compact?: boolean }) {
  const { locale } = useAuth()
  const t = useMessages().carePage
  const name = locale === 'vi' ? text(species.name_vi) || species.name_en : species.name_en
  const sun = locale === 'vi' ? text(species.sun_vi) || species.sun_en : species.sun_en
  const water = locale === 'vi' ? text(species.water_vi) || species.water_en : species.water_en
  const care = locale === 'vi' ? text(species.care_vi) || species.care_en : species.care_en
  const slug = makeSpeciesSlug(species)
  const latin = getSpeciesLatin(species)
  const difficulty = getSpeciesDifficulty(species)

  const sections = sectionFields
    .map(([labelKey, enKey, viKey]) => {
      const value = locale === 'vi'
        ? text(species[viKey]) || text(species[enKey])
        : text(species[enKey])
      return { label: t.sections[labelKey], value }
    })
    .filter(section => section.value)

  return (
    <article id={slug} className="scroll-mt-28 rounded-[1.75rem] border border-forest/12 bg-cream-light p-5 shadow-soft sm:p-7">
      {species.care_image_url && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-sage-pale">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={species.care_image_url} alt={name} className="h-64 w-full object-cover" />
        </div>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sage-pale px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-forest">
              {difficulty}
            </span>
            {species.indoor_outdoor && (
              <span className="rounded-full bg-bonsai-pink-pale px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-bonsai-pink">
                {species.indoor_outdoor}
              </span>
            )}
            {latin && <span className="font-sans text-xs italic text-ink-light">{latin}</span>}
          </div>
          <h2 className="font-serif text-3xl leading-tight text-forest sm:text-4xl">{name}</h2>
          {care && (
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ink-light">
              {care}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-80 lg:grid-cols-1">
          <div className="rounded-2xl bg-sage-pale/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-forest">
              <SunIcon className="h-4 w-4" />
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em]">{t.lightLabel}</p>
            </div>
            <p className="font-sans text-sm leading-relaxed text-ink-light">{sun || t.comingSoon}</p>
          </div>
          <div className="rounded-2xl bg-bonsai-pink-pale/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-forest">
              <WaterIcon className="h-4 w-4" />
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em]">{t.waterLabel}</p>
            </div>
            <p className="font-sans text-sm leading-relaxed text-ink-light">{water || t.comingSoon}</p>
          </div>
        </div>
      </div>

      {sections.length > 0 ? (
        <div className={`mt-7 grid gap-4 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
          {sections.map(section => (
            <section key={section.label} className="rounded-2xl border border-forest/10 bg-white/70 p-4">
              <h3 className="mb-2 font-serif text-xl leading-tight text-forest">{section.label}</h3>
              <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-ink-light">{section.value}</p>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-forest/20 bg-white/60 p-5 text-center">
          <QuestionIcon className="mx-auto mb-2 h-6 w-6 text-sage" />
          <p className="font-sans text-sm text-ink-light">{t.comingSoon}</p>
        </div>
      )}

      {compact && (
        <Link href={`/care-guides/${slug}`} className="btn-secondary mt-6 w-full justify-center text-sm py-3 sm:w-auto">
          {t.openFullGuide}
        </Link>
      )}
    </article>
  )
}

export default function CareGuidesClient({ species }: { species: SpeciesWithSlug[] }) {
  const t = useMessages().carePage
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return species
    return species.filter(item =>
      item.name_en.toLowerCase().includes(q) ||
      item.name_vi.toLowerCase().includes(q) ||
      getSpeciesLatin(item).toLowerCase().includes(q) ||
      item.care_en.toLowerCase().includes(q) ||
      item.care_vi.toLowerCase().includes(q)
    )
  }, [search, species])

  return (
    <div className="bg-cream">
      <section className="border-b border-forest/10 bg-cream-light px-5 py-12 text-center sm:py-16">
        <p className="section-label mb-3">{t.label}</p>
        <h1 className="font-serif text-5xl leading-tight text-forest sm:text-6xl">{t.heading}</h1>
        <div className="pink-divider my-5" />
        <p className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-ink-light">
          {t.description}
        </p>
      </section>

      <section className="sticky top-16 z-20 border-b border-forest/10 bg-cream/95 px-4 py-4 backdrop-blur-md sm:top-[72px]">
        <div className="mx-auto max-w-6xl">
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-2xl border border-forest/20 bg-white px-5 py-3.5 font-sans text-base text-ink placeholder-ink-light/50 transition focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 lg:grid-cols-[260px_1fr] lg:gap-8 lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-40 rounded-[1.5rem] border border-forest/10 bg-cream-light p-4 shadow-soft">
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-bonsai-pink">
              {t.speciesList}
            </p>
            <div className="space-y-1">
              {filtered.map(item => (
                <a
                  key={item.id}
                  href={`#${makeSpeciesSlug(item)}`}
                  className="block rounded-xl px-3 py-2 font-sans text-sm text-ink-light transition-colors hover:bg-sage-pale hover:text-forest"
                >
                  {item.name_en}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="flex items-center gap-2 font-sans text-sm text-ink-light">
            <LeafIcon className="h-4 w-4 text-sage" />
            {filtered.length} {filtered.length === 1 ? t.speciesSingular : t.speciesPlural}
          </div>

          {filtered.map(item => (
            <SpeciesGuideArticle key={item.id} species={item} compact />
          ))}

          {filtered.length === 0 && (
            <div className="rounded-[1.75rem] border border-forest/10 bg-cream-light px-6 py-16 text-center shadow-soft">
              <p className="font-serif text-2xl text-forest">{t.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
