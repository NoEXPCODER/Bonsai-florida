'use client'

import { useRef, useState } from 'react'

interface Props {
  initialSettings: Record<string, string | null>
}

export default function SettingsClient({ initialSettings }: Props) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialSettings.logo_url ?? null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'' | 'success' | 'error'>('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setStatus('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/settings/logo', { method: 'POST', body: form })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setLogoUrl(url)
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleRemove() {
    await fetch('/api/admin/settings/logo', { method: 'DELETE' })
    setLogoUrl(null)
    setStatus('')
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

      {/* Header */}
      <header className="bg-forest text-white px-4 py-4 flex items-center gap-4">
        <a
          href="/admin"
          className="font-sans text-xs font-semibold bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
        >
          ← Admin
        </a>
        <div>
          <p className="font-serif font-bold tracking-wide text-sm">Settings</p>
          <p className="font-sans text-[10px] text-white/50 tracking-widest uppercase">Bonsai Florida</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Logo upload */}
        <section className="card p-6 space-y-5">
          <div>
            <h2 className="font-serif text-xl text-forest mb-1">Brand Logo</h2>
            <p className="font-sans text-sm text-ink-light">
              Shown in the site header and on QR tag fronts. PNG with transparent background recommended.
            </p>
          </div>

          <div className="w-full h-px bg-forest/10" />

          {logoUrl ? (
            <div className="space-y-4">
              <div className="w-full rounded-2xl border border-forest/20 bg-white flex items-center justify-center p-6 overflow-hidden" style={{ minHeight: 160 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Current logo" className="max-w-full max-h-40 object-contain" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="btn-secondary flex-1 justify-center text-sm py-3"
                >
                  {uploading ? 'Uploading…' : '↑ Replace Logo'}
                </button>
                <button
                  onClick={handleRemove}
                  className="font-sans text-sm font-semibold text-bonsai-pink border border-bonsai-pink/30 px-5 py-3 rounded-2xl hover:bg-bonsai-pink-pale transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Default SVG preview */}
              <div className="w-full rounded-2xl border-2 border-dashed border-forest/20 bg-white flex items-center justify-center p-6" style={{ minHeight: 160 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="Default logo" className="max-w-full max-h-40 object-contain opacity-60" />
              </div>
              <p className="font-sans text-xs text-ink-light text-center">Using the built-in SVG. Upload your own logo to replace it.</p>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-primary w-full justify-center text-sm py-4"
              >
                {uploading ? 'Uploading…' : '↑ Upload Logo'}
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleUpload}
          />

          {status === 'success' && (
            <p className="font-sans text-sm font-semibold text-green-700 bg-green-50 px-4 py-3 rounded-2xl text-center">
              Logo updated — live on the site now.
            </p>
          )}
          {status === 'error' && (
            <p className="font-sans text-sm text-bonsai-pink bg-bonsai-pink-pale px-4 py-3 rounded-2xl text-center">
              Upload failed — try again.
            </p>
          )}
        </section>

      </main>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-10" />
    </div>
  )
}
