'use client'

import { CARE_GUIDES } from '@/data/care-guides'
import { useMessages } from '@/lib/i18n'
import { SunIcon, WaterIcon } from '@/components/Icons'

const PREVIEW_COUNT = 4

export default function CareGuidePreview() {
  const t = useMessages().carePreview
  const guides = CARE_GUIDES.slice(0, PREVIEW_COUNT)

  return (
    <section id="care" className="bg-cream py-16 sm:py-20" aria-labelledby="care-preview-heading">
      <div className="section-wrap">
        <div className="text-center mb-12">
          <p className="section-label mb-3">{t.label}</p>
          <h2 id="care-preview-heading" className="section-heading mb-4">{t.heading}</h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-lg text-ink-light max-w-md mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {guides.map((guide) => (
            <article key={guide.slug} className="card p-5 flex flex-col hover:shadow-card-lg transition-shadow duration-200">
              <span className={`self-start font-sans text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 ${
                guide.difficulty === 'Beginner'
                  ? 'bg-bonsai-pink-pale text-bonsai-pink'
                  : 'bg-sage-pale text-forest'
              }`}>
                {guide.difficulty === 'Beginner' ? t.beginner : guide.difficulty}
              </span>

              <h3 className="font-serif text-xl text-forest leading-snug mb-0.5">{guide.name}</h3>
              <p className="font-sans text-xs italic text-ink-light mb-3">{guide.latin}</p>

              <p className="font-sans text-sm text-ink-light leading-relaxed mb-4 line-clamp-3 flex-1">
                {guide.summary}
              </p>

              <div className="space-y-1.5 mb-5">
                <div className="flex items-start gap-2">
                  <SunIcon className="w-3.5 h-3.5 text-sage flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-ink-light line-clamp-1">{guide.quick.light}</p>
                </div>
                <div className="flex items-start gap-2">
                  <WaterIcon className="w-3.5 h-3.5 text-sage flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-ink-light line-clamp-1">{guide.quick.water}</p>
                </div>
              </div>

              <a
                href={`/care#${guide.slug}`}
                className="btn-secondary w-full justify-center text-xs py-2.5 mt-auto"
              >
                {t.viewGuide}
              </a>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/care" className="btn-secondary inline-flex text-base px-10 py-4">
            {t.viewAll}
          </a>
        </div>
      </div>
    </section>
  )
}
