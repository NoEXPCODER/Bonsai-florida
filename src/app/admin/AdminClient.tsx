'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DbTree, DbSpecies } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { getSpeciesLatin } from '@/lib/species'
import { optimizeTreeImage } from '@/lib/image-optimizer'
import { useMessages, useAuth } from '@/lib/i18n'

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onUnlock }: { onUnlock: () => void }) {
  const t = useMessages().admin
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { usernameRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, remember }),
    })

    if (res.ok) {
      onUnlock()
    } else if (res.status === 401) {
      setError(t.errorInvalid)
      setPassword('')
    } else if (res.status === 429) {
      setError(t.errorTooMany)
    } else {
      setError(t.errorServer)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mb-8" />

        <div className="card p-8 text-center shadow-card-lg">
          <div className="text-4xl mb-5">🌸</div>
          <h1 className="font-serif text-3xl text-forest mb-2">{t.loginTitle}</h1>
          <p className="font-sans text-sm text-ink-light mb-8">{t.loginSubtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={usernameRef}
              type="text"
              autoComplete="username"
              placeholder={t.usernamePlaceholder}
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-forest/20 bg-white font-sans text-base focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
            />
            <input
              type="password"
              autoComplete="current-password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-forest/20 bg-white font-sans text-base focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
            />

            {/* Remember device */}
            <label className="flex items-center gap-3 cursor-pointer text-left select-none pt-1">
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  remember ? 'bg-forest border-forest' : 'border-forest/30 bg-white'
                }`}
                onClick={() => setRemember(r => !r)}
              >
                {remember && <span className="text-white text-sm">✓</span>}
              </div>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="sr-only" />
              <div>
                <span className="font-sans text-sm font-semibold text-forest">{t.rememberDevice}</span>
                <span className="block font-sans text-xs text-ink-light">{t.rememberHint}</span>
              </div>
            </label>

            {error && <p role="alert" className="font-sans text-sm text-bonsai-pink">{error}</p>}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-60"
            >
              {loading ? t.signingIn : t.signIn}
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
        getSpeciesLatin(s).toLowerCase().includes(query.toLowerCase())
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
              <p className="font-sans text-xs italic text-ink-light/60">{getSpeciesLatin(selected)}</p>
            </div>
            <span className={`font-sans text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
              selected.level === 'Beginner Friendly' ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage text-white'
            }`}>{selected.level}</span>
          </div>
          <div className="mt-2 space-y-1 rounded-xl bg-white/70 px-3 py-2">
            <p className="font-sans text-xs text-ink-light">
              <strong className="text-forest">Light:</strong> {locale === 'vi' ? selected.light_vi || selected.light_en || selected.sun_vi || selected.sun_en : selected.light_en || selected.sun_en}
            </p>
            <p className="font-sans text-xs text-ink-light">
              <strong className="text-forest">Water:</strong> {locale === 'vi' ? selected.watering_vi || selected.watering_en || selected.water_vi || selected.water_en : selected.watering_en || selected.water_en}
            </p>
          </div>
          <p className="font-sans text-xs text-ink-light mt-2 italic">Care guide stays linked by species. Staff notes stay tree-specific.</p>
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
                    <p className="font-sans text-xs italic text-ink-light/50">{getSpeciesLatin(s)}</p>
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
  const [speciesLoading, setSpeciesLoading] = useState(true)
  // Force combobox remount on form reset so its internal query/selection is cleared
  const [comboboxKey, setComboboxKey] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/species')
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json() })
      .then(data => { if (Array.isArray(data)) setAllSpecies(data) })
      .catch(() => { /* species search still works, just empty */ })
      .finally(() => setSpeciesLoading(false))
  }, [])

  function setField(k: keyof FormData, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function handleSpeciesSelect(s: DbSpecies | null, _autoName: string) {
    if (!s) return
    setForm(p => {
      const isDefaultSun = p.sun === DEFAULT_FORM.sun || p.sun === ''
      const isDefaultWater = p.water === DEFAULT_FORM.water || p.water === ''
      const sun = locale === 'vi' ? s.light_vi || s.light_en || s.sun_vi || s.sun_en : s.light_en || s.sun_en
      const water = locale === 'vi' ? s.watering_vi || s.watering_en || s.water_vi || s.water_en : s.watering_en || s.water_en
      return {
        ...p,
        name: p.name || s.name_en,             // always English, fill only if empty
        species: p.species || getSpeciesLatin(s), // fill only if empty
        level: s.level,                        // always match species
        sun: isDefaultSun ? sun : p.sun,       // fill only if unchanged from default
        water: isDefaultWater ? water : p.water,
        // tree.notes is for custom admin notes; species care guide is shown separately on tree page
        species_id: s.id,
      }
    })
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
      const slug = form.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'bonsai'
      const uploaded: string[] = await Promise.all(
        files.map(async (file, i) => {
          const result = await optimizeTreeImage(file)
          const ext = result.file.name.split('.').pop() ?? 'jpg'
          const path = `${Date.now()}-${i}-${slug}.${ext}`
          const fd = new FormData()
          fd.append('file', result.file)
          fd.append('path', path)
          const up = await fetch('/api/admin/upload', { method: 'POST', body: fd })
          if (!up.ok) {
            const err = await up.json().catch(() => ({}))
            throw new Error(`Photo upload failed: ${err.error ?? up.status}`)
          }
          const { url } = await up.json()
          return url as string
        })
      )

      const res = await fetch('/api/admin/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image_url: uploaded[0] ?? null, image_urls: uploaded }),
      })
      if (res.status === 401) throw new Error('Session expired — please log out and log in again.')
      if (!res.ok) throw new Error(`Save failed (${res.status}) — check Vercel env vars (SUPABASE_SERVICE_ROLE_KEY).`)

      const saved = await res.json()
      // Fetch the full row via API to avoid relying on the anon client
      const treeRes = await fetch(`/api/admin/trees?id=${saved.id}`)
      if (treeRes.ok) {
        const row = await treeRes.json()
        if (row) onSaved(row)
      }

      setStatus('success'); setForm(DEFAULT_FORM); setFiles([]); setPreviews([])
      setComboboxKey(k => k + 1)
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.submitError)
      setStatus('error')
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
        <label className="block font-sans text-sm font-semibold text-forest mb-1.5">
          Species <span className="font-normal text-ink-light">(auto-fills care details)</span>
          {speciesLoading && <span className="font-normal text-ink-light/60 ml-2 text-xs">Loading…</span>}
        </label>
        <SpeciesCombobox key={comboboxKey} allSpecies={allSpecies} locale={locale} onSelect={handleSpeciesSelect} />
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

// ─── Edit Tree Modal ──────────────────────────────────────────────────────────

function EditTreeModal({ tree, onClose, onSaved }: {
  tree: DbTree
  onClose: () => void
  onSaved: (id: string, updates: Partial<DbTree>) => void
}) {
  const { locale } = useAuth()
  const [form, setForm] = useState({
    name: tree.name,
    species: tree.species ?? '',
    price: tree.price,
    level: tree.level,
    status: tree.status ?? 'active',
    sun: tree.sun,
    water: tree.water,
    notes: tree.notes ?? '',
    location_row: tree.location_row ?? '',
    location_tree: tree.location_tree ?? '',
    species_id: tree.species_id ?? '',
  })
  const [imageUrl, setImageUrl] = useState<string | null>(tree.image_url ?? null)
  const [imageUrls, setImageUrls] = useState<string[]>(tree.image_urls ?? [])
  const [newMainFile, setNewMainFile] = useState<File | null>(null)
  const [newMainPreview, setNewMainPreview] = useState('')
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([])
  const [allSpecies, setAllSpecies] = useState<DbSpecies[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [comboboxKey, setComboboxKey] = useState(0)

  const mainRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/species')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setAllSpecies(data) })
      .catch(() => {})
  }, [])

  function setF(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function handleSpeciesSelect(s: DbSpecies | null, _autoName: string) {
    if (!s) return
    setForm(p => ({ ...p, species: getSpeciesLatin(s), species_id: s.id }))
    setComboboxKey(k => k + 1)
  }

  function pickMainFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    if (!f) return
    setNewMainFile(f); setNewMainPreview(URL.createObjectURL(f)); e.target.value = ''
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
      throw new Error(up.status === 401 ? 'Session expired.' : `Upload failed: ${err.error ?? up.status}`)
    }
    return (await up.json()).url as string
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setUploading(true); setError('')
    try {
      const slug = form.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'bonsai'
      let finalMainUrl = imageUrl
      if (newMainFile) finalMainUrl = await uploadFile(newMainFile, slug, '', 0)
      const newGalleryUrls = await Promise.all(newGalleryFiles.map((file, i) => uploadFile(file, slug, 'gallery-', i)))
      setUploading(false)

      const updates: Partial<DbTree> = {
        name: form.name,
        species: form.species || null,
        price: form.price,
        level: form.level,
        status: form.status,
        sun: form.sun,
        water: form.water,
        notes: form.notes || null,
        location_row: form.location_row || null,
        location_tree: form.location_tree || null,
        species_id: form.species_id || null,
        image_url: finalMainUrl,
        image_urls: [...imageUrls, ...newGalleryUrls],
      }

      const res = await fetch(`/api/admin/trees/${tree.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Save failed — check your session.')
      onSaved(tree.id, updates)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setSaving(false); setUploading(false)
    }
  }

  const mainDisplay = newMainPreview || imageUrl

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-cream-light rounded-3xl shadow-card-lg overflow-hidden">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-forest">Edit — {tree.name}</h2>
            <button type="button" onClick={onClose} className="text-ink-light hover:text-ink text-xl">✕</button>
          </div>

          {/* Species picker */}
          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1.5">
              Species <span className="font-normal text-ink-light">(auto-fills latin name)</span>
            </label>
            <SpeciesCombobox key={comboboxKey} allSpecies={allSpecies} locale={locale} onSelect={handleSpeciesSelect} />
          </div>

          {/* Cover photo */}
          <div>
            <p className="font-sans text-sm font-semibold text-forest mb-2">Cover Photo</p>
            {mainDisplay ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mainDisplay} alt="Cover" className="w-full aspect-[4/3] object-cover rounded-2xl border border-forest/20" />
                <span className="absolute top-2 left-2 bg-forest text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</span>
                <button type="button" onClick={removeCurrentMain} className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/80">✕</button>
                <button type="button" onClick={() => mainRef.current?.click()} className="absolute bottom-2 left-2 bg-forest/80 text-white font-sans text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-forest transition-colors">Replace</button>
              </div>
            ) : (
              <button type="button" onClick={() => mainRef.current?.click()} className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex flex-col items-center justify-center gap-2 hover:border-forest transition-colors">
                <span className="text-3xl">📷</span>
                <span className="font-sans text-sm font-semibold text-forest">Add Cover Photo</span>
              </button>
            )}
            <input ref={mainRef} type="file" accept="image/*" onChange={pickMainFile} className="hidden" />
          </div>

          {/* Gallery */}
          <div>
            <p className="font-sans text-xs text-ink-light mb-2">Gallery photos</p>
            <div className="grid grid-cols-4 gap-2">
              {imageUrls.map((url, i) => (
                <div key={`c-${i}`} className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-forest/20" />
                  <button type="button" onClick={() => removeCurrentGallery(i)} className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-black/80">✕</button>
                </div>
              ))}
              {newGalleryPreviews.map((url, i) => (
                <div key={`n-${i}`} className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl border-2 border-forest/40" />
                  <button type="button" onClick={() => removeNewGallery(i)} className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-black/80">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => galleryRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex items-center justify-center text-2xl hover:border-forest transition-colors">+</button>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple onChange={pickGalleryFiles} className="hidden" />
          </div>

          {/* Text fields */}
          {([
            { label: 'Name', key: 'name' as const },
            { label: 'Species (Latin)', key: 'species' as const },
            { label: 'Price', key: 'price' as const },
            { label: 'Sun', key: 'sun' as const },
            { label: 'Water', key: 'water' as const },
          ] as { label: string; key: keyof typeof form }[]).map(({ label, key }) => (
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
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Status</label>
            <select value={form.status} onChange={e => setF('status', e.target.value)} className={inputCls}>
              <option value="active">Active — available for sale</option>
              <option value="reserved">Reserved</option>
              <option value="in_training">In Training</option>
              <option value="in_work">In Work</option>
            </select>
          </div>

          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Staff Notes</label>
            <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2} className={inputCls + ' resize-none'} />
          </div>

          {/* Garden location */}
          <div className="rounded-2xl border border-forest/10 bg-sage-pale/40 px-4 py-4 space-y-3">
            <p className="font-sans text-sm font-semibold text-forest">📍 Garden Location</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-sans text-xs text-ink-light mb-1">Row</label>
                <input type="text" value={form.location_row} onChange={e => setF('location_row', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block font-sans text-xs text-ink-light mb-1">Tree #</label>
                <input type="text" value={form.location_tree} onChange={e => setF('location_tree', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {uploading && <p className="font-sans text-sm text-forest text-center animate-pulse">Uploading photos…</p>}
          {error && <p className="font-sans text-sm text-bonsai-pink text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3 disabled:opacity-60">
              {saving ? (uploading ? 'Uploading…' : 'Saving…') : 'Save Changes'}
            </button>
          </div>
        </form>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>
    </div>
  )
}

// ─── Tree List ────────────────────────────────────────────────────────────────

function TreeList({ trees, t, onDelete, onBulkDelete, onEdit, onBulkQrPrint }: {
  trees: DbTree[]
  t: ReturnType<typeof useMessages>['admin']
  onDelete: (tree: DbTree) => void
  onBulkDelete: (ids: string[], trees: DbTree[]) => void
  onEdit: (tree: DbTree) => void
  onBulkQrPrint: (trees: DbTree[]) => void
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

  function handleBulkQrPrint() {
    const selectedTrees = sorted.filter(t => selected.has(t.id))
    onBulkQrPrint(selectedTrees)
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
            onClick={handleBulkQrPrint}
            className="font-sans text-xs font-bold border border-white/40 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            🏷 QR Tags
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
                {tree.tree_code ? (
                  <a href={`/tree/${tree.tree_code}`} target="_blank" rel="noopener noreferrer"
                    className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-sage-pale border border-forest/10 block hover:opacity-80 transition-opacity">
                    {primaryImage
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={primaryImage} alt={tree.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
                  </a>
                ) : (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-sage-pale border border-forest/10">
                    {primaryImage
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={primaryImage} alt={tree.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {tree.tree_code ? (
                    <a href={`/tree/${tree.tree_code}`} target="_blank" rel="noopener noreferrer"
                      className="font-serif text-base text-forest leading-tight hover:underline">
                      {tree.name}
                    </a>
                  ) : (
                    <p className="font-serif text-base text-forest leading-tight">{tree.name}</p>
                  )}
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

                {/* Actions */}
                <div className="flex-shrink-0 flex flex-col gap-1.5">
                  <button
                    onClick={() => onEdit(tree)}
                    className="bg-sage-pale border border-forest/20 text-forest font-sans text-xs font-bold px-3 py-2 rounded-xl hover:bg-sage hover:text-white transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(tree)}
                    className="bg-bonsai-pink-pale border border-bonsai-pink/30 text-bonsai-pink font-sans text-xs font-bold px-3 py-2 rounded-xl hover:bg-bonsai-pink hover:text-white transition-colors"
                  >
                    {t.deleteButton}
                  </button>
                </div>
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

interface BuyerBooking {
  id: string
  name: string
  phone: string
  email: string | null
  reason: string
  created_at: string
}

interface BuyerInfo {
  buyer_booking_id: string | null
  buyer_name: string | null
  buyer_phone: string | null
  buyer_email: string | null
}

function MarkSoldModal({ tree, t, onClose, onSold }: {
  tree: DbTree
  t: ReturnType<typeof useMessages>['admin']
  onClose: () => void
  onSold: (tree: DbTree, soldImageUrl: string | null, soldNote: string, buyer: BuyerInfo) => Promise<void>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [buyerQuery, setBuyerQuery] = useState('')
  const [buyerResults, setBuyerResults] = useState<BuyerBooking[]>([])
  const [buyerSearching, setBuyerSearching] = useState(false)
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerBooking | null>(null)

  useEffect(() => {
    if (buyerQuery.length < 2 || selectedBuyer) { setBuyerResults([]); return }
    setBuyerSearching(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/bookings/search?q=${encodeURIComponent(buyerQuery)}`)
        const data = res.ok ? await res.json() : []
        setBuyerResults(Array.isArray(data) ? data : [])
      } catch {
        setBuyerResults([])
      } finally {
        setBuyerSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [buyerQuery, selectedBuyer])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null
    setFile(picked)
    setPreview(picked ? URL.createObjectURL(picked) : '')
    e.target.value = ''
  }

  async function uploadSoldPhoto(): Promise<string | null> {
    if (!file) return null
    const ext = file.name.split('.').pop() ?? 'jpg'
    const slug = tree.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'sold'
    const path = `sold/${Date.now()}-${tree.id}-${slug}.${ext}`
    const fd = new FormData()
    fd.append('file', file)
    fd.append('path', path)
    const up = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (!up.ok) throw new Error('Upload failed')
    const { url } = await up.json()
    return url as string
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const soldImageUrl = await uploadSoldPhoto()
      const buyer: BuyerInfo = selectedBuyer
        ? { buyer_booking_id: selectedBuyer.id, buyer_name: selectedBuyer.name, buyer_phone: selectedBuyer.phone, buyer_email: selectedBuyer.email }
        : { buyer_booking_id: null, buyer_name: null, buyer_phone: null, buyer_email: null }
      await onSold(tree, soldImageUrl, note, buyer)
      onClose()
    } catch {
      setError(t.soldSaveError)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-cream-light rounded-3xl shadow-card-lg overflow-hidden">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label mb-1">{t.soldModalLabel}</p>
              <h2 className="font-serif text-2xl text-forest">{tree.name}</h2>
            </div>
            <button type="button" onClick={onClose} className="text-ink-light hover:text-ink text-xl">x</button>
          </div>

          <label className="block">
            <span className="block font-sans text-sm font-semibold text-forest mb-2">{t.soldPhotoLabel}</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="sold-photo-input" />
            <span
              onClick={() => document.getElementById('sold-photo-input')?.click()}
              className="block cursor-pointer rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 overflow-hidden"
            >
              {preview
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={preview} alt="Sold customer preview" className="w-full aspect-[4/3] object-cover" />
                : <span className="flex aspect-[4/3] items-center justify-center text-center font-sans text-sm font-semibold text-forest px-6">{t.soldPhotoHelp}</span>}
            </span>
          </label>

          <label className="block">
            <span className="block font-sans text-sm font-semibold text-forest mb-2">{t.soldNoteLabel}</span>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={t.soldNotePlaceholder}
              rows={3}
              className={inputCls + ' resize-none'}
            />
          </label>

          {/* Buyer search */}
          <div>
            <span className="block font-sans text-sm font-semibold text-forest mb-2">{t.soldBuyerLabel}</span>
            {selectedBuyer ? (
              <div className="flex items-start justify-between gap-3 bg-sage-pale rounded-2xl px-4 py-3">
                <div>
                  <p className="font-sans text-xs font-semibold text-forest mb-0.5">{t.soldBuyerLinked}</p>
                  <p className="font-sans text-sm text-ink font-bold">{selectedBuyer.name}</p>
                  <p className="font-sans text-xs text-ink-light">{selectedBuyer.phone}</p>
                  {selectedBuyer.email && <p className="font-sans text-xs text-ink-light">{selectedBuyer.email}</p>}
                  <p className="font-sans text-[10px] text-ink-light/60 mt-0.5 italic">{selectedBuyer.reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedBuyer(null); setBuyerQuery('') }}
                  className="font-sans text-xs text-ink-light hover:text-forest flex-shrink-0 mt-0.5"
                >
                  {t.soldBuyerClear}
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.soldBuyerSearch}
                  value={buyerQuery}
                  onChange={e => setBuyerQuery(e.target.value)}
                  className={inputCls}
                  autoComplete="off"
                />
                {buyerSearching && (
                  <p className="font-sans text-xs text-ink-light/60 mt-1.5 px-1">{t.soldBuyerSearching}</p>
                )}
                {!buyerSearching && buyerQuery.length >= 2 && buyerResults.length === 0 && (
                  <p className="font-sans text-xs text-ink-light/60 mt-1.5 px-1">{t.soldBuyerNone}</p>
                )}
                {buyerResults.length > 0 && (
                  <div className="mt-1 bg-white rounded-2xl border border-forest/10 shadow-card-lg overflow-hidden">
                    {buyerResults.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onMouseDown={() => { setSelectedBuyer(b); setBuyerQuery(''); setBuyerResults([]) }}
                        className="w-full text-left px-4 py-3 hover:bg-sage-pale transition-colors border-b border-forest/5 last:border-0"
                      >
                        <p className="font-sans text-sm font-semibold text-forest">{b.name}</p>
                        <p className="font-sans text-xs text-ink-light">{b.phone}{b.email ? ` \u00b7 ${b.email}` : ''}</p>
                        <p className="font-sans text-[10px] text-ink-light/60 italic">{b.reason}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <p className="font-sans text-sm text-bonsai-pink text-center">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center text-sm py-3">
              {t.soldCancel}
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm py-3 disabled:opacity-60">
              {saving ? t.soldSaving : t.soldConfirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SoldTreeList({ trees, t }: {
  trees: DbTree[]
  t: ReturnType<typeof useMessages>['admin']
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const sorted = sortTrees(trees, 'created_at', 'desc')

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-forest">{t.soldListTitle}</h2>
        <span className="font-sans text-xs font-bold text-ink-light bg-sage-pale px-3 py-1.5 rounded-full">
          {trees.length} {trees.length === 1 ? 'tree' : 'trees'}
        </span>
      </div>

      {trees.length === 0 ? (
        <p className="font-sans text-ink-light text-center py-8">{t.soldListEmpty}</p>
      ) : (
        <div className="space-y-3">
          {sorted.map(tree => {
            const primaryImage = getPrimaryTreeImageUrl(tree)
            return (
              <div key={tree.id} className="card p-4 opacity-90 border-sage/30">
                <div className="flex gap-3 items-start">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-sage-pale border border-forest/10 grayscale">
                    {primaryImage
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={primaryImage} alt={tree.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-serif text-base text-forest leading-tight">{tree.name}</p>
                      <span className="font-sans text-[10px] font-bold tracking-widest uppercase bg-bonsai-pink-pale text-bonsai-pink px-2 py-0.5 rounded-full">
                        {t.soldBadge}
                      </span>
                    </div>
                    {tree.species && <p className="font-sans text-xs italic text-ink-light">{tree.species}</p>}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                      <span className="font-sans text-sm font-bold text-bonsai-pink">{tree.price}</span>
                      <span className="font-sans text-xs text-ink-light">{tree.level}</span>
                      {tree.tree_code && <span className="font-mono text-xs text-ink-light/60">{tree.tree_code}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 mt-0.5">
                      <p className="font-sans text-xs text-ink-light/50">Added {formatDate(tree.created_at)}</p>
                      {tree.tree_code && (
                        <p className="font-sans text-xs font-mono text-ink-light/60 truncate">
                          {baseUrl}/tree/{tree.tree_code}
                        </p>
                      )}
                    </div>
                    {tree.buyer_name && (
                      <div className="mt-2 bg-sage-pale/60 rounded-xl px-3 py-2">
                        <p className="font-sans text-[10px] font-semibold text-forest/60 uppercase tracking-wide mb-0.5">Buyer</p>
                        <p className="font-sans text-xs font-bold text-forest">{tree.buyer_name}</p>
                        {tree.buyer_phone && <p className="font-sans text-xs text-ink-light">{tree.buyer_phone}</p>}
                        {tree.buyer_email && <p className="font-sans text-xs text-ink-light">{tree.buyer_email}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
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
  const [soldTree, setSoldTree] = useState<DbTree | null>(null)
  const [editTree, setEditTree] = useState<DbTree | null>(null)
  const [loadingTrees, setLoadingTrees] = useState(false)
  const activeTrees = trees.filter(tree => tree.is_active)
  const soldTrees = trees.filter(tree => !tree.is_active)

  useEffect(() => {
    if (isAuth) fetchTrees()
  }, [isAuth])

  async function fetchTrees() {
    setLoadingTrees(true)
    const res = await fetch('/api/admin/trees/list').catch(() => null)
    const data = res?.ok ? await res.json() : []
    setTrees(Array.isArray(data) ? data : [])
    setLoadingTrees(false)
  }

  async function handleDelete(tree: DbTree) {
    setSoldTree(tree)
  }

  async function markTreeSold(tree: DbTree, soldImageUrl: string | null, soldNote: string, buyer: BuyerInfo) {
    const res = await fetch(`/api/admin/trees/${tree.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sold_image_url: soldImageUrl, sold_note: soldNote, ...buyer }),
    })
    if (!res.ok) return
    const soldAt = new Date().toISOString()
    setTrees(p => p.map(item => item.id === tree.id
      ? { ...item, is_active: false, sold_image_url: soldImageUrl, sold_note: soldNote || null, sold_at: soldAt, ...buyer }
      : item
    ))
  }

  async function handleBulkDelete(ids: string[]) {
    const results = await Promise.all(ids.map(id => fetch(`/api/admin/trees/${id}`, { method: 'DELETE' })))
    const soldIds = new Set(ids.filter((_, i) => results[i]?.ok))
    setTrees(p => p.map(tree => soldIds.has(tree.id) ? { ...tree, is_active: false } : tree))
  }

  function handleTreeSaved(id: string, updates: Partial<DbTree>) {
    setTrees(p => p.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  function handleBulkQrPrint(selectedTrees: DbTree[]) {
    const ids = selectedTrees.map(t => t.id).join(',')
    router.push(`/admin/qr-tags?ids=${ids}`)
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    setIsAuth(false)
  }

  if (!isAuth) {
    return <LoginScreen onUnlock={() => setIsAuth(true)} />
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
            { label: '🌿 Collection', path: '/trees', newTab: true },
            { label: '🏠 Public Site', path: '/', newTab: true },
            { label: `📱 ${t.devicesLink}`, path: '/admin/devices', newTab: false },
          ].map(({ label, path, newTab }) => (
            <a key={path} href={path}
              target={newTab ? '_blank' : undefined}
              rel={newTab ? 'noopener noreferrer' : undefined}
              className="flex-shrink-0 font-sans text-xs text-white/70 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
              {label}
            </a>
          ))}
          <a href="/admin/settings"
            className="flex-shrink-0 font-sans text-xs text-white/70 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
            ⚙️ Settings
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <p className="font-sans text-ink-light text-center">{t.pageSubtitle}</p>
        <UploadForm t={t} onSaved={tree => setTrees(p => [tree, ...p])} />
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-forest/10" />
          <span className="font-sans text-xs text-ink-light tracking-widest uppercase">
            {loadingTrees ? '…' : `${activeTrees.length} active · ${soldTrees.length} sold`}
          </span>
          <div className="flex-1 h-px bg-forest/10" />
        </div>
        <TreeList
          trees={activeTrees}
          t={t}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onEdit={setEditTree}
          onBulkQrPrint={handleBulkQrPrint}
        />
        <SoldTreeList trees={soldTrees} t={t} />
      </main>

      {soldTree && (
        <MarkSoldModal
          tree={soldTree}
          t={t}
          onClose={() => setSoldTree(null)}
          onSold={markTreeSold}
        />
      )}

      {editTree && (
        <EditTreeModal
          tree={editTree}
          onClose={() => setEditTree(null)}
          onSaved={handleTreeSaved}
        />
      )}

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-10" />
    </div>
  )
}
