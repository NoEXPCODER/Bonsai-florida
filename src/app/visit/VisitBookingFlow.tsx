'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getVisitList } from '@/lib/visit-list'
import { OPEN_DAYS, OPEN_DAYS_LABEL, OPEN_HOURS_LABEL } from '@/lib/booking-types'
import { siteConfig } from '@/lib/siteConfig'

// ── Constants ─────────────────────────────────────────────────────────────────

const PURPOSES = [
  { id: 'buy',      emoji: '🌿', label: 'Buy a Bonsai',                sub: 'Browse and pick a tree to take home' },
  { id: 'browse',   emoji: '👀', label: 'Just Browsing',               sub: 'Enjoy the garden, no pressure' },
  { id: 'care',     emoji: '💧', label: 'Need Care Help',              sub: 'Get advice on your existing bonsai' },
  { id: 'gift',     emoji: '🎁', label: 'Looking for a Gift',          sub: 'Find the perfect tree for someone special' },
  { id: 'specific', emoji: '🔍', label: 'Looking for a Specific Tree', sub: 'Have something in mind already' },
  { id: 'pickup',   emoji: '📦', label: 'Pickup / Delivery Question',  sub: 'Ask about logistics' },
  { id: 'choose',   emoji: '✨', label: 'Help Me Choose',              sub: "Tell us your budget — we'll pick the best fit" },
]

const BUDGET_OPTIONS = ['Under $50', '$50–$100', '$100–$250', '$250+', 'Not sure']

const EXPERIENCE_OPTIONS = [
  'Beginner',
  'Some experience',
  'Experienced',
  'Buying as a gift',
  'Not sure',
]

const VISIT_GOAL_OPTIONS = [
  'I want to buy during this visit',
  'I want to compare options',
  'I need care advice',
  'I am buying a gift',
  'I am just browsing',
]

// ── Draft persistence ─────────────────────────────────────────────────────────

const DRAFT_KEY = 'bf_booking_draft'
const DRAFT_TTL = 4 * 60 * 60 * 1000 // 4 hours

interface Draft { data: FormState; step: Step; savedAt: number }

function saveDraft(data: FormState, step: Step) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step, savedAt: Date.now() }))
  } catch {}
}

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed: Draft = JSON.parse(raw)
    if (Date.now() - parsed.savedAt > DRAFT_TTL) { localStorage.removeItem(DRAFT_KEY); return null }
    return parsed
  } catch { return null }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch {}
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 'purpose' | 'details' | 'time' | 'confirm'

interface FormState {
  purpose: string
  purposeLabel: string
  full_name: string
  budget_range: string
  experience_level: string
  visit_goal: string
  visitor_count: number
  notes: string
  selected_tree_ids: string[]
  appointment_start: string
  appointment_end: string
  booking_id: string
}

