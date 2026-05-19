'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { CONTACT } from '@/config/contact'
import { useMessages } from '@/lib/i18n'
import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/Icons'
import type { DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import DistanceBadge from '@/components/DistanceBadge'

const SOCIALS = [
  { href: CONTACT.social.instagram.url, icon: InstagramIcon, label: 'Instagram' },
  { href: CONTACT.social.facebook.url,  icon: FacebookIcon,  label: 'Facebook'  },
  { href: CONTACT.social.tiktok.url,    icon: TikTokIcon,    label: 'TikTok'    },
]

// ── Photo swiper ──────────────────────────────────────────────────────────────

interface Photo { url: string; name: string }

function PhotoSwiper({ photos, t }: { photos: Photo[]; t: { localCollection: string; careGuideCard: string; careGuideCardSub: string } }) {
  const [idx, setIdx] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const total = photos.length

  const next = useCallback(() => setIdx(i => (i + 1) % total), [total])
  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next, total])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev() }
    touchStartX.current = null
  }

  if (photos.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-sage-pale shadow-card-lg flex items-center justify-center">
        <span className="text-6xl opacity-20">🌿</span>
      </div>
    )
  }

  return (
    <div
      className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-sage-pale shadow-card-lg select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={idx}
        src={photos[idx].url}
        alt={photos[idx].name}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* LOCAL COLLECTION badge */}
      <span className="absolute top-4 left-4 font-sans text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 text-forest px-3 py-1.5 rounded-full shadow-soft">
        {t.localCollection}
      </span>

      {/* Dot indicators — visible only when multiple photos */}
      {total > 1 && (
        <div className="absolute top-4 right-4 flex gap-1.5 items-center">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Photo ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === idx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Frosted care-guide card — hidden on small mobile so it doesn't cover the photo */}
      <div className="hidden sm:block absolute bottom-4 right-4 bg-white/80 backdrop-blur-md rounded-2xl p-4 max-w-[180px] shadow-card">
        <p className="font-serif text-forest text-sm leading-snug mb-1">
          {t.careGuideCard}
        </p>
        <p className="font-sans text-xs text-ink-light leading-relaxed">
          {t.careGuideCardSub}
        </p>
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

interface HeroProps {
  trees?: DbTree[]
  logoUrl?: string | null
}

export default function Hero({ trees = [], logoUrl = null }: HeroProps) {
  const t = useMessages().hero
  const logoSrc = logoUrl ?? '/logo.svg'

  const photos: Photo[] = trees
    .map(tree => ({ url: getPrimaryTreeImageUrl(tree) ?? '', name: tree.name }))
    .filter(p => p.url)

  return (
    <section id="top" className="bg-cream-light">
      <div className="section-wrap py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: text ─────────────────────────────────────── */}
          <div>
            {/* Brand row */}
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="Bonsai Florida" className="w-14 h-14 object-contain flex-shrink-0" />
              <div className="w-px h-12 bg-forest/20 flex-shrink-0" />
              <div>
                <p className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-bonsai-pink leading-tight">
                  {t.location}
                </p>
                <p className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-light leading-tight mt-0.5">
                  {t.nursery}
                </p>
              </div>
            </div>

            <DistanceBadge className="font-sans text-[11px] font-semibold text-bonsai-pink mb-5 block" />

            <h1 className="font-serif text-[clamp(2.6rem,6vw,4.2rem)] text-forest leading-[1.07] mb-5">
              {t.tagline}
            </h1>

            <div className="w-16 h-0.5 bg-bonsai-pink mb-6" />

            <p className="font-sans text-lg text-ink-light leading-relaxed mb-8 max-w-md">
              {t.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <a href="/book" className="btn-primary text-base py-3.5 px-7 min-h-[52px]">
                {t.bookVisit}
              </a>
              <a href="/trees" className="btn-secondary text-base py-3.5 px-7 min-h-[52px]">
                {t.viewTrees}
              </a>
            </div>
            <a
              href={CONTACT.phone.sms}
              className="font-sans text-sm text-ink-light hover:text-forest transition-colors underline underline-offset-2"
            >
              {t.textInterest} →
            </a>

            <div className="flex items-center gap-4">
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-ink-light/50">
                {t.alsoOn}
              </span>
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-forest/20 flex items-center justify-center text-ink-light hover:text-forest hover:border-forest transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: swipeable photo carousel ────────────────── */}
          <PhotoSwiper photos={photos} t={t} />

        </div>
      </div>
    </section>
  )
}
