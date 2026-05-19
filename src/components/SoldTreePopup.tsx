'use client'

import { useEffect, useMemo, useState } from 'react'
import { CONTACT } from '@/config/contact'
import { getPrimaryTreeImageUrl, isPermanentTreeImageUrl } from '@/lib/tree-images'
import type { DbTree } from '@/lib/supabase'

type SoldTree = Pick<
  DbTree,
  'id' | 'name' | 'species' | 'price' | 'image_url' | 'image_urls' | 'sold_image_url' | 'sold_note' | 'sold_at' | 'tree_code'
>

export default function SoldTreePopup() {
  const [trees, setTrees] = useState<SoldTree[]>([])
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/sold-trees')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) setTrees(data)
      })
      .catch(() => setTrees([]))
  }, [])

  useEffect(() => {
    if (!trees.length || dismissed) return
    const timer = window.setTimeout(() => setOpen(true), 1200)
    return () => window.clearTimeout(timer)
  }, [trees.length, dismissed])

  const latest = trees[0]
  const image = useMemo(() => {
    if (!latest) return null
    return isPermanentTreeImageUrl(latest.sold_image_url)
      ? latest.sold_image_url
      : getPrimaryTreeImageUrl(latest)
  }, [latest])

  if (!latest || dismissed || !open) return null

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:right-6 sm:w-[360px]"
      aria-label="Recently sold bonsai"
    >
      <div className="card overflow-hidden shadow-card-lg border-forest/20 bg-cream-light">
        <div className="flex items-start gap-4 p-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-sage-pale flex-shrink-0">
            {image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={image} alt={`${latest.name} sold`} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-3xl text-forest/40">✓</div>}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-bonsai-pink mb-1">
                  Recently Sold
                </p>
                <h2 className="font-serif text-xl text-forest leading-tight">{latest.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="text-ink-light hover:text-ink text-lg leading-none"
                aria-label="Close sold tree notice"
              >
                x
              </button>
            </div>

            {latest.species && <p className="font-sans text-xs italic text-ink-light mt-0.5">{latest.species}</p>}
            <p className="font-serif text-base font-bold text-bonsai-pink mt-1">{latest.price}</p>
            <p className="font-sans text-sm text-ink-light mt-2 leading-snug">
              {latest.sold_note || 'This tree found a new home. More bonsai are available now.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <a href="#collection" className="btn-primary flex-1 justify-center text-xs py-3">
            See Available Trees
          </a>
          <a href={CONTACT.phone.sms} className="btn-secondary flex-1 justify-center text-xs py-3">
            Ask Us
          </a>
        </div>
      </div>
    </aside>
  )
}
