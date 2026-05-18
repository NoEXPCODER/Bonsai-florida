'use client'

import { useEffect, useRef, useState } from 'react'
import { AUTH } from '@/config/auth'
import { supabase } from '@/lib/supabase'
import type { DbTree } from '@/lib/supabase'
import { useMessages } from '@/lib/i18n'

const PIN_KEY = 'bf_admin_unlocked'

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ─── PIN Screen ──────────────────────────────────────────────────────────────

function PinScreen({ onUnlock, t }: { onUnlock: () => void; t: ReturnType<typeof useMessages>['admin'] }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin === AUTH.adminPin) {
      sessionStorage.setItem(PIN_KEY, '1')
      onUnlock()
    } else {
      setError(t.pinError)
      setPin('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Top pink rule */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mb-8" />

        <div className="card p-8 text-center shadow-card-lg">
          <div className="text-4xl mb-5">🌸</div>
          <h1 className="font-serif text-3xl text-forest mb-2">{t.pinTitle}</h1>
          <p className="font-sans text-sm text-ink-light mb-8">{t.pinSubtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t.pinPlaceholder}
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-forest/20 bg-white font-sans text-2xl text-center text-ink tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition"
              aria-label={t.pinPlaceholder}
            />
            {error && (
              <p role="alert" className="font-sans text-sm text-bonsai-pink">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full justify-center text-lg py-4">
              {t.pinButton}
            </button>
          </form>
        </div>

        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-8" />
      </div>
    </div>
  )
}

// ─── Upload Form ─────────────────────────────────────────────────────────────

interface FormData {
  name: string
  species: string
  price: string
  level: string
  sun: string
  water: string
  notes: string
}

const DEFAULT_FORM: FormData = {
  name: '',
  species: '',
  price: '',
  level: 'Beginner Friendly',
  sun: 'Bright indirect light',
  water: 'Every 2–3 days',
  notes: '',
}

function UploadForm({ t, onSaved }: { t: ReturnType<typeof useMessages>['admin']; onSaved: () => void }) {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function setField(key: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setErrorMsg('')

    try {
      let image_url: string | null = null

      // Upload photo if one was selected
      if (file) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `${Date.now()}-${slugify(form.name || 'tree')}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('bonsai-trees')
          .upload(path, file, { upsert: false, contentType: file.type })
        if (uploadErr) throw uploadErr

        const { data: urlData } = supabase.storage
          .from('bonsai-trees')
          .getPublicUrl(path)
        image_url = urlData.publicUrl
      }

      // Insert tree record
      const { error: dbErr } = await supabase.from('bonsai_trees').insert({
        name: form.name || 'Bonsai Tree',
        species: form.species || null,
        price: form.price || 'Call for price',
        level: form.level,
        sun: form.sun,
        water: form.water,
        notes: form.notes || null,
        image_url,
      })
      if (dbErr) throw dbErr

      setStatus('success')
      setForm(DEFAULT_FORM)
      setFile(null)
      setPreview(null)
      onSaved()

      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.error(err)
      setErrorMsg(t.submitError)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
      <h2 className="font-serif text-2xl text-forest">{t.addTitle}</h2>
      <div className="w-10 h-px bg-bonsai-pink-lt" />

      {/* Photo picker */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
          aria-label={t.photoButton}
        />
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Tree preview"
              className="w-full aspect-[4/3] object-cover rounded-2xl border-2 border-forest/20"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-3 right-3 bg-forest text-white text-sm font-sans font-bold px-4 py-2 rounded-full shadow-card"
            >
              {t.photoChange}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex flex-col items-center justify-center gap-3 hover:border-forest hover:bg-sage-pale transition-colors"
          >
            <span className="text-5xl">📷</span>
            <span className="font-sans text-base font-semibold text-forest">{t.photoButton}</span>
          </button>
        )}
      </div>

      {/* Name */}
      <Field label={t.fieldName} required>
        <input
          type="text"
          placeholder={t.fieldNamePlaceholder}
          value={form.name}
          onChange={e => setField('name', e.target.value)}
          className={inputCls}
        />
      </Field>

      {/* Species */}
      <Field label={t.fieldSpecies}>
        <input
          type="text"
          placeholder={t.fieldSpeciesPlaceholder}
          value={form.species}
          onChange={e => setField('species', e.target.value)}
          className={inputCls}
        />
      </Field>

      {/* Price */}
      <Field label={t.fieldPrice} required>
        <input
          type="text"
          placeholder={t.fieldPricePlaceholder}
          value={form.price}
          onChange={e => setField('price', e.target.value)}
          className={inputCls}
          required
        />
      </Field>

      {/* Level */}
      <Field label={t.fieldLevel}>
        <select
          value={form.level}
          onChange={e => setField('level', e.target.value)}
          className={inputCls}
        >
          <option value="Beginner Friendly">{t.levelBeginner}</option>
          <option value="Intermediate">{t.levelIntermediate}</option>
        </select>
      </Field>

      {/* Sun */}
      <Field label={t.fieldSun}>
        <input
          type="text"
          placeholder={t.fieldSunPlaceholder}
          value={form.sun}
          onChange={e => setField('sun', e.target.value)}
          className={inputCls}
        />
      </Field>

      {/* Water */}
      <Field label={t.fieldWater}>
        <input
          type="text"
          placeholder={t.fieldWaterPlaceholder}
          value={form.water}
          onChange={e => setField('water', e.target.value)}
          className={inputCls}
        />
      </Field>

      {/* Notes */}
      <Field label={t.fieldNotes}>
        <textarea
          placeholder={t.fieldNotesPlaceholder}
          value={form.notes}
          onChange={e => setField('notes', e.target.value)}
          rows={3}
          className={inputCls + ' resize-none'}
        />
      </Field>

      {/* Status messages */}
      {status === 'success' && (
        <p className="font-sans text-sm font-semibold text-forest bg-sage-pale px-4 py-3 rounded-2xl text-center">
          ✅ {t.submitSuccess}
        </p>
      )}
      {status === 'error' && (
        <p className="font-sans text-sm font-semibold text-bonsai-pink bg-bonsai-pink-pale px-4 py-3 rounded-2xl text-center">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="btn-primary w-full justify-center text-lg py-5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'saving' ? t.submitting : t.submitButton}
      </button>
    </form>
  )
}

// ─── Tree List ────────────────────────────────────────────────────────────────

function TreeList({ trees, t, onDelete }: {
  trees: DbTree[]
  t: ReturnType<typeof useMessages>['admin']
  onDelete: (id: string, imageUrl: string | null) => void
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-forest mb-5">{t.listTitle}</h2>

      {trees.length === 0 ? (
        <p className="font-sans text-ink-light text-center py-10">{t.listEmpty}</p>
      ) : (
        <div className="space-y-4">
          {trees.map(tree => (
            <div key={tree.id} className="card p-4 flex gap-4 items-start">
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-sage-pale border border-forest/10">
                {tree.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tree.image_url}
                    alt={tree.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-lg text-forest leading-tight truncate">{tree.name}</p>
                {tree.species && (
                  <p className="font-sans text-xs italic text-ink-light">{tree.species}</p>
                )}
                <p className="font-sans text-base font-bold text-bonsai-pink mt-1">{tree.price}</p>
                <p className="font-sans text-xs text-ink-light mt-0.5">{tree.level}</p>
              </div>

              {/* Delete */}
              <button
                onClick={() => onDelete(tree.id, tree.image_url)}
                className="flex-shrink-0 bg-bonsai-pink-pale border border-bonsai-pink/30 text-bonsai-pink font-sans text-xs font-bold px-3 py-2 rounded-xl hover:bg-bonsai-pink hover:text-white transition-colors"
                aria-label={`${t.deleteButton}: ${tree.name}`}
              >
                {t.deleteButton}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-3.5 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition'

function Field({ label, children, required }: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div>
      <label className="block font-sans text-sm font-semibold text-forest mb-1.5">
        {label}{required && <span className="text-bonsai-pink ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const m = useMessages()
  const t = m.admin

  const [unlocked, setUnlocked] = useState(false)
  const [trees, setTrees] = useState<DbTree[]>([])
  const [loading, setLoading] = useState(false)

  // Restore session on mount
  useEffect(() => {
    if (sessionStorage.getItem(PIN_KEY) === '1') setUnlocked(true)
  }, [])

  // Fetch trees whenever admin is unlocked
  useEffect(() => {
    if (!unlocked) return
    fetchTrees()
  }, [unlocked])

  async function fetchTrees() {
    setLoading(true)
    const { data } = await supabase
      .from('bonsai_trees')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    setTrees(data ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string, imageUrl: string | null) {
    if (!window.confirm(t.deleteConfirm)) return

    // Soft-delete (mark inactive so it disappears from public site)
    await supabase.from('bonsai_trees').update({ is_active: false }).eq('id', id)

    // Remove image from storage if present
    if (imageUrl) {
      const path = imageUrl.split('/bonsai-trees/')[1]
      if (path) await supabase.storage.from('bonsai-trees').remove([path])
    }

    setTrees(prev => prev.filter(t => t.id !== id))
  }

  function handleLock() {
    sessionStorage.removeItem(PIN_KEY)
    setUnlocked(false)
  }

  if (!unlocked) {
    return <PinScreen onUnlock={() => setUnlocked(true)} t={t} />
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top pink rule */}
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
        <button
          onClick={handleLock}
          className="font-sans text-xs font-semibold tracking-wider border border-white/30 text-white/80 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={t.logout}
        >
          🔒 {t.logout}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <p className="font-sans text-ink-light text-center">{t.pageSubtitle}</p>

        {/* Upload form */}
        <UploadForm t={t} onSaved={fetchTrees} />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-forest/10" />
          <span className="font-sans text-xs text-ink-light tracking-widest uppercase">
            {loading ? '…' : `${trees.length} trees`}
          </span>
          <div className="flex-1 h-px bg-forest/10" />
        </div>

        {/* Inventory list */}
        <TreeList trees={trees} t={t} onDelete={handleDelete} />
      </main>

      {/* Bottom pink rule */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-10" />
    </div>
  )
}
