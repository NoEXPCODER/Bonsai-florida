'use client'

import { useMessages } from '@/lib/i18n'
import BookGardenVisitButton from '@/components/BookGardenVisitButton'

export default function FinalCTA() {
  const t = useMessages().finalCTA

  return (
    <section className="bg-cream-warm py-20 sm:py-24">
      <div className="section-wrap text-center max-w-2xl mx-auto">
        <p className="section-label mb-3">{t.label}</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-forest leading-tight mb-4">{t.heading}</h2>
        <div className="pink-divider mb-6" />
        <p className="font-sans text-lg text-ink-light leading-relaxed mb-10">{t.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <BookGardenVisitButton />
          <a href="/trees" className="btn-secondary text-base px-10 py-4 min-h-[56px] justify-center">
            {t.browse}
          </a>
        </div>
      </div>
    </section>
  )
}
