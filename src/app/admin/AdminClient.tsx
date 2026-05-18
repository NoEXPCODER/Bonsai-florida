'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { DbTree, DbSpecies } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { useMessages, useAuth } from '@/lib/i18n'

// ─── PIN Screen ───────────────────────────────────────────────────────────────

function PinScreen({ onUnlock, t }: {
  onUnlock: () => void
  t: ReturnType<typeof useMessages>['admin']
}) {
  const [pin, setPin] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, remember }),
    })

    if (res.ok) {
      onUnlock()
    } else if (res.status === 401) {
      setError(t.pinError)
      setPin('')
      inputRef.current?.focus()
    } else {
      setError('Server error — check Vercel env vars (SUPABASE_SERVICE_ROLE_KEY).')
      setPin('')
      inputRef.current?.focus()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mb-8" />

        <div className="card p-8 text-center shadow-card-lg">
          <div className="text-4xl mb-5">🌸</div>
          <h1 className="font-serif text-3xl text-forest mb-2">{t.pinTitle}</h1>
          <p className="font-sans text-sm text-ink-light mb-8">{t.pinSubtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              placeholder={t.pinPlaceholder}
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-forest/20 bg-white font-sans text-2xl text-center tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
            />

            {/* Remember device checkbox */}
            <label className="flex items-center gap-3 cursor-pointer text-left select-none">
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  remember ? 'bg-forest border-forest' : 'border-forest/30 bg-white'
                }`}
                onClick={() => setRemember(r => !r)}
              >
                {remember && <span className="text-white text-sm">✓</span>}
              </div>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="sr-only"
                aria-label={t.rememberDevice}
              />
              <div>
                <span className="font-sans text-sm font-semibold text-forest">{t.rememberDevice}</span>
                <span className="block font-sans text-xs text-ink-light">{t.rememberHint}</span>
              </div>
            </label>

            {error && <p role="alert" className="font-sans text-sm text-bonsai-pink">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-60"
            >
              {loading ? t.pinLoading : t.pinButton}
            </button>
          </form>
        </div>

        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-8" />
      </div>
    </div>
  )
}

// ─── Upload Form ──────────────────────────────────────────────────────────────

interface FormData {
  name: string; species: string; price: string; level: string
  sun: string; water: string; notes: string
  location_row: string; location_tree: string
  species_id: string
}
const DEFAULT_FORM: FormData = {
  name: '', species: '', price: '', level: 'Beginner Friendly',
  sun: 'Bright indirect light', water: 'Every 2–3 days', notes: '',
  location_row: '', location_tree: '', species_id: '',
}

// ─── Species combobox ─────────────────────────────────────────────────────────

function SpeciesCombobox({ allSpecies, locale, onSelect }: {
  allSpecies: DbSpecies[]
  locale: string
  onSelect: (s: DbSpecies | null, customName: string) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<DbSpecies | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? allSpecies.filter(s =>
        s.name_en.toLowerCase().includes(query.toLowerCase()) ||
        s.name_vi.toLowerCase().includes(query.toLowerCase()) ||
        s.species_latin.toLowerCase().includes(query.toLowerCase())
      )
    : allSpecies

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function pick(s: DbSpecies) {
    setSelected(s)
    setQuery(locale === 'vi' ? s.name_vi || s.name_en : s.name_en)
    setOpen(false)
    onSelect(s, locale === 'vi' ? s.name_vi || s.name_en : s.name_en)
  }

  function clear() {
    setSelected(null)
    setQuery('')
    onSelect(null, '')
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search species (EN or Vietnamese)…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); if (!e.target.value) { setSelected(null); onSelect(null, '') } }}
          onFocus={() => setOpen(true)}
          className="w-full px-4 py-3.5 pr-10 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
        />
        {selected && (
          <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink text-lg">✕</button>
        )}
      </div>

      {/* Selected species card */}
      {selected && (
        <div className="mt-2 px-4 py-3 bg-sage-pale rounded-2xl border border-forest/10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-sans text-sm font-bold text-forest">{selected.name_en}</p>
              <p className="font-sans text-sm text-ink-light">{selected.name_vi}</p>
              <p className="font-sans text-xs italic text-ink-light/60">{selected.species_latin}</p>
            </div>
            <span className={`font-sans text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
              selected.level === 'Beginner Friendly' ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage text-white'
            }`}>{selected.level}</span>
          </div>
          <p className="font-sans text-xs text-ink-light mt-2 italic">✓ Care details auto-filled from species database</p>
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-2xl border border-forest/10 shadow-card-lg max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-center">
              <p className="font-sans text-sm text-ink-light mb-2">No species found for &quot;{query}&quot;</p>
              <p className="font-sans text-xs text-ink-light/60">Save tree first, then add species from the species manager.</p>
            </div>
          ) : (
            filtered.map(s => (
              <button
                key={s.id}
                type="button"
                onMouseDown={() => pick(s)}
                className="w-full text-left px-4 py-3 hover:bg-sage-pale transition-colors border-b border-forest/5 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-sans text-sm font-semibold text-forest">{s.name_en}</span>
                    <span className="font-sans text-sm text-ink-light ml-2">· {s.name_vi}</span>
                    <p className="font-sans text-xs italic text-ink-light/50">{s.species_latin}</p>
                  </div>
                  <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    s.level === 'Beginner Friendly' ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage-pale text-forest'
                  }`}>{s.level === 'Beginner Friendly' ? 'Beginner' : 'Inter.'}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
