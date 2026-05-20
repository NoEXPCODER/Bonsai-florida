'use client'

import { useMessages } from '@/lib/i18n'

export default function WhyBonsaiFlorida() {
  const t = useMessages().whyBonsai

  return (
    <section className="bg-cream-light py-16 sm:py-20" aria-labelledby="why-heading">
      <div className="section-wrap">
        <div className="text-center mb-12">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="why-heading" className="section-heading mb-4">{t.heading}</h2>
          <div className="pink-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {t.items.map(item => (
            <div key={item.title} className="card p-6 text-center flex flex-col items-center">
              <span className="text-3xl mb-4">{item.icon}</span>
              <h3 className="font-serif text-base text-forest leading-snug mb-2">{item.title}</h3>
              <p className="font-sans text-sm text-ink-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
