import { CONTACT } from '@/config/contact'
import {
  PhoneIcon,
  MessageIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  EmailIcon,
} from '@/components/Icons'

interface ConnectCard {
  id: string
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  description: string
  buttonLabel: string
  href: string
  external: boolean
  ariaLabel: string
}

const cards: ConnectCard[] = [
  {
    id: 'call',
    icon: <PhoneIcon className="w-8 h-8" />,
    iconBg: 'bg-forest',
    title: 'Call Us',
    subtitle: CONTACT.phone.display,
    description: 'Best for quick help — speak directly with us about any tree.',
    buttonLabel: 'Call Now',
    href: CONTACT.phone.tel,
    external: false,
    ariaLabel: `Call Bonsai Florida at ${CONTACT.phone.display}`,
  },
  {
    id: 'text',
    icon: <MessageIcon className="w-8 h-8" />,
    iconBg: 'bg-forest-light',
    title: 'Text Us',
    subtitle: CONTACT.phone.display,
    description: 'Best for sending bonsai photos — we love seeing your trees!',
    buttonLabel: 'Send a Text',
    href: CONTACT.phone.sms,
    external: false,
    ariaLabel: `Send a text message to Bonsai Florida at ${CONTACT.phone.display}`,
  },
  {
    id: 'facebook',
    icon: <FacebookIcon className="w-8 h-8" />,
    iconBg: 'bg-[#1877F2]',
    title: 'Facebook',
    subtitle: CONTACT.social.facebook.handle,
    description: 'Best for events, updates, and following our collection.',
    buttonLabel: 'Open Facebook',
    href: CONTACT.social.facebook.url,
    external: true,
    ariaLabel: 'Visit Bonsai Florida on Facebook',
  },
  {
    id: 'instagram',
    icon: <InstagramIcon className="w-8 h-8" />,
    iconBg: 'bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    title: 'Instagram',
    subtitle: CONTACT.social.instagram.handle,
    description: 'Best for tree photos — see every detail of our collection.',
    buttonLabel: 'Open Instagram',
    href: CONTACT.social.instagram.url,
    external: true,
    ariaLabel: 'Visit Bonsai Florida on Instagram',
  },
  {
    id: 'tiktok',
    icon: <TikTokIcon className="w-8 h-8" />,
    iconBg: 'bg-[#010101]',
    title: 'TikTok',
    subtitle: CONTACT.social.tiktok.handle,
    description: 'Best for short bonsai videos — quick tips and tree reveals.',
    buttonLabel: 'Open TikTok',
    href: CONTACT.social.tiktok.url,
    external: true,
    ariaLabel: 'Visit Bonsai Florida on TikTok',
  },
  {
    id: 'youtube',
    icon: <YouTubeIcon className="w-8 h-8" />,
    iconBg: 'bg-[#FF0000]',
    title: 'YouTube',
    subtitle: CONTACT.social.youtube.handle,
    description: 'Best for longer care videos — learn how to keep your tree healthy.',
    buttonLabel: 'Open YouTube',
    href: CONTACT.social.youtube.url,
    external: true,
    ariaLabel: 'Visit Bonsai Florida on YouTube',
  },
  {
    id: 'email',
    icon: <EmailIcon className="w-8 h-8" />,
    iconBg: 'bg-sage',
    title: 'Email',
    subtitle: CONTACT.email.address,
    description: 'Best for written questions — we reply within one business day.',
    buttonLabel: 'Send an Email',
    href: CONTACT.email.href,
    external: false,
    ariaLabel: `Email Bonsai Florida at ${CONTACT.email.address}`,
  },
]

export default function ConnectSection() {
  return (
    <section
      id="connect"
      className="bg-cream-warm py-20 sm:py-24"
      aria-labelledby="connect-heading"
    >
      <div className="section-wrap">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">One tap away</p>
          <h2 id="connect-heading" className="section-heading mb-4">
            Choose How You Want to Connect
          </h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">
            Pick the way that feels easiest for you. Every button here opens
            the right app instantly — no searching required.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <article
              key={card.id}
              className="card p-7 flex flex-col hover:shadow-card-lg transition-shadow duration-200"
            >
              {/* Icon */}
              <div
                className={`${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-5 shadow-soft`}
                aria-hidden="true"
              >
                {card.icon}
              </div>

              {/* Text */}
              <h3 className="font-serif text-2xl text-forest mb-1">{card.title}</h3>
              <p className="font-sans text-xs text-bonsai-pink font-semibold tracking-wider uppercase mb-3">
                {card.subtitle}
              </p>
              <p className="font-sans text-ink-light text-base leading-relaxed flex-1 mb-6">
                {card.description}
              </p>

              {/* CTA button — full width for easy tapping */}
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
