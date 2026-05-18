'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CONTACT } from '@/config/contact'
import { TREES } from '@/data/trees'
import { supabase } from '@/lib/supabase'
import type { DbTree } from '@/lib/supabase'
import { useMessages } from '@/lib/i18n'
import { SunIcon, WaterIcon, LeafIcon, MessageIcon } from '@/components/Icons'

// ─── Photo carousel (swipe + dots) ───────────────────────────────────────────

function PhotoCarousel({ urls, name }: { urls: string[]; name: string }) {
  const [idx, setIdx] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)

  if (urls.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-forest to-sage flex items-center justify-center text-6xl opacity-50">
        🌿
      </div>
    )
  }

  function onTouchStart(e: React.TouchEvent) { setStartX(e.touches[0].clientX) }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX === null) return
    const dx = startX - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) setIdx(i => dx > 0 ? Math.min(i + 1, urls.length - 1) : Math.max(i - 1, 0))
    setStartX(null)
  }

  return (
    <div className="relative w-full h-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[idx]} alt={`${name} photo ${idx + 1}`} className="w-full h-full object-cover transition-opacity duration-300" />

      {/* Prev/next arrows (desktop) */}
      {urls.length > 1 && idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i - 1) }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-sm transition-colors hidden sm:flex">
          ‹
        </button>
      )}
      {urls.length > 1 && idx < urls.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i + 1) }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-sm transition-colors hidden sm:flex">
          ›
        </button>
      )}

      {/* Dot indicators */}
      {urls.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {urls.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setIdx(i) }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-3' : 'bg-white/50'}`} />
          ))}
        </div>
      )}

      {/* Photo count badge */}
      {urls.length > 1 && (
        <div className="absolute top-3 right-12 bg-black/50 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
          {idx + 1}/{urls.length}
        </div>
      )}
    </div>
  )
}

// ─── Portfolio DB card ────────────────────────────────────────────────────────

