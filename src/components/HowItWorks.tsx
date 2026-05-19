'use client'

import { useMessages } from '@/lib/i18n'

export default function HowItWorks() {
  const t = useMessages().howItWorks

  return (
    <section className="bg-cream-warm py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="section-wrap">
        <div className="text-center mb-12">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="how-heading" className="section-heading mb-4">{t.heading}</h2>
          <div className="pink-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {t.steps.map((step, i) => (
            <div key={i} className="card p-6 sm:p-7 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-forest text-white font-serif text-2xl font-bold flex items-center justify-center mb-5 shadow-soft">
                {i + 1}
              </div>
              <h3 className="font-serif text-xl text-forest mb-3">{step.title}</h3>
              <p className="font-sans text-base text-ink-light leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
