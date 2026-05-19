'use client'

import { useState } from 'react'
import { CONTACT } from '@/config/contact'
import { useAuth, useMessages } from '@/lib/i18n'
import { PhoneIcon } from '@/components/Icons'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { locale, toggleLocale } = useAuth()
  const m = useMessages()

  const navLinks = [
    { href: '#connect', label: m.nav.connect },
    { href: '/trees', label: m.nav.collection },
    { href: '#care', label: m.nav.care },
    { href: '#visit', label: m.nav.visit },
  ]

  return (
    <header className="sticky top-0 z-40 bg-cream/92 backdrop-blur-md border-b border-forest/12">
      <div className="section-wrap">
        <nav
          className="flex items-center justify-between h-16 sm:h-20"
          aria-label="Main navigation"
        >
          {/* Brand mark */}
          <a
            href="#top"
            className="flex items-center gap-3 group"
            aria-label="Bonsai Florida — home"
          >
            <div className="w-10 h-10 rounded-full border-2 border-forest flex items-center justify-center bg-cream-light text-xl select-none group-hover:bg-white transition-colors">
              🌸
            </div>
            <div>
              <span className="block font-serif font-bold text-forest tracking-[0.15em] text-sm sm:text-base uppercase leading-tight">
                Bonsai Florida
              </span>
              <span className="block font-sans text-[10px] sm:text-xs text-ink-light tracking-[0.18em] uppercase">
                Palm Beach
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7 font-sans text-xs font-semibold tracking-[0.14em] text-forest uppercase">
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
          <div className="hidden md:flex items-center gap-3">
            {/* EN / VI language toggle */}
            <button
              onClick={toggleLocale}
              className="font-sans text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full border border-forest/20 text-ink-light hover:border-forest hover:text-forest transition-colors"
              aria-label={locale === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}
            >
              {locale === 'en' ? '🇻🇳 VI' : '🇺🇸 EN'}
            </button>

            {/* Call CTA */}
            <a
              href={CONTACT.phone.tel}
              className="btn-primary text-sm px-6 py-3"
              aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
            >
              <PhoneIcon className="w-4 h-4" />
              {m.nav.callNow}
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
              <a
                href={CONTACT.phone.tel}
                className="btn-primary justify-center text-sm"
                aria-label={`Call us at ${CONTACT.phone.display}`}
                onClick={() => setMenuOpen(false)}
              >
                <PhoneIcon className="w-4 h-4" />
                {m.nav.callNow} — {CONTACT.phone.display}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
