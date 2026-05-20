'use client'

import { useState } from 'react'
import type { VisitBooking } from '@/lib/booking-types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed:  { label: 'Confirmed',  color: 'bg-forest text-white' },
  cancelled:  { label: 'Cancelled',  color: 'bg-bonsai-pink-pale text-bonsai-pink' },
  completed:  { label: 'Completed',  color: 'bg-sage-pale text-forest' },
  no_show:    { label: 'No Show',    color: 'bg-ink-light/20 text-ink-light' },
}

function formatDateTimeET(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function isUpcoming(iso: string): boolean {
  return new Date(iso) > new Date()
}

export default function BookingsClient({ initialBookings }: { initialBookings: VisitBooking[] }) {
  const [bookings, setBookings] = useState<VisitBooking[]>(initialBookings)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'upcoming' | 'all' | 'past'>('upcoming')

  const filtered = bookings.filter(b => {
    if (filter === 'upcoming') return isUpcoming(b.appointment_start) && b.status === 'confirmed'
    if (filter === 'past') return !isUpcoming(b.appointment_start)
    return true
  })

  async function updateStatus(id: string, status: VisitBooking['status']) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const upcoming = bookings.filter(b => isUpcoming(b.appointment_start) && b.status === 'confirmed')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-forest">Garden Visit Bookings</h1>
          <p className="font-sans text-sm text-ink-light mt-1">{upcoming.length} upcoming confirmed</p>
        </div>
        <a href="/admin" className="font-sans text-xs text-ink-light hover:text-forest border border-forest/20 px-3 py-2 rounded-xl transition-colors">
          ← Admin
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['upcoming', 'all', 'past'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl border transition-colors capitalize ${
              filter === f ? 'bg-forest text-white border-forest' : 'bg-white text-ink-light border-forest/20 hover:border-forest'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-forest/10 p-10 text-center">
          <p className="font-sans text-sm text-ink-light">No bookings to show.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => {
            const statusInfo = STATUS_LABELS[b.status] ?? { label: b.status, color: 'bg-sage-pale text-forest' }
            return (
              <div key={b.id} className="bg-white rounded-3xl border border-forest/10 p-5 shadow-soft">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-serif text-lg text-forest">{b.full_name}</h2>
                      <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-bonsai-pink font-semibold mt-0.5">{formatDateTimeET(b.appointment_start)} ET</p>
                    <p className="font-sans text-xs text-ink-light italic">{b.purpose}</p>
                  </div>
                  <span className="font-mono text-[10px] text-ink-light/50 flex-shrink-0">{b.id.slice(0, 8).toUpperCase()}</span>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-4 bg-sage-pale/40 rounded-2xl px-4 py-3">
                  <div>
                    <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Phone</span>
                    <p className="font-sans text-sm text-forest font-semibold">{b.phone}</p>
                  </div>
                  <div>
                    <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Email</span>
                    <p className="font-sans text-sm text-ink">{b.email}</p>
                  </div>
                  {b.budget_range && (
                    <div>
                      <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Budget</span>
                      <p className="font-sans text-sm text-ink">{b.budget_range}</p>
                    </div>
                  )}
                  {b.experience_level && (
                    <div>
                      <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Experience</span>
                      <p className="font-sans text-sm text-ink">{b.experience_level}</p>
                    </div>
                  )}
                  {b.visit_goal && (
                    <div className="sm:col-span-2">
                      <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Visit Goal</span>
                      <p className="font-sans text-sm text-ink">{b.visit_goal}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Visitors</span>
                    <p className="font-sans text-sm text-ink">{b.visitor_count}</p>
                  </div>
                  {b.selected_tree_ids && b.selected_tree_ids.length > 0 && (
                    <div className="sm:col-span-2">
                      <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Selected Trees</span>
                      <p className="font-sans text-sm text-ink">{b.selected_tree_ids.join(', ')}</p>
                    </div>
                  )}
                  {b.notes && (
                    <div className="sm:col-span-2">
                      <span className="font-sans text-[10px] font-semibold text-ink-light/60 uppercase">Notes</span>
                      <p className="font-sans text-sm text-ink">{b.notes}</p>
                    </div>
                  )}
                </div>

                {/* Status actions */}
                <div className="flex flex-wrap gap-2">
                  {(['confirmed', 'completed', 'cancelled', 'no_show'] as const)
                    .filter(s => s !== b.status)
                    .map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(b.id, s)}
                        disabled={updatingId === b.id}
                        className="font-sans text-xs font-semibold border border-forest/20 px-3 py-1.5 rounded-xl hover:bg-sage-pale transition-colors disabled:opacity-50 capitalize"
                      >
                        {updatingId === b.id ? '…' : STATUS_LABELS[s]?.label ?? s}
                      </button>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