const inputCls = 'w-full px-4 py-3.5 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 transition'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-sm font-semibold text-forest mb-1.5">
        {label}{required && <span className="text-bonsai-pink ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function UploadForm({ t, onSaved }: { t: ReturnType<typeof useMessages>['admin']; onSaved: (tree: DbTree) => void }) {
  const { locale } = useAuth()
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [allSpecies, setAllSpecies] = useState<DbSpecies[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/species').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAllSpecies(data)
    })
  }, [])

  function setField(k: keyof FormData, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function handleSpeciesSelect(s: DbSpecies | null, autoName: string) {
    if (!s) return
    setForm(p => ({
      ...p,
      name: autoName,
      species: s.species_latin,
      level: s.level,
      sun: locale === 'vi' ? s.sun_vi || s.sun_en : s.sun_en,
      water: locale === 'vi' ? s.water_vi || s.water_en : s.water_en,
      notes: locale === 'vi' ? s.care_vi || s.care_en : s.care_en,
      species_id: s.id,
    }))
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return
    setFiles(prev => [...prev, ...picked])
    setPreviews(prev => [...prev, ...picked.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removePhoto(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  function setPrimary(i: number) {
    setFiles(prev => { const a = [...prev]; const [f] = a.splice(i, 1); return [f, ...a] })
    setPreviews(prev => { const a = [...prev]; const [p] = a.splice(i, 1); return [p, ...a] })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving'); setErrorMsg('')
    try {
      const slug = form.name.replace(/\s+/g, '-').toLowerCase()
      const uploaded: string[] = await Promise.all(
        files.map(async (file, i) => {
          const ext = file.name.split('.').pop() ?? 'jpg'
          const path = `${Date.now()}-${i}-${slug}.${ext}`
          const { error } = await supabase.storage.from('bonsai-trees').upload(path, file, { contentType: file.type })
          if (error) throw error
          return supabase.storage.from('bonsai-trees').getPublicUrl(path).data.publicUrl
        })
      )

      const res = await fetch('/api/admin/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image_url: uploaded[0] ?? null, image_urls: uploaded }),
      })
      if (!res.ok) throw new Error('Server error')

      const saved = await res.json()
      const { data: row } = await supabase.from('bonsai_trees').select('*').eq('id', saved.id).single()
      if (row) onSaved(row)

      setStatus('success'); setForm(DEFAULT_FORM); setFiles([]); setPreviews([])
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setErrorMsg(t.submitError); setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
      <h2 className="font-serif text-2xl text-forest">{t.addTitle}</h2>
      <div className="w-10 h-px bg-bonsai-pink-lt" />

      {/* Multi-photo picker */}
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />

      {previews.length > 0 ? (
        <div className="space-y-3">
          {/* Hero photo */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previews[0]} alt="Primary" className="w-full aspect-[4/3] object-cover rounded-2xl border-2 border-forest/30" />
            <div className="absolute top-3 left-3 bg-forest text-white font-sans text-xs font-bold px-2.5 py-1 rounded-full">Cover</div>
            <button type="button" onClick={() => removePhoto(0)}
              className="absolute top-3 right-3 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-black/80">✕</button>
          </div>
          {/* Additional photos grid */}
          {previews.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {previews.slice(1).map((src, i) => (
                <div key={i} className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${i + 2}`} className="w-full h-full object-cover rounded-xl border border-forest/20" />
                  <button type="button" onClick={() => setPrimary(i + 1)}
                    className="absolute bottom-1 left-1 bg-forest/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">Cover</button>
                  <button type="button" onClick={() => removePhoto(i + 1)}
                    className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-black/80">✕</button>
                </div>
              ))}
              {/* Add more */}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex items-center justify-center text-2xl hover:border-forest transition-colors">+</button>
            </div>
          )}
          {previews.length === 1 && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 font-sans text-sm font-semibold text-forest hover:border-forest transition-colors">
              + Add More Photos
            </button>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()}
          className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex flex-col items-center justify-center gap-3 hover:border-forest transition-colors">
          <span className="text-5xl">📷</span>
          <span className="font-sans font-semibold text-forest">{t.photoButton}</span>
          <span className="font-sans text-xs text-ink-light">Tap to pick one or more photos</span>
        </button>
      )}

      {/* Species picker — auto-fills name + care */}
      <div>
        <label className="block font-sans text-sm font-semibold text-forest mb-1.5">Species <span className="font-normal text-ink-light">(auto-fills care details)</span></label>
        <SpeciesCombobox allSpecies={allSpecies} locale={locale} onSelect={handleSpeciesSelect} />
      </div>

      <Field label={t.fieldName} required>
        <input type="text" placeholder={t.fieldNamePlaceholder} value={form.name} onChange={e => setField('name', e.target.value)} className={inputCls} />
      </Field>
      <Field label={t.fieldSpecies}>
        <input type="text" placeholder={t.fieldSpeciesPlaceholder} value={form.species} onChange={e => setField('species', e.target.value)} className={inputCls} />
      </Field>
      <Field label={t.fieldPrice} required>
        <input type="text" placeholder={t.fieldPricePlaceholder} value={form.price} onChange={e => setField('price', e.target.value)} className={inputCls} required />
      </Field>
      <Field label={t.fieldLevel}>
        <select value={form.level} onChange={e => setField('level', e.target.value)} className={inputCls}>
          <option value="Beginner Friendly">{t.levelBeginner}</option>
          <option value="Intermediate">{t.levelIntermediate}</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t.fieldSun}>
          <input type="text" placeholder={t.fieldSunPlaceholder} value={form.sun} onChange={e => setField('sun', e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.fieldWater}>
          <input type="text" placeholder={t.fieldWaterPlaceholder} value={form.water} onChange={e => setField('water', e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label={t.fieldNotes}>
        <textarea placeholder={t.fieldNotesPlaceholder} value={form.notes} onChange={e => setField('notes', e.target.value)} rows={2} className={inputCls + ' resize-none'} />
      </Field>

      {/* Location — optional */}
      <div className="rounded-2xl border border-forest/10 bg-sage-pale/40 px-4 py-4 space-y-3">
        <p className="font-sans text-sm font-semibold text-forest">📍 Garden Location <span className="text-ink-light font-normal">(optional)</span></p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-sans text-xs text-ink-light mb-1">Row</label>
            <input type="text" placeholder="e.g. A or 3" value={form.location_row} onChange={e => setField('location_row', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block font-sans text-xs text-ink-light mb-1">Tree #</label>
            <input type="text" placeholder="e.g. 7" value={form.location_tree} onChange={e => setField('location_tree', e.target.value)} className={inputCls} />
          </div>
        </div>
        <p className="font-sans text-xs text-ink-light/70">Helps you find the tree in the garden. Not shown publicly.</p>
      </div>

      {status === 'success' && <p className="font-sans text-sm font-semibold text-forest bg-sage-pale px-4 py-3 rounded-2xl text-center">✅ {t.submitSuccess}</p>}
      {status === 'error' && <p className="font-sans text-sm text-bonsai-pink bg-bonsai-pink-pale px-4 py-3 rounded-2xl text-center">{errorMsg}</p>}

      <button type="submit" disabled={status === 'saving'} className="btn-primary w-full justify-center text-lg py-5 disabled:opacity-60">
        {status === 'saving' ? t.submitting : t.submitButton}
      </button>
    </form>
  )
}

// ─── Tree List ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type SortKey = 'created_at' | 'name' | 'price' | 'level'
type SortDir = 'asc' | 'desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'created_at', label: 'Date Added' },
  { key: 'name',       label: 'Name' },
  { key: 'price',      label: 'Price' },
  { key: 'level',      label: 'Level' },
]

function sortTrees(trees: DbTree[], key: SortKey, dir: SortDir): DbTree[] {
  return [...trees].sort((a, b) => {
    let av: string = a[key] ?? ''
    let bv: string = b[key] ?? ''
    if (key === 'price') {
      av = String(parseFloat(av.replace(/[^0-9.]/g, '')) || 0)
      bv = String(parseFloat(bv.replace(/[^0-9.]/g, '')) || 0)
      return dir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av)
    }
    return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })
}

function exportCSV(trees: DbTree[], baseUrl: string) {
  const rows = [
    ['Code', 'Name', 'Species', 'Price', 'Level', 'Date Added', 'URL'],
    ...trees.map(tree => [
      tree.tree_code ?? '',
      tree.name,
      tree.species ?? '',
      tree.price,
      tree.level,
      formatDate(tree.created_at),
      tree.tree_code ? `${baseUrl}/tree/${tree.tree_code}` : '',
    ]),
  ]
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `bonsai-inventory-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
}

function TreeList({ trees, t, onDelete, onBulkDelete }: {
  trees: DbTree[]
  t: ReturnType<typeof useMessages>['admin']
  onDelete: (id: string) => void
  onBulkDelete: (ids: string[], trees: DbTree[]) => void
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const sorted = sortTrees(trees, sortKey, sortDir)
  const allSelected = sorted.length > 0 && selected.size === sorted.length
  const someSelected = selected.size > 0

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(sorted.map(t => t.id)))
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function handleBulkDelete() {
    const selectedTrees = trees.filter(t => selected.has(t.id))
    if (!window.confirm(`Mark ${selected.size} tree${selected.size > 1 ? 's' : ''} as sold?`)) return
    onBulkDelete([...selected], selectedTrees)
    setSelected(new Set())
  }

  function handleBulkExport() {
    const selectedTrees = sorted.filter(t => selected.has(t.id))
    exportCSV(selectedTrees, baseUrl)
  }

  if (trees.length === 0) {
    return (
      <div>
        <h2 className="font-serif text-2xl text-forest mb-5">{t.listTitle}</h2>
        <p className="font-sans text-ink-light text-center py-10">{t.listEmpty}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-forest">{t.listTitle}</h2>
        <button
          type="button"
          onClick={() => exportCSV(sorted, baseUrl)}
          className="font-sans text-xs font-bold text-forest border border-forest/20 px-3 py-2 rounded-xl hover:bg-sage-pale transition-colors"
        >
          Export All
        </button>
      </div>

      {/* Sort bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleSort(key)}
            className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-colors ${
              sortKey === key
                ? 'bg-forest text-white border-forest'
                : 'text-ink-light border-forest/20 hover:bg-sage-pale'
            }`}
          >
            {label} {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 bg-forest text-white px-4 py-3 rounded-2xl mb-4">
          <span className="font-sans text-sm font-semibold flex-1">{selected.size} selected</span>
          <button
            type="button"
            onClick={handleBulkExport}
            className="font-sans text-xs font-bold border border-white/40 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleBulkDelete}
            className="font-sans text-xs font-bold bg-bonsai-pink px-3 py-1.5 rounded-lg hover:bg-bonsai-pink/80 transition-colors"
          >
            Mark Sold
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="font-sans text-xs text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Select all row */}
      <label className="flex items-center gap-3 px-1 mb-3 cursor-pointer select-none">
        <div
          onClick={toggleAll}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            allSelected ? 'bg-forest border-forest' : 'border-forest/30 bg-white'
          }`}
        >
          {allSelected && <span className="text-white text-xs">✓</span>}
          {!allSelected && someSelected && <span className="text-forest text-xs">—</span>}
        </div>
        <span className="font-sans text-xs text-ink-light">
          {allSelected ? 'Deselect all' : `Select all (${sorted.length})`}
        </span>
      </label>

      {/* Tree cards */}
      <div className="space-y-3">
        {sorted.map(tree => {
          const isSelected = selected.has(tree.id)
          const primaryImage = getPrimaryTreeImageUrl(tree)
          return (
            <div
              key={tree.id}
              className={`card p-4 space-y-3 transition-colors ${isSelected ? 'ring-2 ring-forest/40 bg-sage-pale/30' : ''}`}
            >
              <div className="flex gap-3 items-start">
                {/* Checkbox */}
                <div
                  onClick={() => toggleOne(tree.id)}
                  className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
                    isSelected ? 'bg-forest border-forest' : 'border-forest/30 bg-white'
                  }`}
                >
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-sage-pale border border-forest/10">
                  {primaryImage
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={primaryImage} alt={tree.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base text-forest leading-tight">{tree.name}</p>
                  {tree.species && <p className="font-sans text-xs italic text-ink-light">{tree.species}</p>}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                    <span className="font-sans text-sm font-bold text-bonsai-pink">{tree.price}</span>
                    <span className="font-sans text-xs text-ink-light">{tree.level}</span>
                    {tree.tree_code && <span className="font-mono text-xs text-ink-light/60">{tree.tree_code}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-3 mt-0.5">
                    <p className="font-sans text-xs text-ink-light/50">Added {formatDate(tree.created_at)}</p>
                    {!primaryImage && (
                      <p className="font-sans text-xs font-semibold text-bonsai-pink">Needs image</p>
                    )}
                    {(tree.location_row || tree.location_tree) && (
                      <p className="font-sans text-xs text-sage font-semibold">
                        📍 {[tree.location_row && `Row ${tree.location_row}`, tree.location_tree && `#${tree.location_tree}`].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Single delete */}
                <button
                  onClick={() => onDelete(tree.id)}
                  className="flex-shrink-0 bg-bonsai-pink-pale border border-bonsai-pink/30 text-bonsai-pink font-sans text-xs font-bold px-3 py-2 rounded-xl hover:bg-bonsai-pink hover:text-white transition-colors"
                >
                  {t.deleteButton}
                </button>
              </div>

              {/* QR row */}
              {tree.tree_code && (
                <div className="flex items-center gap-3 bg-sage-pale/60 rounded-xl px-3 py-2">
                  <span className="text-lg">📱</span>
                  <p className="font-sans text-xs font-mono text-forest truncate flex-1">{baseUrl}/tree/{tree.tree_code}</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(`${baseUrl}/tree/${tree.tree_code}`)}
                    className="flex-shrink-0 font-sans text-xs font-bold text-forest border border-forest/20 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    {t.qrCopy}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Admin Client ────────────────────────────────────────────────────────

export default function AdminClient({ initialAuth }: { initialAuth: boolean }) {
  const m = useMessages()
  const t = m.admin
  const router = useRouter()

  const [isAuth, setIsAuth] = useState(initialAuth)
  const [trees, setTrees] = useState<DbTree[]>([])
  const [loadingTrees, setLoadingTrees] = useState(false)

  useEffect(() => {
    if (isAuth) fetchTrees()
  }, [isAuth])

  async function fetchTrees() {
    setLoadingTrees(true)
    const { data } = await supabase
      .from('bonsai_trees')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    setTrees(data ?? [])
    setLoadingTrees(false)
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t.deleteConfirm)) return
    const res = await fetch(`/api/admin/trees/${id}`, { method: 'DELETE' })
    const result = await res.json().catch(() => null)
    if (result?.cleanupError) console.warn(result.cleanupError)
    setTrees(p => p.filter(t => t.id !== id))
  }

  async function handleBulkDelete(ids: string[]) {
    const results = await Promise.all(ids.map(id => fetch(`/api/admin/trees/${id}`, { method: 'DELETE' })))
    const cleanupResults = await Promise.all(results.map(res => res.json().catch(() => null)))
    if (cleanupResults.some(result => result?.cleanupError)) {
      console.warn('Some uploaded images could not be deleted.')
    }
    setTrees(p => p.filter(t => !ids.includes(t.id)))
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    setIsAuth(false)
  }

  if (!isAuth) {
    return <PinScreen onUnlock={() => setIsAuth(true)} t={t} />
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

      {/* Header */}
      <header className="bg-forest text-white">
        {/* Top row: brand + lock */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌸</span>
            <div>
              <p className="font-serif font-bold tracking-wide text-sm">Bonsai Florida</p>
              <p className="font-sans text-[10px] text-white/50 tracking-widest uppercase">{t.pageTitle}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="font-sans text-xs font-semibold bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            🔒 {t.logout}
          </button>
        </div>
        {/* Nav strip */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { label: '🌿 Collection', path: '/trees' },
            { label: '🏠 Site', path: '/' },
            { label: `📱 ${t.devicesLink}`, path: '/admin/devices' },
          ].map(({ label, path }) => (
            <button key={path} onClick={() => router.push(path)}
              className="flex-shrink-0 font-sans text-xs text-white/70 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <p className="font-sans text-ink-light text-center">{t.pageSubtitle}</p>
        <UploadForm t={t} onSaved={tree => setTrees(p => [tree, ...p])} />
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-forest/10" />
          <span className="font-sans text-xs text-ink-light tracking-widest uppercase">
            {loadingTrees ? '…' : `${trees.length} trees`}
          </span>
          <div className="flex-1 h-px bg-forest/10" />
        </div>
        <TreeList trees={trees} t={t} onDelete={handleDelete} onBulkDelete={handleBulkDelete} />
      </main>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-10" />
    </div>
  )
}
