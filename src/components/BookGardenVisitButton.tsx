import { siteConfig } from '@/lib/siteConfig'

export default function BookGardenVisitButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={siteConfig.bookingUrl}
      className={`inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-forest px-6 py-4 text-center font-sans text-base font-bold text-white shadow-card transition-all hover:bg-forest-light active:scale-95 sm:w-auto ${className}`}
      aria-label="Book a garden visit with Bonsai Florida"
    >
      Book a Garden Visit
    </a>
  )
}
