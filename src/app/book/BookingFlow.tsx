'use client'

import { useState, useEffect } from 'react'
import { CONTACT } from '@/config/contact'
import { getVisitList, type VisitItem } from '@/lib/visit-list'

const CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2rQtgIgRIvKdusIMMARHlSxDTqPkyVpjcaRj8FYeULUNtJkIU8sMhWsD9ccA1iymKsd4wjE3Xw?gv=true'

const REASONS = [
  { id: 'buy',      emoji: '🌿', label: 'Buy a Bonsai',              sub: 'Browse and pick a tree to take home' },
  { id: 'browse',   emoji: '👀', label: 'Just Browsing',             sub: 'Enjoy the garden, no pressure' },
  { id: 'care',     emoji: '💧', label: 'Need Care Help',            sub: 'Get advice on your existing bonsai' },
  { id: 'gift',     emoji: '🎁', label: 'Looking for a Gift',        sub: 'Find the perfect tree for someone special' },
  { id: 'specific', emoji: '🔍', label: 'Looking for a Specific Tree', sub: 'Have something in mind already' },
  { id: 'pickup',   emoji: '📦', label: 'Pickup / Delivery Question', sub: 'Ask about logistics' },
]

type Step = 'reason' | 'contact' | 'confirm'

interface FormData {
  reason: string
  reasonLabel: string
  name: string
  email: string
  phone: string
  notes: string
  treeName: string
}

const EMPTY: FormData = { reason: '', reasonLabel: '', name: '', email: '', phone: '', notes: '', treeName: '' }

function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ['reason', 'contact', 'confirm']
  const idx = steps.indexOf(step)
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((s, i) => (
        <div key={s} className={`rounded-full transition-all duration-300 ${
          i === idx ? 'w-6 h-2 bg-forest' : i < idx ? 'w-2 h-2 bg-forest/40' : 'w-2 h-2 bg-forest/15'
        }`} />
      ))}
    </div>
  )
}

// ── Step 1: Reason ──────────────────────────────────────────────────────────

