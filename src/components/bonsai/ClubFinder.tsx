'use client'

import { useState } from 'react'

interface Club {
  name: string
  city: string
  region: string
  lat: number
  lng: number
  website?: string
  facebook?: string
  instagram?: string
  meeting: string
}

const CLUBS: Club[] = [
  {
    name: 'Jacksonville Bonsai Society',
    city: 'Jacksonville',
    region: 'Northeast Florida',
    lat: 30.332,
    lng: -81.655,
    facebook: 'https://www.facebook.com/groups/jacksonvillebonsai',
    meeting: 'Meets monthly',
  },
  {
    name: 'Gainesville Bonsai Club',
    city: 'Gainesville',
    region: 'North Central Florida',
    lat: 29.651,
    lng: -82.325,
    facebook: 'https://www.facebook.com/search/top?q=Gainesville%20Bonsai%20Club',
    meeting: 'Meets monthly',
  },
  {
    name: 'Tallahassee Bonsai Society',
    city: 'Tallahassee',
    region: 'Northwest Florida',
    lat: 30.438,
    lng: -84.281,
    facebook: 'https://www.facebook.com/search/top?q=Tallahassee%20Bonsai%20Society',
    meeting: 'Meets monthly',
  },
  {
    name: 'Central Florida Bonsai Club',
    city: 'Orlando',
    region: 'Central Florida',
    lat: 28.538,
    lng: -81.379,
    website: 'https://www.cfbonsai.com',
    facebook: 'https://www.facebook.com/centralfloridabonsaiclub',
    meeting: 'Meets monthly',
  },
  {
    name: 'Bonsai Society of Brevard',
    city: 'Melbourne',
    region: 'Space Coast',
    lat: 28.083,
    lng: -80.608,
    facebook: 'https://www.facebook.com/search/top?q=Bonsai%20Society%20of%20Brevard',
    meeting: 'Meets monthly',
  },
  {
    name: 'Volusia Bonsai Society',
    city: 'Daytona Beach',
    region: 'Northeast Florida',
    lat: 29.211,
    lng: -81.023,
    facebook: 'https://www.facebook.com/search/top?q=Volusia%20Bonsai%20Society',
    meeting: 'Meets monthly',
  },
  {
    name: 'Tampa Bay Bonsai Society',
    city: 'Tampa',
    region: 'Tampa Bay',
    lat: 27.947,
    lng: -82.458,
    website: 'https://www.tampabonsai.org',
    facebook: 'https://www.facebook.com/TampaBayBonsaiSociety',
    meeting: 'Meets monthly',
  },
  {
    name: 'Pinellas Bonsai Society',
    city: 'St. Petersburg',
    region: 'Tampa Bay',
    lat: 27.773,
    lng: -82.639,
    facebook: 'https://www.facebook.com/groups/pinellasbonsai',
    meeting: 'Meets monthly',
  },
  {
    name: 'Suncoast Bonsai Society',
    city: 'Sarasota',
    region: 'Southwest Florida',
    lat: 27.336,
    lng: -82.530,
    facebook: 'https://www.facebook.com/search/top?q=Suncoast%20Bonsai%20Society',
    meeting: 'Meets monthly',
  },
  {
    name: 'Caloosahatchee Bonsai Society',
    city: 'Fort Myers',
    region: 'Southwest Florida',
    lat: 26.640,
    lng: -81.872,
    facebook: 'https://www.facebook.com/search/top?q=Caloosahatchee%20Bonsai%20Society',
    meeting: 'Meets monthly',
  },
  {
    name: 'Palm Beach Bonsai Club',
    city: 'West Palm Beach',
    region: 'Palm Beach',
    lat: 26.715,
    lng: -80.053,
    facebook: 'https://www.facebook.com/search/top?q=Palm%20Beach%20Bonsai%20Club',
    meeting: 'Meets monthly',
  },
  {
    name: 'Gold Coast Bonsai Society',
    city: 'Fort Lauderdale',
    region: 'South Florida',
    lat: 26.122,
    lng: -80.143,
    facebook: 'https://www.facebook.com/groups/goldcoastbonsai',
    meeting: 'Meets monthly',
  },
  {
    name: 'Bonsai Society of Greater Miami',
    city: 'Miami',
    region: 'South Florida',
    lat: 25.775,
    lng: -80.208,
    facebook: 'https://www.facebook.com/search/top?q=Bonsai%20Society%20Greater%20Miami',
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

  return (
    <div>
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

      {status === 'error' && (
        <p className="text-center font-sans text-sm text-bonsai-pink mb-6" role="alert">
          {errorMsg}
        </p>
      )}

      {status === 'done' && results.length > 0 && (
        <div>
          <p className="text-center font-sans text-sm text-ink-light mb-6">
            Showing clubs nearest to <strong className="text-forest">{locationLabel}</strong>
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.slice(0, 6).map((club) => (
              <div key={club.name} className="card p-6 flex flex-col gap-3">
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
                  {club.website && (
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs font-semibold px-4 py-2 rounded-full bg-forest text-white hover:bg-forest-light transition-colors min-h-[36px] flex items-center"
                      aria-label={`Visit ${club.name} website`}
                    >
                      Website
                    </a>
                  )}
                  {club.facebook && (
                    <a
                      href={club.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs font-semibold px-4 py-2 rounded-full border border-forest/20 text-forest hover:bg-forest hover:text-white transition-colors min-h-[36px] flex items-center gap-1.5"
                      aria-label={`Find ${club.name} on Facebook`}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                  )}
                  {club.instagram && (
                    <a
                      href={club.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs font-semibold px-4 py-2 rounded-full border border-forest/20 text-forest hover:bg-forest hover:text-white transition-colors min-h-[36px] flex items-center gap-1.5"
                      aria-label={`Find ${club.name} on Instagram`}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-sans text-xs text-ink-light mt-8">
            Meeting schedules vary — check each club&apos;s page for the latest dates and locations.
          </p>
        </div>
      )}
    </div>
  )
}
