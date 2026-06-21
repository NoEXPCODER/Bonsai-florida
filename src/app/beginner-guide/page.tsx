import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CONTACT } from '@/config/contact'

export const metadata: Metadata = {
  title: 'Beginner Bonsai Guide | Bonsai Florida — Start Here',
  description:
    'Complete beginner guide to growing bonsai in Florida. Learn the best starter trees, simple care steps, Florida-specific watering tips, and common mistakes to avoid.',
  keywords: [
    'beginner bonsai guide',
    'bonsai for beginners Florida',
    'how to start bonsai',
    'best beginner bonsai tree',
    'ficus bonsai beginner',
    'bonsai care Florida',
    'tropical bonsai beginner',
    'South Florida bonsai',
  ],
  openGraph: {
    title: 'Beginner Bonsai Guide — Bonsai Florida',
    description: 'The easiest way to start your bonsai journey in Florida. Best starter trees, step-by-step care, and local tips.',
    type: 'article',
  },
}

const starterTrees = [
  {
    rank: '1',
    name: 'Ficus (Tiger Ficus)',
    latin: 'Ficus microcarpa',
    emoji: '🌿',
    difficulty: 'Beginner',
    difficultyColor: 'bg-sage-pale text-forest',
    tagline: 'The #1 pick for Florida beginners',
    why: 'The most forgiving bonsai you can own. Ficus bounces back from overwatering, underwatering, missed feedings, and the brutal Florida summer heat. It stays happy outdoors year-round in South Florida.',
    pros: [
      'Extremely forgiving of beginner mistakes',
      'Thrives in Florida heat and humidity',
      'Beautiful glossy dark-green leaves',
      'Grows quickly — you see results fast',
    ],
    care: 'Water every 2–3 days in summer. Bright indirect light. Keep outdoors in warm weather.',
    highlight: true,
  },
  {
    rank: '2',
    name: 'Fukien Tea',
    latin: 'Carmona retusa',
    emoji: '🌸',
    difficulty: 'Beginner',
    difficultyColor: 'bg-bonsai-pink-pale text-forest',
    tagline: 'Tiny white flowers, effortless charm',
    why: 'Fukien Tea produces delicate white flowers and small red berries year-round in Florida\'s warmth. It tolerates indoor life well, making it ideal if you want a bonsai inside your home.',
    pros: [
      'Blooms with tiny white flowers year-round',
      'Great for indoor display',
      'Compact, elegant growth habit',
      'Tolerates Florida climate perfectly',
    ],
    care: 'Water when top inch of soil dries. Bright indirect light. Protect from cold snaps below 50°F.',
    highlight: false,
  },
  {
    rank: '3',
    name: 'Buttonwood',
    latin: 'Conocarpus erectus',
    emoji: '🌳',
    difficulty: 'Intermediate',
    difficultyColor: 'bg-cream-warm text-ink',
    tagline: 'Florida\'s native bonsai — stunning driftwood style',
    why: 'Buttonwood is a native Florida coastal tree that transforms into breathtaking driftwood-style bonsai. It is more rewarding than most beginner species but requires slightly more patience. A great second tree once you\'re comfortable.',
    pros: [
      'Native to South Florida — naturally adapted',
      'Spectacular driftwood and deadwood styling',
      'Extremely heat and salt tolerant',
      'Increases dramatically in value over time',
    ],
    care: 'Full sun preferred. Water every 2 days in summer. Allow to dry slightly between waterings.',
    highlight: false,
  },
]

