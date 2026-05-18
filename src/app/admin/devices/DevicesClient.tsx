'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DeviceRow } from './page'
import { useMessages } from '@/lib/i18n'

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function DeviceIcon({ name }: { name: string }) {
  if (/iPhone|iPad/i.test(name)) return <span className="text-2xl">📱</span>
  if (/Android/i.test(name)) return <span className="text-2xl">📱</span>
  if (/Mac/i.test(name)) return <span className="text-2xl">💻</span>
  if (/Windows|Linux/i.test(name)) return <span className="text-2xl">🖥️</span>
  return <span className="text-2xl">📟</span>
}

export default function DevicesClient({ devices, currentSessionId }: {
  devices: DeviceRow[]
  currentSessionId: string
}) {
  const m = useMessages()
  const t = m.admin
  const router = useRouter()
  const [rows, setRows] = useState<DeviceRow[]>(devices)
  const [revoking, setRevoking] = useState<string | null>(null)

  async function handleRevoke(id: string) {
    if (!window.confirm(t.revokeConfirm)) return
    setRevoking(id)
    await fetch(`/api/admin/devices/${id}`, { method: 'DELETE' })
    setRows(prev => prev.map(r => r.id === id ? { ...r, revoked_at: new Date().toISOString() } : r))
    setRevoking(null)
  }

  const active = rows.filter(r => !r.revoked_at && new Date(r.expires_at) > new Date())
  const inactive = rows.filter(r => r.revoked_at || new Date(r.expires_at) <= new Date())

  return (
    <div className="min-h-screen bg-cream">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

      <header className="bg-forest text-white px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <p className="font-serif font-bold tracking-wide text-sm sm:text-base">Bonsai Florida</p>
            <p className="font-sans text-xs text-white/60 tracking-widest uppercase">{t.devicesPageTitle}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="font-sans text-xs border border-white/30 text-white/80 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
        >
          ← {t.backToAdmin}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Active devices */}
        <section>
          <h2 className="font-serif text-2xl text-forest mb-5">
            {t.activeDevices} <span className="text-bonsai-pink text-lg">({active.length})</span>
          </h2>
          {active.length === 0
            ? <p className="font-sans text-ink-light text-center py-6">{t.noActiveDevices}</p>
            : (
              <div className="space-y-3">
                {active.map(d => (
                  <div key={d.id} className={`card p-5 flex items-start gap-4 ${d.id === currentSessionId ? 'border-forest/40 bg-sage-pale/30' : ''}`}>
                    <DeviceIcon name={d.device_name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans font-semibold text-forest">{d.device_name}</p>
                        {d.id === currentSessionId && (
                          <span className="font-sans text-[10px] font-bold tracking-widest uppercase bg-forest text-white px-2 py-0.5 rounded-full">
                            {t.thisDevice}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-ink-light mt-1">
                        {t.lastUsed}: {fmt(d.last_used_at)}
                      </p>
                      <p className="font-sans text-xs text-ink-light">
                        {t.expires}: {fmt(d.expires_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRevoke(d.id)}
                      disabled={revoking === d.id}
                      className="flex-shrink-0 bg-bonsai-pink-pale border border-bonsai-pink/30 text-bonsai-pink font-sans text-xs font-bold px-3 py-2 rounded-xl hover:bg-bonsai-pink hover:text-white transition-colors disabled:opacity-50"
                    >
                      {revoking === d.id ? '…' : t.revokeButton}
                    </button>
                  </div>
                ))}
              </div>
            )}
        </section>

        {/* Inactive / revoked devices */}
        {inactive.length > 0 && (
          <section>
            <h2 className="font-serif text-xl text-ink-light mb-4">{t.inactiveDevices}</h2>
            <div className="space-y-2">
              {inactive.map(d => (
                <div key={d.id} className="card p-4 flex items-start gap-3 opacity-50">
                  <DeviceIcon name={d.device_name} />
                  <div className="flex-1">
                    <p className="font-sans text-sm font-semibold text-forest">{d.device_name}</p>
                    <p className="font-sans text-xs text-ink-light">
                      {d.revoked_at ? `${t.revoked}: ${fmt(d.revoked_at)}` : `${t.expired}: ${fmt(d.expires_at)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent mt-10" />
    </div>
  )
}
