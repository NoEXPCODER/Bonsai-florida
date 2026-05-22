'use client'

import { useEffect, useRef, useState } from 'react'
import type { DbSpecies } from '@/lib/supabase'
import { getSpeciesLatin } from '@/lib/species'

export default function SpeciesCombobox({ allSpecies, locale, onSelect }: {
  allSpecies: DbSpecies[]
  locale: string
  onSelect: (s: DbSpecies | null, customName: string) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<DbSpecies | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? allSpecies.filter(s =>
        s.name_en.toLowerCase().includes(query.toLowerCase()) ||
        s.name_vi.toLowerCase().includes(query.toLowerCase()) ||
        getSpeciesLatin(s).toLowerCase().includes(query.toLowerCase())
      )
    : allSpecies

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function pick(s: DbSpecies) {
    setSelected(s)
    setQuery(locale === 'vi' ? s.name_vi || s.name_en : s.name_en)
    setOpen(false)
    onSelect(s, locale === 'vi' ? s.name_vi || s.name_en : s.name_en)
  }

  function clear() {
    setSelected(null)
    setQuery('')
    onSelect(null, '')
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search species…"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setOpen(true)
            if (!e.target.value) { setSelected(null); onSelect(null, '') }
          }}
          onFocus={() => setOpen(true)}
          className="w-full px-4 py-3.5 pr-10 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-forest/30 transition"
        />
        {selected && (
          <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink text-lg">✕</button>
        )}
      </div>

      {selected && (
        <div className="mt-2 px-4 py-3 bg-sage-pale rounded-2xl border border-forest/10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-sans text-sm font-bold text-forest">{selected.name_en}</p>
              <p className="font-sans text-xs italic text-ink-light/60">{getSpeciesLatin(selected)}</p>
            </div>
            <span className={`font-sans text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
              selected.level === 'Beginner Friendly' ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage text-white'
            }`}>{selected.level}</span>
          </div>
          <div className="mt-2 space-y-1 rounded-xl bg-white/70 px-3 py-2">
            <p className="font-sans text-xs text-ink-light">
              <strong className="text-forest">Light:</strong> {selected.light_en || selected.sun_en}
            </p>
            <p className="font-sans text-xs text-ink-light">
              <strong className="text-forest">Water:</strong> {selected.watering_en || selected.water_en}
            </p>
          </div>
          <p className="font-sans text-xs text-ink-light mt-2 italic">Care guide stays linked by species.</p>
        </div>
      )}

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-2xl border border-forest/10 shadow-card-lg max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-center">
              <p className="font-sans text-sm text-ink-light">No species found for &quot;{query}&quot;</p>
            </div>
          ) : (
            filtered.map(s => (
              <button
                key={s.id}
                type="button"
                onMouseDown={() => pick(s)}
                className="w-full text-left px-4 py-3 hover:bg-sage-pale transition-colors border-b border-forest/5 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-sans text-sm font-semibold text-forest">{s.name_en}</span>
                    <p className="font-sans text-xs italic text-ink-light/50">{getSpeciesLatin(s)}</p>
                  </div>
                  <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    s.level === 'Beginner Friendly' ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage-pale text-forest'
                  }`}>{s.level === 'Beginner Friendly' ? 'Beginner' : 'Inter.'}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
