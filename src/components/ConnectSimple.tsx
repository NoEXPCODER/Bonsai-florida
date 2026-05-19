'use client'

import { CONTACT } from '@/config/contact'
import { useMessages } from '@/lib/i18n'
import {
  PhoneIcon, MessageIcon,
  FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon,
} from '@/components/Icons'

export default function ConnectSimple() {
  const t = useMessages().connectSimple

  const LINKS = [
    {
      label: t.callUs,
      sub: CONTACT.phone.display,
      href: CONTACT.phone.tel,
      icon: <PhoneIcon className="w-6 h-6" />,
      bg: 'bg-forest',
      external: false,
    },
    {
      label: t.textUs,
      sub: CONTACT.phone.display,
      href: CONTACT.phone.sms,
      icon: <MessageIcon className="w-6 h-6" />,
      bg: 'bg-forest-light',
      external: false,
    },
    {
      label: 'Facebook',
      sub: CONTACT.social.facebook.handle,
      href: CONTACT.social.facebook.url,
      icon: <FacebookIcon className="w-6 h-6" />,
      bg: 'bg-[#1877F2]',
      external: true,
    },
    {
      label: 'Instagram',
      sub: CONTACT.social.instagram.handle,
      href: CONTACT.social.instagram.url,
      icon: <InstagramIcon className="w-6 h-6" />,
      bg: 'bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
      external: true,
    },
    {
      label: 'TikTok',
      sub: CONTACT.social.tiktok.handle,
      href: CONTACT.social.tiktok.url,
      icon: <TikTokIcon className="w-6 h-6" />,
      bg: 'bg-[#010101]',
      external: true,
    },
    {
      label: 'YouTube',
      sub: CONTACT.social.youtube.handle,
      href: CONTACT.social.youtube.url,
      icon: <YouTubeIcon className="w-6 h-6" />,
      bg: 'bg-[#FF0000]',
      external: true,
    },
  ]

  return (
    <section id="connect" className="bg-cream-warm py-16 sm:py-20" aria-labelledby="connect-simple-heading">
      <div className="section-wrap">
        <div className="text-center mb-10">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="connect-simple-heading" className="section-heading mb-4">{t.heading}</h2>
          <div className="pink-divider" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="flex flex-col items-center gap-2 group"
              aria-label={link.label}
            >
              <div className={`${link.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-soft group-hover:opacity-90 group-active:scale-95 transition-all`}>
                {link.icon}
              </div>
              <span className="font-sans text-xs font-semibold text-forest text-center leading-tight">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
