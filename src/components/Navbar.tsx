'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CONTACT } from '@/config/contact'
import { useAuth, useMessages } from '@/lib/i18n'
import { siteConfig } from '@/lib/siteConfig'
import { MessageIcon } from '@/components/Icons'

export default function Navbar({ logoUrl = null }: { logoUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { locale, toggleLocale } = useAuth()
  const m = useMessages()
  const logoSrc = logoUrl ?? '/logo.png'

  const navLinks = [
    { href: '/#connect', label: m.nav.connect },
    { href: '/trees', label: m.nav.collection },
    { href: '/beginner-guide', label: m.nav.beginnerGuide },
    { href: '/care-guides', label: m.nav.care },
    { href: '/#visit', label: m.nav.visit },
  ]

  return (
    <header className="sticky top-0 z-40 bg-cream/92 backdrop-blur-md border-b border-forest/12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-16 sm:h-[72px]"
          aria-label="Main navigation"
        >
          {/* Brand mark */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group"
            aria-label="Bonsai Florida — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt=""
              aria-hidden
              className="h-12 w-14 object-contain sm:h-14 sm:w-20"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.png' }}
            />
            <div>
              <span className="block font-serif font-bold text-forest tracking-[0.1em] text-base sm:text-lg uppercase leading-tight">
                Bonsai Florida
              </span>
              <span className="block font-sans text-[10px] sm:text-[11px] text-ink-light tracking-[0.18em] uppercase">
                Palm Beach
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7 font-sans text-xs font-semibold tracking-[0.14em] text-forest uppercase">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="hover:text-bonsai-pink transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/admin"
              className="font-sans text-xs font-semibold tracking-wider uppercase px-3.5 py-2 rounded-full border border-forest/20 text-ink-light hover:border-forest hover:text-forest transition-colors"
            >
              {m.nav.login}
            </Link>

            {/* EN / VI language toggle */}
            <button
              onClick={toggleLocale}
              className="font-sans text-[11px] font-bold tracking-wider uppercase px-3 py-2 rounded-full border border-forest/20 text-ink-light hover:border-forest hover:text-forest transition-colors"
              aria-label={locale === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}
            >
              {locale === 'en' ? '🇻🇳 VI' : '🇺🇸 EN'}
            </button>

            <a
              href={CONTACT.phone.sms}
              className="font-sans text-xs font-semibold text-ink-light hover:text-forest transition-colors"
              aria-label="Text Bonsai Florida"
            >
              <MessageIcon className="w-4 h-4 inline mr-1" />
              {m.nav.textUs}
            </a>
            <a href={siteConfig.textBookingUrl} className="btn-primary text-sm px-6 py-3 min-h-[48px]">
              Text to Visit
            </a>
          </div>

          {/* Mobile: language toggle + menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLocale}
              className="font-sans text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-forest/20 text-ink-light"
              aria-label={locale === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}
            >
              {locale === 'en' ? '🇻🇳' : '🇺🇸'}
            </button>
            <button
              className="p-2 text-forest rounded-lg hover:bg-forest/8 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className="text-2xl leading-none select-none">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-5 pt-2 space-y-1 border-t border-forest/10">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block py-3 px-2 font-sans text-sm font-semibold tracking-wider text-forest uppercase hover:text-bonsai-pink transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-3">
              <Link
                href="/admin"
                className="btn-secondary justify-center text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {m.nav.login}
              </Link>
              <a
                href={siteConfig.textBookingUrl}
                className="btn-primary justify-center text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Text to Visit
              </a>
              <a
                href={CONTACT.phone.sms}
                className="btn-secondary justify-center text-sm"
                aria-label="Text Bonsai Florida"
                onClick={() => setMenuOpen(false)}
              >
                <MessageIcon className="w-4 h-4" />
                Text Us — {CONTACT.phone.display}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
