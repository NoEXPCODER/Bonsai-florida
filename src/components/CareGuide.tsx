'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMessages } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'
import type { DbTree } from '@/lib/supabase'
import { CARE_GUIDES, type CareGuideEntry } from '@/data/care-guides'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { WaterIcon, SunIcon, LeafIcon, QuestionIcon } from '@/components/Icons'

const HOMEPAGE_CARE_GUIDE_LIMIT = 4

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

function CareGuideCard({ guide, expanded, onToggle, index }: {
  guide: CareGuideEntry
  expanded: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <article className="card p-6 sm:p-7 flex flex-col hover:shadow-card-lg transition-shadow duration-200">
      <div
        className={`${BLOCK_ACCENTS[index % BLOCK_ACCENTS.length]} w-14 h-14 rounded-2xl flex items-center justify-center text-forest mb-5 shadow-soft`}
        aria-hidden="true"
      >
        {BLOCK_ICONS[index % BLOCK_ICONS.length]}
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl text-forest leading-snug">{guide.name}</h3>
          <p className="font-sans text-sm italic text-ink-light">{guide.latin}</p>
        </div>
        <span className="font-sans text-[10px] font-bold tracking-widest uppercase bg-sage-pale text-forest px-2.5 py-1 rounded-full flex-shrink-0">
          {guide.difficulty}
        </span>
      </div>

      <p className="font-sans text-sm text-ink-light leading-relaxed mb-4">{guide.summary}</p>

      <div className="grid grid-cols-1 gap-2 mb-5">
        {[
          ['Light', guide.quick.light],
          ['Water', guide.quick.water],
          ['Best spot', guide.quick.placement],
        ].map(([label, value]) => (
          <p key={label} className="font-sans text-xs text-ink-light bg-sage-pale/50 rounded-xl px-3 py-2">
            <strong className="text-forest">{label}:</strong> {value}
          </p>
        ))}
      </div>

      {expanded && (
        <div className="space-y-4 mb-5">
          <div className="rounded-2xl border border-bonsai-pink-lt/50 bg-bonsai-pink-pale/40 px-4 py-3">
            <p className="font-sans text-sm font-semibold text-forest">Beginner tip</p>
            <p className="font-sans text-sm text-ink-light leading-relaxed">{guide.quick.beginnerTip}</p>
          </div>
          {guide.details.map(section => (
            <div key={section.title}>
              <h4 className="font-serif text-xl text-forest mb-2">{section.title}</h4>
              <ul className="space-y-2">
                {section.body.map(line => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-bonsai-pink flex-shrink-0" />
                    <span className="font-sans text-sm text-ink-light leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        className="mt-auto btn-secondary justify-center text-sm py-3"
      >
        {expanded ? 'Hide Details' : 'View Detailed Care'}
      </button>
    </article>
  )
}

export default function CareGuide() {
  const m = useMessages()
  const t = m.care
  const router = useRouter()
  const [trees, setTrees] = useState<DbTree[]>([])
  const [search, setSearch] = useState('')
  const [guideSearch, setGuideSearch] = useState('')
  const [expanded, setExpanded] = useState(CARE_GUIDES[0].slug)

  useEffect(() => {
    supabase
      .from('bonsai_trees')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setTrees(data ?? []))
  }, [])

  const filteredGuides = useMemo(() => {
    const q = guideSearch.trim().toLowerCase()
    if (!q) return CARE_GUIDES.slice(0, HOMEPAGE_CARE_GUIDE_LIMIT)
    return CARE_GUIDES.filter(guide =>
      guide.name.toLowerCase().includes(q) ||
      guide.latin.toLowerCase().includes(q) ||
      guide.aliases.some(alias => alias.toLowerCase().includes(q)) ||
      guide.summary.toLowerCase().includes(q)
    ).slice(0, HOMEPAGE_CARE_GUIDE_LIMIT)
  }, [guideSearch])

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

        <div className="max-w-xl mx-auto mb-8">
          <input
            type="search"
            value={guideSearch}
            onChange={e => setGuideSearch(e.target.value)}
            placeholder="Search species care: ficus, juniper, jade..."
            className="w-full px-5 py-4 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
          />
          <p className="mt-3 text-center font-sans text-xs text-ink-light">
            Showing up to {HOMEPAGE_CARE_GUIDE_LIMIT} care guides to keep the homepage short and easy to read.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredGuides.map((guide, i) => (
            <CareGuideCard
              key={guide.slug}
              guide={guide}
              index={i}
              expanded={expanded === guide.slug}
              onToggle={() => setExpanded(current => current === guide.slug ? '' : guide.slug)}
            />
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
