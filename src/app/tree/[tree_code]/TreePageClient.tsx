'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CONTACT } from '@/config/contact'
import type { DbTree, DbSpecies } from '@/lib/supabase'
import { getTreeImageUrls } from '@/lib/tree-images'
import { optimizeTreeImage } from '@/lib/image-optimizer'
import { PhoneIcon, MessageIcon, SunIcon, WaterIcon, LeafIcon } from '@/components/Icons'

const inputCls = 'w-full px-4 py-3 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest/30 transition'

// ─── Photo carousel ───────────────────────────────────────────────────────────

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

// ─── Species care guide ───────────────────────────────────────────────────────

interface CareSection { label: string; value: string | null | undefined }

function SpeciesCareGuide({ species }: { species: DbSpecies }) {
  const sections: CareSection[] = [
    { label: 'Quick Facts', value: species.quick_facts_en },
    { label: 'Light', value: species.light_en },
    { label: 'Watering', value: species.watering_en },
    { label: 'Fertilizer', value: species.fertilizer_en },
    { label: 'Pruning', value: species.pruning_en },
    { label: 'Repotting', value: species.repotting_en },
    { label: 'Watch For', value: species.watch_for_en },
    { label: 'Florida Tips', value: species.florida_tips_en },
    { label: 'Weekly Checklist', value: species.weekly_checklist_en },
  ].filter(s => s.value)

  if (sections.length === 0) {
    return (
      <div className="card p-6 mb-5">
        <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-1">Care Guide</p>
        <h3 className="font-serif text-lg text-forest mb-1">{species.name_en}</h3>
        <p className="font-sans text-xs italic text-ink-light">{species.species_latin}</p>
        <p className="font-sans text-sm text-ink-light mt-3">Detailed care guide coming soon for this species.</p>
      </div>
    )
  }

  return (
    <div className="card p-6 mb-5 space-y-5">
      <div>
        <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-1">Care Guide</p>
        <h3 className="font-serif text-xl text-forest">{species.name_en}</h3>
        <p className="font-sans text-xs italic text-ink-light">{species.species_latin}</p>
      </div>
      <div className="w-10 h-px bg-bonsai-pink-lt" />
      {sections.map(({ label, value }) => (
        <div key={label}>
          <p className="font-sans text-xs font-bold text-forest tracking-wide uppercase mb-1">{label}</p>
          <p className="font-sans text-sm text-ink-light leading-relaxed whitespace-pre-line">{value}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

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
  // Image state — track current URLs separately from newly added files
  const [imageUrl, setImageUrl] = useState<string | null>(tree.image_url ?? null)
  const [imageUrls, setImageUrls] = useState<string[]>(tree.image_urls ?? [])
  const [newMainFile, setNewMainFile] = useState<File | null>(null)
  const [newMainPreview, setNewMainPreview] = useState('')
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const mainFileRef = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)

  function setF(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function pickMainFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    if (!f) return
    setNewMainFile(f)
    setNewMainPreview(URL.createObjectURL(f))
    e.target.value = ''
  }

  function pickGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return
    setNewGalleryFiles(prev => [...prev, ...picked])
    setNewGalleryPreviews(prev => [...prev, ...picked.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeCurrentMain() { setImageUrl(null); setNewMainFile(null); setNewMainPreview('') }
  function removeCurrentGallery(i: number) { setImageUrls(prev => prev.filter((_, idx) => idx !== i)) }
  function removeNewGallery(i: number) {
    setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== i))
    setNewGalleryPreviews(prev => prev.filter((_, idx) => idx !== i))
  }
  function setCurrentGalleryAsCover(i: number) {
    const url = imageUrls[i]
    setImageUrls(prev => prev.filter((_, idx) => idx !== i))
    if (imageUrl) setImageUrls(prev => [imageUrl, ...prev])
    setImageUrl(url)
    setNewMainFile(null)
    setNewMainPreview('')
  }
  function setNewGalleryAsCover(i: number) {
    const file = newGalleryFiles[i]
    const preview = newGalleryPreviews[i]
    setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== i))
    setNewGalleryPreviews(prev => prev.filter((_, idx) => idx !== i))
    if (newMainFile) {
      setNewGalleryFiles(prev => [newMainFile, ...prev])
      setNewGalleryPreviews(prev => [newMainPreview, ...prev])
    } else if (imageUrl) {
      setNewGalleryFiles(prev => prev)
    }
    setNewMainFile(file)
    setNewMainPreview(preview)
    setImageUrl(null)
  }

  async function uploadFile(file: File, slug: string, prefix: string, idx: number): Promise<string> {
    const result = await optimizeTreeImage(file)
    const ext = result.file.name.split('.').pop() ?? 'jpg'
    const path = `${prefix}${Date.now()}-${idx}-${slug}.${ext}`
    const fd = new FormData()
    fd.append('file', result.file)
    fd.append('path', path)
    const up = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (!up.ok) {
      const err = await up.json().catch(() => ({}))
      throw new Error(up.status === 401 ? 'Session expired — log out and log back in.' : `Upload failed: ${err.error ?? up.status}`)
    }
    const { url } = await up.json()
    return url as string
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setUploading(true)
    setError('')
    try {
      const slug = form.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'bonsai'

      let finalMainUrl = imageUrl
      if (newMainFile) {
        finalMainUrl = await uploadFile(newMainFile, slug, '', 0)
      }

      const newGalleryUrls = await Promise.all(
        newGalleryFiles.map((file, i) => uploadFile(file, slug, 'gallery-', i))
      )

      const finalGalleryUrls = [...imageUrls, ...newGalleryUrls]

      setUploading(false)

      const res = await fetch(`/api/admin/trees/${tree.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image_url: finalMainUrl,
          image_urls: finalGalleryUrls,
        }),
      })
      if (res.ok) {
        onSaved({ ...form, image_url: finalMainUrl, image_urls: finalGalleryUrls })
        onClose()
      } else {
        setError('Save failed — are you still logged in?')
      }
    } catch {
      setError('Upload failed. Check your connection and try again.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const currentMainDisplay = newMainPreview || imageUrl
  const allCurrentGallery = imageUrls
  const allNewGallery = newGalleryPreviews

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

          {/* ── Image management ── */}
          <div className="space-y-3">
            <p className="font-sans text-sm font-semibold text-forest">Photos</p>

            {/* Main / cover image */}
            <div>
              <p className="font-sans text-xs text-ink-light mb-2">Cover image</p>
              {currentMainDisplay ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentMainDisplay} alt="Cover" className="w-full aspect-[4/3] object-cover rounded-2xl border border-forest/20" />
                  <span className="absolute top-2 left-2 bg-forest text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</span>
                  <button type="button" onClick={removeCurrentMain}
                    className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-black/80">✕</button>
                  <button type="button" onClick={() => mainFileRef.current?.click()}
                    className="absolute bottom-2 left-2 bg-forest/80 text-white font-sans text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-forest transition-colors">
                    Replace
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => mainFileRef.current?.click()}
                  className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex flex-col items-center justify-center gap-2 hover:border-forest transition-colors">
                  <span className="text-3xl">📷</span>
                  <span className="font-sans text-sm font-semibold text-forest">Add Cover Photo</span>
                </button>
              )}
              <input ref={mainFileRef} type="file" accept="image/*" onChange={pickMainFile} className="hidden" />
            </div>

            {/* Gallery */}
            {(allCurrentGallery.length > 0 || allNewGallery.length > 0) && (
              <div>
                <p className="font-sans text-xs text-ink-light mb-2">Gallery photos</p>
                <div className="grid grid-cols-4 gap-2">
                  {allCurrentGallery.map((url, i) => (
                    <div key={`cur-${i}`} className="relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover rounded-xl border border-forest/20" />
                      <button type="button" onClick={() => setCurrentGalleryAsCover(i)}
                        className="absolute bottom-1 left-1 bg-forest/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">Cover</button>
                      <button type="button" onClick={() => removeCurrentGallery(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-black/80">✕</button>
                    </div>
                  ))}
                  {allNewGallery.map((preview, i) => (
                    <div key={`new-${i}`} className="relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt={`New ${i + 1}`} className="w-full h-full object-cover rounded-xl border-2 border-forest/40" />
                      <button type="button" onClick={() => setNewGalleryAsCover(i)}
                        className="absolute bottom-1 left-1 bg-forest/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">Cover</button>
                      <button type="button" onClick={() => removeNewGallery(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-black/80">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => galleryFileRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex items-center justify-center text-2xl hover:border-forest transition-colors">+</button>
                </div>
              </div>
            )}
            {allCurrentGallery.length === 0 && allNewGallery.length === 0 && (
              <button type="button" onClick={() => galleryFileRef.current?.click()}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 font-sans text-sm font-semibold text-forest hover:border-forest transition-colors">
                + Add More Photos
              </button>
            )}
            <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={pickGalleryFiles} className="hidden" />
          </div>

          {/* ── Text fields ── */}
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

          {uploading && <p className="font-sans text-sm text-forest text-center">Compressing &amp; uploading photos…</p>}
          {error && <p className="text-bonsai-pink text-sm text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center text-sm py-3">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm py-3 disabled:opacity-60">
              {saving ? (uploading ? 'Uploading…' : 'Saving…') : 'Save Changes'}
            </button>
          </div>
        </form>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TreePageClient({ tree: initialTree, isStaff, species }: {
  tree: DbTree
  isStaff: boolean
  species?: DbSpecies | null
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

          {/* Tree info card */}
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

            {/* Custom staff notes (separate from species care guide) */}
            {tree.notes && (
              <>
                <div className="w-full h-px bg-bonsai-pink-lt/50 my-4" />
                <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-2">Staff Notes</p>
                <p className="font-sans text-sm italic text-ink-light leading-relaxed">{tree.notes}</p>
              </>
            )}
          </div>

          {/* Species care guide — only shown when linked species has data */}
          {species && <SpeciesCareGuide species={species} />}

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
