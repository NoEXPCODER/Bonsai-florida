'use client'

import { useState, useEffect } from 'react'
import { useVisitList } from '@/hooks/useVisitList'
import { MAX_VISIT_LIST } from '@/lib/visit-list'
import { siteConfig } from '@/lib/siteConfig'
import { saveCustomer } from '@/lib/customer-session'
import { useAuth } from '@/lib/i18n'

interface Props {
  open: boolean
  onClose: () => void
}

export default function VisitListDrawer({ open, onClose }: Props) {
  const { list, remove, count } = useVisitList()
  const { customer, setCustomer } = useAuth()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    if (open && customer) { setName(customer.name) }
  }, [open, customer])

  if (!open) return null

  const needsContact = count >= 4 && !customer && !saved

  const smsBody = encodeURIComponent(
    count > 0
      ? `Hi! My visit list:\n${list.map((t, i) => `${i + 1}. ${t.name}${t.treeCode ? ` (${t.treeCode})` : ''} — $${t.price}`).join('\n')}`
      : 'Hi, I want to request a Bonsai Florida garden visit. Please text me back to confirm a time.'
  )

  function handleSaveContact(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setContactError('Please enter your name.'); return }
    const c = { name: name.trim(), phone: '' }
    saveCustomer(c)
    setCustomer(c)
    setSaved(true)
    setContactError('')
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-forest/20" />
        </div>

        <div className="px-5 pb-8 pt-2">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-serif text-2xl text-forest">Your Visit List</h2>
              <p className="font-sans text-xs text-ink-light mt-0.5">
                {count === 0
                  ? 'No trees saved yet.'
                  : `${count} of ${MAX_VISIT_LIST} trees saved`}
              </p>
            </div>
            <button onClick={onClose} className="text-ink-light hover:text-forest text-2xl leading-none mt-1">✕</button>
          </div>

          <p className="font-sans text-sm text-ink-light leading-relaxed mb-5">
            Save up to {MAX_VISIT_LIST} trees before requesting a visit. This helps us prepare the best options for your visit.
          </p>

          {count === 0 && (
            <div className="bg-sage-pale rounded-2xl p-6 text-center mb-5">
              <p className="font-sans text-sm text-ink-light mb-4">
                Not sure what to pick? Tell us your budget and experience level, and we&apos;ll prepare beginner-friendly options.
              </p>
              <a href={siteConfig.bookingUrl} onClick={onClose} className="btn-secondary text-sm justify-center w-full">
                Help Me Choose
              </a>
            </div>
          )}

          {count > 0 && (
            <ul className="space-y-3 mb-5">
              {list.map(item => (
                <li key={item.id} className="flex items-center gap-3 bg-cream rounded-2xl p-3">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm text-forest font-bold leading-snug">{item.name}</p>
                    <p className="font-sans text-xs text-bonsai-pink font-bold">${item.price}</p>
                    {item.treeCode && <p className="font-sans text-[10px] text-ink-light/60">{item.treeCode}</p>}
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="flex-shrink-0 font-sans text-xs text-ink-light/50 hover:text-red-400 transition-colors px-2 py-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {needsContact && (
            <form onSubmit={handleSaveContact} className="bg-sage-pale rounded-2xl p-4 mb-5">
              <p className="font-sans text-xs font-semibold text-forest mb-3">
                Your list is getting serious. Add your name so we can match it to your text:
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-forest/20 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
                {contactError && (
                  <p className="font-sans text-xs text-red-500">{contactError}</p>
                )}
                <button type="submit" className="btn-primary w-full justify-center text-sm py-2.5">
                  Save My List
                </button>
              </div>
            </form>
          )}

          {count > 0 && (
            <p className="font-sans text-[11px] text-ink-light/60 leading-relaxed mb-5">
              Saved trees are prepared for your visit but are not fully reserved until confirmed. A specific tree can be held until your appointment time. Premium trees may require a small deposit.
            </p>
          )}

          <div className="space-y-2.5">
            {count > 0 && (
              <a href={siteConfig.bookingUrl} onClick={onClose} className="btn-primary w-full justify-center text-base py-4">
                Request Visit With These Trees
              </a>
            )}
            <a href={`${siteConfig.textBookingUrl.split('?')[0]}?&body=${smsBody}`} onClick={onClose} className={`w-full justify-center text-sm py-3 ${count > 0 ? 'btn-secondary' : 'btn-primary'}`}>
              Text Visit Request
            </a>
            <button onClick={onClose} className="w-full text-center font-sans text-sm text-ink-light hover:text-forest transition-colors py-2">
              Keep Browsing
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
