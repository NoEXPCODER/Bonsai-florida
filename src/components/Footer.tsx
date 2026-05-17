import { CONTACT } from '@/config/contact'
import {
  PhoneIcon,
  MessageIcon,
  EmailIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  YouTubeIcon,
} from '@/components/Icons'

export default function Footer() {
  return (
    <footer className="bg-forest text-white" aria-label="Site footer">
      {/* Top pink rule */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

      <div className="section-wrap py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-xl">
                🌸
              </div>
              <div>
                <span className="block font-serif font-bold tracking-[0.15em] uppercase text-sm">
                  Bonsai Florida
                </span>
                <span className="block font-sans text-[10px] text-white/60 tracking-widest uppercase">
                  Palm Beach
                </span>
              </div>
            </div>
            <p className="font-sans text-white/70 text-sm leading-relaxed max-w-xs">
              Beginner-friendly tropical bonsai in Palm Beach, Florida.
              Handcrafted trees, local guidance, and peaceful garden visits.
            </p>

            {/* Decorative pink divider */}
            <div className="w-12 h-px bg-bonsai-pink mt-6" />
          </div>

          {/* Column 2: Direct contact */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-bonsai-pink-lt mb-6">
              Contact Us Directly
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={CONTACT.phone.tel}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                  aria-label={`Call us at ${CONTACT.phone.display}`}
                >
                  <span className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <PhoneIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block font-sans font-semibold text-sm">Call Us</span>
                    <span className="block font-sans text-xs text-white/60">
                      {CONTACT.phone.display}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.phone.sms}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                  aria-label={`Text us at ${CONTACT.phone.display}`}
                >
                  <span className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <MessageIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block font-sans font-semibold text-sm">Text Us</span>
                    <span className="block font-sans text-xs text-white/60">
                      {CONTACT.phone.display}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.email.href}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                  aria-label={`Email us at ${CONTACT.email.address}`}
                >
                  <span className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <EmailIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block font-sans font-semibold text-sm">Email</span>
                    <span className="block font-sans text-xs text-white/60 break-all">
                      {CONTACT.email.address}
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-bonsai-pink-lt mb-6">
              Follow Our Journey
            </h3>
            <ul className="space-y-4">
              {[
                {
                  label: 'Instagram',
                  handle: CONTACT.social.instagram.handle,
                  url: CONTACT.social.instagram.url,
                  icon: <InstagramIcon className="w-4 h-4" />,
                },
                {
                  label: 'TikTok',
                  handle: CONTACT.social.tiktok.handle,
                  url: CONTACT.social.tiktok.url,
                  icon: <TikTokIcon className="w-4 h-4" />,
                },
                {
                  label: 'Facebook',
                  handle: CONTACT.social.facebook.handle,
                  url: CONTACT.social.facebook.url,
                  icon: <FacebookIcon className="w-4 h-4" />,
                },
                {
                  label: 'YouTube',
                  handle: CONTACT.social.youtube.handle,
                  url: CONTACT.social.youtube.url,
                  icon: <YouTubeIcon className="w-4 h-4" />,
                },
              ].map(({ label, handle, url, icon }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                    aria-label={`Bonsai Florida on ${label}`}
                  >
                    <span className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                      {icon}
                    </span>
                    <div>
                      <span className="block font-sans font-semibold text-sm">{label}</span>
                      <span className="block font-sans text-xs text-white/60">{handle}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-white/50 text-sm text-center sm:text-left">
            Bonsai Florida &copy; {CONTACT.year} &mdash; {CONTACT.location}
          </p>
          {/* Quick action buttons */}
          <div className="flex gap-3">
            <a
              href={CONTACT.phone.tel}
              className="inline-flex items-center gap-2 bg-white text-forest rounded-full px-5 py-2.5 font-sans font-bold text-xs tracking-wide hover:bg-cream transition-colors min-h-[40px]"
              aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              Call Now
            </a>
            <a
              href={CONTACT.phone.sms}
              className="inline-flex items-center gap-2 border border-white/30 text-white rounded-full px-5 py-2.5 font-sans font-bold text-xs tracking-wide hover:bg-white/10 transition-colors min-h-[40px]"
              aria-label="Send a text to Bonsai Florida"
            >
              <MessageIcon className="w-3.5 h-3.5" />
              Text Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom pink rule */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
    </footer>
  )
}
