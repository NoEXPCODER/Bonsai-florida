'use client'

const CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2rQtgIgRIvKdusIMMARHlSxDTqPkyVpjcaRj8FYeULUNtJkIU8sMhWsD9ccA1iymKsd4wjE3Xw?gv=true'

export default function BookAppointment({
  label = 'Book an Appointment',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <a
      href={CALENDAR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'btn-primary text-sm py-2.5 px-6 min-h-[44px]'}
    >
      {label}
    </a>
  )
}
