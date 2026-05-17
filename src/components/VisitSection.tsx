import { CONTACT } from '@/config/contact'
import { PhoneIcon, MessageIcon, MapPinIcon } from '@/components/Icons'

export default function VisitSection() {
  return (
    <section
      id="visit"
      className="bg-cream py-20 sm:py-24"
      aria-labelledby="visit-heading"
    >
      <div className="section-wrap">
        {/* Outer decorative frame — poster-border style */}
        <div className="relative max-w-3xl mx-auto">
          {/* Offset shadow frame */}
          <div className="absolute inset-0 border-2 border-forest/15 rounded-4xl translate-x-4 translate-y-4" aria-hidden="true" />

          <div className="relative bg-forest rounded-4xl overflow-hidden shadow-card-lg">
            {/* Top pink rule */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

            <div className="px-8 py-14 sm:px-16 sm:py-16 text-center">
              {/* Corner flourishes */}
              <div className="absolute top-6 left-6 text-white/20 text-2xl select-none" aria-hidden="true">🌸</div>
              <div className="absolute top-6 right-6 text-white/20 text-2xl select-none" aria-hidden="true">🌸</div>

              {/* Location badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8">
                <MapPinIcon className="w-4 h-4 text-bonsai-pink-lt" />
                <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
                  Palm Beach, Florida
                </span>
              </div>

              {/* Heading */}
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-bonsai-pink-lt mb-3">
                Garden visits welcome
              </p>
              <h2
                id="visit-heading"
                className="font-serif text-white text-4xl sm:text-5xl leading-tight mb-5"
              >
                Visit Bonsai Florida
              </h2>

              {/* Pink divider */}
              <div className="w-16 h-px bg-bonsai-pink mx-auto mb-7" />

              {/* Body text */}
              <p className="font-sans text-white/80 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto mb-10">
                Want to see the trees in person? Call or text us to plan a
                relaxed bonsai garden visit. We love sharing the collection
                with anyone who has a love for beautiful trees.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={CONTACT.phone.tel}
                  className="inline-flex items-center justify-center gap-3 bg-white text-forest rounded-full px-10 py-4 font-sans font-bold text-base tracking-wide shadow-card hover:bg-cream transition-colors min-h-[56px]"
                  aria-label={`Call us at ${CONTACT.phone.display} to plan a visit`}
                >
                  <PhoneIcon className="w-5 h-5" />
                  Call Now
                </a>
                <a
                  href={CONTACT.phone.sms}
                  className="inline-flex items-center justify-center gap-3 border-2 border-white/50 text-white rounded-full px-10 py-4 font-sans font-bold text-base tracking-wide hover:bg-white/10 transition-colors min-h-[56px]"
                  aria-label="Send us a text to plan a visit"
                >
                  <MessageIcon className="w-5 h-5" />
                  Text Us
                </a>
              </div>

              {/* Phone number display */}
              <p className="mt-8 font-sans text-white/50 text-sm tracking-wider">
                {CONTACT.phone.display}
              </p>
            </div>

            {/* Bottom pink rule */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
