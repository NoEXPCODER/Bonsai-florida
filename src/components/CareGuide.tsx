'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMessages } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'
import type { DbSpecies, DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { WaterIcon, SunIcon, LeafIcon, QuestionIcon } from '@/components/Icons'

const BLOCK_ICONS = [
  <WaterIcon key="water" className="w-8 h-8" />,
  <SunIcon key="sun" className="w-8 h-8" />,
  <LeafIcon key="leaf" className="w-8 h-8" />,
  <QuestionIcon key="question" className="w-8 h-8" />,
]

const BLOCK_ACCENTS = [
  'bg-[#dbeafe]',
  'bg-[#fef9c3]',
  'bg-sage-pale',
  'bg-bonsai-pink-pale',
]

export default function CareGuide() {
  const m = useMessages()
  const t = m.care
  const router = useRouter()
  const [species, setSpecies] = useState<DbSpecies[]>([])
  const [trees, setTrees] = useState<DbTree[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/species')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) setSpecies(data)
      })
      .catch(() => setSpecies([]))

    supabase
      .from('bonsai_trees')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setTrees(data ?? []))
  }, [])

  const speciesGuides = species.length > 0
    ? species.slice(0, 6).map(item => ({
        title: item.name_en,
        subtitle: item.species_latin || item.name_vi,
        level: item.level,
        sun: item.sun_en,
        water: item.water_en,
        care: item.care_en,
      }))
    : t.blocks.map(block => ({
        title: block.title,
        subtitle: t.fallbackSpecies,
        level: '',
        sun: block.body[1] ?? '',
        water: block.body[0] ?? '',
        care: block.body.slice(2).join(' '),
      }))

  const matchingTrees = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return trees.slice(0, 6)

    return trees
      .filter(tree =>
        tree.name.toLowerCase().includes(q) ||
        (tree.species ?? '').toLowerCase().includes(q) ||
        (tree.tree_code ?? '').toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [search, trees])

  function openTree(tree: DbTree) {
    if (tree.tree_code) router.push(`/tree/${tree.tree_code}`)
  }

  return (
    <section
      id="care"
      className="bg-cream-warm py-20 sm:py-24"
      aria-labelledby="care-heading"
    >
      <div className="section-wrap">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="care-heading" className="section-heading mb-4">
            {t.heading}
          </h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {speciesGuides.map((guide, i) => (
            <article
              key={`${guide.title}-${i}`}
              className="card p-7 sm:p-8 flex flex-col hover:shadow-card-lg transition-shadow duration-200"
            >
              <div
                className={`${BLOCK_ACCENTS[i]} w-16 h-16 rounded-2xl flex items-center justify-center text-forest mb-6 shadow-soft`}
                aria-hidden="true"
              >
                {BLOCK_ICONS[i]}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-4 leading-snug">
                {guide.title}
              </h3>
              {guide.subtitle && (
                <p className="font-sans text-sm italic text-ink-light -mt-2 mb-4">
                  {guide.subtitle}
                </p>
              )}

              <div className="w-10 h-px bg-bonsai-pink-lt mb-5" />

              <ul className="space-y-3 flex-1">
                {[
                  guide.level && `${t.levelLabel}: ${guide.level}`,
                  guide.sun && `${t.sunLabel}: ${guide.sun}`,
                  guide.water && `${t.waterLabel}: ${guide.water}`,
                  guide.care,
                ].filter(Boolean).map((line, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full bg-bonsai-pink flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-sans text-base sm:text-lg text-ink-light leading-relaxed">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="card p-6 sm:p-8">
            <div className="text-center mb-6">
              <p className="section-label mb-2">{t.searchLabel}</p>
              <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-2">
                {t.searchHeading}
              </h3>
              <p className="font-sans text-sm sm:text-base text-ink-light">
                {t.searchDescription}
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full px-5 py-4 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
            />

            <div className="mt-5 space-y-3">
              {matchingTrees.map(tree => {
                const image = getPrimaryTreeImageUrl(tree)
                return (
                  <button
                    key={tree.id}
                    type="button"
                    onClick={() => openTree(tree)}
                    disabled={!tree.tree_code}
                    className="w-full flex items-center gap-4 rounded-2xl border border-forest/10 bg-cream-light px-3 py-3 text-left hover:border-forest/30 hover:shadow-soft transition disabled:opacity-50"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-sage-pale flex-shrink-0">
                      {image
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={image} alt={tree.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl text-forest/40">?</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-forest truncate">{tree.name}</p>
                      <p className="font-sans text-sm text-ink-light truncate">
                        {tree.species || t.treeFallbackSpecies}
                      </p>
                      <p className="font-sans text-xs text-ink-light/70">
                        {tree.tree_code ? t.openGuide : t.noGuide}
                      </p>
                    </div>
                    <span className="font-sans text-sm font-bold text-bonsai-pink flex-shrink-0">
                      {t.viewGuide}
                    </span>
                  </button>
                )
              })}

              {trees.length > 0 && matchingTrees.length === 0 && (
                <p className="font-sans text-sm text-ink-light text-center py-4">
                  {t.noSearchResults}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
