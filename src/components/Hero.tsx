import { CONTACT } from '@/config/contact'
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
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-cream"
      aria-label="Welcome to Bonsai Florida"
    >
      {/* Top pink accent line */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />

      {/* Background decorative blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-sage-pale/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-bonsai-pink-pale/30 blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-wrap relative py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left: text content ── */}
          <div>
            {/* Eyebrow */}
            <p className="section-label mb-4">Palm Beach, Florida</p>

            {/* Main heading */}
            <h1 className="font-serif text-forest leading-none mb-2">
              <span className="block text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-tight">
                Bonsai
              </span>
              <span className="block text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-tight text-forest-light">
                Florida
              </span>
            </h1>

            {/* Thin pink rule */}
            <div className="w-16 h-0.5 bg-bonsai-pink mt-4 mb-6" />

            {/* Tagline */}
            <p className="font-serif italic text-bonsai-pink text-xl sm:text-2xl mb-3">
              Tropical Bonsai for South Florida Living
            </p>

            {/* Description */}
            <p className="font-sans text-ink-light text-lg sm:text-xl leading-relaxed max-w-lg mb-10">
              Beginner-friendly bonsai, local guidance, and peaceful garden
              visits in Palm Beach, Florida.
            </p>

            {/* Primary CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={CONTACT.phone.tel}
                className="btn-primary"
                aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
              >
                <PhoneIcon className="w-5 h-5" />
                Call Now
              </a>
              <a
                href={CONTACT.phone.sms}
                className="btn-secondary"
                aria-label="Send a text message to Bonsai Florida"
              >
                <MessageIcon className="w-5 h-5" />
                Text Us
              </a>
              <a
                href="#collection"
                className="btn-secondary"
                aria-label="View available bonsai trees"
              >
                View Available Trees
              </a>
            </div>

            {/* Social quick links */}
            <div>
              <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-3">
                Also find us on
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
            {/* Outer frame — inspired by the poster border */}
            <div className="w-full max-w-sm sm:max-w-md relative">
              <div className="absolute inset-0 border-2 border-forest/20 rounded-4xl translate-x-3 translate-y-3" />
              <div className="relative card p-6 sm:p-8 shadow-card-lg overflow-hidden">
                {/* Decorative corner marks */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-forest/40 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-forest/40 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-forest/40 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-forest/40 rounded-br-lg" />

                {/* Bonsai illustration placeholder */}
                <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-forest to-forest-light flex flex-col items-center justify-end pb-10 mb-6 relative overflow-hidden">
                  {/* Sky gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-sage-pale/20 via-transparent to-transparent" />
                  {/* Ground */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-forest-dark/60 to-transparent" />
                  {/* Pot silhouette */}
                  <div className="relative z-10 w-20 h-8 bg-forest-dark/70 rounded-b-xl rounded-t-sm" />
                  {/* Trunk */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3 h-24 bg-forest-dark/60 rounded-full" />
                  {/* Canopy layers */}
                  <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-32 h-20 bg-forest-light/70 rounded-full blur-sm" />
                  <div className="absolute bottom-36 left-1/2 -translate-x-[40%] w-24 h-16 bg-sage/50 rounded-full blur-sm" />
                  <div className="absolute bottom-40 left-1/2 -translate-x-[60%] w-20 h-14 bg-sage-light/40 rounded-full blur-sm" />
                  {/* Pink floral accents */}
                  <div className="absolute top-8 left-8 text-2xl opacity-60">🌸</div>
                  <div className="absolute top-12 right-10 text-lg opacity-50">🌸</div>
                  <div className="absolute top-20 left-16 text-sm opacity-40">🌸</div>
                </div>

                {/* Card text */}
                <div className="text-center">
                  <div className="pink-divider mb-4" />
                  <h2 className="font-serif text-2xl text-forest tracking-wide mb-1">
                    Bonsai Florida
                  </h2>
                  <p className="font-sans text-xs text-ink-light tracking-[0.18em] uppercase">
                    Ficus · Willow · Tropical Forms
                  </p>
                  <div className="pink-divider mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom pink divider */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
    </section>
  )
}
