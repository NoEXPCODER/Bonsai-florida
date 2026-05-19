'use client'

import { useState, useEffect } from 'react'
import { CONTACT } from '@/config/contact'

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8 // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function DistanceBadge({ className = '' }: { className?: string }) {
  const [miles, setMiles] = useState<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => {
        const d = haversine(
          pos.coords.latitude,
          pos.coords.longitude,
          CONTACT.coordinates.lat,
          CONTACT.coordinates.lng,
        )
        setMiles(Math.round(d * 10) / 10)
      },
      () => {}, // silent on deny
      { timeout: 8000 },
    )
  }, [])

  if (miles === null) return null

  return (
    <span className={`font-sans text-xs font-semibold text-bonsai-pink-lt ${className}`}>
      {miles < 1 ? 'Less than 1 mile from you' : `${miles} miles from you`}
    </span>
  )
}