const EMPTY: FormState = {
  purpose: '', purposeLabel: '',
  full_name: '',
  budget_range: '', experience_level: '', visit_goal: '',
  visitor_count: 1, notes: '',
  selected_tree_ids: [],
  appointment_start: '', appointment_end: '',
  booking_id: '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateET(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function formatTimeET(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

// Get next N available days starting from tomorrow
function getAvailableDates(count = 14): string[] {
  const dates: string[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (dates.length < count) {
    if (OPEN_DAYS.has(d.getDay())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      dates.push(`${y}-${m}-${day}`)
    }
    d.setDate(d.getDate() + 1)
  }
  return dates
}

function formatDateLabel(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function buildVisitTextMessage(data: FormState): string {
  const lines = [
    'Hi, I want to request a Bonsai Florida garden visit.',
    '',
    `Date: ${formatDateET(data.appointment_start)}`,
    `Time: ${formatTimeET(data.appointment_start)} - ${formatTimeET(data.appointment_end)} ET`,
    `Name: ${data.full_name}`,
    `Purpose: ${data.purposeLabel}`,
  ]

  if (data.budget_range) lines.push(`Budget: ${data.budget_range}`)
  if (data.experience_level) lines.push(`Experience: ${data.experience_level}`)
  if (data.visit_goal) lines.push(`Visit goal: ${data.visit_goal}`)
  lines.push(`Visitors: ${data.visitor_count}`)
  if (data.selected_tree_ids.length) lines.push(`Saved trees: ${data.selected_tree_ids.join(', ')}`)
  if (data.notes.trim()) lines.push(`Notes: ${data.notes.trim()}`)
  lines.push('', 'Please text me back to confirm this visit time.')

  return lines.join('\n')
}

function buildVisitTextUrl(data: FormState): string {
  const smsBase = siteConfig.textBookingUrl.split('?')[0]
  return `${smsBase}?&body=${encodeURIComponent(buildVisitTextMessage(data))}`
}

// ── Progress bar ──────────────────────────────────────────────────────────────

const STEP_LABELS: { key: Step; label: string }[] = [
  { key: 'purpose', label: 'Purpose' },
  { key: 'details', label: 'Details' },
  { key: 'time', label: 'Time' },
  { key: 'confirm', label: 'Confirm' },
]

function Progress({ step }: { step: Step }) {
  const idx = STEP_LABELS.findIndex(s => s.key === step)
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className={`flex flex-col items-center ${i <= idx ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-bold border-2 transition-all ${
              i < idx ? 'bg-forest border-forest text-white' :
              i === idx ? 'bg-white border-forest text-forest' :
              'bg-white border-forest/30 text-ink-light'
            }`}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span className="font-sans text-[10px] text-ink-light mt-1 hidden sm:block">{s.label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`w-10 sm:w-16 h-0.5 mb-3 sm:mb-0 transition-all ${i < idx ? 'bg-forest' : 'bg-forest/20'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Purpose ───────────────────────────────────────────────────────────

function PurposeStep({ onSelect }: { onSelect: (id: string, label: string) => void }) {
  return (
    <div>
      <p className="section-label mb-2 text-center">Book a Garden Visit</p>
      <h1 className="font-serif text-3xl sm:text-4xl text-forest text-center mb-2">
        What brings you in?
      </h1>
      <div className="pink-divider mb-6" />
      <p className="font-sans text-sm text-ink-light text-center max-w-xs mx-auto mb-8">
        Choose the option that fits best — helps us prepare for your visit.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {PURPOSES.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id, p.label)}
            className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-forest/10 hover:border-forest hover:shadow-card-lg text-left transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{p.emoji}</span>
            <div>
              <p className="font-serif text-base text-forest group-hover:text-bonsai-pink transition-colors leading-snug">{p.label}</p>
              <p className="font-sans text-xs text-ink-light mt-0.5 leading-relaxed">{p.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Details ───────────────────────────────────────────────────────────

const inputCls = 'w-full px-4 py-3 rounded-xl border border-forest/20 bg-white font-sans text-sm text-ink placeholder-ink-light/40 focus:outline-none focus:ring-2 focus:ring-forest/30 transition'

function DetailsStep({
  data, onChange, onBack, onNext, error,
}: {
  data: FormState
  onChange: (k: keyof FormState, v: string | number) => void
  onBack: () => void
  onNext: () => void
  error: string
}) {
  const purpose = PURPOSES.find(p => p.id === data.purpose)

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 font-sans text-xs text-ink-light hover:text-forest mb-8 transition-colors">
        ← Back
      </button>

      <p className="section-label mb-2 text-center">Step 2 — Details</p>
      <h2 className="font-serif text-3xl sm:text-4xl text-forest text-center mb-2">Tell us about you</h2>
      <div className="pink-divider mb-6" />

      {/* Purpose badge */}
      <div className="bg-sage-pale rounded-2xl px-4 py-3 flex items-center gap-3 mb-6">
        <span className="text-xl">{purpose?.emoji}</span>
        <div>
          <p className="font-sans text-xs text-ink-light">Visit purpose</p>
          <p className="font-serif text-sm text-forest font-bold">{data.purposeLabel}</p>
        </div>
      </div>

      {/* Saved trees notice */}
      {data.selected_tree_ids.length > 0 && (
        <div className="bg-sage-pale/60 rounded-2xl px-4 py-3 mb-6 border border-forest/10">
          <p className="font-sans text-xs font-semibold text-forest">{data.selected_tree_ids.length} tree{data.selected_tree_ids.length > 1 ? 's' : ''} from your visit list will be included</p>
          <p className="font-sans text-[11px] text-ink-light mt-0.5">{data.selected_tree_ids.join(', ')}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">Full Name *</label>
          <input type="text" value={data.full_name} onChange={e => onChange('full_name', e.target.value)} placeholder="e.g. Maria Nguyen" className={inputCls} />
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">Budget Range</label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map(b => (
              <button
                key={b}
                type="button"
                onClick={() => onChange('budget_range', data.budget_range === b ? '' : b)}
                className={`font-sans text-xs px-3 py-2 rounded-xl border transition-colors ${
                  data.budget_range === b ? 'bg-forest text-white border-forest' : 'bg-white text-ink-light border-forest/20 hover:border-forest'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">Experience Level</label>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => onChange('experience_level', data.experience_level === e ? '' : e)}
                className={`font-sans text-xs px-3 py-2 rounded-xl border transition-colors ${
                  data.experience_level === e ? 'bg-forest text-white border-forest' : 'bg-white text-ink-light border-forest/20 hover:border-forest'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">Visit Goal</label>
          <select value={data.visit_goal} onChange={e => onChange('visit_goal', e.target.value)} className={inputCls}>
            <option value="">Select…</option>
            {VISIT_GOAL_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">Number of Visitors</label>
          <select value={data.visitor_count} onChange={e => onChange('visitor_count', parseInt(e.target.value))} className={inputCls}>
            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}{n === 1 ? ' person' : ' people'}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">Additional Notes</label>
          <textarea
            value={data.notes}
            onChange={e => onChange('notes', e.target.value)}
            placeholder="Preferred days, questions, anything…"
            rows={3}
            className={inputCls + ' resize-none'}
          />
        </div>
      </div>

      {/* Honeypot */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} aria-hidden="true" />

      {error && <p className="font-sans text-xs text-red-500 mt-4">{error}</p>}

      <button onClick={onNext} className="btn-primary w-full justify-center mt-6 text-base py-4 min-h-[52px]">
        Choose a Time →
      </button>
      <p className="font-sans text-xs text-ink-light/50 text-center mt-4">Your info is only used to prepare your visit. We never sell it.</p>
    </div>
  )
}

// ── Step 3: Time ──────────────────────────────────────────────────────────────

interface TimeSlot { start: string; end: string }

function TimeStep({
  data, onBack, onSlotSelect, onBrowseTrees,
}: {
  data: FormState
  onBack: () => void
  onSlotSelect: (slot: TimeSlot) => void
  onBrowseTrees: () => void
}) {
  const dates = getAvailableDates(14)
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [availabilityLimited, setAvailabilityLimited] = useState(false)

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    setAvailabilityLimited(false)
    setSlots([])
    fetch(`/api/booking-slots?date=${selectedDate}&purpose=${encodeURIComponent(data.purposeLabel)}`)
      .then(r => r.json())
      .then(d => {
        setSlots(Array.isArray(d.slots) ? d.slots : [])
        setAvailabilityLimited(Boolean(d.availabilityLimited))
      })
      .catch(() => {
        setSlots([])
        setAvailabilityLimited(false)
      })
      .finally(() => setLoadingSlots(false))
  }, [selectedDate, data.purposeLabel])

  const noTreesSaved = data.selected_tree_ids.length === 0

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 font-sans text-xs text-ink-light hover:text-forest mb-8 transition-colors">
        ← Back
      </button>

      <p className="section-label mb-2 text-center">Step 3 — Choose a Time</p>
      <h2 className="font-serif text-3xl sm:text-4xl text-forest text-center mb-2">When would you like to visit?</h2>
      <div className="pink-divider mb-6" />
      <p className="font-sans text-sm text-ink-light text-center mb-6">
        We&apos;re open {OPEN_DAYS_LABEL}, {OPEN_HOURS_LABEL}
      </p>

      {/* Tree nudge — only when no trees saved */}
      {noTreesSaved && (
        <div className="bg-cream-warm border border-forest/15 rounded-2xl px-4 py-4 mb-6 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">🌿</span>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-forest leading-snug">
              Want us to prepare specific trees?
            </p>
            <p className="font-sans text-xs text-ink-light mt-1 leading-relaxed">
              Browse the collection and save up to 5 trees — we&apos;ll have them ready when you arrive.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={onBrowseTrees}
                className="font-sans text-xs font-bold text-white bg-forest px-3 py-1.5 rounded-xl hover:bg-forest/90 transition-colors"
              >
                Browse Trees →
              </button>
              <span className="font-sans text-xs text-ink-light/60 py-1.5">or pick a time below and we&apos;ll help you choose</span>
            </div>
          </div>
        </div>
      )}

      {/* Date picker */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {dates.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border transition-all font-sans text-xs font-semibold ${
              selectedDate === d
                ? 'bg-forest text-white border-forest shadow-card'
                : 'bg-white text-ink-light border-forest/20 hover:border-forest'
            }`}
          >
            {formatDateLabel(d).split(', ').map((part, i) => (
              <span key={i} className={i === 0 ? 'text-[10px] font-bold tracking-wide uppercase' : 'text-sm mt-0.5'}>{part}</span>
            ))}
            <span className={selectedDate === d ? 'mt-1 text-[10px] text-white/75' : 'mt-1 text-[10px] text-ink-light/60'}>
              {OPEN_HOURS_LABEL}
            </span>
          </button>
        ))}
      </div>

      {/* Slot grid */}
      {loadingSlots && (
        <p className="font-sans text-sm text-ink-light text-center py-10 animate-pulse">Checking availability…</p>
      )}

      {!loadingSlots && slots.length === 0 && (
        <div className="bg-sage-pale rounded-2xl p-6 text-center">
          <p className="font-sans text-sm text-ink-light">No available times on this date. Try another day.</p>
        </div>
      )}

      {!loadingSlots && slots.length > 0 && (
        <>
          {availabilityLimited && (
            <p className="font-sans text-xs text-ink-light text-center mb-3">
              Showing regular visit times. Final availability is confirmed when you book.
            </p>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map(slot => (
              <button
                key={slot.start}
                onClick={() => onSlotSelect(slot)}
                className="bg-white rounded-xl border border-forest/20 hover:border-forest hover:bg-sage-pale/40 py-3 font-sans text-sm font-semibold text-forest transition-all active:scale-[0.97]"
              >
                {formatTimeET(slot.start)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Step 4: Confirm ───────────────────────────────────────────────────────────

function ConfirmStep({
  data, onBack, onSubmit, onBrowseTrees, error,
}: {
  data: FormState
  onBack: () => void
  onSubmit: () => void
  onBrowseTrees: () => void
  error: string
}) {
  const rows: { label: string; value: string }[] = [
    { label: 'Purpose', value: data.purposeLabel },
    { label: 'Date', value: formatDateET(data.appointment_start) },
    { label: 'Time', value: `${formatTimeET(data.appointment_start)} – ${formatTimeET(data.appointment_end)} ET` },
    { label: 'Name', value: data.full_name },
    ...(data.budget_range ? [{ label: 'Budget', value: data.budget_range }] : []),
    ...(data.experience_level ? [{ label: 'Experience', value: data.experience_level }] : []),
    ...(data.visit_goal ? [{ label: 'Visit Goal', value: data.visit_goal }] : []),
    { label: 'Visitors', value: String(data.visitor_count) },
    ...(data.selected_tree_ids.length ? [{ label: 'Saved Trees', value: data.selected_tree_ids.join(', ') }] : []),
    ...(data.notes ? [{ label: 'Notes', value: data.notes }] : []),
  ]

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 font-sans text-xs text-ink-light hover:text-forest mb-8 transition-colors">
        ← Back
      </button>

      <p className="section-label mb-2 text-center">Step 4 — Review</p>
      <h2 className="font-serif text-3xl sm:text-4xl text-forest text-center mb-2">Confirm your visit</h2>
      <div className="pink-divider mb-6" />

      {/* Summary card */}
      <div className="bg-white rounded-3xl border border-forest/10 p-5 mb-6 space-y-2.5">
        {rows.map(row => (
          <div key={row.label} className="flex gap-3">
            <span className="font-sans text-xs font-semibold text-ink-light/60 w-24 flex-shrink-0 pt-0.5">{row.label}</span>
            <span className="font-sans text-sm text-ink">{row.value}</span>
          </div>
        ))}
      </div>

      {/* No-tree nudge */}
      {data.selected_tree_ids.length === 0 && (
        <div className="bg-cream-warm border border-bonsai-pink/30 rounded-2xl px-4 py-4 mb-6 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">🌿</span>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-forest leading-snug">
              Want to pick trees before you arrive?
            </p>
            <p className="font-sans text-xs text-ink-light mt-1 leading-relaxed">
              You haven&apos;t saved any trees yet. Browse the collection and we&apos;ll have your picks ready — or book now and choose when you visit.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={onBrowseTrees}
                className="font-sans text-xs font-bold text-white bg-forest px-3 py-1.5 rounded-xl hover:bg-forest/90 transition-colors"
              >
                Browse Trees →
              </button>
              <span className="font-sans text-xs text-ink-light/60 py-1.5">or text your visit request below — we&apos;ll help you choose in person</span>
            </div>
          </div>
        </div>
      )}

      {/* Hold policy */}
      <p className="font-sans text-xs text-ink-light/70 bg-sage-pale/60 rounded-2xl px-4 py-4 leading-relaxed mb-6">
        Saved trees are prepared for your visit but are not fully reserved until confirmed. A specific tree can be held until your appointment time. Premium or high-demand trees may require a small deposit.
      </p>

      <p className="font-sans text-xs text-ink-light/70 bg-cream-warm border border-forest/10 rounded-2xl px-4 py-4 leading-relaxed mb-6">
        The next button opens a text message with your visit details filled in. Send the text, then wait for us to text back and confirm your appointment.
      </p>

      {error && <p className="font-sans text-xs text-red-500 mb-4 text-center">{error}</p>}

      <button
        onClick={onSubmit}
        className="btn-primary w-full justify-center text-base py-4 min-h-[52px]"
      >
        Text Visit Request →
      </button>
      <p className="font-sans text-xs text-ink-light/50 text-center mt-3">
        Your visit is not confirmed until we text you back.
      </p>
    </div>
  )
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

export default function VisitBookingFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('purpose')
  const [data, setData] = useState<FormState>(EMPTY)
  const [submitError, setSubmitError] = useState('')
  const [detailsError, setDetailsError] = useState('')
  const [draftRestored, setDraftRestored] = useState(false)

  // On mount: restore draft if present, always refresh tree IDs from visit list
  useEffect(() => {
    const list = getVisitList()
    const ids = list.map(item => item.treeCode).filter(Boolean) as string[]
    const draft = loadDraft()

    if (draft && draft.data.full_name) {
      // If saved slot is in the past, drop back to time picker
      const restoredStep: Step =
        draft.step === 'confirm' && draft.data.appointment_start && new Date(draft.data.appointment_start) <= new Date()
          ? 'time'
          : draft.step
      setData({ ...draft.data, selected_tree_ids: ids })
      setStep(restoredStep)
      setDraftRestored(true)
    } else {
      setData(prev => ({ ...prev, selected_tree_ids: ids }))
    }
  }, [])

  function handleBrowseTrees(currentStep: Step) {
    saveDraft(data, currentStep)
    router.push('/trees')
  }

  function handleStartOver() {
    clearDraft()
    setData(EMPTY)
    setStep('purpose')
    setDraftRestored(false)
  }

  function change(k: keyof FormState, v: string | number) {
    setData(prev => ({ ...prev, [k]: v }))
    setDetailsError('')
  }

  function selectPurpose(id: string, label: string) {
    setData(prev => ({ ...prev, purpose: id, purposeLabel: label }))
    setStep('details')
  }

  function validateDetails(): boolean {
    if (!data.full_name.trim()) { setDetailsError('Please enter your name.'); return false }
    return true
  }

  function onSlotSelect(slot: { start: string; end: string }) {
    setData(prev => ({ ...prev, appointment_start: slot.start, appointment_end: slot.end }))
    setStep('confirm')
  }

  function handleSubmit() {
    setSubmitError('')
    try {
      window.location.href = buildVisitTextUrl(data)
      clearDraft()
    } catch {
      setSubmitError('Could not open your text app. Please text us directly with your visit details.')
    }
  }

  return (
    <div className="section-wrap py-14 sm:py-20">
      {/* Resume banner */}
      {draftRestored && (
        <div className="max-w-lg mx-auto mb-6 bg-sage-pale border border-forest/15 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <p className="font-sans text-sm text-forest">
            <span className="font-semibold">Welcome back!</span> Your booking details are saved.
          </p>
          <button
            onClick={handleStartOver}
            className="font-sans text-xs text-ink-light hover:text-forest underline underline-offset-2 flex-shrink-0 transition-colors"
          >
            Start over
          </button>
        </div>
      )}

      <Progress step={step} />

      {step === 'purpose' && <PurposeStep onSelect={selectPurpose} />}

      {step === 'details' && (
        <DetailsStep
          data={data}
          onChange={change}
          onBack={() => setStep('purpose')}
          onNext={() => { if (validateDetails()) setStep('time') }}
          error={detailsError}
        />
      )}

      {step === 'time' && (
        <TimeStep
          data={data}
          onBack={() => setStep('details')}
          onSlotSelect={onSlotSelect}
          onBrowseTrees={() => handleBrowseTrees('time')}
        />
      )}

      {step === 'confirm' && (
        <ConfirmStep
          data={data}
          onBack={() => setStep('time')}
          onSubmit={handleSubmit}
          onBrowseTrees={() => handleBrowseTrees('confirm')}
          error={submitError}
        />
      )}
    </div>
  )
}
