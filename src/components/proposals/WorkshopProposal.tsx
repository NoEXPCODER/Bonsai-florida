import type { avenirWorkshopProposal } from '@/data/proposals/avenir-bonsai-workshop'

type WorkshopProposalData = typeof avenirWorkshopProposal
type WorkshopProposalVariant = 'landing' | 'print'

function ProposalButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}) {
  return (
    <a
      href={href}
      className={
        variant === 'primary'
          ? 'inline-flex min-h-[52px] items-center justify-center rounded-full bg-forest px-7 py-3 font-sans text-sm font-bold tracking-[0.08em] text-white shadow-card transition hover:bg-forest-light'
          : 'inline-flex min-h-[52px] items-center justify-center rounded-full border border-forest/25 px-7 py-3 font-sans text-sm font-bold tracking-[0.08em] text-forest transition hover:border-forest'
      }
    >
      {children}
    </a>
  )
}

function WorkshopCards({ proposal }: { proposal: WorkshopProposalData }) {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="workshop-options">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="section-label mb-3">Workshop Formats</p>
          <h2 id="workshop-options" className="font-serif text-3xl leading-tight text-forest sm:text-5xl">
            Flexible experiences for residents, families, and lifestyle programming.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {proposal.workshopCards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-2xl border border-forest/12 bg-cream-light p-5 shadow-soft"
            >
              <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sage-pale font-serif text-sm font-bold text-forest">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mb-3 font-serif text-xl leading-snug text-forest">{card.title}</h3>
              <p className="font-sans text-sm leading-6 text-ink-light">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FitSection({ proposal }: { proposal: WorkshopProposalData }) {
  return (
    <section className="bg-forest px-5 py-16 text-white sm:px-8 lg:py-24" aria-labelledby="why-avenir">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.24em] text-bonsai-pink-lt">
            Why This Fits Avenir
          </p>
          <h2 id="why-avenir" className="font-serif text-3xl leading-tight sm:text-5xl">
            A calm, refined program built around nature, learning, and shared experience.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {proposal.fitReasons.map(reason => (
            <div key={reason} className="rounded-2xl border border-white/14 bg-white/8 px-5 py-4">
              <p className="font-sans text-sm font-semibold leading-6 text-white/88">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FooterBlock({ proposal }: { proposal: WorkshopProposalData }) {
  return (
    <footer className="bg-forest-dark px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-white/15 pt-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl">{proposal.brand}</p>
          <p className="mt-2 max-w-xl font-sans text-sm leading-6 text-white/65">
            Family-run South Florida bonsai business based in West Palm Beach. Members of the Bonsai Society of the Palm Beaches.
          </p>
        </div>
        <div className="grid gap-1 font-sans text-sm text-white/78 sm:text-right">
          <a href={proposal.website} className="hover:text-white">Website: {proposal.website}</a>
          <p>Instagram: {proposal.instagram}</p>
          <p>Facebook: {proposal.facebook}</p>
          <p>TikTok: {proposal.tiktok}</p>
          <a href={`mailto:${proposal.email}`} className="hover:text-white">Email: {proposal.email}</a>
        </div>
      </div>
    </footer>
  )
}

export default function WorkshopProposal({
  proposal,
  variant = 'landing',
}: {
  proposal: WorkshopProposalData
  variant?: WorkshopProposalVariant
}) {
  const isPrint = variant === 'print'

  return (
    <main className={isPrint ? 'bg-white text-ink print-proposal' : 'bg-cream text-ink'}>
      {isPrint && (
        <style>{`
          @media print {
            @page { size: letter; margin: 0.45in; }
            body { background: #ffffff !important; }
            .print-proposal section { break-inside: avoid; page-break-inside: avoid; }
            .print-hide { display: none !important; }
            .print-proposal a { color: inherit; text-decoration: none; }
          }
        `}</style>
      )}

      <section className="relative overflow-hidden bg-cream-light" aria-labelledby="proposal-headline">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex min-h-[620px] flex-col justify-center px-5 py-16 sm:px-8 lg:px-14">
            <p className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.28em] text-bonsai-pink">
              {proposal.brand} for {proposal.audience}
            </p>
            <h1 id="proposal-headline" className="font-serif text-5xl leading-[0.95] text-forest sm:text-7xl lg:text-8xl">
              {proposal.headline}
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-2xl leading-snug text-forest-dark sm:text-3xl">
              {proposal.subheadline}
            </p>
            <p className="mt-7 max-w-2xl font-sans text-base leading-8 text-ink-light sm:text-lg">
              {proposal.intro}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row print-hide">
              <ProposalButton href={proposal.mailto}>{proposal.ctaButton}</ProposalButton>
              <ProposalButton href="/avenir-bonsai-workshop/print" variant="secondary">Print Proposal</ProposalButton>
            </div>
          </div>
          <div className="relative min-h-[440px] lg:min-h-[620px]">
            {/* Replace this local placeholder with a real Bonsai Florida workshop or garden image in public/. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proposal.heroImage}
              alt="Japanese-inspired bonsai workshop arrangement"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-cream-warm px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="about-bonsai-florida">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-forest/12 bg-white shadow-card">
            {/* Replace this local placeholder with a detail image showing hands-on bonsai styling. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proposal.detailImage} alt="Hands-on bonsai styling workshop detail" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <p className="section-label mb-3">About Bonsai Florida</p>
            <h2 id="about-bonsai-florida" className="font-serif text-3xl leading-tight text-forest sm:text-5xl">
              A South Florida bonsai experience designed for approachable, beautiful learning.
            </h2>
            <p className="mt-6 font-sans text-base leading-8 text-ink-light sm:text-lg">{proposal.about}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Beginner friendly', 'South Florida care', 'Hands-on learning'].map(item => (
                <div key={item} className="rounded-2xl border border-forest/12 bg-cream-light px-4 py-4">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-forest">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WorkshopCards proposal={proposal} />
      <FitSection proposal={proposal} />

      <section className="bg-cream-light px-5 py-16 text-center sm:px-8 lg:py-24" aria-labelledby="proposal-cta">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-4">Next Step</p>
          <h2 id="proposal-cta" className="font-serif text-4xl leading-tight text-forest sm:text-6xl">
            {proposal.cta}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-8 text-ink-light">
            We would be happy to discuss workshop format, timing, resident capacity, starter tree options, and whether the event should be hosted indoors, outdoors, or as a market-style experience.
          </p>
          <div className="mt-9 print-hide">
            <ProposalButton href={proposal.mailto}>{proposal.ctaButton}</ProposalButton>
          </div>
        </div>
      </section>

      <FooterBlock proposal={proposal} />
    </main>
  )
}
