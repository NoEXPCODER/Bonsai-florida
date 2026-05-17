import { CONTACT } from '@/config/contact'
import { TREES } from '@/data/trees'
import { SunIcon, WaterIcon, LeafIcon } from '@/components/Icons'
import { MessageIcon } from '@/components/Icons'

export default function BonsaiCollection() {
  return (
    <section
      id="collection"
      className="bg-cream py-20 sm:py-24"
      aria-labelledby="collection-heading"
    >
      <div className="section-wrap">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Current inventory</p>
          <h2 id="collection-heading" className="section-heading mb-4">
            Available Bonsai
          </h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">
            Each tree is hand-selected for South Florida living. Text or call
            us to ask about any tree — we love talking bonsai.
          </p>
        </div>

        {/* Tree cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TREES.map((tree) => (
            <article
              key={tree.id}
              className="card overflow-hidden hover:shadow-card-lg transition-shadow duration-200 group"
              aria-label={`${tree.name} — ${tree.price}`}
            >
              {/* Image placeholder — styled like a display case */}
              <div
                className="relative w-full aspect-[4/3] flex flex-col items-center justify-end pb-6 overflow-hidden"
                style={{
                  background: `linear-gradient(165deg, ${tree.bgFrom}, ${tree.bgTo})`,
                }}
                aria-hidden="true"
              >
                {/* Light overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20" />

                {/* Corner marks — poster-frame style */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/30" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/30" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/30" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/30" />

                {/* Simple bonsai silhouette via CSS */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Canopy */}
                  <div className="relative">
                    <div className="w-28 h-20 rounded-full bg-white/10 blur-md absolute -top-2 left-1/2 -translate-x-1/2" />
                    <div className="w-20 h-14 rounded-full bg-white/15 relative" />
                  </div>
                  {/* Trunk */}
                  <div className="w-2.5 h-10 bg-white/20 rounded-full mx-auto" />
                  {/* Pot */}
                  <div className="w-14 h-5 bg-white/15 rounded-b-lg rounded-t-sm" />
                </div>

                {/* Level badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                      tree.level === 'Beginner Friendly'
                        ? 'bg-bonsai-pink-pale text-bonsai-pink'
                        : 'bg-sage-pale text-forest'
                    }`}
                  >
                    {tree.level}
                  </span>
                </div>

                {/* Price badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="font-serif text-white text-lg font-bold drop-shadow-lg">
                    {tree.price}
                  </span>
                </div>
              </div>

              {/* Card info — display tag style */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-serif text-2xl text-forest mb-0.5">{tree.name}</h3>
                  <p className="font-sans text-xs text-ink-light italic tracking-wide">
                    {tree.species}
                  </p>
                </div>

                {/* Info rows */}
                <ul className="space-y-2.5 mb-6" aria-label="Tree care details">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 text-sage flex-shrink-0" aria-hidden="true">
                      <SunIcon className="w-4 h-4" />
                    </div>
                    <span className="font-sans text-sm text-ink-light leading-snug">
                      <strong className="font-semibold text-forest-dark">Sun:</strong>{' '}
                      {tree.sun}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 text-sage flex-shrink-0" aria-hidden="true">
                      <WaterIcon className="w-4 h-4" />
                    </div>
                    <span className="font-sans text-sm text-ink-light leading-snug">
                      <strong className="font-semibold text-forest-dark">Water:</strong>{' '}
                      {tree.water}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 text-sage flex-shrink-0" aria-hidden="true">
                      <LeafIcon className="w-4 h-4" />
                    </div>
                    <span className="font-sans text-sm text-ink-light leading-snug">
                      <strong className="font-semibold text-forest-dark">Level:</strong>{' '}
                      {tree.level}
                    </span>
                  </li>
                </ul>

                {/* Pink divider */}
                <div className="w-full h-px bg-bonsai-pink-lt/50 mb-5" />

                {/* CTA */}
                <a
                  href={CONTACT.phone.sms}
                  className="btn-primary w-full justify-center text-sm"
                  aria-label={`Ask about the ${tree.name} bonsai priced at ${tree.price}`}
                >
                  <MessageIcon className="w-4 h-4" />
                  Ask About This Tree
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="font-serif italic text-ink-light text-lg mb-5">
            Don&apos;t see what you&apos;re looking for? We may have more trees available.
          </p>
          <a
            href={CONTACT.phone.tel}
            className="btn-secondary inline-flex"
            aria-label="Call us to ask about more available trees"
          >
            Call to Ask About More Trees
          </a>
        </div>
      </div>
    </section>
  )
}
