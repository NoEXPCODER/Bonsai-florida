'use client'

import { CONTACT } from '@/config/contact'
import { useMessages } from '@/lib/i18n'
import {
  PhoneIcon,
  MessageIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  EmailIcon,
} from '@/components/Icons'

export default function ConnectSection() {
  const m = useMessages()
  const t = m.connect
  const cards = t.cards

  const CARDS = [
    {
      id: 'call',
      icon: <PhoneIcon className="w-8 h-8" />,
      iconBg: 'bg-forest',
      title: cards.call.title,
      subtitle: CONTACT.phone.display,
      description: cards.call.description,
      buttonLabel: cards.call.button,
      href: CONTACT.phone.tel,
      external: false,
      ariaLabel: `Call Bonsai Florida at ${CONTACT.phone.display}`,
    },
    {
      id: 'text',
      icon: <MessageIcon className="w-8 h-8" />,
      iconBg: 'bg-forest-light',
      title: cards.text.title,
      subtitle: CONTACT.phone.display,
      description: cards.text.description,
      buttonLabel: cards.text.button,
      href: CONTACT.phone.sms,
      external: false,
      ariaLabel: `Send a text to Bonsai Florida at ${CONTACT.phone.display}`,
    },
    {
      id: 'facebook',
      icon: <FacebookIcon className="w-8 h-8" />,
      iconBg: 'bg-[#1877F2]',
      title: cards.facebook.title,
      subtitle: CONTACT.social.facebook.handle,
      description: cards.facebook.description,
      buttonLabel: cards.facebook.button,
      href: CONTACT.social.facebook.url,
      external: true,
      ariaLabel: 'Visit Bonsai Florida on Facebook',
    },
    {
      id: 'instagram',
      icon: <InstagramIcon className="w-8 h-8" />,
      iconBg: 'bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
      title: cards.instagram.title,
      subtitle: CONTACT.social.instagram.handle,
      description: cards.instagram.description,
      buttonLabel: cards.instagram.button,
      href: CONTACT.social.instagram.url,
      external: true,
      ariaLabel: 'Visit Bonsai Florida on Instagram',
    },
    {
      id: 'tiktok',
      icon: <TikTokIcon className="w-8 h-8" />,
      iconBg: 'bg-[#010101]',
      title: cards.tiktok.title,
      subtitle: CONTACT.social.tiktok.handle,
      description: cards.tiktok.description,
      buttonLabel: cards.tiktok.button,
      href: CONTACT.social.tiktok.url,
      external: true,
      ariaLabel: 'Visit Bonsai Florida on TikTok',
    },
    {
      id: 'youtube',
      icon: <YouTubeIcon className="w-8 h-8" />,
      iconBg: 'bg-[#FF0000]',
      title: cards.youtube.title,
      subtitle: CONTACT.social.youtube.handle,
      description: cards.youtube.description,
      buttonLabel: cards.youtube.button,
      href: CONTACT.social.youtube.url,
      external: true,
      ariaLabel: 'Visit Bonsai Florida on YouTube',
    },
    {
      id: 'email',
      icon: <EmailIcon className="w-8 h-8" />,
      iconBg: 'bg-sage',
      title: cards.email.title,
      subtitle: CONTACT.email.address,
      description: cards.email.description,
      buttonLabel: cards.email.button,
      href: CONTACT.email.href,
      external: false,
      ariaLabel: `Email Bonsai Florida at ${CONTACT.email.address}`,
    },
  ]

  return (
    <section
      id="connect"
      className="bg-cream-warm py-20 sm:py-24"
      aria-labelledby="connect-heading"
    >
      <div className="section-wrap">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="connect-heading" className="section-heading mb-4">
            {t.heading}
          </h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card) => (
            <article
              key={card.id}
              className="card p-7 flex flex-col hover:shadow-card-lg transition-shadow duration-200"
            >
              <div
                className={`${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-5 shadow-soft`}
                aria-hidden="true"
              >
                {card.icon}
              </div>

              <h3 className="font-serif text-2xl text-forest mb-1">{card.title}</h3>
              <p className="font-sans text-xs text-bonsai-pink font-semibold tracking-wider uppercase mb-3">
                {card.subtitle}
              </p>
              <p className="font-sans text-ink-light text-base leading-relaxed flex-1 mb-6">
                {card.description}
              </p>

              <a
                href={card.href}
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noopener noreferrer' : undefined}
                className="btn-primary w-full justify-center text-base"
                aria-label={card.ariaLabel}
              >
                {card.buttonLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
