'use client'

import { CONTACT } from '@/config/contact'
import { useMessages } from '@/lib/i18n'
import { PhoneIcon, MessageIcon } from '@/components/Icons'

export default function Hero() {
  const m = useMessages()
  const t = m.hero

  return (
    <section id="top" className="bg-cream-light">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />

      <div className="max-w-xl mx-auto px-6 py-16 sm:py-20 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Bonsai Florida"
          width={88}
          height={88}
          className="mx-auto mb-7 w-20 h-20 sm:w-24 sm:h-24"
        />

        <p className="section-label mb-5">{t.location}</p>

        <h1 className="font-serif text-[clamp(2.4rem,8vw,4rem)] text-forest leading-tight mb-5">
          {t.tagline}
        </h1>

        <div className="pink-divider mb-6" />

        <p className="font-sans text-xl text-ink-light leading-relaxed mb-11 max-w-sm mx-auto">
          {t.description}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:flex-wrap">
          <a
            href={CONTACT.phone.tel}
            className="btn-primary text-base py-4 px-8 justify-center min-h-[56px]"
            aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
          >
            <PhoneIcon className="w-5 h-5" /> {t.callNow}
          </a>
          <a
            href={CONTACT.phone.sms}
            className="btn-secondary text-base py-4 px-8 justify-center min-h-[56px]"
            aria-label="Text Bonsai Florida"
          >
            <MessageIcon className="w-5 h-5" /> {t.textUs}
          </a>
          <a
            href="/trees"
            className="btn-secondary text-base py-4 px-8 justify-center min-h-[56px]"
          >
            {t.viewTrees}
          </a>
        </div>
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
    </section>
  )
}
