'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CONTACT } from '@/config/contact'
import type { DbTree } from '@/lib/supabase'
import { getTreeImageUrls } from '@/lib/tree-images'
import { PhoneIcon, MessageIcon, SunIcon, WaterIcon, LeafIcon } from '@/components/Icons'

const inputCls = 'w-full px-4 py-3 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest/30 transition'

function PhotoCarousel({ urls, name }: { urls: string[]; name: string }) {
  const [idx, setIdx] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)

  if (urls.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-7xl opacity-50">🌿</div>
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
      <img src={urls[idx]} alt={`${name} ${idx + 1}`} className="w-full h-full object-cover" />
      {urls.length > 1 && idx > 0 && (
        <button onClick={() => setIdx(i => i - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg">‹</button>
      )}
      {urls.length > 1 && idx < urls.length - 1 && (
        <button onClick={() => setIdx(i => i + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg">›</button>
      )}
      {urls.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {urls.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`} />
          ))}
        </div>
      )}
      {urls.length > 1 && (
        <div className="absolute top-4 right-16 bg-black/50 text-white text-xs font-bold px-2 py-0.5 rounded-full">{idx + 1}/{urls.length}</div>
      )}
    </div>
  )
}

function EditModal({ tree, onClose, onSaved }: {
  tree: DbTree
  onClose: () => void
  onSaved: (updated: Partial<DbTree>) => void
}) {
  const [form, setForm] = useState({
    name: tree.name,
    price: tree.price,
    level: tree.level,
    sun: tree.sun,
    water: tree.water,
    notes: tree.notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function setF(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/admin/trees/${tree.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      onSaved(form)
      onClose()
    } else {
      setError('Save failed — are you still logged in?')
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-cream-light rounded-3xl shadow-card-lg overflow-hidden">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl text-forest">Edit Tree</h2>
            <button type="button" onClick={onClose} className="text-ink-light hover:text-ink text-xl">✕</button>
          </div>

          {[
            { label: 'Name', key: 'name' as const },
            { label: 'Price', key: 'price' as const },
            { label: 'Sun', key: 'sun' as const },
            { label: 'Water', key: 'water' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block font-sans text-sm font-semibold text-forest mb-1">{label}</label>
              <input type="text" value={form[key]} onChange={e => setF(key, e.target.value)} className={inputCls} />
            </div>
          ))}

          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Level</label>
            <select value={form.level} onChange={e => setF('level', e.target.value)} className={inputCls}>
              <option value="Beginner Friendly">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
            </select>
          </div>

          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2} className={inputCls + ' resize-none'} />
          </div>

          {error && <p className="text-bonsai-pink text-sm text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center text-sm py-3">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm py-3 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>
    </div>
  )
}

export default function TreePageClient({ tree: initialTree, isStaff }: {
  tree: DbTree
  isStaff: boolean
}) {
  const [tree, setTree] = useState<DbTree>(initialTree)
  const [editing, setEditing] = useState(false)
  const router = useRouter()
  const photos = getTreeImageUrls(tree)

  function handleSaved(updated: Partial<DbTree>) {
    setTree(p => ({ ...p, ...updated }))
  }

  return (
    <>
      <div className="min-h-screen bg-cream">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

        {/* Staff banner */}
        {isStaff && (
          <div className="bg-forest text-white px-4 py-3 flex items-center justify-between">
            <span className="font-sans text-sm font-semibold">🌸 Staff View — {tree.tree_code}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-white text-forest font-sans text-xs font-bold px-4 py-2 rounded-full hover:bg-cream transition-colors"
              >
                ✏️ Edit Tree
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="border border-white/40 text-white font-sans text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        <div className="max-w-lg mx-auto px-4 py-8">
          {/* Tree photo */}
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-card-lg bg-forest">
            <PhotoCarousel urls={photos} name={tree.name} />
            {/* Corner marks */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/40 pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/40 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/40 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/40 pointer-events-none" />
            {/* Price badge */}
            <div className="absolute top-4 right-4 bg-forest/80 backdrop-blur text-white font-serif text-xl font-bold px-4 py-1.5 rounded-full pointer-events-none">
              {tree.price}
            </div>
          </div>

          {/* Tree info and database care card */}
          <div className="card p-6 mb-5">
            <div className="mb-4">
              <h1 className="font-serif text-3xl text-forest">{tree.name}</h1>
              {tree.species && <p className="font-sans text-sm italic text-ink-light">{tree.species}</p>}
              <span className={`inline-block mt-2 font-sans text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                tree.level === 'Beginner Friendly'
                  ? 'bg-bonsai-pink-pale text-bonsai-pink'
                  : 'bg-sage-pale text-forest'
              }`}>
                {tree.level}
              </span>
            </div>

            <div className="w-full h-px bg-bonsai-pink-lt/50 my-4" />

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <SunIcon className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-ink-light"><strong className="text-forest-dark">Sun:</strong> {tree.sun}</span>
              </li>
              <li className="flex items-start gap-3">
                <WaterIcon className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-ink-light"><strong className="text-forest-dark">Water:</strong> {tree.water}</span>
              </li>
              <li className="flex items-start gap-3">
                <LeafIcon className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-ink-light"><strong className="text-forest-dark">Level:</strong> {tree.level}</span>
              </li>
            </ul>

            {tree.notes && (
              <>
                <div className="w-full h-px bg-bonsai-pink-lt/50 my-4" />
                <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-2">Care guide</p>
                <p className="font-sans text-sm italic text-ink-light leading-relaxed">{tree.notes}</p>
              </>
            )}
          </div>

          {/* Contact CTA */}
          <div className="card p-6 text-center">
            <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-2">Interested in this tree?</p>
            <h2 className="font-serif text-xl text-forest mb-5">Contact Bonsai Florida</h2>
            <div className="flex flex-col gap-3">
              <a href={CONTACT.phone.tel} className="btn-primary w-full justify-center" aria-label="Call Bonsai Florida">
                <PhoneIcon className="w-5 h-5" /> Call {CONTACT.phone.display}
              </a>
              <a href={`${CONTACT.phone.sms}&body=Hi! I'm interested in the ${encodeURIComponent(tree.name)} (${tree.tree_code})`}
                className="btn-secondary w-full justify-center" aria-label="Text Bonsai Florida">
                <MessageIcon className="w-5 h-5" /> Text Us
              </a>
            </div>
          </div>

          <p className="text-center font-sans text-xs text-ink-light mt-6 tracking-widest uppercase">
            Bonsai Florida · Palm Beach, Florida
          </p>
        </div>

        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>

      {editing && <EditModal tree={tree} onClose={() => setEditing(false)} onSaved={handleSaved} />}
    </>
  )
}
