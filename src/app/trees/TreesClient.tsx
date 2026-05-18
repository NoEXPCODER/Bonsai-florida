'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CONTACT } from '@/config/contact'
import type { DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl, getTreeImageUrls } from '@/lib/tree-images'
import { useMessages } from '@/lib/i18n'
import { SunIcon, WaterIcon, MessageIcon, PhoneIcon } from '@/components/Icons'

// ─── Photo thumbnail ──────────────────────────────────────────────────────────

function TreePhoto({ tree, className }: { tree: DbTree; className?: string }) {
  const urls = getTreeImageUrls(tree)
  const src = getPrimaryTreeImageUrl(tree)
  const count = urls.length
  return (
    <div className={`relative overflow-hidden bg-forest ${className}`}>
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt={tree.name} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">🌿</div>
      }
      {count > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          +{count - 1}
        </div>
      )}
    </div>
  )
}

// ─── Level badge ──────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: string }) {
  const isBeginner = level === 'Beginner Friendly' || level === 'Dành Cho Người Mới'
  return (
    <span className={`font-sans text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
      isBeginner ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage-pale text-forest'
    }`}>
      {level}
    </span>
  )
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridCard({ tree, onClick }: { tree: DbTree; onClick: () => void }) {
  const t = useMessages().collection
  return (
    <article
      className="card overflow-hidden hover:shadow-card-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[3/4]">
        <TreePhoto tree={tree} className="w-full h-full" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3"><LevelBadge level={tree.level} /></div>
        <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pointer-events-none">
          <h3 className="font-serif text-lg text-white leading-tight">{tree.name}</h3>
          {tree.species && <p className="font-sans text-xs text-white/60 italic">{tree.species}</p>}
          <p className="font-serif text-base font-bold text-bonsai-pink mt-0.5">{tree.price}</p>
        </div>
        <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-forest font-sans text-sm font-bold px-4 py-2 rounded-full shadow">View</span>
        </div>
      </div>
      <div className="p-4">
        <ul className="space-y-1.5 mb-3">
          <li className="flex items-center gap-2"><SunIcon className="w-3 h-3 text-sage flex-shrink-0" /><span className="font-sans text-xs text-ink-light truncate">{tree.sun}</span></li>
          <li className="flex items-center gap-2"><WaterIcon className="w-3 h-3 text-sage flex-shrink-0" /><span className="font-sans text-xs text-ink-light truncate">{tree.water}</span></li>
        </ul>
        <div className="w-full h-px bg-bonsai-pink-lt/50 mb-3" />
        <a
          href={`${CONTACT.phone.sms}&body=Hi! I'm interested in the ${encodeURIComponent(tree.name)}${tree.tree_code ? ` (${tree.tree_code})` : ''}`}
          onClick={e => e.stopPropagation()}
          className="btn-primary w-full justify-center text-xs py-2.5"
        >
          <MessageIcon className="w-3.5 h-3.5" />{t.askButton}
        </a>
      </div>
    </article>
  )
}

// ─── List row ─────────────────────────────────────────────────────────────────

