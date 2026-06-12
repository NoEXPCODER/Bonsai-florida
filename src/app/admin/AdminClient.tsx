'use client'

import { useEffect, useRef, useState } from 'react'
import type { DbTree, DbSpecies } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { getSpeciesLatin, makeSpeciesSlug } from '@/lib/species'
import { optimizeTreeImage } from '@/lib/image-optimizer'
import { useMessages, useAuth } from '@/lib/i18n'
import SpeciesCombobox from '@/components/SpeciesCombobox'

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

// ─── Bulk Edit Modal ─────────────────────────────────────────────────────────

function BulkEditModal({ trees, onClose, onSaved }: {
  trees: DbTree[]
  onClose: () => void
  onSaved: (ids: string[], updates: Partial<DbTree>) => void
}) {
  const [applyStatus, setApplyStatus] = useState(false)
  const [applyPrice, setApplyPrice]   = useState(false)
  const [applyLevel, setApplyLevel]   = useState(false)
  const [status, setStatus] = useState('active')
  const [price, setPrice]   = useState('')
  const [level, setLevel]   = useState('Beginner Friendly')
  const [saving, setSaving] = useState(false)
  const [done, setDone]     = useState(0)
  const [error, setError]   = useState('')

  const hasAny = applyStatus || applyPrice || applyLevel

  async function handleSave() {
    const updates: Partial<DbTree> = {}
    if (applyStatus) updates.status = status
    if (applyPrice && price.trim()) updates.price = price.trim()
    if (applyLevel) updates.level = level
    if (!Object.keys(updates).length) { onClose(); return }

    setSaving(true); setDone(0); setError('')
    let count = 0
    const results = await Promise.allSettled(
      trees.map(async (tree) => {
        const res = await fetch(`/api/admin/trees/${tree.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
        if (!res.ok) throw new Error(`Failed for ${tree.name}`)
        setDone(++count)
      })
    )
    setSaving(false)
    const failed = results.filter(r => r.status === 'rejected').length
    if (failed > 0) { setError(`${failed} tree${failed > 1 ? 's' : ''} failed to save.`); return }
    onSaved(trees.map(t => t.id), updates)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-cream-light rounded-3xl shadow-card-lg overflow-hidden">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-xs text-ink-light uppercase tracking-widest mb-0.5">Bulk Edit</p>
              <h2 className="font-serif text-xl text-forest">{trees.length} tree{trees.length !== 1 ? 's' : ''} selected</h2>
            </div>
            <button type="button" onClick={onClose} className="text-ink-light hover:text-ink text-xl">✕</button>
          </div>

          <p className="font-sans text-xs text-ink-light">Check a field to apply it to all selected trees.</p>

          {/* Status */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setApplyStatus(v => !v)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${applyStatus ? 'bg-forest border-forest' : 'border-forest/30 bg-white'}`}
            >
              {applyStatus && <span className="text-white text-xs">✓</span>}
            </div>
            <div className="flex-1">
              <span className="block font-sans text-sm font-semibold text-forest mb-1.5">Status</span>
              <select
                value={status} onChange={e => setStatus(e.target.value)}
                disabled={!applyStatus}
                className={inputCls + (applyStatus ? '' : ' opacity-40 pointer-events-none')}
              >
                <option value="active">Active — available for sale</option>
                <option value="reserved">Reserved</option>
                <option value="in_training">In Training</option>
                <option value="in_work">In Work</option>
              </select>
            </div>
          </label>

          {/* Price */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setApplyPrice(v => !v)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${applyPrice ? 'bg-forest border-forest' : 'border-forest/30 bg-white'}`}
            >
              {applyPrice && <span className="text-white text-xs">✓</span>}
            </div>
            <div className="flex-1">
              <span className="block font-sans text-sm font-semibold text-forest mb-1.5">Price</span>
              <input
                type="text" placeholder="e.g. 150 or $150"
                value={price} onChange={e => setPrice(e.target.value)}
                disabled={!applyPrice}
                className={inputCls + (applyPrice ? '' : ' opacity-40 pointer-events-none')}
              />
            </div>
          </label>

          {/* Level */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setApplyLevel(v => !v)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${applyLevel ? 'bg-forest border-forest' : 'border-forest/30 bg-white'}`}
            >
              {applyLevel && <span className="text-white text-xs">✓</span>}
            </div>
            <div className="flex-1">
              <span className="block font-sans text-sm font-semibold text-forest mb-1.5">Level</span>
              <select
                value={level} onChange={e => setLevel(e.target.value)}
                disabled={!applyLevel}
                className={inputCls + (applyLevel ? '' : ' opacity-40 pointer-events-none')}
              >
                <option value="Beginner Friendly">Beginner Friendly</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>
          </label>

          {saving && (
            <p className="font-sans text-sm text-forest text-center animate-pulse">
              Saving… {done}/{trees.length}
            </p>
          )}
          {error && <p className="font-sans text-sm text-bonsai-pink text-center">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
            <button
              type="button" onClick={handleSave}
              disabled={saving || !hasAny}
              className="btn-primary flex-1 justify-center py-3 disabled:opacity-50"
            >
              {saving ? 'Saving…' : `Save ${trees.length} tree${trees.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>
    </div>
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

export function EditTreeModal({ tree, onClose, onSaved }: {
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

// ─── Admin Share + Autopost Row ───────────────────────────────────────────────

function AdminShareRow({ tree, baseUrl }: { tree: DbTree; baseUrl: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<'link' | 'text' | null>(null)
  const [autoposting, setAutoposting] = useState(false)
  const [autopostStatus, setAutopostStatus] = useState<'idle' | 'ok' | 'fail'>('idle')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  const treeUrl = `${baseUrl}/tree/${tree.tree_code}`
  const levelBlurb = tree.level === 'Beginner Friendly'
    ? 'A perfect starter bonsai — low-maintenance and thrives in South Florida.'
    : 'A beautiful piece for the experienced collector.'
  const speciesTag = tree.species
    ? '#' + (tree.species as string).split(' ')[0].replace(/[^a-zA-Z]/g, '') + 'Bonsai'
    : ''

  const postText = [
    `🌿 ${tree.name} — $${tree.price}`,
    ...(tree.species ? [tree.species] : []),
    '',
    `🌱 ${tree.level}`,
    `☀️ Sun: ${tree.sun}`,
    `💧 Water: ${tree.water}`,
    '',
    levelBlurb,
    '',
    `Available at Bonsai Florida · Palm Beach, FL`,
    `Text to inquire: 561-312-9576`,
    '',
    `👉 View tree: ${treeUrl}`,
    '',
    `#BonsaiFlorida${speciesTag ? ' ' + speciesTag : ''} #Bonsai #TropicalBonsai #PalmBeach #Florida`,
  ].join('\n')

  async function copyText(text: string, type: 'link' | 'text') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2500)
    } catch { /* ignore */ }
  }

  async function handleAutopost() {
    setAutoposting(true)
    try {
      const res = await fetch(`/api/admin/trees/${tree.id}/autopost`, { method: 'POST' })
      setAutopostStatus(res.ok ? 'ok' : 'fail')
      setTimeout(() => setAutopostStatus('idle'), 4000)
    } catch {
      setAutopostStatus('fail')
      setTimeout(() => setAutopostStatus('idle'), 4000)
    } finally {
      setAutoposting(false)
    }
  }

  if (!tree.tree_code) return null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`font-sans text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
          open ? 'bg-forest text-white border-forest' : 'bg-sage-pale border-forest/20 text-forest hover:bg-sage hover:text-white'
        }`}
      >
        📤 Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-2xl border border-forest/10 shadow-card-lg z-30 overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="font-sans text-[10px] font-bold text-forest tracking-widest uppercase">Share / Autopost</p>
          </div>

          <div className="px-4 py-2 border-t border-forest/5">
            <div className="bg-sage-pale/60 rounded-xl px-3 py-2.5 max-h-36 overflow-y-auto mb-2">
              <div className="font-sans text-xs text-ink leading-relaxed whitespace-pre-wrap break-words">{postText}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyText(postText, 'text')}
                className="flex-1 border border-forest/20 px-3 py-2 rounded-xl font-sans text-xs font-semibold text-forest hover:bg-sage-pale transition-colors"
              >
                {copied === 'text' ? '✓ Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={() => copyText(treeUrl, 'link')}
                className="flex-1 border border-forest/20 px-3 py-2 rounded-xl font-sans text-xs font-semibold text-forest hover:bg-sage-pale transition-colors"
              >
                {copied === 'link' ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="px-4 pb-3.5 border-t border-forest/5 pt-2">
            <button
              onClick={handleAutopost}
              disabled={autoposting}
              className={`w-full py-2.5 rounded-xl font-sans text-xs font-bold transition-colors disabled:opacity-60 ${
                autopostStatus === 'ok'
                  ? 'bg-sage text-white'
                  : autopostStatus === 'fail'
                  ? 'bg-bonsai-pink text-white'
                  : 'bg-forest text-white hover:bg-forest/90'
              }`}
            >
              {autoposting ? 'Posting…' : autopostStatus === 'ok' ? '✓ Posted to n8n!' : autopostStatus === 'fail' ? '✕ Failed — check n8n' : '🤖 Autopost via n8n'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tree List ────────────────────────────────────────────────────────────────

export function TreeList({ trees, t, onDelete, onBulkDelete, onEdit, onBulkQrPrint, onBulkEdit }: {
  trees: DbTree[]
  t: ReturnType<typeof useMessages>['admin']
  onDelete: (tree: DbTree) => void
  onBulkDelete: (ids: string[], trees: DbTree[]) => void
  onEdit: (tree: DbTree) => void
  onBulkQrPrint: (trees: DbTree[]) => void
  onBulkEdit: (trees: DbTree[]) => void
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterSearch, setFilterSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterLevel, setFilterLevel]   = useState('all')

  const sorted = sortTrees(trees, sortKey, sortDir)
  const filtered = sorted.filter(tree => {
    if (filterStatus !== 'all' && (tree.status ?? 'active') !== filterStatus) return false
    if (filterLevel  !== 'all' && tree.level !== filterLevel) return false
    if (filterSearch) {
      const q = filterSearch.toLowerCase()
      return (
        tree.name.toLowerCase().includes(q) ||
        (tree.tree_code ?? '').toLowerCase().includes(q) ||
        (tree.species ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const allSelected  = filtered.length > 0 && filtered.every(t => selected.has(t.id))
  const someSelected = filtered.some(t => selected.has(t.id))

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(t => next.delete(t.id)); return next })
    } else {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(t => next.add(t.id)); return next })
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const selectedInView = filtered.filter(t => selected.has(t.id))
  const selectedCount  = selectedInView.length

  function handleBulkDelete() {
    if (!window.confirm(`Mark ${selectedCount} tree${selectedCount !== 1 ? 's' : ''} as sold?`)) return
    onBulkDelete(selectedInView.map(t => t.id), selectedInView)
    setSelected(new Set())
  }

  function handleBulkExport() { exportCSV(selectedInView, baseUrl) }
  function handleBulkQrPrint() { onBulkQrPrint(selectedInView) }
  function handleBulkEdit()    { onBulkEdit(selectedInView) }

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

      {/* Search */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light/50 text-sm pointer-events-none">🔍</span>
        <input
          type="search"
          placeholder="Search name, code, species…"
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-forest/20 bg-white font-sans text-sm text-ink placeholder-ink-light/40 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
        />
      </div>

      {/* Filter: Status */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {[
          { value: 'all',         label: 'All Status' },
          { value: 'active',      label: 'Active' },
          { value: 'reserved',    label: 'Reserved' },
          { value: 'in_training', label: 'In Training' },
          { value: 'in_work',     label: 'In Work' },
        ].map(({ value, label }) => (
          <button key={value} type="button" onClick={() => setFilterStatus(value)}
            className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filterStatus === value ? 'bg-forest text-white border-forest' : 'text-ink-light border-forest/20 hover:bg-sage-pale'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Filter: Level */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {[
          { value: 'all',               label: 'All Levels' },
          { value: 'Beginner Friendly', label: 'Beginner' },
          { value: 'Intermediate',      label: 'Intermediate' },
        ].map(({ value, label }) => (
          <button key={value} type="button" onClick={() => setFilterLevel(value)}
            className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filterLevel === value ? 'bg-bonsai-pink text-white border-bonsai-pink' : 'text-ink-light border-forest/20 hover:bg-sage-pale'
            }`}>
            {label}
          </button>
        ))}
        {(filterSearch || filterStatus !== 'all' || filterLevel !== 'all') && (
          <button type="button"
            onClick={() => { setFilterSearch(''); setFilterStatus('all'); setFilterLevel('all') }}
            className="font-sans text-xs px-3 py-1.5 rounded-full border border-bonsai-pink/30 text-bonsai-pink hover:bg-bonsai-pink-pale transition-colors">
            Clear filters
          </button>
        )}
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
          <span className="font-sans text-sm font-semibold flex-1">{selectedCount} selected</span>
          <button
            type="button"
            onClick={handleBulkExport}
            className="font-sans text-xs font-bold border border-white/40 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleBulkEdit}
            className="font-sans text-xs font-bold border border-white/40 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✏️ Edit
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
          {allSelected ? `Deselect all (${filtered.length})` : `Select all (${filtered.length})`}
          {filtered.length !== trees.length && (
            <span className="ml-1 text-ink-light/50">of {trees.length}</span>
          )}
        </span>
      </label>

      {filtered.length === 0 && (
        <p className="font-sans text-sm text-ink-light text-center py-8">No trees match the current filters.</p>
      )}

      {/* Tree cards */}
      <div className="space-y-3">
        {filtered.map(tree => {
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
                  <AdminShareRow tree={tree} baseUrl={baseUrl} />
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

export function MarkSoldModal({ tree, t, onClose, onSold }: {
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

export function SoldTreeList({ trees, t }: {
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

type StaffTask = 'lookup' | 'care' | 'add' | 'manage'

function StaffDashboard({
  trees,
  loadingTrees,
  t,
  onSaved,
  onUpdated,
  onBulkUpdated,
  onDeleted,
  onLogout,
}: {
  trees: DbTree[]
  loadingTrees: boolean
  t: ReturnType<typeof useMessages>['admin']
  onSaved: (tree: DbTree) => void
  onUpdated: (id: string, updates: Partial<DbTree>) => void
  onBulkUpdated: (ids: string[], updates: Partial<DbTree>) => void
  onDeleted: (ids: string[]) => void
  onLogout: () => void
}) {
  const [task, setTask] = useState<StaffTask>('lookup')
  const [treeQuery, setTreeQuery] = useState('')
  const [careQuery, setCareQuery] = useState('')
  const [species, setSpecies] = useState<DbSpecies[]>([])
  const [copied, setCopied] = useState('')
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // Manage tab modals
  const [editingTree, setEditingTree] = useState<DbTree | null>(null)
  const [deletingTree, setDeletingTree] = useState<DbTree | null>(null)
  const [bulkEditTrees, setBulkEditTrees] = useState<DbTree[]>([])

  useEffect(() => {
    fetch('/api/admin/species')
      .then(r => (r.ok ? r.json() : []))
      .then(data => setSpecies(Array.isArray(data) ? data : []))
      .catch(() => setSpecies([]))
  }, [])

  const activeTrees = trees.filter(tree => tree.is_active)
  const lookupResults = activeTrees
    .filter(tree => {
      const q = treeQuery.trim().toLowerCase()
      if (!q) return true
      return (
        tree.name.toLowerCase().includes(q) ||
        (tree.tree_code ?? '').toLowerCase().includes(q) ||
        (tree.species ?? '').toLowerCase().includes(q) ||
        (tree.location_row ?? '').toLowerCase().includes(q) ||
        (tree.location_tree ?? '').toLowerCase().includes(q)
      )
    })
    .slice(0, treeQuery.trim() ? 12 : 6)

  const careResults = species
    .filter(item => {
      const q = careQuery.trim().toLowerCase()
      if (!q) return true
      return (
        item.name_en.toLowerCase().includes(q) ||
        item.name_vi.toLowerCase().includes(q) ||
        getSpeciesLatin(item).toLowerCase().includes(q)
      )
    })
    .slice(0, careQuery.trim() ? 12 : 8)

  function treeLocation(tree: DbTree) {
    const parts = [
      tree.location_row ? `Row ${tree.location_row}` : '',
      tree.location_tree ? `#${tree.location_tree}` : '',
    ].filter(Boolean)
    return parts.length ? parts.join(' · ') : 'No location saved'
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      window.setTimeout(() => setCopied(''), 2000)
    } catch {
      setCopied('')
    }
  }

  async function shareCareGuide(item: DbSpecies) {
    const url = `${window.location.origin}/care-guides/${makeSpeciesSlug(item)}`
    const title = `${item.name_en} care guide`
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {})
      return
    }
    await copyText(url, item.id)
  }

  const taskButtons: { key: StaffTask; label: string; helper: string }[] = [
    { key: 'lookup',  label: 'Look Up Tree',     helper: 'Find code, price, location' },
    { key: 'care',    label: 'Share Care Guide',  helper: 'Send a guide link' },
    { key: 'add',     label: 'Add Tree',          helper: 'Photo, price, care' },
    { key: 'manage',  label: 'All Trees',         helper: 'Select, sort, bulk edit' },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-forest text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="font-serif text-xl leading-tight">Bonsai Florida</p>
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-white/60">Staff phone dashboard</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-xs font-semibold text-white"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">
        <div className="grid grid-cols-2 gap-2">
          {taskButtons.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTask(item.key)}
              className={`min-h-[72px] rounded-2xl border px-3 py-3 text-center transition-colors ${
                task === item.key
                  ? 'border-forest bg-forest text-white'
                  : 'border-forest/15 bg-white text-forest'
              }`}
            >
              <span className="block font-sans text-xs font-bold leading-tight">{item.label}</span>
              <span className={`mt-1 block font-sans text-[10px] leading-tight ${task === item.key ? 'text-white/65' : 'text-ink-light'}`}>
                {item.helper}
              </span>
            </button>
          ))}
        </div>

        {task === 'lookup' && (
          <section className="mt-5 space-y-4">
            <input
              type="search"
              value={treeQuery}
              onChange={event => setTreeQuery(event.target.value)}
              placeholder="Search name, code, row..."
              className={inputCls}
            />
            {loadingTrees && <p className="font-sans text-sm text-ink-light">Loading trees...</p>}
            <div className="space-y-3">
              {lookupResults.map(tree => {
                const image = getPrimaryTreeImageUrl(tree)
                const guide = species.find(item => item.id === tree.species_id)
                const treeUrl = tree.tree_code && baseUrl ? `${baseUrl}/tree/${tree.tree_code}` : ''
                return (
                  <article key={tree.id} className="rounded-3xl border border-forest/10 bg-white p-3 shadow-sm">
                    <div className="flex gap-3">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-sage-pale">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={image} alt={tree.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl opacity-30">🌿</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="font-serif text-xl leading-tight text-forest">{tree.name}</h2>
                            <p className="font-sans text-xs italic text-ink-light">{tree.species || 'No species saved'}</p>
                          </div>
                          <p className="font-serif text-lg font-bold text-bonsai-pink">${tree.price}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 font-sans text-xs">
                          {tree.tree_code && <span className="rounded-full bg-sage-pale px-2.5 py-1 font-mono text-forest">{tree.tree_code}</span>}
                          <span className="rounded-full bg-cream px-2.5 py-1 text-ink-light">{treeLocation(tree)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {tree.tree_code ? (
                        <a href={`/tree/${tree.tree_code}`} className="btn-primary justify-center text-sm py-3">
                          Open
                        </a>
                      ) : (
                        <button type="button" disabled className="btn-primary justify-center text-sm py-3 opacity-50">
                          No Page
                        </button>
                      )}
                      {guide ? (
                        <button type="button" onClick={() => shareCareGuide(guide)} className="btn-secondary justify-center text-sm py-3">
                          {copied === guide.id ? 'Copied' : 'Share Care'}
                        </button>
                      ) : treeUrl ? (
                        <button type="button" onClick={() => copyText(treeUrl, tree.id)} className="btn-secondary justify-center text-sm py-3">
                          {copied === tree.id ? 'Copied' : 'Copy Link'}
                        </button>
                      ) : null}
                    </div>
                  </article>
                )
              })}
              {!loadingTrees && lookupResults.length === 0 && (
                <p className="rounded-2xl bg-white px-4 py-8 text-center font-sans text-sm text-ink-light">No tree found.</p>
              )}
            </div>
          </section>
        )}

        {task === 'care' && (
          <section className="mt-5 space-y-4">
            <input
              type="search"
              value={careQuery}
              onChange={event => setCareQuery(event.target.value)}
              placeholder="Search care guide..."
              className={inputCls}
            />
            <div className="space-y-2">
              {careResults.map(item => {
                const slug = makeSpeciesSlug(item)
                return (
                  <article key={item.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                    <h2 className="font-serif text-xl leading-tight text-forest">{item.name_en}</h2>
                    <p className="font-sans text-xs italic text-ink-light">{getSpeciesLatin(item)}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <a href={`/care-guides/${slug}`} className="btn-primary justify-center text-sm py-3">
                        Open
                      </a>
                      <button type="button" onClick={() => shareCareGuide(item)} className="btn-secondary justify-center text-sm py-3">
                        {copied === item.id ? 'Copied' : 'Share'}
                      </button>
                    </div>
                  </article>
                )
              })}
              {careResults.length === 0 && (
                <p className="rounded-2xl bg-white px-4 py-8 text-center font-sans text-sm text-ink-light">No care guide found.</p>
              )}
            </div>
          </section>
        )}

        {task === 'add' && (
          <section className="mt-5">
            <UploadForm t={t} onSaved={onSaved} />
          </section>
        )}

        {task === 'manage' && (
          <section className="mt-5">
            {loadingTrees ? (
              <p className="font-sans text-sm text-ink-light text-center py-10">Loading trees…</p>
            ) : (
              <TreeList
                trees={activeTrees}
                t={t}
                onEdit={setEditingTree}
                onDelete={setDeletingTree}
                onBulkDelete={(ids) => {
                  Promise.allSettled(
                    ids.map(id => fetch(`/api/admin/trees/${id}`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({}),
                    }))
                  ).then(() => onDeleted(ids))
                }}
                onBulkQrPrint={(selectedTrees) => {
                  const ids = selectedTrees.map(tree => tree.id).join(',')
                  window.location.href = `/admin/qr-tags?ids=${ids}`
                }}
                onBulkEdit={setBulkEditTrees}
              />
            )}
          </section>
        )}

        {/* Single-tree edit modal */}
        {editingTree && (
          <EditTreeModal
            tree={editingTree}
            onClose={() => setEditingTree(null)}
            onSaved={(id, updates) => { onUpdated(id, updates); setEditingTree(null) }}
          />
        )}

        {/* Single-tree mark sold modal */}
        {deletingTree && (
          <MarkSoldModal
            tree={deletingTree}
            t={t}
            onClose={() => setDeletingTree(null)}
            onSold={async (tree, soldImageUrl, soldNote, buyer) => {
              const res = await fetch(`/api/admin/trees/${tree.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sold_image_url: soldImageUrl,
                  sold_note: soldNote,
                  ...buyer,
                }),
              })
              if (!res.ok) throw new Error('Save failed.')
              onDeleted([tree.id])
            }}
          />
        )}

        {/* Bulk edit modal */}
        {bulkEditTrees.length > 0 && (
          <BulkEditModal
            trees={bulkEditTrees}
            onClose={() => setBulkEditTrees([])}
            onSaved={(ids, updates) => { onBulkUpdated(ids, updates); setBulkEditTrees([]) }}
          />
        )}
      </main>
    </div>
  )
}

// ─── Main Admin Client ────────────────────────────────────────────────────────

export default function AdminClient({ initialAuth }: { initialAuth: boolean }) {
  const m = useMessages()
  const t = m.admin

  const [isAuth, setIsAuth] = useState(initialAuth)
  const [trees, setTrees] = useState<DbTree[]>([])
  const [loadingTrees, setLoadingTrees] = useState(false)

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

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    setIsAuth(false)
  }

  if (!isAuth) {
    return <LoginScreen onUnlock={() => setIsAuth(true)} />
  }

  return (
    <StaffDashboard
      trees={trees}
      loadingTrees={loadingTrees}
      t={t}
      onSaved={tree => setTrees(p => [tree, ...p])}
      onUpdated={(id, updates) => setTrees(p => p.map(tr => tr.id === id ? { ...tr, ...updates } : tr))}
      onBulkUpdated={(ids, updates) => setTrees(p => p.map(tr => ids.includes(tr.id) ? { ...tr, ...updates } : tr))}
      onDeleted={ids => setTrees(p => p.filter(tr => !ids.includes(tr.id)))}
      onLogout={handleLogout}
    />
  )
}