const steps = [
  {
    number: '01',
    title: 'Choose the right tree',
    body: 'Start with a Ficus or Fukien Tea. Avoid species that need cold winters (like Junipers or Maples) — they struggle in Florida\'s climate. Pick a tropical or subtropical species and you are already halfway to success.',
    tip: 'Visit a local grower (like Bonsai Florida) so you can see the tree in person before buying.',
  },
  {
    number: '02',
    title: 'Use the right soil and pot',
    body: 'Bonsai soil must drain fast. Never use regular potting mix — it holds too much moisture and will rot the roots. Use a gritty bonsai mix (akadama, pumice, and lava rock). The pot should have drainage holes.',
    tip: 'Start in a training container before moving to a decorative ceramic pot.',
  },
  {
    number: '03',
    title: 'Find the right light spot',
    body: 'Most bonsai love morning sun with afternoon shade protection in Florida\'s harsh summers. Outdoors is almost always better than indoors. A covered patio facing east is close to ideal.',
    tip: 'Avoid direct afternoon summer sun — it can scorch leaves and dry the soil in under an hour.',
  },
  {
    number: '04',
    title: 'Learn to water correctly',
    body: 'Water when the top inch of soil feels dry — not before, not after. In summer, this may mean daily. In cooler months, every 2–3 days. Lift the pot: a light pot needs water, a heavy pot does not.',
    tip: 'Most beginners kill bonsai with overwatering, not underwatering. When in doubt, wait one more day.',
  },
  {
    number: '05',
    title: 'Be patient — bonsai is slow art',
    body: 'A beautiful bonsai takes years, not weeks. The first year, your only goal is to keep the tree healthy. Learn its rhythm. Watch how it responds to seasons, water, and sunlight. Enjoy the process.',
    tip: 'Take a photo every month. In one year you will be amazed at how much you — and the tree — have grown.',
  },
]

const floridaTips = [
  {
    icon: '💧',
    title: 'Water daily in summer',
    body: 'Florida summers are brutal — 90°F+ heat dries bonsai soil fast. Check your tree every morning. Most tropical bonsai need water every 24 hours from June through September.',
  },
  {
    icon: '☀️',
    title: 'Morning sun is ideal',
    body: 'Morning sun (6am–11am) is gentle and promotes healthy growth. Harsh afternoon sun from the west can scorch leaves. East-facing or covered patios are perfect.',
  },
  {
    icon: '🌱',
    title: 'Fertilize more in warm months',
    body: 'Florida\'s long growing season means your bonsai needs more food than trees in colder states. Fertilize lightly every two weeks from spring through fall. Reduce in winter.',
  },
  {
    icon: '🌀',
    title: 'Hurricane season: be prepared',
    body: 'June through November, be ready to bring your bonsai indoors during storms. A few hours of wind can topple pots and snap fragile branches. Keep your collection near a door for quick moving.',
  },
  {
    icon: '🌡️',
    title: 'Florida winters are mild',
    body: 'Most of South Florida never freezes, so your tropical bonsai stay outdoors year-round. If temperatures drop below 45°F in a rare cold snap, bring sensitive species inside for the night.',
  },
  {
    icon: '🪲',
    title: 'Watch for pests',
    body: 'Florida\'s warmth supports more insects year-round. Check leaves weekly for scale, spider mites, and aphids. Treat early with neem oil spray — a weekly light misting prevents most infestations.',
  },
]

const mistakes = [
  {
    mistake: 'Watering on a fixed schedule',
    fix: 'Check the soil each day. Water based on dryness, not the calendar.',
  },
  {
    mistake: 'Using regular potting soil',
    fix: 'Fast-draining bonsai mix only. Regular soil suffocates roots.',
  },
  {
    mistake: 'Leaving bonsai in afternoon sun all day',
    fix: 'Morning sun with afternoon shade protection is ideal in Florida.',
  },
  {
    mistake: 'Repotting too often',
    fix: 'Most bonsai only need repotting every 2–3 years. Over-repotting stresses the tree.',
  },
  {
    mistake: 'Buying a species that doesn\'t match the climate',
    fix: 'Stick to tropical and subtropical species. Ficus, Fukien Tea, Buttonwood, Bougainvillea.',
  },
  {
    mistake: 'Expecting fast results',
    fix: 'Bonsai is slow art. Measure progress in months and seasons, not weeks.',
  },
]

const whyFlorida = [
  {
    icon: '🌴',
    title: 'Year-round growing season',
    body: 'No frost, no dormancy forced by cold. Your bonsai grows and thrives every single month of the year.',
  },
  {
    icon: '🌧️',
    title: 'Humidity helps',
    body: "Florida's natural humidity reduces watering stress and supports the lush, healthy leaf growth bonsai need.",
  },
  {
    icon: '☀️',
    title: 'Tropical species available',
    body: "Florida has access to tropical bonsai species — Ficus, Buttonwood, Bougainvillea — that simply don't survive northern winters.",
  },
]

const jumpLinks = [
  { href: '#starter-trees', label: 'Best Starter Trees' },
  { href: '#getting-started', label: 'Getting Started' },
  { href: '#florida-care', label: 'Florida Care Tips' },
  { href: '#mistakes', label: 'Common Mistakes' },
]

