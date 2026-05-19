'use client'

import { useEffect, useRef } from 'react'

const CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2rQtgIgRIvKdusIMMARHlSxDTqPkyVpjcaRj8FYeULUNtJkIU8sMhWsD9ccA1iymKsd4wjE3Xw?gv=true'

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (opts: { url: string; color: string; label: string; target: Element }) => void
      }
    }
  }
}

export default function BookAppointment({ label = 'Book an Appointment' }: { label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js'
    script.async = true
    script.onload = () => {
      if (containerRef.current && window.calendar) {
        window.calendar.schedulingButton.load({
          url: CALENDAR_URL,
          color: '#1a3c28',
          label,
          target: containerRef.current,
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(link)
    }
  }, [label])

  return <div ref={containerRef} />
}
