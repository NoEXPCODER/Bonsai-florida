'use client'

import { useState } from 'react'

interface Club {
  name: string
  city: string
  region: string
  lat: number
  lng: number
  website?: string
  meeting: string
}

const CLUBS: Club[] = [
  {
    name: 'Jacksonville Bonsai Society',
    city: 'Jacksonville',
    region: 'Northeast Florida',
    lat: 30.332,
    lng: -81.655,
    meeting: 'Meets monthly',
  },
  {
    name: 'Gainesville Bonsai Club',
    city: 'Gainesville',
    region: 'North Central Florida',
    lat: 29.651,
    lng: -82.325,
    meeting: 'Meets monthly',
  },
  {
    name: 'Tallahassee Bonsai Society',
    city: 'Tallahassee',
    region: 'Northwest Florida',
    lat: 30.438,
    lng: -84.281,
    meeting: 'Meets monthly',
  },
  {
    name: 'Central Florida Bonsai Club',
    city: 'Orlando',
    region: 'Central Florida',
    lat: 28.538,
    lng: -81.379,
    meeting: 'Meets monthly',
    website: 'https://www.cfbonsai.com',
  },
  {
    name: 'Bonsai Society of Brevard',
    city: 'Melbourne',
    region: 'Space Coast',
    lat: 28.083,
    lng: -80.608,
    meeting: 'Meets monthly',
  },
  {
    name: 'Volusia Bonsai Society',
    city: 'Daytona Beach',
    region: 'Northeast Florida',
    lat: 29.211,
    lng: -81.023,
    meeting: 'Meets monthly',
  },
  {
    name: 'Tampa Bay Bonsai Society',
    city: 'Tampa',
    region: 'Tampa Bay',
    lat: 27.947,
    lng: -82.458,
    meeting: 'Meets monthly',
    website: 'https://www.tampabonsai.org',
  },
  {
    name: 'Pinellas Bonsai Society',
    city: 'St. Petersburg',
    region: 'Tampa Bay',
    lat: 27.773,
    lng: -82.639,
    meeting: 'Meets monthly',
  },
  {
    name: 'Suncoast Bonsai Society',
    city: 'Sarasota',
    region: 'Southwest Florida',
    lat: 27.336,
    lng: -82.530,
    meeting: 'Meets monthly',
  },
  {
    name: 'Caloosahatchee Bonsai Society',
    city: 'Fort Myers',
    region: 'Southwest Florida',
    lat: 26.640,
    lng: -81.872,
    meeting: 'Meets monthly',
  },
  {
    name: 'Palm Beach Bonsai Club',
    city: 'West Palm Beach',
    region: 'Palm Beach',
    lat: 26.715,
    lng: -80.053,
    meeting: 'Meets monthly',
  },
  {
    name: 'Gold Coast Bonsai Society',
    city: 'Fort Lauderdale',
    region: 'South Florida',
    lat: 26.122,
    lng: -80.143,
    meeting: 'Meets monthly',
  },
  {
    name: 'Bonsai Society of Greater Miami',
    city: 'Miami',
    region: 'South Florida',
    lat: 25.775,
    lng: -80.208,
    meeting: 'Meets monthly',
  },
]

const FLORIDA_CITIES = [
  { label: 'Pensacola', lat: 30.421, lng: -87.217 },
  { label: 'Panama City', lat: 30.159, lng: -85.660 },
  { label: 'Tallahassee', lat: 30.438, lng: -84.281 },
  { label: 'Jacksonville', lat: 30.332, lng: -81.655 },
  { label: 'Gainesville', lat: 29.651, lng: -82.325 },
  { label: 'Ocala', lat: 29.187, lng: -82.140 },
  { label: 'Daytona Beach', lat: 29.211, lng: -81.023 },
  { label: 'Orlando', lat: 28.538, lng: -81.379 },
  { label: 'Melbourne / Brevard', lat: 28.083, lng: -80.608 },
  { label: 'Tampa', lat: 27.947, lng: -82.458 },
  { label: 'St. Petersburg', lat: 27.773, lng: -82.639 },
  { label: 'Sarasota', lat: 27.336, lng: -82.530 },
  { label: 'Fort Myers', lat: 26.640, lng: -81.872 },
  { label: 'West Palm Beach', lat: 26.715, lng: -80.053 },
  { label: 'Fort Lauderdale', lat: 26.122, lng: -80.143 },
  { label: 'Miami', lat: 25.775, lng: -80.208 },
  { label: 'Key West', lat: 24.555, lng: -81.779 },
]

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function sortedByDistance(lat: number, lng: number) {
  return CLUBS.map((club) => ({
    ...club,
    miles: Math.round(haversine(lat, lng, club.lat, club.lng)),
  })).sort((a, b) => a.miles - b.miles)
}

