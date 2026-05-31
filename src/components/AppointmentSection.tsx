'use client'

import BookGardenVisitButton from '@/components/BookGardenVisitButton'
import { siteConfig } from '@/lib/siteConfig'

export default function AppointmentSection() {
  return (
    <section id="visit" className="bg-cream py-16 sm:py-24" aria-labelledby="appointment-heading">
      <div className="section-wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="section-label mb-3">Private appointments</p>
            <h2 id="appointment-heading" className="section-heading max-w-2xl">
              Visit Bonsai Florida
            </h2>
            <p className="mt-5 max-w-2xl font-sans text-lg leading-8 text-forest/75">
              Browse available bonsai online, then request a private garden visit by text. Each tree will have a QR tag with price, care information, and tree details so visitors can browse with less staff assistance.
            </p>
          </div>

          <div className="rounded-3xl border border-forest/15 bg-cream-light p-6 shadow-card-lg sm:p-8">
            <p className="mb-5 font-sans text-base leading-7 text-forest/75">
              Bonsai Florida is located in {siteConfig.publicArea} near ZIP code {siteConfig.publicZip}. Garden visits are by appointment only. The exact address and Google Maps link are sent after we confirm your visit by text.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <BookGardenVisitButton />
              <a href={siteConfig.textBookingUrl} className="btn-secondary justify-center text-base px-6 py-4 min-h-[56px]">
                Text First
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
