'use client'

import { useEffect, useState } from 'react'
import { CONTACT } from '@/config/contact'
import { TREES } from '@/data/trees'
import { supabase } from '@/lib/supabase'
import type { DbTree } from '@/lib/supabase'
import { useMessages } from '@/lib/i18n'
import { SunIcon, WaterIcon, LeafIcon, MessageIcon } from '@/components/Icons'

// ─── Static placeholder card (used when no DB trees yet) ──────────────────────

function StaticCard({ tree, t }: { tree: typeof TREES[0]; t: ReturnType<typeof useMessages>['collection'] }) {
  return (
    <article
      className="card overflow-hidden hover:shadow-card-lg transition-shadow duration-200"
      aria-label={`${tree.name} — ${tree.price}`}
    >
      <div
        className="relative w-full aspect-[4/3] flex flex-col items-center justify-end pb-6 overflow-hidden"
        style={{ background: `linear-gradient(165deg, ${tree.bgFrom}, ${tree.bgTo})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20" />
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/30" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/30" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/30" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/30" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-20 rounded-full bg-white/10 blur-md absolute -top-2 left-1/2 -translate-x-1/2" />
            <div className="w-20 h-14 rounded-full bg-white/15 relative" />
          </div>
          <div className="w-2.5 h-10 bg-white/20 rounded-full mx-auto" />
          <div className="w-14 h-5 bg-white/15 rounded-b-lg rounded-t-sm" />
        </div>
        <div className="absolute top-4 left-4 z-10">
          <span className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
            tree.level === 'Beginner Friendly'
              ? 'bg-bonsai-pink-pale text-bonsai-pink'
              : 'bg-sage-pale text-forest'
          }`}>
            {tree.level}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="font-serif text-white text-lg font-bold drop-shadow-lg">{tree.price}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-serif text-2xl text-forest mb-0.5">{tree.name}</h3>
          <p className="font-sans text-xs text-ink-light italic tracking-wide">{tree.species}</p>
        </div>
        <TreeInfoRows sun={tree.sun} water={tree.water} level={tree.level} t={t} />
        <div className="w-full h-px bg-bonsai-pink-lt/50 mb-5" />
        <a href={CONTACT.phone.sms} className="btn-primary w-full justify-center text-sm" aria-label={`Ask about ${tree.name}`}>
          <MessageIcon className="w-4 h-4" />
          {t.askButton}
        </a>
      </div>
    </article>
  )
}

// ─── Live DB card ─────────────────────────────────────────────────────────────

function DbCard({ tree, t }: { tree: DbTree; t: ReturnType<typeof useMessages>['collection'] }) {
  return (
    <article
      className="card overflow-hidden hover:shadow-card-lg transition-shadow duration-200"
      aria-label={`${tree.name} — ${tree.price}`}
    >
      {/* Photo or gradient placeholder */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-forest" aria-hidden="true">
        {tree.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tree.image_url}
            alt={tree.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest to-forest-light flex items-center justify-center text-6xl opacity-60">
            🌿
          </div>
        )}

        {/* Corner marks — poster-frame style */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/40" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/40" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/40" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/40" />

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

        {/* Price */}
        <div className="absolute top-4 right-4 z-10">
          <span className="font-serif text-white text-lg font-bold drop-shadow-lg">{tree.price}</span>
        </div>
      </div>

      {/* Card info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-serif text-2xl text-forest mb-0.5">{tree.name}</h3>
          {tree.species && (
            <p className="font-sans text-xs text-ink-light italic tracking-wide">{tree.species}</p>
          )}
        </div>
        <TreeInfoRows sun={tree.sun} water={tree.water} level={tree.level} t={t} />
        {tree.notes && (
          <p className="font-sans text-sm text-ink-light italic mb-4 leading-relaxed">
            {tree.notes}
          </p>
        )}
        <div className="w-full h-px bg-bonsai-pink-lt/50 mb-5" />
        <a
          href={CONTACT.phone.sms}
          className="btn-primary w-full justify-center text-sm"
          aria-label={`Ask about the ${tree.name} bonsai priced at ${tree.price}`}
        >
          <MessageIcon className="w-4 h-4" />
          {t.askButton}
        </a>
      </div>
    </article>
  )
}

// ─── Shared info rows ─────────────────────────────────────────────────────────

function TreeInfoRows({ sun, water, level, t }: {
  sun: string; water: string; level: string
  t: ReturnType<typeof useMessages>['collection']
}) {
  return (
    <ul className="space-y-2.5 mb-6">
      <li className="flex items-start gap-3">
        <div className="mt-0.5 text-sage flex-shrink-0"><SunIcon className="w-4 h-4" /></div>
        <span className="font-sans text-sm text-ink-light leading-snug">
          <strong className="font-semibold text-forest-dark">{t.sunLabel}:</strong> {sun}
        </span>
      </li>
      <li className="flex items-start gap-3">
        <div className="mt-0.5 text-sage flex-shrink-0"><WaterIcon className="w-4 h-4" /></div>
        <span className="font-sans text-sm text-ink-light leading-snug">
          <strong className="font-semibold text-forest-dark">{t.waterLabel}:</strong> {water}
        </span>
      </li>
      <li className="flex items-start gap-3">
        <div className="mt-0.5 text-sage flex-shrink-0"><LeafIcon className="w-4 h-4" /></div>
        <span className="font-sans text-sm text-ink-light leading-snug">
          <strong className="font-semibold text-forest-dark">{t.levelLabel}:</strong> {level}
        </span>
      </li>
    </ul>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function BonsaiCollection() {
  const m = useMessages()
  const t = m.collection

  const [dbTrees, setDbTrees] = useState<DbTree[] | null>(null)

  useEffect(() => {
    supabase
      .from('bonsai_trees')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setDbTrees(data ?? []))
  }, [])

  // Use DB trees if any uploaded; fall back to static placeholders
  const useLiveData = dbTrees !== null && dbTrees.length > 0

  return (
    <section
      id="collection"
      className="bg-cream py-20 sm:py-24"
      aria-labelledby="collection-heading"
    >
      <div className="section-wrap">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="collection-heading" className="section-heading mb-4">
            {t.heading}
          </h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Loading shimmer */}
        {dbTrees === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="w-full aspect-[4/3] bg-sage-pale" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-sage-pale rounded-lg w-2/3" />
                  <div className="h-4 bg-sage-pale rounded-lg w-1/2" />
                  <div className="h-4 bg-sage-pale rounded-lg w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DB trees (live inventory) */}
        {useLiveData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbTrees.map(tree => (
              <DbCard key={tree.id} tree={tree} t={t} />
            ))}
          </div>
        )}

        {/* Static placeholder trees (shown when DB is empty) */}
        {dbTrees !== null && dbTrees.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TREES.map(tree => (
              <StaticCard key={tree.id} tree={tree} t={t} />
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <p className="font-serif italic text-ink-light text-lg mb-5">{t.footerNote}</p>
          <a href={CONTACT.phone.tel} className="btn-secondary inline-flex" aria-label="Call to ask about more trees">
            {t.footerCta}
          </a>
        </div>
      </div>
    </section>
  )
}