function ReasonStep({ onSelect }: { onSelect: (id: string, label: string) => void }) {
  return (
    <div>
      <p className="section-label mb-2 text-center">Book a Garden Visit</p>
      <h1 className="font-serif text-3xl sm:text-4xl text-forest text-center mb-2">
        What brings you in?
      </h1>
      <div className="pink-divider mb-8" />
      <p className="font-sans text-sm text-ink-light text-center max-w-xs mx-auto mb-10">
        Choose the option that fits best — helps us get ready for your visit.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {REASONS.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id, r.label)}
            className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-forest/10 hover:border-forest hover:shadow-card-lg text-left transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{r.emoji}</span>
            <div>
              <p className="font-serif text-base text-forest group-hover:text-bonsai-pink transition-colors leading-snug">{r.label}</p>
              <p className="font-sans text-xs text-ink-light mt-0.5 leading-relaxed">{r.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Contact ─────────────────────────────────────────────────────────

function ContactStep({
  data,
  onChange,
  onBack,
  onNext,
  loading,
  error,
  savedTrees,
}: {
  data: FormData
  onChange: (k: keyof FormData, v: string) => void
  onBack: () => void
  onNext: () => void
  loading: boolean
  error: string
  savedTrees: VisitItem[]
}) {
  function field(label: string, key: keyof FormData, type = 'text', placeholder = '') {
    return (
      <div>
        <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">
          {label}
        </label>
        <input
          type={type}
          value={data[key] as string}
          onChange={e => onChange(key, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-forest/20 bg-white font-sans text-sm text-ink placeholder-ink-light/40 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
        />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 font-sans text-xs text-ink-light hover:text-forest mb-8 transition-colors">
        ← Back
      </button>

      <p className="section-label mb-2 text-center">Step 2 of 2</p>
      <h2 className="font-serif text-3xl sm:text-4xl text-forest text-center mb-2">
        Tell us who you are
      </h2>
      <div className="pink-divider mb-8" />

      {/* Reason badge */}
      <div className="bg-sage-pale rounded-2xl px-4 py-3 flex items-center gap-3 mb-8">
        <span className="text-xl">{REASONS.find(r => r.id === data.reason)?.emoji}</span>
        <div>
          <p className="font-sans text-xs text-ink-light">You selected</p>
          <p className="font-serif text-sm text-forest font-bold">{data.reasonLabel}</p>
        </div>
      </div>

      <div className="space-y-4">
        {field('Your Name *', 'name', 'text', 'e.g. Maria')}
        {field('Phone Number *', 'phone', 'tel', 'e.g. 561-555-0100')}
        {field('Email (optional)', 'email', 'email', 'e.g. maria@email.com')}

        {data.reason === 'specific' && (
          <div>
            <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">
              Which tree? (optional)
            </label>
            <input
              type="text"
              value={data.treeName}
              onChange={e => onChange('treeName', e.target.value)}
              placeholder="e.g. Tiger Ficus, or code BF-001"
              className="w-full px-4 py-3 rounded-xl border border-forest/20 bg-white font-sans text-sm text-ink placeholder-ink-light/40 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
            />
          </div>
        )}

        <div>
          <label className="block font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-1.5">
            Anything else? (optional)
          </label>
          <textarea
            value={data.notes}
            onChange={e => onChange('notes', e.target.value)}
            placeholder="Preferred days, questions, anything…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-forest/20 bg-white font-sans text-sm text-ink placeholder-ink-light/40 focus:outline-none focus:ring-2 focus:ring-forest/30 transition resize-none"
          />
        </div>

        {savedTrees.length > 0 && (
          <div className="bg-sage-pale rounded-2xl p-4">
            <p className="font-sans text-xs font-semibold text-forest tracking-wide uppercase mb-3">
              Your Saved Trees ({savedTrees.length})
            </p>
            <ul className="space-y-2.5">
              {savedTrees.map(item => (
                <li key={item.id} className="flex items-center gap-3">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm text-forest leading-snug">{item.name}</p>
                    {item.treeCode && <p className="font-sans text-[10px] text-ink-light">{item.treeCode}</p>}
                  </div>
                  <span className="font-sans text-xs font-bold text-bonsai-pink flex-shrink-0">${item.price}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-[11px] text-ink-light/60 mt-3 leading-relaxed">
              We&apos;ll prepare these trees for your visit.
            </p>
          </div>
        )}
      </div>

      {/* Honeypot — hidden from real users, bots fill it */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} aria-hidden="true" />

      {error && (
        <p className="font-sans text-xs text-red-500 mt-4">{error}</p>
      )}

      <button
        onClick={onNext}
        disabled={loading}
        className="btn-primary w-full justify-center mt-6 text-base py-4 min-h-[52px]"
      >
        {loading ? 'Opening your calendar…' : 'Pick Your Visit Time →'}
      </button>

      <p className="font-sans text-xs text-ink-light/50 text-center mt-4">
        Your info is only used to prepare your visit. We never sell it.
      </p>
    </div>
  )
}

const SESSION_KEY = 'bf_booking_confirmed'
const CALENDAR_VISITED_KEY = 'bf_calendar_visited'

// ── Step 3: Confirm + What to Expect ────────────────────────────────────────

function ConfirmStep({ data, returning, onRestart }: { data: FormData; returning: boolean; onRestart: () => void }) {
  const smsBody = encodeURIComponent(
    `Hi! I just booked a visit — my name is ${data.name}. I'm coming to ${data.reasonLabel.toLowerCase()}.${data.treeName ? ` I'm interested in the ${data.treeName}.` : ''}${data.notes ? ` Notes: ${data.notes}` : ''}`
  )

  function handleCalendarClick() {
    sessionStorage.setItem(CALENDAR_VISITED_KEY, '1')
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Success header */}
      <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center mx-auto mb-6 text-3xl">
        ✓
      </div>
      {returning ? (
        <>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest mb-3">
            You&rsquo;re all set, {data.name.split(' ')[0]}!
          </h2>
          <p className="font-sans text-sm text-ink-light mb-8">
            Your visit time is confirmed. See you soon — we&apos;ll have the trees ready.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest mb-3">
            Almost done, {data.name.split(' ')[0]}!
          </h2>
          <p className="font-sans text-sm text-ink-light mb-8">
            Your info is saved. One last step — pick your visit time below.
          </p>
        </>
      )}

      {/* Calendar link — same tab, no popup, back button always returns here */}
      <a
        href={CALENDAR_URL}
        onClick={handleCalendarClick}
        className="btn-primary w-full justify-center text-base py-4 min-h-[52px] mb-3"
      >
        {returning ? 'Pick a Different Time →' : 'Pick Your Visit Time →'}
      </a>

      {/* Secondary — text us */}
      <a
        href={`${CONTACT.phone.sms}&body=${smsBody}`}
        className="btn-secondary w-full justify-center text-sm py-3 mb-10"
      >
        Or Text Us to Arrange a Visit
      </a>

      {/* What to expect */}
      <div className="bg-white rounded-3xl border border-forest/10 p-6 text-left space-y-5">
        <h3 className="font-serif text-lg text-forest">What to Expect</h3>

        <div className="space-y-4">
          {[
            {
              icon: '📍',
              title: 'Location shared at confirmation',
              body: 'After you pick your time, the exact address and parking directions will be in your calendar confirmation.',
            },
            {
              icon: '⏱️',
              title: 'Plan for 30–60 minutes',
              body: 'Most visits take about half an hour. Take your time — there\'s no rush.',
            },
            {
              icon: '☀️',
              title: 'Outdoor garden',
              body: 'We\'re an outdoor nursery. Wear comfortable shoes and clothes you don\'t mind getting a little dusty.',
            },
            {
              icon: '🌿',
              title: 'No pressure, ever',
              body: 'Browse freely. We love talking bonsai whether you buy anything or not.',
            },
            {
              icon: '📱',
              title: 'Questions before your visit?',
              body: (
                <span>
                  Text us at{' '}
                  <a href={CONTACT.phone.sms} className="text-forest font-semibold underline">
                    {CONTACT.phone.display}
                  </a>{' '}
                  — we reply fast.
                </span>
              ),
            },
          ].map(item => (
            <div key={item.icon} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="font-sans text-sm font-semibold text-forest">{item.title}</p>
                <p className="font-sans text-xs text-ink-light leading-relaxed mt-0.5">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 font-sans text-xs text-ink-light/50 hover:text-ink-light transition-colors"
      >
        Book another visit
      </button>
    </div>
  )
}

// ── Main orchestrator ────────────────────────────────────────────────────────

export default function BookingFlow() {
  const [step, setStep] = useState<Step>('reason')
  const [data, setData] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedTrees, setSavedTrees] = useState<VisitItem[]>([])
  const [returning, setReturning] = useState(false)

  useEffect(() => {
    setSavedTrees(getVisitList())
    // Restore confirm step if user navigated to Calendar and pressed back
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as FormData
        setData(parsed)
        setStep('confirm')
        if (sessionStorage.getItem(CALENDAR_VISITED_KEY)) {
          setReturning(true)
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }, [])

  function change(k: keyof FormData, v: string) {
    setData(prev => ({ ...prev, [k]: v }))
    setError('')
  }

  function selectReason(id: string, label: string) {
    setData(prev => ({ ...prev, reason: id, reasonLabel: label }))
    setStep('contact')
  }

  async function submit() {
    if (!data.name.trim()) { setError('Please enter your name.'); return }
    if (!data.phone.trim()) { setError('Please enter your phone number.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: data.reasonLabel,
          name: data.name,
          email: data.email || null,
          phone: data.phone,
          notes: data.notes || null,
          tree_name: data.treeName || null,
          saved_trees: savedTrees.length > 0 ? savedTrees : null,
          _hp: '',
        }),
      })
      if (!res.ok) throw new Error()
      // Store data so back-button restores the confirm page
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
      sessionStorage.setItem(CALENDAR_VISITED_KEY, '1')
      // Go straight to Calendar — no extra tap needed
      window.location.href = CALENDAR_URL
    } catch {
      setError('Something went wrong. Please try again or text us directly.')
      setLoading(false)
    }
  }

  return (
    <div className="section-wrap py-14 sm:py-20">
      <StepDots step={step} />

      {step === 'reason' && (
        <ReasonStep onSelect={selectReason} />
      )}

      {step === 'contact' && (
        <ContactStep
          data={data}
          onChange={change}
          onBack={() => setStep('reason')}
          onNext={submit}
          loading={loading}
          error={error}
          savedTrees={savedTrees}
        />
      )}

      {step === 'confirm' && (
        <ConfirmStep
          data={data}
          returning={returning}
          onRestart={() => {
            sessionStorage.removeItem(SESSION_KEY)
            sessionStorage.removeItem(CALENDAR_VISITED_KEY)
            setData(EMPTY)
            setReturning(false)
            setStep('reason')
          }}
        />
      )}
    </div>
  )
}
