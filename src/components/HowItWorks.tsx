const STEPS = [
  {
    number: '1',
    title: 'Pick a Tree',
    description: 'Browse our collection online or visit our garden in Palm Beach to find the perfect tree.',
  },
  {
    number: '2',
    title: 'Scan the QR Tag',
    description: 'Every tree has a QR tag with its full care guide, care tips, and price — right on your phone.',
  },
  {
    number: '3',
    title: 'Call or Text to Visit',
    description: 'Contact us to arrange a garden visit or pickup. We\'ll help you take it home with confidence.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-cream-warm py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="section-wrap">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Simple Process</p>
          <h2 id="how-heading" className="section-heading mb-4">How It Works</h2>
          <div className="pink-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={i} className="card p-6 sm:p-7 text-center flex flex-col items-center">
              {/* Number circle */}
              <div className="w-14 h-14 rounded-full bg-forest text-white font-serif text-2xl font-bold flex items-center justify-center mb-5 shadow-soft">
                {step.number}
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