export default function BeginnerGuidePage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream">
        <section className="bg-forest text-white pt-16 pb-20 sm:pt-20 sm:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none select-none"
            aria-hidden
            style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #c8658a 0%, transparent 60%)' }}
          />
          <div className="section-wrap relative z-10">
            <div className="max-w-3xl">
              <p className="section-label text-bonsai-pink-lt mb-4">Start Here</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Start Your<br />
                <span className="text-bonsai-pink-lt">Bonsai Journey</span>
              </h1>
              <p className="font-sans text-xl text-white/80 leading-relaxed max-w-2xl mb-8">
                Everything you need to grow beautiful bonsai in Florida — the best beginner trees,
                simple care steps, and honest advice from people who grow them here every day.
              </p>
              {/* Jump links */}
              <nav aria-label="Guide sections" className="flex flex-wrap gap-3">
                {jumpLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="font-sans text-sm font-semibold px-4 py-2 rounded-full border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </section>
        <section className="section-wrap py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-label mb-4">The Simple Truth</p>
            <h2 className="section-heading mb-6">What is bonsai?</h2>
            <div className="pink-divider mb-8" />
            <p className="font-sans text-lg text-ink-light leading-relaxed mb-6">
              A bonsai is simply a tree — grown in a small container, shaped with care over time.
              That&apos;s it. There is no mystery. No secret knowledge required.
            </p>
            <p className="font-sans text-lg text-ink-light leading-relaxed mb-6">
              The word &ldquo;bonsai&rdquo; (盆栽) means &ldquo;planted in a tray.&rdquo; It originated in China, was
              refined in Japan, and now it is practiced all over the world — including right here
              in South Florida, where our tropical climate makes bonsai growing easier than almost
              anywhere else in the United States.
            </p>
            <p className="font-sans text-lg text-ink-light leading-relaxed">
              Anyone can grow a bonsai. You do not need experience. You do not need special tools.
              You need a good tree, the right soil, some sunlight, and a little patience.
            </p>
          </div>
        </section>
        <section className="bg-sage-pale py-14 sm:py-20">
          <div className="section-wrap">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <p className="section-label mb-3">Local Advantage</p>
                <h2 className="section-heading mb-4">Why Florida is perfect for bonsai</h2>
                <div className="pink-divider" />
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {whyFlorida.map(({ icon, title, body }) => (
                  <div key={title} className="card p-6 text-center">
                    <div className="text-4xl mb-4">{icon}</div>
                    <h3 className="font-serif text-xl text-forest font-bold mb-3">{title}</h3>
                    <p className="font-sans text-sm text-ink-light leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section id="starter-trees" className="section-wrap py-16 sm:py-24">
          <div className="text-center mb-12">
            <p className="section-label mb-4">Our Recommendation</p>
            <h2 className="section-heading mb-4">The 3 best starter trees for Florida</h2>
            <div className="pink-divider mb-6" />
            <p className="font-sans text-lg text-ink-light max-w-2xl mx-auto">
              Not all bonsai species work in Florida. These three are proven, beautiful, and
              forgiving enough for anyone starting out.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {starterTrees.map((tree) => (
              <article
                key={tree.name}
                className={`card p-7 flex flex-col relative ${tree.highlight ? 'ring-2 ring-forest' : ''}`}
              >
                {tree.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-forest text-white font-sans text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                      Best Pick
                    </span>
                  </div>
                )}

                {/* Rank + emoji */}
                <div className="flex items-start justify-between mb-5">
                  <span className="font-serif text-5xl text-forest/15 font-bold leading-none select-none">
                    {tree.rank}
                  </span>
                  <span className="text-4xl">{tree.emoji}</span>
                </div>

                {/* Difficulty badge */}
                <span className={`self-start font-sans text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 ${tree.difficultyColor}`}>
                  {tree.difficulty}
                </span>

                <h3 className="font-serif text-2xl text-forest font-bold leading-tight mb-1">
                  {tree.name}
                </h3>
                <p className="font-sans text-xs text-ink-light italic mb-2">{tree.latin}</p>
                <p className="font-sans text-sm font-semibold text-bonsai-pink mb-4">{tree.tagline}</p>

                <p className="font-sans text-sm text-ink-light leading-relaxed mb-5">
                  {tree.why}
                </p>

                {/* Pros list */}
                <ul className="space-y-2 mb-5 flex-1">
                  {tree.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2.5 font-sans text-sm text-ink-light">
                      <span className="text-forest mt-0.5 flex-shrink-0">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>

                {/* Care note */}
                <div className="bg-sage-pale rounded-2xl p-4">
                  <p className="font-sans text-xs font-bold tracking-wider uppercase text-forest mb-1">Quick Care</p>
                  <p className="font-sans text-xs text-ink-light leading-relaxed">{tree.care}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/trees" className="btn-primary">
              See Our Available Trees
            </Link>
          </div>
        </section>
        <section id="getting-started" className="bg-cream-warm py-16 sm:py-24">
          <div className="section-wrap">
            <div className="text-center mb-12">
              <p className="section-label mb-4">Step by Step</p>
              <h2 className="section-heading mb-4">How to get started in 5 steps</h2>
              <div className="pink-divider" />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="card p-7 flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="font-serif text-3xl font-bold text-forest/20 leading-none">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-forest font-bold mb-3">{step.title}</h3>
                    <p className="font-sans text-sm text-ink-light leading-relaxed mb-4">{step.body}</p>
                    <div className="flex items-start gap-2.5 bg-bonsai-pink-pale rounded-xl p-3.5">
                      <span className="text-base flex-shrink-0">💡</span>
                      <p className="font-sans text-xs text-ink leading-relaxed">{step.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="florida-care" className="section-wrap py-16 sm:py-24">
          <div className="text-center mb-12">
            <p className="section-label mb-4">Local Knowledge</p>
            <h2 className="section-heading mb-4">Florida-specific care tips</h2>
            <div className="pink-divider mb-6" />
            <p className="font-sans text-lg text-ink-light max-w-2xl mx-auto">
              Growing bonsai in Florida is different from the rest of the country. Here is what
              you need to know for our climate.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {floridaTips.map((tip) => (
              <div key={tip.title} className="card p-6">
                <div className="text-3xl mb-4">{tip.icon}</div>
                <h3 className="font-serif text-lg text-forest font-bold mb-3">{tip.title}</h3>
                <p className="font-sans text-sm text-ink-light leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="mistakes" className="bg-sage-pale py-16 sm:py-20">
          <div className="section-wrap">
            <div className="text-center mb-12">
              <p className="section-label mb-4">Learn From Others</p>
              <h2 className="section-heading mb-4">Common beginner mistakes</h2>
              <div className="pink-divider mb-6" />
              <p className="font-sans text-lg text-ink-light max-w-2xl mx-auto">
                Most beginner bonsai problems come from the same six mistakes. Avoid these and your
                tree will thrive.
              </p>
            </div>

            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
              {mistakes.map((item) => (
                <div key={item.mistake} className="card p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 text-bonsai-pink font-sans font-bold text-lg leading-none mt-0.5">✕</span>
                    <p className="font-sans text-sm font-bold text-ink">{item.mistake}</p>
                  </div>
                  <div className="flex items-start gap-3 pl-6">
                    <span className="flex-shrink-0 text-forest font-sans font-bold text-lg leading-none mt-0.5">✓</span>
                    <p className="font-sans text-sm text-ink-light leading-relaxed">{item.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section-wrap py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <p className="section-label mb-4">Ready to Begin?</p>
            <h2 className="section-heading mb-6">
              We help beginners find the perfect tree
            </h2>
            <div className="pink-divider mb-8" />
            <p className="font-sans text-lg text-ink-light leading-relaxed mb-10">
              Every beginner tree at Bonsai Florida comes with personal guidance — watering
              schedules, placement advice, and support whenever you have questions. You will
              never feel alone in this.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link href="/trees" className="btn-primary">
                See Trees for Sale
              </Link>
              <a href={CONTACT.phone.tel} className="btn-secondary">
                Call Us — {CONTACT.phone.display}
              </a>
              <a href={CONTACT.phone.sms} className="btn-secondary">
                Text Us
              </a>
              <a
                href={CONTACT.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Facebook
              </a>
            </div>
          </div>
        </section>
        <section className="bg-forest text-white py-12">
          <div className="section-wrap">
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-sans text-xs font-bold tracking-widest uppercase text-bonsai-pink-lt mb-6">
                Keep Learning
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { href: '/care-guides', label: 'Species Care Guides →' },
                  { href: '/trees', label: 'Browse Our Trees →' },
                  { href: '/#visit', label: 'Book a Garden Visit →' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="font-sans text-sm font-semibold px-5 py-3 rounded-full border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
