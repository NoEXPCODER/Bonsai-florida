'use client'

import { CONTACT } from '@/config/contact'
import type { DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { useMessages } from '@/lib/i18n'
import { FacebookIcon, InstagramIcon, MessageIcon, PhoneIcon, TikTokIcon } from '@/components/Icons'

interface HeroProps {
  trees?: DbTree[]
  logoUrl?: string | null
}

function HeroImage({ tree, logoSrc }: { tree: DbTree | null; logoSrc: string }) {
  const m = useMessages()
  const t = m.hero
  const image = tree ? getPrimaryTreeImageUrl(tree) : null
  const imageAlt = tree?.name ? `${tree.name} bonsai` : 'Bonsai Florida tree'

  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="absolute -inset-4 rounded-[2rem] bg-bonsai-pink-pale/40 blur-2xl lg:-inset-6" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-forest/10 bg-cream-light shadow-card-lg">
        <div className="relative aspect-[4/5] min-h-[420px] bg-gradient-to-br from-sage-pale via-cream-light to-cream-warm lg:min-h-[590px]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={imageAlt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_32%,rgba(200,101,138,0.18),transparent_34%),linear-gradient(145deg,#fffdf8,#e8f0e8)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt=""
                aria-hidden
                className="h-60 w-72 object-contain opacity-90"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.png' }}
              />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-forest/75 via-forest/20 to-transparent" aria-hidden="true" />
          <div className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-forest shadow-soft">
            {t.localCollection}
          </div>
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/92 p-4 shadow-card backdrop-blur-sm sm:left-auto sm:w-72">
            <p className="font-serif text-xl leading-tight text-forest">{t.careIncluded}</p>
            <p className="mt-1 font-sans text-sm leading-relaxed text-ink-light">{t.careIncludedSub}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero({ trees = [], logoUrl = null }: HeroProps) {
  const m = useMessages()
  const t = m.hero
  const logoSrc = logoUrl ?? '/logo.png'
  const heroTree = trees.find(tree => getPrimaryTreeImageUrl(tree)) ?? null
  const socialLinks = [
    CONTACT.social.instagram,
    CONTACT.social.facebook,
    CONTACT.social.tiktok,
  ]
  const socialIcons = [InstagramIcon, FacebookIcon, TikTokIcon]

  return (
    <section id="top" className="bg-gradient-to-b from-cream-light to-cream">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-10 sm:px-6 sm:py-14 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1fr_0.92fr] lg:gap-14 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <div className="mb-6 flex flex-col items-center gap-4 lg:mb-8 lg:flex-row lg:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Bonsai Florida"
              width={96}
              height={120}
              className="h-24 w-28 object-contain sm:h-28 sm:w-32 lg:h-24 lg:w-28"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.png' }}
            />
            <div>
              <p className="section-label mb-2">{t.location}</p>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.26em] text-forest/55">
                {t.premiumTag}
              </p>
            </div>
          </div>

          <h1 className="font-serif text-[clamp(3rem,12vw,4.25rem)] leading-[0.96] text-forest sm:text-[4.75rem] lg:max-w-[680px] lg:text-[4.6rem] xl:text-[5rem]">
            {t.tagline}
          </h1>

          <div className="mx-auto my-6 h-px w-24 bg-bonsai-pink-lt lg:mx-0 lg:my-7" />

          <p className="mx-auto max-w-md font-sans text-xl leading-relaxed text-ink-light sm:text-2xl lg:mx-0 lg:max-w-[560px]">
            {t.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={CONTACT.phone.tel}
              className="btn-primary justify-center px-7 py-4 text-base lg:px-8"
              aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
            >
              <PhoneIcon className="h-5 w-5" /> {t.callNow}
            </a>
            <a
              href={CONTACT.phone.sms}
              className="btn-secondary justify-center px-7 py-4 text-base lg:px-8"
              aria-label="Text Bonsai Florida"
            >
              <MessageIcon className="h-5 w-5" /> {t.textUs}
            </a>
            <a
              href="/trees"
              className="btn-secondary justify-center px-7 py-4 text-base lg:px-8"
            >
              {t.viewTrees}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-forest/55 lg:justify-start">
            <span>{t.alsoOn}</span>
            {socialLinks.map((social, index) => {
              const Icon = socialIcons[index]
              return (
                <a
                  key={social.label}
                  href={social.url}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 bg-white/70 text-forest transition-colors hover:border-bonsai-pink hover:text-bonsai-pink"
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>

        <HeroImage tree={heroTree} logoSrc={logoSrc} />
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
    </section>
  )
}
