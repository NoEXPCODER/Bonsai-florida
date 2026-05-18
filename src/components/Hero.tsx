'use client'

import { CONTACT } from '@/config/contact'
import { useMessages } from '@/lib/i18n'
import {
  PhoneIcon,
  MessageIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  YouTubeIcon,
  EmailIcon,
} from '@/components/Icons'

export default function Hero() {
  const m = useMessages()
  const t = m.hero

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-cream"
      aria-label="Welcome to Bonsai Florida"
    >
      {/* Top pink accent line */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />

      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-sage-pale/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-bonsai-pink-pale/30 blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-wrap relative py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: text content ── */}
          <div>
            <p className="section-label mb-4">{t.location}</p>

            <h1 className="font-serif text-forest leading-none mb-2">
              <span className="block text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-tight">
                Bonsai
              </span>
              <span className="block text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-tight text-forest-light">
                Florida
              </span>
            </h1>

            <div className="w-16 h-0.5 bg-bonsai-pink mt-4 mb-6" />

            <p className="font-serif italic text-bonsai-pink text-xl sm:text-2xl mb-3">
              {t.tagline}
            </p>

            <p className="font-sans text-ink-light text-lg sm:text-xl leading-relaxed max-w-lg mb-10">
              {t.description}
            </p>

            {/* Primary CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={CONTACT.phone.tel}
                className="btn-primary"
                aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
              >
                <PhoneIcon className="w-5 h-5" />
                {t.callNow}
              </a>
              <a
                href={CONTACT.phone.sms}
                className="btn-secondary"
                aria-label="Send a text message to Bonsai Florida"
              >
                <MessageIcon className="w-5 h-5" />
                {t.textUs}
              </a>
              <a
                href="#collection"
                className="btn-secondary"
                aria-label="View available bonsai trees"
              >
                {t.viewTrees}
              </a>
            </div>

            {/* Social quick links */}
            <div>
              <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-3">
                {t.alsoOn}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: 'Facebook',
                    url: CONTACT.social.facebook.url,
                    icon: <FacebookIcon className="w-4 h-4" />,
                  },
                  {
                    label: 'Instagram',
                    url: CONTACT.social.instagram.url,
                    icon: <InstagramIcon className="w-4 h-4" />,
                  },
                  {
                    label: 'TikTok',
                    url: CONTACT.social.tiktok.url,
                    icon: <TikTokIcon className="w-4 h-4" />,
                  },
                  {
                    label: 'YouTube',
                    url: CONTACT.social.youtube.url,
                    icon: <YouTubeIcon className="w-4 h-4" />,
                  },
                  {
                    label: 'Email',
                    url: CONTACT.email.href,
                    icon: <EmailIcon className="w-4 h-4" />,
                  },
                ].map(({ label, url, icon }) => (
                  <a
                    key={label}
                    href={url}
                    className="btn-social"
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                    aria-label={`Visit Bonsai Florida on ${label}`}
                  >
                    {icon}
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: decorative display card ── */}
          <div className="relative flex justify-center lg:justify-end" aria-hidden="true">
            <div className="w-full max-w-sm sm:max-w-md relative">
              <div className="absolute inset-0 border-2 border-forest/20 rounded-4xl translate-x-3 translate-y-3" />
              <div className="relative card p-6 sm:p-8 shadow-card-lg overflow-hidden">
                {/* Corner marks */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-forest/40 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-forest/40 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-forest/40 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-forest/40 rounded-br-lg" />

                {/* Bonsai illustration placeholder */}
                <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-forest to-forest-light flex flex-col items-center justify-end pb-10 mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-forest-dark/60 to-transparent" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-28 h-20 rounded-full bg-white/10 blur-md absolute -top-2 left-1/2 -translate-x-1/2" />
                      <div className="w-20 h-14 rounded-full bg-white/15 relative" />
                    </div>
                    <div className="w-2.5 h-10 bg-white/20 rounded-full mx-auto" />
                    <div className="w-14 h-5 bg-white/15 rounded-b-lg rounded-t-sm" />
                  </div>
                  <div className="absolute top-8 left-8 text-2xl opacity-60">🌸</div>
                  <div className="absolute top-12 right-10 text-lg opacity-50">🌸</div>
                  <div className="absolute top-20 left-16 text-sm opacity-40">🌸</div>
                </div>

                <div className="text-center">
                  <div className="pink-divider mb-4" />
                  <h2 className="font-serif text-2xl text-forest tracking-wide mb-1">
                    Bonsai Florida
                  </h2>
                  <p className="font-sans text-xs text-ink-light tracking-[0.18em] uppercase">
                    {t.cardSpecies}
                  </p>
                  <div className="pink-divider mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
    </section>
  )
}