function DbCard({ tree, t }: { tree: DbTree; t: ReturnType<typeof useMessages>['collection'] }) {
  const router = useRouter()
  const photos = tree.image_urls?.length ? tree.image_urls : tree.image_url ? [tree.image_url] : []

  return (
    <article
      className="card overflow-hidden hover:shadow-card-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
      aria-label={`${tree.name} — ${tree.price}`}
      onClick={() => tree.tree_code && router.push(`/tree/${tree.tree_code}`)}
    >
      {/* Photo area */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-forest">
        <PhotoCarousel urls={photos} name={tree.name} />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Corner marks */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/40 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/40 pointer-events-none" />

        {/* Level badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
            tree.level === 'Beginner Friendly' || tree.level === 'Dành Cho Người Mới'
              ? 'bg-bonsai-pink-pale text-bonsai-pink'
              : 'bg-sage-pale text-forest'
          }`}>
            {tree.level}
          </span>
        </div>

        {/* Name + price over gradient */}
        <div className="absolute bottom-0 inset-x-0 px-5 pb-4 pointer-events-none">
          <h3 className="font-serif text-xl text-white leading-tight drop-shadow">{tree.name}</h3>
          {tree.species && <p className="font-sans text-xs text-white/70 italic">{tree.species}</p>}
          <p className="font-serif text-lg font-bold text-bonsai-pink mt-1 drop-shadow">{tree.price}</p>
        </div>

        {/* View overlay on hover */}
        <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-forest font-sans text-sm font-bold px-5 py-2 rounded-full shadow-lg">View Tree</span>
        </div>
      </div>

      {/* Care info + CTA */}
      <div className="p-5">
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2.5">
            <SunIcon className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            <span className="font-sans text-xs text-ink-light leading-snug truncate">{tree.sun}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <WaterIcon className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            <span className="font-sans text-xs text-ink-light leading-snug truncate">{tree.water}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <LeafIcon className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            <span className="font-sans text-xs text-ink-light leading-snug">{tree.level}</span>
          </li>
        </ul>
        {tree.notes && (
          <p className="font-sans text-xs text-ink-light italic mb-4 leading-relaxed line-clamp-2">{tree.notes}</p>
        )}
        <div className="w-full h-px bg-bonsai-pink-lt/50 mb-4" />
        <a
          href={`${CONTACT.phone.sms}&body=Hi! I'm interested in the ${encodeURIComponent(tree.name)}${tree.tree_code ? ` (${tree.tree_code})` : ''}`}
          onClick={e => e.stopPropagation()}
          className="btn-primary w-full justify-center text-sm"
          aria-label={`Ask about the ${tree.name}`}
        >
          <MessageIcon className="w-4 h-4" />
          {t.askButton}
        </a>
      </div>
    </article>
  )
}

// ─── Static placeholder card ──────────────────────────────────────────────────

function StaticCard({ tree, t }: { tree: typeof TREES[0]; t: ReturnType<typeof useMessages>['collection'] }) {
  return (
    <article className="card overflow-hidden hover:shadow-card-lg transition-shadow duration-200" aria-label={`${tree.name} — ${tree.price}`}>
      <div className="relative w-full aspect-[3/4] flex flex-col items-center justify-end pb-8 overflow-hidden"
        style={{ background: `linear-gradient(165deg, ${tree.bgFrom}, ${tree.bgTo})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40" />
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/30" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/30" />
        <div className="relative z-10 flex flex-col items-center mb-2">
          <div className="w-24 h-16 rounded-full bg-white/10 blur-md absolute -top-2 left-1/2 -translate-x-1/2" />
          <div className="w-16 h-12 rounded-full bg-white/15 relative" />
          <div className="w-2 h-8 bg-white/20 rounded-full mx-auto" />
          <div className="w-12 h-4 bg-white/15 rounded-b-lg rounded-t-sm" />
        </div>
        <div className="absolute top-4 left-4 z-10">
          <span className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
            tree.level === 'Beginner Friendly' ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage-pale text-forest'
          }`}>{tree.level}</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 px-5 pb-4 pointer-events-none">
          <h3 className="font-serif text-xl text-white leading-tight drop-shadow">{tree.name}</h3>
          <p className="font-sans text-xs text-white/70 italic">{tree.species}</p>
          <p className="font-serif text-lg font-bold text-bonsai-pink mt-1">{tree.price}</p>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2.5"><SunIcon className="w-3.5 h-3.5 text-sage" /><span className="font-sans text-xs text-ink-light truncate">{tree.sun}</span></li>
          <li className="flex items-center gap-2.5"><WaterIcon className="w-3.5 h-3.5 text-sage" /><span className="font-sans text-xs text-ink-light truncate">{tree.water}</span></li>
          <li className="flex items-center gap-2.5"><LeafIcon className="w-3.5 h-3.5 text-sage" /><span className="font-sans text-xs text-ink-light">{tree.level}</span></li>
        </ul>
        <div className="w-full h-px bg-bonsai-pink-lt/50 mb-4" />
        <a href={CONTACT.phone.sms} className="btn-primary w-full justify-center text-sm">
          <MessageIcon className="w-4 h-4" />{t.askButton}
        </a>
      </div>
    </article>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function BonsaiCollection() {
  const m = useMessages()
  const t = m.collection
  const [dbTrees, setDbTrees] = useState<DbTree[] | null>(null)

  useEffect(() => {
    supabase.from('bonsai_trees').select('*').eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setDbTrees(data ?? []))
  }, [])

  const useLiveData = dbTrees !== null && dbTrees.length > 0

  return (
    <section id="collection" className="bg-cream py-20 sm:py-24" aria-labelledby="collection-heading">
      <div className="section-wrap">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="collection-heading" className="section-heading mb-4">{t.heading}</h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">{t.description}</p>
        </div>

        {/* Loading shimmer */}
        {dbTrees === null && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="w-full aspect-[3/4] bg-sage-pale" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-sage-pale rounded w-3/4" />
                  <div className="h-3 bg-sage-pale rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live DB portfolio grid */}
        {useLiveData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {dbTrees.map(tree => <DbCard key={tree.id} tree={tree} t={t} />)}
          </div>
        )}

        {/* Static placeholders */}
        {dbTrees !== null && dbTrees.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {TREES.map(tree => <StaticCard key={tree.id} tree={tree} t={t} />)}
          </div>
        )}

        <div className="mt-14 text-center space-y-4">
          <a href="/trees" className="btn-primary inline-flex text-base px-8 py-4">
            View Full Inventory →
          </a>
          <p className="font-sans text-xs text-ink-light">{t.footerNote}</p>
          <a href={CONTACT.phone.tel} className="btn-secondary inline-flex">{t.footerCta}</a>
        </div>
      </div>
    </section>
  )
}
