'use client'

import { siteConfig } from '@/lib/siteConfig'

export default function BookAppointment({
  label = 'Book an Appointment',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <a
      href={siteConfig.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'btn-primary text-sm py-2.5 px-6 min-h-[44px]'}
    >
      {label}
    </a>
  )
}
