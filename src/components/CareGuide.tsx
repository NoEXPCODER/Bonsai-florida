import { WaterIcon, SunIcon, LeafIcon, QuestionIcon } from '@/components/Icons'

interface CareBlock {
  icon: React.ReactNode
  title: string
  body: string[]
  accent: string
}

const careBlocks: CareBlock[] = [
  {
    icon: <WaterIcon className="w-8 h-8" />,
    title: 'Watering in Florida',
    body: [
      'Florida summers are hot and humid, but bonsai pots dry out fast.',
      'Most tropical bonsai need water every 1–3 days in warm months.',
      'Stick your finger an inch into the soil — if it feels dry, water slowly until it drains from the bottom.',
      'In cooler winter months, you can water a little less often.',
    ],
    accent: 'bg-[#dbeafe]',
  },
  {
    icon: <SunIcon className="w-8 h-8" />,
    title: 'Morning Sun & Bright Shade',
    body: [
      'Tropical bonsai love bright light, but Florida afternoon sun can scorch the leaves.',
      'The ideal spot gets 2–4 hours of gentle morning sun, then bright open shade for the rest of the day.',
      'A covered porch, lanai, or spot under a big tree usually works beautifully.',
      'Indoors with a bright south or east window is also a good option.',
    ],
    accent: 'bg-[#fef9c3]',
  },
  {
    icon: <LeafIcon className="w-8 h-8" />,
    title: 'What to Do After Buying',
    body: [
      'Find one spot at home and leave your tree there for two weeks.',
      'Bonsai are sensitive to change — give it time to adjust before moving it around.',
      'Water on a regular schedule and watch the leaves closely.',
      'A little leaf drop when you first bring it home is normal — don\'t panic!',
    ],
    accent: 'bg-sage-pale',
  },
  {
    icon: <QuestionIcon className="w-8 h-8" />,
    title: 'When to Ask for Help',
    body: [
      'You never have to figure it out alone. Call or text us any time.',
      'If leaves are yellowing, falling fast, or the soil stays soggy — reach out.',
      'Send us a photo of your tree by text — we can usually help right away.',
      'We want your bonsai to thrive just as much as you do.',
    ],
    accent: 'bg-bonsai-pink-pale',
  },
]

export default function CareGuide() {
  return (
    <section
      id="care"
      className="bg-cream-warm py-20 sm:py-24"
      aria-labelledby="care-heading"
    >
      <div className="section-wrap">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Simple guidance</p>
          <h2 id="care-heading" className="section-heading mb-4">
            Beginner Bonsai Care
          </h2>
          <div className="pink-divider mb-4" />
          <p className="font-sans text-ink-light text-lg max-w-xl mx-auto leading-relaxed">
            Bonsai care doesn&apos;t have to be complicated. Here are the four
            most important things to know as a beginner in Florida.
          </p>
        </div>

        {/* Care blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {careBlocks.map((block, i) => (
            <article
              key={i}
              className="card p-7 sm:p-8 flex flex-col hover:shadow-card-lg transition-shadow duration-200"
            >
              {/* Icon with accent background */}
              <div
                className={`${block.accent} w-16 h-16 rounded-2xl flex items-center justify-center text-forest mb-6 shadow-soft`}
                aria-hidden="true"
              >
                {block.icon}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-4 leading-snug">
                {block.title}
              </h3>

              {/* Thin rule */}
              <div className="w-10 h-px bg-bonsai-pink-lt mb-5" />

              <ul className="space-y-3 flex-1">
                {block.body.map((line, j) => (
                  <li key={j} className="flex items-start gap-3">
                    {/* Dot */}
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-bonsai-pink flex-shrink-0" aria-hidden="true" />
                    <span className="font-sans text-base sm:text-lg text-ink-light leading-relaxed">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Reassurance note */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <div className="card px-8 py-7 inline-block text-center">
            <p className="font-serif italic text-forest text-xl sm:text-2xl leading-relaxed">
              &ldquo;We are always just a text or phone call away. No question
              is too small when it comes to your bonsai.&rdquo;
            </p>
            <p className="font-sans text-xs text-ink-light tracking-widest uppercase mt-4">
              — Bonsai Florida, Palm Beach
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