function ListRow({ tree, onClick }: { tree: DbTree; onClick: () => void }) {
  return (
    <article
      className="card p-0 overflow-hidden hover:shadow-card transition-all duration-200 cursor-pointer group flex"
      onClick={onClick}
    >
      <TreePhoto tree={tree} className="w-24 sm:w-32 flex-shrink-0 aspect-square" />
      <div className="flex flex-1 min-w-0 items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-serif text-base text-forest leading-tight">{tree.name}</h3>
            <LevelBadge level={tree.level} />
          </div>
          {tree.species && <p className="font-sans text-xs text-ink-light italic">{tree.species}</p>}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
            <span className="flex items-center gap-1 font-sans text-xs text-ink-light"><SunIcon className="w-3 h-3 text-sage" />{tree.sun}</span>
            <span className="flex items-center gap-1 font-sans text-xs text-ink-light"><WaterIcon className="w-3 h-3 text-sage" />{tree.water}</span>
          </div>
          {tree.tree_code && <p className="font-mono text-[10px] text-ink-light/40 mt-1">{tree.tree_code}</p>}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-serif text-lg font-bold text-bonsai-pink">{tree.price}</p>
          <a
            href={`${CONTACT.phone.sms}&body=Hi! I'm interested in the ${encodeURIComponent(tree.name)}${tree.tree_code ? ` (${tree.tree_code})` : ''}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 mt-2 bg-forest text-white font-sans text-xs font-bold px-3 py-2 rounded-full hover:bg-forest-light transition-colors"
          >
            <MessageIcon className="w-3 h-3" /> Ask
          </a>
        </div>
      </div>
    </article>
  )
}

// ─── Main client ──────────────────────────────────────────────────────────────

type View = 'grid' | 'list'
type Filter = 'all' | 'beginner' | 'intermediate'
type Sort = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name'

export default function TreesClient({ trees }: { trees: DbTree[] }) {
  const router = useRouter()
  const m = useMessages()
  const t = m.collection

  const [view, setView] = useState<View>('grid')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('newest')
  const [search, setSearch] = useState('')

  const displayed = useMemo(() => {
    let list = [...trees]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        (t.species ?? '').toLowerCase().includes(q) ||
        (t.notes ?? '').toLowerCase().includes(q)
      )
    }

    // Filter by level
    if (filter === 'beginner') list = list.filter(t => t.level === 'Beginner Friendly')
    if (filter === 'intermediate') list = list.filter(t => t.level === 'Intermediate')

    // Sort
    if (sort === 'newest') list.sort((a, b) => b.created_at.localeCompare(a.created_at))
    if (sort === 'oldest') list.sort((a, b) => a.created_at.localeCompare(b.created_at))
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price_asc' || sort === 'price_desc') {
      list.sort((a, b) => {
        const pa = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
        const pb = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
        return sort === 'price_asc' ? pa - pb : pb - pa
      })
    }

    return list
  }, [trees, search, filter, sort])

  function goToTree(tree: DbTree) {
    if (tree.tree_code) router.push(`/tree/${tree.tree_code}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

      {/* Header */}
      <div className="bg-cream-light border-b border-forest/10">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 text-center">
          <p className="section-label mb-3">{t.label}</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest mb-3">{t.heading}</h1>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light max-w-lg mx-auto">{t.description}</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <a href={CONTACT.phone.tel} className="btn-primary text-sm py-3">
              <PhoneIcon className="w-4 h-4" /> Call Now
            </a>
            <Link href="/" className="btn-secondary text-sm py-3">← Back to Home</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls bar */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Search */}
          <input
            type="search"
            placeholder="Search trees…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-40 px-4 py-2.5 rounded-2xl border border-forest/20 bg-white font-sans text-sm text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
          />

          {/* Filter pills */}
          <div className="flex gap-2">
            {(['all', 'beginner', 'intermediate'] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`font-sans text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${
                  filter === f ? 'bg-forest text-white border-forest' : 'text-ink-light border-forest/20 hover:bg-sage-pale'
                }`}>
                {f === 'all' ? `All (${trees.length})` : f === 'beginner' ? 'Beginner' : 'Intermediate'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value as Sort)}
            className="font-sans text-xs text-ink border border-forest/20 bg-white px-3 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-forest/30">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
            <option value="name">Name A–Z</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-forest/20 rounded-2xl overflow-hidden bg-white">
            <button onClick={() => setView('grid')}
              className={`px-3 py-2.5 transition-colors ${view === 'grid' ? 'bg-forest text-white' : 'text-ink-light hover:bg-sage-pale'}`}
              title="Grid view">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button onClick={() => setView('list')}
              className={`px-3 py-2.5 transition-colors ${view === 'list' ? 'bg-forest text-white' : 'text-ink-light hover:bg-sage-pale'}`}
              title="List view">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="2" width="14" height="2" rx="1"/><rect x="1" y="7" width="14" height="2" rx="1"/>
                <rect x="1" y="12" width="14" height="2" rx="1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="font-sans text-xs text-ink-light mb-4">
          {displayed.length} {displayed.length === 1 ? 'tree' : 'trees'}{search ? ` matching "${search}"` : ''}
        </p>

        {/* Empty state */}
        {displayed.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌿</div>
            <p className="font-serif text-xl text-forest mb-2">No trees found</p>
            <p className="font-sans text-ink-light text-sm mb-6">Try a different search or filter</p>
            <button onClick={() => { setSearch(''); setFilter('all') }}
              className="btn-secondary text-sm">Clear filters</button>
          </div>
        )}

        {/* Grid view */}
        {view === 'grid' && displayed.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayed.map(tree => <GridCard key={tree.id} tree={tree} onClick={() => goToTree(tree)} />)}
          </div>
        )}

        {/* List view */}
        {view === 'list' && displayed.length > 0 && (
          <div className="space-y-3">
            {displayed.map(tree => <ListRow key={tree.id} tree={tree} onClick={() => goToTree(tree)} />)}
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
