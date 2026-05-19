'use client'

import { useState } from 'react'
import type { DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { useMessages } from '@/lib/i18n'
import { useVisitList } from '@/hooks/useVisitList'
import { MAX_VISIT_LIST } from '@/lib/visit-list'
import VisitListDrawer from '@/components/VisitListDrawer'

function TreeCard({ tree, onSave }: { tree: DbTree; onSave: () => void }) {
  const t = useMessages().featuredTrees
  const { list, toggle } = useVisitList()
  const photo = getPrimaryTreeImageUrl(tree)
  const isBeginner = tree.level === 'Beginner Friendly'
  const isSaved = list.some(i => i.id === tree.id)
  const listFull = list.length >= MAX_VISIT_LIST && !isSaved

  function handleSave() {
    toggle({
      id: tree.id,
      name: tree.name,
      price: tree.price,
      imageUrl: photo ?? undefined,
      treeCode: tree.tree_code ?? undefined,
    })
    if (!isSaved && !listFull) onSave()
  }

  return (
    <article className="card overflow-hidden flex flex-col">
      <a
        href={tree.tree_code ? `/tree/${tree.tree_code}` : '#'}
        className="block relative w-full aspect-[3/4] overflow-hidden bg-sage-pale"
        aria-label={`View ${tree.name}`}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={tree.name}
            className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🌿</div>
        )}
        <span className={`absolute top-3 left-3 font-sans text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
          isBeginner ? 'bg-bonsai-pink/90 text-white' : 'bg-forest/90 text-white'
        }`}>
          {isBeginner ? t.easy : t.intermediate}
        </span>
      </a>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg sm:text-xl text-forest leading-snug mb-0.5">{tree.name}</h3>
        {tree.species && (
          <p className="font-sans text-xs italic text-ink-light mb-2 line-clamp-1">{tree.species}</p>
        )}
        <p className="font-serif text-2xl font-bold text-bonsai-pink mb-4">${tree.price}</p>

        <div className="mt-auto flex flex-col gap-2">
          <a
            href={tree.tree_code ? `/tree/${tree.tree_code}` : '#'}
            className="btn-secondary w-full justify-center text-sm py-3"
          >
            {t.viewTree}
          </a>
          <button
            onClick={handleSave}
            disabled={listFull}
            className={`w-full justify-center text-sm py-3 rounded-full font-sans font-bold transition-all duration-200 flex items-center gap-2 ${
              isSaved
                ? 'bg-forest text-white'
                : listFull
                ? 'border border-forest/20 text-ink-light/40 cursor-not-allowed'
                : 'border border-forest/30 text-forest hover:bg-forest hover:text-white hover:border-forest'
            }`}
          >
            {isSaved ? '✓ ' : '♡ '}
            {isSaved ? t.savedToList : listFull ? t.listFull : t.saveToList}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedTrees({ trees }: { trees: DbTree[] }) {
  const t = useMessages().featuredTrees
  const [drawerOpen, setDrawerOpen] = useState(false)
  if (trees.length === 0) return null

  return (
    <>
      <section id="collection" className="bg-cream py-16 sm:py-20" aria-labelledby="featured-heading">
        <div className="section-wrap">
          <div className="text-center mb-12">
            <p className="section-label mb-3">{t.label}</p>
            <h2 id="featured-heading" className="section-heading mb-4">{t.heading}</h2>
            <div className="pink-divider mb-4" />
            <p className="font-sans text-lg text-ink-light max-w-md mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {trees.map(tree => (
              <TreeCard key={tree.id} tree={tree} onSave={() => setDrawerOpen(true)} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/trees" className="btn-primary inline-flex text-base px-10 py-4">
              {t.viewInventory}
            </a>
          </div>
        </div>
      </section>

      <VisitListDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
