'use client'

import Link from 'next/link'
import type { DbSpecies } from '@/lib/supabase'
import { useMessages } from '@/lib/i18n'
import { getSpeciesDifficulty, getSpeciesLatin, makeSpeciesSlug } from '@/lib/species'
import { SunIcon, WaterIcon } from '@/components/Icons'

const PREVIEW_COUNT = 3

export default function CareGuidePreview({ species }: { species: DbSpecies[] }) {
  const t = useMessages().carePreview
  const guides = species.slice(0, PREVIEW_COUNT)

  if (guides.length === 0) return null

  return (
    <section id="care" className="bg-cream py-16 sm:py-20" aria-labelledby="care-preview-heading">
      <div className="section-wrap">
        <div className="text-center mb-12">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="care-preview-heading" className="section-heading mb-4">{t.heading}</h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-lg text-ink-light max-w-md mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {guides.map((guide) => (
            <article key={guide.id} className="card p-5 flex flex-col hover:shadow-card-lg transition-shadow duration-200">
              <span className={`self-start font-sans text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 ${
                getSpeciesDifficulty(guide) === 'Beginner Friendly'
                  ? 'bg-bonsai-pink-pale text-bonsai-pink'
                  : 'bg-sage-pale text-forest'
              }`}>
                {getSpeciesDifficulty(guide) === 'Beginner Friendly' ? t.beginner : getSpeciesDifficulty(guide)}
              </span>

              <h3 className="font-serif text-xl text-forest leading-snug mb-0.5">{guide.name_en}</h3>
              <p className="font-sans text-xs italic text-ink-light mb-3">{getSpeciesLatin(guide)}</p>

              <div className="space-y-1.5 flex-1 mb-5">
                <div className="flex items-start gap-2">
                  <SunIcon className="w-3.5 h-3.5 text-sage flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-ink-light line-clamp-1">{guide.light_en || guide.sun_en}</p>
                </div>
                <div className="flex items-start gap-2">
                  <WaterIcon className="w-3.5 h-3.5 text-sage flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-ink-light line-clamp-1">{guide.watering_en || guide.water_en}</p>
                </div>
              </div>

              <a
                href={`/care-guides/${makeSpeciesSlug(guide)}`}
                className="btn-secondary w-full justify-center text-xs py-2.5 mt-auto"
              >
                {t.viewGuide}
              </a>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/care-guides" className="btn-secondary inline-flex text-base px-10 py-4">
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
