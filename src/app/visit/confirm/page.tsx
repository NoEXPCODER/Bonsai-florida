import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import { CONTACT } from '@/config/contact'

export const dynamic = 'force-dynamic'

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

export default async function VisitConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; name?: string; start?: string; end?: string; purpose?: string }>
}) {
  const params = await searchParams
  const { id, name, start, end, purpose } = params

  let logoUrl: string | null = null
  try {
    const db = createServerClient()
    const { data } = await db
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_url')
      .maybeSingle()
    logoUrl = data?.value ?? null
  } catch {
    logoUrl = null
  }

  const firstName = name?.split(' ')[0] ?? 'there'
  const hasDetails = !!(start && end && purpose)

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <main className="min-h-screen bg-cream">
        <div className="section-wrap py-14 sm:py-20 max-w-lg mx-auto text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-forest flex items-center justify-center mx-auto mb-6 text-4xl text-white">
            ✓
          </div>

          <p className="section-label mb-2">Booking Confirmed</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-forest mb-3">
            Your garden visit is booked, {firstName}!
          </h1>
          <div className="pink-divider mb-6" />

          {hasDetails && (
            <div className="bg-white rounded-3xl border border-forest/10 p-6 mb-6 text-left space-y-3">
              <div className="flex gap-3">
                <span className="font-sans text-xs font-semibold text-ink-light/60 w-20 flex-shrink-0 pt-0.5">Purpose</span>
                <span className="font-sans text-sm text-ink">{purpose}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-sans text-xs font-semibold text-ink-light/60 w-20 flex-shrink-0 pt-0.5">Date</span>
                <span className="font-sans text-sm text-ink">{formatDateET(start!)}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-sans text-xs font-semibold text-ink-light/60 w-20 flex-shrink-0 pt-0.5">Time</span>
                <span className="font-sans text-sm text-ink">
                  {formatTimeET(start!)} – {formatTimeET(end!)} Eastern
                </span>
              </div>
              {id && (
                <div className="flex gap-3">
                  <span className="font-sans text-xs font-semibold text-ink-light/60 w-20 flex-shrink-0 pt-0.5">Ref #</span>
                  <span className="font-mono text-xs text-ink-light">{id.slice(0, 8).toUpperCase()}</span>
                </div>
              )}
            </div>
          )}

          <p className="font-sans text-sm text-ink-light mb-4">
            Please check your email for confirmation details.
          </p>

          <p className="font-sans text-sm text-ink-light mb-8">
            Text is preferred for updates — we reply fast.{' '}
            <a href={CONTACT.phone.sms} className="text-forest underline font-semibold">
              Text {CONTACT.phone.display}
            </a>
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mb-10">
            <Link href="/trees" className="btn-primary justify-center text-base py-4">
              View the Tree Inventory
            </Link>
            <Link href="/care-guides" className="btn-secondary justify-center text-sm py-3">
              Browse Care Guides
            </Link>
          </div>

          {/* What to bring */}
          <div className="bg-white rounded-3xl border border-forest/10 p-6 text-left space-y-4">
            <h3 className="font-serif text-lg text-forest">What to expect</h3>
            {[
              { icon: '☀️', title: 'Outdoor garden', body: 'Wear comfortable shoes and clothes you don\'t mind getting dusty.' },
              { icon: '⏱️', title: 'Plan 30–60 minutes', body: 'Most visits take about half an hour. No rush.' },
              { icon: '🌿', title: 'Trees prepared for you', body: 'We\'ll have your saved trees and matching options ready when you arrive.' },
              { icon: '📱', title: 'Questions before your visit?', body: `Text us at ${CONTACT.phone.display} — we reply fast.` },
            ].map(item => (
              <div key={item.icon} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-forest">{item.title}</p>
                  <p className="font-sans text-xs text-ink-light mt-0.5">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/visit" className="mt-8 block font-sans text-xs text-ink-light/50 hover:text-ink-light transition-colors">
            Book another visit
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
