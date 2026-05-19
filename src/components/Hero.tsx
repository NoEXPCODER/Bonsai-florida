import { CONTACT } from '@/config/contact'
import { PhoneIcon, MessageIcon } from '@/components/Icons'

export default function Hero() {
  return (
    <section id="top" className="bg-cream-light">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />

      <div className="max-w-xl mx-auto px-6 py-16 sm:py-20 text-center">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Bonsai Florida"
          width={88}
          height={88}
          className="mx-auto mb-7 w-20 h-20 sm:w-24 sm:h-24"
        />

        {/* Location label */}
        <p className="section-label mb-5">Palm Beach, Florida</p>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(2.4rem,8vw,4rem)] text-forest leading-tight mb-5">
          Tropical Bonsai<br />
          <span className="text-forest-light">for South Florida Living</span>
        </h1>

        <div className="pink-divider mb-6" />

        {/* Subtitle */}
        <p className="font-sans text-xl text-ink-light leading-relaxed mb-11 max-w-sm mx-auto">
          Hand-grown bonsai trees — beautiful, low-maintenance, and ready for your home or garden.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:flex-wrap">
          <a
            href={CONTACT.phone.tel}
            className="btn-primary text-base py-4 px-8 justify-center min-h-[56px]"
            aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
          >
            <PhoneIcon className="w-5 h-5" /> Call Now
          </a>
          <a
            href={CONTACT.phone.sms}
            className="btn-secondary text-base py-4 px-8 justify-center min-h-[56px]"
            aria-label="Text Bonsai Florida"
          >
            <MessageIcon className="w-5 h-5" /> Text Us
          </a>
          <a
            href="/trees"
            className="btn-secondary text-base py-4 px-8 justify-center min-h-[56px]"
          >
            View Available Trees
          </a>
        </div>
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
    </section>
  )
}