type Status = 'idle' | 'locating' | 'done' | 'error'

export default function ClubFinder() {
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<(Club & { miles: number })[]>([])
  const [locationLabel, setLocationLabel] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  function requestGeolocation() {
    if (!navigator.geolocation) {
      setStatus('error')
      setErrorMsg('Your browser does not support location access. Pick a city below.')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setResults(sortedByDistance(latitude, longitude))
        setLocationLabel('your location')
        setStatus('done')
      },
      () => {
        setStatus('error')
        setErrorMsg('Location access was denied. Pick a city below instead.')
      },
      { timeout: 8000 }
    )
  }

  function selectCity(value: string) {
    setSelectedCity(value)
    const city = FLORIDA_CITIES.find((c) => c.label === value)
    if (!city) return
    setResults(sortedByDistance(city.lat, city.lng))
    setLocationLabel(city.label)
    setStatus('done')
  }

  const mapsUrl = (club: Club) =>
    `https://www.google.com/maps/search/${encodeURIComponent(club.name + ' ' + club.city + ' FL')}`

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <button
          onClick={requestGeolocation}
          disabled={status === 'locating'}
          className="btn-primary min-w-[220px]"
          aria-label="Use my current location to find nearby bonsai clubs"
        >
          {status === 'locating' ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Finding you…
            </span>
          ) : (
            <>📍 Use My Location</>
          )}
        </button>

        <span className="font-sans text-sm text-ink-light">or pick a city</span>

        <select
          value={selectedCity}
          onChange={(e) => selectCity(e.target.value)}
          className="font-sans text-sm text-ink bg-cream-light border border-forest/20 rounded-full px-5 py-3 min-h-[56px] focus:outline-none focus:border-forest cursor-pointer"
          aria-label="Select a Florida city"
        >
          <option value="">Choose a city…</option>
          {FLORIDA_CITIES.map((c) => (
            <option key={c.label} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {status === 'error' && (
        <p className="text-center font-sans text-sm text-bonsai-pink mb-6" role="alert">
          {errorMsg}
        </p>
      )}

      {/* Results */}
      {status === 'done' && results.length > 0 && (
        <div>
          <p className="text-center font-sans text-sm text-ink-light mb-6">
            Showing clubs nearest to <strong className="text-forest">{locationLabel}</strong>
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.slice(0, 6).map((club) => (
              <div key={club.name} className="card p-6 flex flex-col gap-3">
                {/* Distance badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-bonsai-pink">
                    {club.region}
                  </span>
                  <span className="font-sans text-xs font-semibold text-ink-light whitespace-nowrap">
                    {club.miles} mi
                  </span>
                </div>

                <h3 className="font-serif text-lg text-forest font-bold leading-snug">
                  {club.name}
                </h3>
                <p className="font-sans text-sm text-ink-light">{club.city}, FL</p>
                <p className="font-sans text-xs text-ink-light">{club.meeting}</p>

                <div className="flex gap-2 mt-auto pt-2 flex-wrap">
                  <a
                    href={mapsUrl(club)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs font-semibold px-4 py-2 rounded-full bg-forest text-white hover:bg-forest-light transition-colors min-h-[36px] flex items-center"
                    aria-label={`Get directions to ${club.name}`}
                  >
                    Get Directions →
                  </a>
                  {club.website && (
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs font-semibold px-4 py-2 rounded-full border border-forest/20 text-forest hover:border-forest transition-colors min-h-[36px] flex items-center"
                      aria-label={`Visit ${club.name} website`}
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-sans text-xs text-ink-light mt-8">
            Meeting schedules vary — search the club name for the latest dates and locations.
          </p>
        </div>
      )}
    </div>
  )
}
