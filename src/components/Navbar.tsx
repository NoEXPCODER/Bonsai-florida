'use client'

import { useState } from 'react'
import { CONTACT } from '@/config/contact'
import { PhoneIcon } from '@/components/Icons'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream/92 backdrop-blur-md border-b border-forest/12">
      <div className="section-wrap">
        <nav
          className="flex items-center justify-between h-16 sm:h-20"
          aria-label="Main navigation"
        >
          {/* Brand mark */}
          <a href="#top" className="flex items-center gap-3 group" aria-label="Bonsai Florida — home">
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
          <div
            className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold tracking-[0.14em] text-forest uppercase"
            role="list"
          >
            {[
              { href: '#connect', label: 'Connect' },
              { href: '#collection', label: 'Collection' },
              { href: '#care', label: 'Care Guide' },
              { href: '#visit', label: 'Visit' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="hover:text-bonsai-pink transition-colors duration-150"
                role="listitem"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href={CONTACT.phone.tel}
            className="hidden md:flex btn-primary text-sm px-6 py-3"
            aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}
          >
            <PhoneIcon className="w-4 h-4" />
            Call Now
          </a>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-forest rounded-lg hover:bg-forest/8 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="text-2xl leading-none select-none">{open ? '✕' : '☰'}</span>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-5 pt-2 space-y-1 border-t border-forest/10">
            {[
              { href: '#connect', label: 'Connect' },
              { href: '#collection', label: 'Collection' },
              { href: '#care', label: 'Care Guide' },
              { href: '#visit', label: 'Visit' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block py-3 px-2 font-sans text-sm font-semibold tracking-wider text-forest uppercase hover:text-bonsai-pink transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-3">
              <a
                href={CONTACT.phone.tel}
                className="btn-primary justify-center text-sm"
                aria-label={`Call us at ${CONTACT.phone.display}`}
                onClick={() => setOpen(false)}
              >
                <PhoneIcon className="w-4 h-4" />
                Call Now — {CONTACT.phone.display}
              </a>
              <a
                href={CONTACT.phone.sms}
                className="btn-secondary justify-center text-sm"
                aria-label="Send us a text message"
                onClick={() => setOpen(false)}
              >
                Text Us
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
