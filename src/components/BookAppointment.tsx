'use client'

export default function BookAppointment({
  label = 'Book an Appointment',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <a
      href="/book"
      className={className ?? 'btn-primary text-sm py-2.5 px-6 min-h-[44px]'}
    >
      {label}
    </a>
  )
}
