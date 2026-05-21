'use client'

import { useState } from 'react'

const DEFAULT_SUBJECT = 'Bonsai Workshop Idea for Avenir Residents'

export default function AvenirProposalSender() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  async function sendProposal(event: React.FormEvent) {
    event.preventDefault()
    setSending(true)
    setStatus('')

    const res = await fetch('/api/proposals/avenir-bonsai-workshop/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject }),
    })

    const data = await res.json().catch(() => ({}))
    setSending(false)

    if (!res.ok) {
      setStatus(`Send failed: ${data.error?.message ?? data.error ?? res.status}`)
      return
    }

    setStatus(`Sent to ${data.to}. Resend id: ${data.id}`)
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <a href="/admin" className="font-sans text-sm font-semibold text-ink-light hover:text-forest">
          ← Admin
        </a>

        <div className="card mt-5 p-6 sm:p-8">
          <p className="section-label mb-2">Proposal Email</p>
          <h1 className="font-serif text-4xl text-forest">Send Avenir Workshop Proposal</h1>
          <p className="mt-4 font-sans text-sm leading-6 text-ink-light">
            Sends the designed HTML proposal through Resend. Use a test email first, then send to the Avenir contact once the preview looks right.
          </p>

          <form onSubmit={sendProposal} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block font-sans text-sm font-bold text-forest" htmlFor="to">
                Recipient email
              </label>
              <input
                id="to"
                type="email"
                required
                value={to}
                onChange={event => setTo(event.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-forest/20 bg-white px-4 py-3 font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div>
              <label className="mb-2 block font-sans text-sm font-bold text-forest" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={event => setSubject(event.target.value)}
                className="w-full rounded-2xl border border-forest/20 bg-white px-4 py-3 font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={sending} className="btn-primary flex-1 disabled:opacity-60">
                {sending ? 'Sending...' : 'Send Proposal'}
              </button>
              <a href="/email/avenir-bonsai-workshop.html" target="_blank" className="btn-secondary flex-1">
                Preview HTML
              </a>
            </div>

            {status && (
              <p className="rounded-2xl bg-sage-pale px-4 py-3 font-sans text-sm text-forest">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}
