'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { DbTree } from '@/lib/supabase'
import { useMessages } from '@/lib/i18n'

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
    } else {
      setError(t.pinError)
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
}
const DEFAULT_FORM: FormData = {
  name: '', species: '', price: '', level: 'Beginner Friendly',
  sun: 'Bright indirect light', water: 'Every 2–3 days', notes: '',
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
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function setField(k: keyof FormData, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving'); setErrorMsg('')
    try {
      let image_url: string | null = null
      if (file) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `${Date.now()}-${form.name.replace(/\s+/g, '-').toLowerCase()}.${ext}`
        const { error: upErr } = await supabase.storage.from('bonsai-trees').upload(path, file, { contentType: file.type })
        if (upErr) throw upErr
        const { data: urlData } = supabase.storage.from('bonsai-trees').getPublicUrl(path)
        image_url = urlData.publicUrl
      }

      // Server-side creation (validates cookie)
      const res = await fetch('/api/admin/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image_url }),
      })
      if (!res.ok) throw new Error('Server error')

      const saved = await res.json()
      // Fetch the full row to add to list
      const { data: row } = await supabase.from('bonsai_trees').select('*').eq('id', saved.id).single()
      if (row) onSaved(row)

      setStatus('success'); setForm(DEFAULT_FORM); setFile(null); setPreview(null)
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setErrorMsg(t.submitError); setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
      <h2 className="font-serif text-2xl text-forest">{t.addTitle}</h2>
      <div className="w-10 h-px bg-bonsai-pink-lt" />

      {/* Photo picker */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full aspect-[4/3] object-cover rounded-2xl border-2 border-forest/20" />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="absolute bottom-3 right-3 bg-forest text-white text-sm font-bold px-4 py-2 rounded-full shadow">
            {t.photoChange}
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()}
          className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex flex-col items-center justify-center gap-3 hover:border-forest transition-colors">
          <span className="text-5xl">📷</span>
          <span className="font-sans font-semibold text-forest">{t.photoButton}</span>
        </button>
      )}

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

      {status === 'success' && <p className="font-sans text-sm font-semibold text-forest bg-sage-pale px-4 py-3 rounded-2xl text-center">✅ {t.submitSuccess}</p>}
      {status === 'error' && <p className="font-sans text-sm text-bonsai-pink bg-bonsai-pink-pale px-4 py-3 rounded-2xl text-center">{errorMsg}</p>}

      <button type="submit" disabled={status === 'saving'} className="btn-primary w-full justify-center text-lg py-5 disabled:opacity-60">
        {status === 'saving' ? t.submitting : t.submitButton}
      </button>
    </form>
  )
}

// ─── Tree List ────────────────────────────────────────────────────────────────

function TreeList({ trees, t, onDelete }: {
  trees: DbTree[]; t: ReturnType<typeof useMessages>['admin']
  onDelete: (id: string, imageUrl: string | null) => void
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div>
      <h2 className="font-serif text-2xl text-forest mb-5">{t.listTitle}</h2>
      {trees.length === 0
        ? <p className="font-sans text-ink-light text-center py-10">{t.listEmpty}</p>
        : (
          <div className="space-y-4">
            {trees.map(tree => (
              <div key={tree.id} className="card p-4 space-y-3">
                <div className="flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-sage-pale border border-forest/10">
                    {tree.image_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={tree.image_url} alt={tree.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-forest leading-tight">{tree.name}</p>
                    {tree.species && <p className="font-sans text-xs italic text-ink-light">{tree.species}</p>}
                    <p className="font-sans font-bold text-bonsai-pink mt-1">{tree.price}</p>
                    <p className="font-sans text-xs text-ink-light">{tree.level}</p>
                  </div>
                  {/* Delete */}
                  <button
                    onClick={() => onDelete(tree.id, tree.image_url)}
                    className="flex-shrink-0 bg-bonsai-pink-pale border border-bonsai-pink/30 text-bonsai-pink font-sans text-xs font-bold px-3 py-2 rounded-xl hover:bg-bonsai-pink hover:text-white transition-colors"
                  >
                    {t.deleteButton}
                  </button>
                </div>

                {/* QR link row */}
                {tree.tree_code && (
                  <div className="flex items-center gap-3 bg-sage-pale/60 rounded-xl px-4 py-2.5">
                    <span className="text-xl">📱</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-ink-light">{t.qrLabel}</p>
                      <p className="font-sans text-xs font-mono text-forest truncate">{baseUrl}/tree/{tree.tree_code}</p>
                    </div>
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
            ))}
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

  async function handleDelete(id: string, imageUrl: string | null) {
    if (!window.confirm(t.deleteConfirm)) return

    await fetch(`/api/admin/trees/${id}`, { method: 'DELETE' })

    if (imageUrl) {
      const path = imageUrl.split('/bonsai-trees/')[1]
      if (path) await supabase.storage.from('bonsai-trees').remove([path])
    }
    setTrees(p => p.filter(t => t.id !== id))
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
      <header className="bg-forest text-white px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌸</span>
          <div>
            <p className="font-serif font-bold tracking-wide text-sm sm:text-base">Bonsai Florida</p>
            <p className="font-sans text-xs text-white/60 tracking-widest uppercase">{t.pageTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/admin/devices')}
            className="font-sans text-xs border border-white/30 text-white/80 px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            📱 {t.devicesLink}
          </button>
          <button
            onClick={handleLogout}
            className="font-sans text-xs border border-white/30 text-white/80 px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            🔒 {t.logout}
          </button>
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
        <TreeList trees={trees} t={t} onDelete={handleDelete} />
      </main>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-10" />
    </div>
  )
}
