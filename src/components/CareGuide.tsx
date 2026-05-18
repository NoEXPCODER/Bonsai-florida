'use client'

import { useMessages } from '@/lib/i18n'
import { WaterIcon, SunIcon, LeafIcon, QuestionIcon } from '@/components/Icons'

const BLOCK_ICONS = [
  <WaterIcon key="water" className="w-8 h-8" />,
  <SunIcon key="sun" className="w-8 h-8" />,
  <LeafIcon key="leaf" className="w-8 h-8" />,
  <QuestionIcon key="question" className="w-8 h-8" />,
]

const BLOCK_ACCENTS = [
  'bg-[#dbeafe]',
  'bg-[#fef9c3]',
  'bg-sage-pale',
  'bg-bonsai-pink-pale',
]

export default function CareGuide() {
  const m = useMessages()
  const t = m.care

  return (
    <section
      id="care"
      className="bg-cream-warm py-20 sm:py-24"
      aria-labelledby="care-heading"
    >
      <div className="section-wrap">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="care-heading" className="section-heading mb-4">
            {t.heading}
          </h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.blocks.map((block, i) => (
            <article
              key={i}
              className="card p-7 sm:p-8 flex flex-col hover:shadow-card-lg transition-shadow duration-200"
            >
              <div
                className={`${BLOCK_ACCENTS[i]} w-16 h-16 rounded-2xl flex items-center justify-center text-forest mb-6 shadow-soft`}
                aria-hidden="true"
              >
                {BLOCK_ICONS[i]}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-4 leading-snug">
                {block.title}
              </h3>

              <div className="w-10 h-px bg-bonsai-pink-lt mb-5" />

              <ul className="space-y-3 flex-1">
                {block.body.map((line, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full bg-bonsai-pink flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-sans text-base sm:text-lg text-ink-light leading-relaxed">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          <div className="card px-8 py-7 inline-block text-center">
            <p className="font-serif italic text-forest text-xl sm:text-2xl leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="font-sans text-xs text-ink-light tracking-widest uppercase mt-4">
              — {t.quoteAuthor}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
