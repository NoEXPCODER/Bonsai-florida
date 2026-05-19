'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CONTACT } from '@/config/contact'
import BookGardenVisitButton from '@/components/BookGardenVisitButton'
import type { DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl, getTreeImageUrls } from '@/lib/tree-images'
import { useMessages } from '@/lib/i18n'
import { getSpeciesDifficulty, getSpeciesLatin } from '@/lib/species'
import { siteConfig } from '@/lib/siteConfig'
import { MessageIcon, PhoneIcon, SunIcon, WaterIcon } from '@/components/Icons'
import Navbar from '@/components/Navbar'

// ─── Photo card (grid view — default) ────────────────────────────────────────

function PhotoCard({ tree, onClick }: { tree: DbTree; onClick: () => void }) {
  const t = useMessages().collection
  const primary = getPrimaryTreeImageUrl(tree)
  const count = getTreeImageUrls(tree).length
  const species = tree.tree_species
  const difficulty = species ? getSpeciesDifficulty(species) : tree.level
  const isBeginner = difficulty === 'Beginner Friendly'

  return (
    <article className="cursor-pointer group select-none" onClick={onClick}>
      {/* Portrait photo */}
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-sage-pale shadow-sm group-active:shadow-none mb-3">
        {primary ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primary}
            alt={tree.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🌿</div>
        )}
        {/* Level badge */}
        <span className={`absolute top-2.5 left-2.5 font-sans text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full backdrop-blur-sm ${
          isBeginner ? 'bg-bonsai-pink/90 text-white' : 'bg-forest/90 text-white'
        }`}>
          {isBeginner ? 'Easy' : 'Inter.'}
        </span>
        {/* Extra photos */}
        {count > 1 && (
          <span className="absolute bottom-2.5 right-2.5 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            +{count - 1}
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-forest/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-forest font-sans text-xs font-bold px-4 py-2 rounded-full shadow">
            View details
          </span>
        </div>
      </div>

      {/* Info strip */}
      <div className="px-0.5">
        <h3 className="font-serif text-[15px] leading-snug text-forest line-clamp-2">{tree.name}</h3>
        {(species || tree.species) && (
          <p className="font-sans text-[11px] text-ink-light/70 italic mt-0.5 line-clamp-1">{species ? getSpeciesLatin(species) : tree.species}</p>
        )}
        {species && (
          <div className="mt-2 space-y-1">
            <p className="font-sans text-[11px] text-ink-light line-clamp-1">
              <strong className="text-forest">Light:</strong> {species.light_en || species.sun_en}
            </p>
            <p className="font-sans text-[11px] text-ink-light line-clamp-1">
              <strong className="text-forest">Water:</strong> {species.watering_en || species.water_en}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="font-serif font-bold text-bonsai-pink text-base">${tree.price}</span>
          <a
            href={`${CONTACT.phone.sms}&body=Hi! I'm interested in the ${encodeURIComponent(tree.name)}${tree.tree_code ? ` (${tree.tree_code})` : ''}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 bg-forest text-white font-sans text-[10px] font-bold px-2.5 py-1.5 rounded-full hover:bg-forest-light active:scale-95 transition-all flex-shrink-0"
            aria-label={`Ask about ${tree.name}`}
          >
            <MessageIcon className="w-3 h-3" /> {t.askButton}
          </a>
        </div>
      </div>
    </article>
  )
}

// ─── List row ─────────────────────────────────────────────────────────────────

function ListRow({ tree, onClick }: { tree: DbTree; onClick: () => void }) {
  const t = useMessages().collection
  const primary = getPrimaryTreeImageUrl(tree)
  const species = tree.tree_species
  const difficulty = species ? getSpeciesDifficulty(species) : tree.level
  const isBeginner = difficulty === 'Beginner Friendly'
  const lightText = species?.light_en || species?.sun_en || tree.sun

  return (
    <article
      className="flex items-center gap-0 bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-none cursor-pointer group"
      onClick={onClick}
    >
      {/* Square photo */}
      <div className="w-[88px] h-[88px] flex-shrink-0 bg-sage-pale overflow-hidden">
        {primary ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primary} alt={tree.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">🌿</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 px-3 py-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3 className="font-serif text-base text-forest leading-tight">{tree.name}</h3>
          <span className={`font-sans text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            isBeginner ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage-pale text-forest'
          }`}>{isBeginner ? 'Easy' : 'Inter.'}</span>
        </div>
        {(species || tree.species) && <p className="font-sans text-[11px] text-ink-light italic mt-0.5 line-clamp-1">{species ? getSpeciesLatin(species) : tree.species}</p>}
        <div className="flex items-center gap-1 mt-1.5">
          <SunIcon className="w-3 h-3 text-sage flex-shrink-0" />
          <span className="font-sans text-[11px] text-ink-light line-clamp-1">{lightText}</span>
        </div>
      </div>

      {/* Price + Ask */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2 pr-4 py-3">
        <span className="font-serif font-bold text-bonsai-pink text-base">${tree.price}</span>
        <a
          href={`${CONTACT.phone.sms}&body=Hi! I'm interested in the ${encodeURIComponent(tree.name)}${tree.tree_code ? ` (${tree.tree_code})` : ''}`}
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 bg-forest text-white font-sans text-[10px] font-bold px-2.5 py-1.5 rounded-full hover:bg-forest-light transition-colors"
          aria-label={`Ask about ${tree.name}`}
        >
          <MessageIcon className="w-3 h-3" /> {t.askButton}
        </a>
      </div>
    </article>
  )
}

// ─── Care row ─────────────────────────────────────────────────────────────────

function CareRow({ tree, onClick }: { tree: DbTree; onClick: () => void }) {
  const t = useMessages().collection
  const species = tree.tree_species
  const image = getPrimaryTreeImageUrl(tree)

  const displaySpecies = species?.name_en || tree.species || 'Care guide not linked'
  const lightText = species?.light_en || species?.sun_en || 'Ask Bonsai Florida'
  const waterText = species?.watering_en || species?.water_en || 'Ask Bonsai Florida'
  const summary = species?.care_en || 'Care guide not linked yet. Please ask Bonsai Florida.'

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-sm">
      <button type="button" onClick={onClick} className="w-full text-left block">
        {/* Wide photo banner */}
        <div className="relative w-full aspect-[16/9] bg-sage-pale overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={tree.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🌿</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-24">
            <h3 className="font-serif text-xl text-white">{tree.name}</h3>
            <p className="font-sans text-xs text-white/70 italic mt-0.5">{displaySpecies}</p>
          </div>
          <div className="absolute top-3 right-3 bg-forest/80 backdrop-blur-sm text-white font-serif text-lg font-bold px-3 py-1 rounded-full">
            ${tree.price}
          </div>
        </div>

        {/* Care info */}
        <div className="p-4">
          {summary && (
          <p className="font-sans text-sm text-ink-light leading-relaxed mb-3 line-clamp-2">{summary}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-sage-pale/60 rounded-xl px-3 py-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <SunIcon className="w-3 h-3 text-sage" />
                <span className="font-sans text-[10px] font-bold text-forest uppercase tracking-wide">Light</span>
              </div>
              <p className="font-sans text-xs text-ink-light line-clamp-2">{lightText}</p>
            </div>
            <div className="bg-sage-pale/60 rounded-xl px-3 py-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <WaterIcon className="w-3 h-3 text-sage" />
                <span className="font-sans text-[10px] font-bold text-forest uppercase tracking-wide">Water</span>
              </div>
              <p className="font-sans text-xs text-ink-light line-clamp-2">{waterText}</p>
            </div>
          </div>
        </div>
      </button>

      <div className="flex gap-2 px-4 pb-4">
        <button type="button" onClick={onClick} className="btn-primary flex-1 justify-center text-xs py-2.5">
          {species ? 'Tree Care Guide →' : 'Ask for Care Guide'}
        </button>
        <a
          href={`${CONTACT.phone.sms}&body=Hi! I'm interested in the ${encodeURIComponent(tree.name)}${tree.tree_code ? ` (${tree.tree_code})` : ''}`}
          className="btn-secondary flex-1 justify-center text-xs py-2.5"
        >
          <MessageIcon className="w-3 h-3" /> {t.askButton}
        </a>
      </div>
    </article>
  )
}

// ─── Main client ──────────────────────────────────────────────────────────────

type View = 'grid' | 'list' | 'care'
type Filter = 'all' | 'beginner' | 'intermediate'

const VIEW_ICONS: Record<View, string> = { grid: '⊞', list: '≡', care: '✿' }
const VIEW_LABELS: Record<View, string> = { grid: 'Photos', list: 'List', care: 'Care' }

export default function TreesClient({ trees }: { trees: DbTree[] }) {
  const router = useRouter()
  const m = useMessages()
  const t = m.collection

  const [view, setView] = useState<View>('grid')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const displayed = useMemo(() => {
    let list = [...trees]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(tree =>
        tree.name.toLowerCase().includes(q) ||
        (tree.species ?? '').toLowerCase().includes(q) ||
        (tree.tree_species?.name_en ?? '').toLowerCase().includes(q) ||
        (tree.tree_species?.name_vi ?? '').toLowerCase().includes(q) ||
        (tree.tree_species?.species_latin ?? '').toLowerCase().includes(q) ||
        (tree.tree_species?.latin_name ?? '').toLowerCase().includes(q)
      )
    }
    if (filter === 'beginner') list = list.filter(t => t.level === 'Beginner Friendly')
    if (filter === 'intermediate') list = list.filter(t => t.level === 'Intermediate')
    return list
  }, [trees, search, filter])

  function goToTree(tree: DbTree) {
    if (tree.tree_code) router.push(`/tree/${tree.tree_code}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-cream-light border-b border-forest/10 px-4 py-10 text-center">
        <p className="section-label mb-2">{t.label}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-forest mb-2">{t.heading}</h1>
        <div className="pink-divider mb-4" />
        <p className="font-sans text-sm text-ink-light max-w-sm mx-auto">{t.description}</p>
        <p className="font-sans text-sm text-ink-light max-w-2xl mx-auto mt-4">
          Bonsai Florida is located in the {siteConfig.publicArea} near ZIP code {siteConfig.publicZip}. Garden visits are by appointment only. The exact address and Google Maps link are sent after booking.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 mt-5 sm:flex-row">
          <BookGardenVisitButton />
          <a href={CONTACT.phone.tel} className="btn-primary text-sm py-2.5">
            <PhoneIcon className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>

      {/* Sticky controls */}
      <div className="sticky top-0 z-20 bg-cream-light/95 backdrop-blur-sm border-b border-forest/10">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-2.5">
          <input
            type="search"
            placeholder="Search bonsai trees…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-forest/20 bg-white font-sans text-sm text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
          />
          <div className="flex items-center justify-between gap-3">
            {/* Level filters */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {(['all', 'beginner', 'intermediate'] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    filter === f ? 'bg-forest text-white border-forest' : 'text-ink-light border-forest/20 hover:bg-sage-pale'
                  }`}
                >
                  {f === 'all' ? `All (${trees.length})` : f === 'beginner' ? 'Easy Care' : 'Intermediate'}
                </button>
              ))}
            </div>
            {/* View toggle */}
            <div className="flex-shrink-0 flex border border-forest/20 rounded-xl overflow-hidden bg-white">
              {(['grid', 'list', 'care'] as View[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  title={VIEW_LABELS[v]}
                  className={`font-sans text-xs px-2.5 py-1.5 transition-colors ${
                    view === v ? 'bg-forest text-white' : 'text-ink-light hover:bg-sage-pale'
                  }`}
                >
                  {VIEW_ICONS[v]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-5">
        {displayed.length > 0 && (
          <p className="font-sans text-xs text-ink-light mb-4">
            {displayed.length} {displayed.length === 1 ? 'tree' : 'trees'}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {/* Empty state */}
        {displayed.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌿</div>
            <p className="font-serif text-xl text-forest mb-2">No trees found</p>
            <p className="font-sans text-sm text-ink-light mb-6">Try a different search or filter</p>
            <button onClick={() => { setSearch(''); setFilter('all') }} className="btn-secondary text-sm">
              Clear filters
            </button>
          </div>
        )}

        {/* Photo grid — default */}
        {view === 'grid' && displayed.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8">
            {displayed.map(tree => (
              <PhotoCard key={tree.id} tree={tree} onClick={() => goToTree(tree)} />
            ))}
          </div>
        )}

        {/* List view */}
        {view === 'list' && displayed.length > 0 && (
          <div className="space-y-2">
            {displayed.map(tree => (
              <ListRow key={tree.id} tree={tree} onClick={() => goToTree(tree)} />
            ))}
          </div>
        )}

        {/* Care view */}
        {view === 'care' && displayed.length > 0 && (
          <div className="space-y-4">
            {displayed.map(tree => (
              <CareRow key={tree.id} tree={tree} onClick={() => goToTree(tree)} />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {displayed.length > 0 && (
          <div className="mt-16 text-center">
            <p className="font-serif italic text-ink-light text-lg mb-5">{t.footerNote}</p>
            <a href={CONTACT.phone.tel} className="btn-secondary inline-flex">{t.footerCta}</a>
          </div>
        )}
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-10" />
    </div>
  )
}
