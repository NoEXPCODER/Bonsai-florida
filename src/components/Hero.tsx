'use client'

import { CONTACT } from '@/config/contact'
import { useMessages } from '@/lib/i18n'
import { PhoneIcon, MessageIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/Icons'
import type { DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'

const SOCIALS = [
  { href: CONTACT.social.instagram.url, icon: InstagramIcon, label: 'Instagram' },
  { href: CONTACT.social.facebook.url,  icon: FacebookIcon,  label: 'Facebook'  },
  { href: CONTACT.social.tiktok.url,    icon: TikTokIcon,    label: 'TikTok'    },
]

interface HeroProps {
  featuredTree?: DbTree | null
  logoUrl?: string | null
}

export default function Hero({ featuredTree, logoUrl = null }: HeroProps) {
  const t = useMessages().hero
  const photo = featuredTree ? getPrimaryTreeImageUrl(featuredTree) : null
  const logoSrc = logoUrl ?? '/logo.svg'

  return (
    <section id="top" className="bg-cream-light">
      <div className="section-wrap py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: text ─────────────────────────────────────── */}
          <div>
            {/* Brand row */}
            <div className="flex items-center gap-4 mb-10 sm:mb-12">
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

            {/* Headline */}
            <h1 className="font-serif text-[clamp(2.6rem,6vw,4.2rem)] text-forest leading-[1.07] mb-5">
              {t.tagline}
            </h1>

            <div className="w-16 h-0.5 bg-bonsai-pink mb-6" />

            {/* Subtitle */}
            <p className="font-sans text-lg text-ink-light leading-relaxed mb-10 max-w-md">
              {t.description}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={CONTACT.phone.tel}
                className="btn-primary text-base py-3.5 px-7 min-h-[52px]"
                aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
              >
                <PhoneIcon className="w-5 h-5" /> {t.callNow}
              </a>
              <a
                href={CONTACT.phone.sms}
                className="btn-secondary text-base py-3.5 px-7 min-h-[52px]"
                aria-label="Text Bonsai Florida"
              >
                <MessageIcon className="w-5 h-5" /> {t.textUs}
              </a>
              <a
                href="/trees"
                className="btn-secondary text-base py-3.5 px-7 min-h-[52px]"
              >
                {t.viewTrees}
              </a>
            </div>

            {/* Social icons row */}
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

          {/* ── Right: photo ───────────────────────────────────── */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-sage-pale shadow-card-lg">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt={featuredTree?.name ?? 'Featured bonsai'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20 text-6xl">🌿</div>
              )}

              {/* LOCAL COLLECTION badge */}
              <span className="absolute top-4 left-4 font-sans text-[10px] font-bold tracking-[0.2em] uppercase bg-white/90 text-forest px-3 py-1.5 rounded-full shadow-soft">
                {t.localCollection}
              </span>

              {/* Frosted glass card */}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md rounded-2xl p-4 max-w-[190px] shadow-card">
                <p className="font-serif text-forest text-sm leading-snug mb-1">
                  {t.careGuideCard}
                </p>
                <p className="font-sans text-xs text-ink-light leading-relaxed">
                  {t.careGuideCardSub}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
