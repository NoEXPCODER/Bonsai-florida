'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CONTACT } from '@/config/contact'
import BookGardenVisitButton from '@/components/BookGardenVisitButton'
import type { DbTree, DbSpecies } from '@/lib/supabase'
import { getTreeImageUrls } from '@/lib/tree-images'
import { makeSpeciesSlug } from '@/lib/species'
import { siteConfig } from '@/lib/siteConfig'
import { optimizeTreeImage } from '@/lib/image-optimizer'
import { SunIcon, WaterIcon, LeafIcon } from '@/components/Icons'
import Navbar from '@/components/Navbar'
import SpeciesCombobox from '@/components/SpeciesCombobox'

const inputCls = 'w-full px-4 py-3 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest/30 transition'

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ urls, startIdx, onClose }: { urls: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx)
  const [startX, setStartX] = useState<number | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(i - 1, 0))
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, urls.length - 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, urls.length])

  function onTouchStart(e: React.TouchEvent) { setStartX(e.touches[0].clientX) }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX === null) return
    const dx = startX - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) setIdx(i => dx > 0 ? Math.min(i + 1, urls.length - 1) : Math.max(i - 1, 0))
    setStartX(null)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <button onClick={e => { e.stopPropagation(); onClose() }}
        className="absolute top-4 right-4 text-white bg-white/10 w-11 h-11 rounded-full flex items-center justify-center text-xl z-10">✕</button>
      {urls.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {idx + 1} / {urls.length}
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[idx]} alt={`Photo ${idx + 1}`}
        className="max-w-full max-h-full object-contain p-2"
        onClick={e => e.stopPropagation()} />
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i - 1) }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 text-white w-11 h-11 rounded-full flex items-center justify-center text-2xl">‹</button>
      )}
      {idx < urls.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i + 1) }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 text-white w-11 h-11 rounded-full flex items-center justify-center text-2xl">›</button>
      )}
      {urls.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {urls.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setIdx(i) }}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Photo carousel ───────────────────────────────────────────────────────────

function PhotoCarousel({ urls, name, onTap }: { urls: string[]; name: string; onTap?: (idx: number) => void }) {
  const [idx, setIdx] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)

  if (urls.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-7xl opacity-50">🌿</div>
  }

  function onTouchStart(e: React.TouchEvent) { setStartX(e.touches[0].clientX) }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX === null) return
    const dx = startX - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) setIdx(i => dx > 0 ? Math.min(i + 1, urls.length - 1) : Math.max(i - 1, 0))
    setStartX(null)
  }

  return (
    <div className="relative w-full h-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Blurred background fill — same image, blurred + scaled to fill gaps */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[idx]} alt="" aria-hidden
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60 pointer-events-none" />
      {/* Main image — object-cover fills the frame, blurred bg softens any edges */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[idx]} alt={`${name} ${idx + 1}`}
        className={`relative w-full h-full object-cover ${onTap ? 'cursor-zoom-in' : ''}`}
        onClick={() => onTap?.(idx)} />
      {urls.length > 1 && idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i - 1) }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg">‹</button>
      )}
      {urls.length > 1 && idx < urls.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i + 1) }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg">›</button>
      )}
      {urls.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {urls.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`} />
          ))}
        </div>
      )}
      {urls.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-bold px-2 py-0.5 rounded-full">{idx + 1}/{urls.length}</div>
      )}
      {onTap && (
        <div className="absolute bottom-3 left-3 bg-black/40 text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
          Tap to zoom
        </div>
      )}
    </div>
  )
}

// ─── Species care guide (accordion) ─────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  reserved:    { label: 'Reserved',    bg: '#FEF3C7', color: '#92400E' },
  in_training: { label: 'In Training', bg: '#EFF6FF', color: '#1D4ED8' },
  in_work:     { label: 'In Work',     bg: '#F5F3FF', color: '#6D28D9' },
}

type SocialFormat = 'group' | 'marketplace' | 'reel'

const SOCIAL_FORMAT_LABELS: Record<SocialFormat, string> = {
  group: 'Facebook Group',
  marketplace: 'Marketplace',
  reel: 'Reel Caption',
}

function displayPrice(price: string): string {
  const trimmed = price.trim()
  return trimmed.startsWith('$') ? trimmed : `$${trimmed}`
}

function getTreeSpeciesLabel(tree: DbTree, species?: DbSpecies | null): string {
  return species?.name_en || tree.species || 'Tropical bonsai'
}

function getTreeLatinLabel(tree: DbTree, species?: DbSpecies | null): string | null {
  return species?.species_latin || species?.latin_name || tree.species || null
}

function getTreeLightLabel(tree: DbTree, species?: DbSpecies | null): string {
  return species?.light_en || species?.sun_en || tree.sun || 'Bright outdoor light'
}

function getTreeWaterLabel(tree: DbTree, species?: DbSpecies | null): string {
  return species?.watering_en || species?.water_en || tree.water || 'Water when the top soil begins to dry'
}

function buildSocialPost(tree: DbTree, species: DbSpecies | null | undefined, format: SocialFormat): string {
  const price = displayPrice(tree.price)
  const speciesName = getTreeSpeciesLabel(tree, species)
  const latinName = getTreeLatinLabel(tree, species)
  const light = getTreeLightLabel(tree, species)
  const water = getTreeWaterLabel(tree, species)
  const careLevel = species?.difficulty || species?.level || tree.level
  const code = tree.tree_code ? `\nTree code: ${tree.tree_code}` : ''
  const publicLocation = `${siteConfig.publicArea}, ${siteConfig.publicZip}`
  const treeUrl = typeof window !== 'undefined' ? window.location.href : ''
  const linkLine = treeUrl ? `\nTree details: ${treeUrl}` : ''

  if (format === 'marketplace') {
    return `${tree.name} Bonsai - ${careLevel}

Price: ${price}
Species: ${speciesName}${latinName ? ` (${latinName})` : ''}
Care level: ${careLevel}
Light: ${light}
Water: ${water}${code}

Available in the ${publicLocation} area.
Message me to reserve or schedule a garden visit.
Exact address is sent after appointment confirmation.${linkLine}`
  }

  if (format === 'reel') {
    return `${tree.name} bonsai is available.

${price} - ${careLevel}
Located in the ${publicLocation} area.
Message me to reserve or request a garden visit.
Exact address is sent after appointment confirmation.${linkLine}

#bonsai #floridabonsai #westpalmbeach #tropicalbonsai #bonsaitree #ficusbonsai`
  }

  return `Available Bonsai: ${tree.name}

Price: ${price}
Species: ${speciesName}${latinName ? ` (${latinName})` : ''}
Care level: ${careLevel}
Light: ${light}
Water: ${water}${code}

Available by appointment in the ${publicLocation} area.
Message me to reserve this tree or schedule a garden visit.
Exact address is sent privately after appointment confirmation.${linkLine}

#bonsai #floridabonsai #westpalmbeach #tropicalbonsai`
}

function SocialPostGenerator({ tree, species }: { tree: DbTree; species?: DbSpecies | null }) {
  const [format, setFormat] = useState<SocialFormat>('group')
  const [copied, setCopied] = useState(false)
  const post = buildSocialPost(tree, species, format)

  async function copyPost() {
    await navigator.clipboard.writeText(post)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="card p-5 mb-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-1">Social Media</p>
          <h2 className="font-serif text-2xl text-forest">Post Generator</h2>
        </div>
        <button
          type="button"
          onClick={copyPost}
          className="btn-primary text-xs px-4 py-2.5 flex-shrink-0"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-3 rounded-2xl bg-sage-pale/70 p-1">
        {(['group', 'marketplace', 'reel'] as SocialFormat[]).map(option => (
          <button
            key={option}
            type="button"
            onClick={() => setFormat(option)}
            className={`min-h-[42px] rounded-xl px-2 font-sans text-[11px] font-bold transition-colors ${
              format === option ? 'bg-forest text-white shadow-sm' : 'text-forest hover:bg-white/70'
            }`}
          >
            {SOCIAL_FORMAT_LABELS[option]}
          </button>
        ))}
      </div>

      <textarea
        readOnly
        value={post}
        rows={13}
        className="w-full resize-none rounded-2xl border border-forest/15 bg-white px-4 py-3 font-sans text-sm leading-6 text-ink focus:outline-none focus:ring-2 focus:ring-forest/30"
        aria-label={`${SOCIAL_FORMAT_LABELS[format]} post text`}
      />
      <p className="mt-3 font-sans text-xs leading-5 text-ink-light">
        Uses only the public area and ZIP. Send the exact address privately after the appointment is confirmed.
      </p>
    </div>
  )
}

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]/)
  return m ? m[0] : text.slice(0, 90)
}

function AccordionSection({ icon, title, summary, highlighted, children }: {
  icon: React.ReactNode; title: string; summary?: string | null; highlighted?: boolean; children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={`rounded-2xl border overflow-hidden ${highlighted ? 'border-forest/20 bg-sage-pale/30' : 'bg-white border-forest/10'}`}>
      <button type="button" onClick={() => setIsOpen(p => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left">
        <span className="text-forest flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs font-bold text-forest tracking-widest uppercase">{title}</p>
          {summary && !isOpen && (
            <p className="font-sans text-sm text-ink-light mt-0.5 truncate">{summary}</p>
          )}
        </div>
        <span className={`text-ink-light flex-shrink-0 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-forest/5 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
}
function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
}
function CopyIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
}
function LinkIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
}

function SharePanel({ tree, species }: { tree: DbTree; species?: DbSpecies | null }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<'link' | 'text' | null>(null)
  const [pageUrl, setPageUrl] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setPageUrl(window.location.href) }, [])

  useEffect(() => {
    if (!open) return
    function onOutsideClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [open])

  const treeUrl = pageUrl || `https://bonsaiflorida.com/tree/${tree.tree_code}`
  const origin = pageUrl ? new URL(pageUrl).origin : 'https://bonsaiflorida.com'
  const careGuideUrl = species ? `${origin}/care-guides/${makeSpeciesSlug(species)}` : null
  const speciesTag = tree.species
    ? '#' + tree.species.split(' ')[0].replace(/[^a-zA-Z]/g, '') + 'Bonsai'
    : species?.name_en
      ? '#' + species.name_en.split(' ')[0].replace(/[^a-zA-Z]/g, '') + 'Bonsai'
      : ''
  const levelBlurb = tree.level === 'Beginner Friendly'
    ? 'A perfect starter bonsai — low-maintenance and thrives in South Florida.'
    : 'A beautiful piece for the experienced collector.'

  const postText = [
    `🌿 ${tree.name} — $${tree.price}`,
    ...(tree.species ? [tree.species] : []),
    '',
    `🌱 ${tree.level}`,
    `☀️ Sun: ${tree.sun}`,
    `💧 Water: ${tree.water}`,
    '',
    levelBlurb,
    '',
    `Available at Bonsai Florida · Palm Beach, FL`,
    `Text to inquire: ${CONTACT.phone.display}`,
    '',
    `👉 View tree: ${treeUrl}`,
    ...(careGuideUrl ? [`📖 Care guide: ${careGuideUrl}`] : []),
    '',
    `#BonsaiFlorida${speciesTag ? ' ' + speciesTag : ''} #Bonsai #TropicalBonsai #PalmBeach #Florida`,
  ].join('\n')

  async function copy(text: string, type: 'link' | 'text') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2500)
    } catch { /* silently fail */ }
  }

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(treeUrl)}`

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        aria-label="Share this tree"
        className={`flex items-center gap-2 border px-4 py-3.5 rounded-2xl font-sans text-base font-semibold transition-colors ${
          open ? 'bg-forest text-white border-forest' : 'border-forest/20 text-forest hover:bg-sage-pale'
        }`}
      >
        <ShareIcon className="w-5 h-5" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-forest/10 shadow-card-lg z-20 overflow-hidden">
          <div className="px-4 pt-3.5 pb-1">
            <p className="font-sans text-[10px] font-bold text-forest tracking-widest uppercase">Share this tree</p>
          </div>

          {/* Facebook */}
          <a
            href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 hover:bg-sage-pale transition-colors border-t border-forest/5"
            onClick={() => setOpen(false)}
          >
            <FacebookIcon className="w-5 h-5 text-[#1877F2] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-semibold text-forest">Share on Facebook</p>
              <p className="font-sans text-xs text-ink-light">Opens share dialog</p>
            </div>
            <span className="text-ink-light text-sm flex-shrink-0">↗</span>
          </a>

          {/* Post text preview */}
          <div className="px-4 pt-3 pb-2 border-t border-forest/5">
            <p className="font-sans text-[10px] font-bold text-forest tracking-widest uppercase mb-2">Post text</p>
            <div className="bg-sage-pale/60 rounded-xl px-3 py-2.5 max-h-36 overflow-y-auto">
              <div className="font-sans text-xs text-ink leading-relaxed whitespace-pre-wrap break-words">{postText}</div>
            </div>
          </div>

          {/* Copy buttons */}
          <div className="flex gap-2 px-4 pb-3.5">
            <button
              onClick={() => copy(postText, 'text')}
              className="flex-1 flex items-center justify-center gap-1.5 border border-forest/20 px-3 py-2 rounded-xl font-sans text-xs font-semibold text-forest hover:bg-sage-pale transition-colors"
            >
              <CopyIcon className="w-3.5 h-3.5" />
              {copied === 'text' ? 'Copied!' : 'Copy text'}
            </button>
            <button
              onClick={() => copy(treeUrl, 'link')}
              className="flex-1 flex items-center justify-center gap-1.5 border border-forest/20 px-3 py-2 rounded-xl font-sans text-xs font-semibold text-forest hover:bg-sage-pale transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              {copied === 'link' ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ScissorsIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
}
function PlantPotIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6"/><path d="M5 7h14l-2 13H7L5 7z"/><path d="M12 11v5"/></svg>
}
function AlertIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function PalmIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V10M7 10c0-3 1.5-6 5-7 3.5 1 5 4 5 7"/><path d="M4 14c1-3 3-5 8-4"/><path d="M20 14c-1-3-3-5-8-4"/></svg>
}
function CheckboxIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
}
function StarIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

function parseChecklist(text: string): string[] {
  return text.split(/\.\s+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.endsWith('.') ? s.slice(0, -1) : s)
}

function SpeciesCareGuide({ species }: { species: DbSpecies }) {
  const hasDetail = !!(species.quick_facts_en || species.light_en || species.watering_en ||
    species.fertilizer_en || species.pruning_en || species.repotting_en ||
    species.watch_for_en || species.florida_tips_en || species.weekly_checklist_en)

  const header = (
    <div className="card p-5 mb-2">
      <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-1">Care Guide</p>
      <h2 className="font-serif text-2xl text-forest">{species.name_en}</h2>
      {species.species_latin && <p className="font-sans text-sm italic text-ink-light mt-0.5">{species.species_latin}</p>}
      <a href={`/care-guides/${makeSpeciesSlug(species)}`} className="mt-3 inline-flex font-sans text-sm font-semibold text-bonsai-pink hover:text-forest">
        Open full species guide
      </a>
      <div className="w-8 h-0.5 bg-bonsai-pink-lt mt-3" />
    </div>
  )

  if (!hasDetail) {
    const fallback = [
      { label: 'Sun', value: species.sun_en },
      { label: 'Water', value: species.water_en },
      { label: 'Care', value: species.care_en },
    ].filter(s => s.value)
    return (
      <div className="mb-5">
        {header}
        {fallback.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-forest/10 p-5 mb-2">
            <p className="font-sans text-xs font-bold text-forest tracking-widest uppercase mb-2">{label}</p>
            <p className="font-sans text-base text-ink leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    )
  }

  const checklistItems = species.weekly_checklist_en ? parseChecklist(species.weekly_checklist_en) : []
  const wateringParas = species.watering_en ? species.watering_en.split('\n\n').map(p => p.trim()).filter(Boolean) : []
  const wateringSummary = wateringParas[0] ?? null

  return (
    <div className="mb-5 space-y-2">
      {header}

      {species.quick_facts_en && (
        <AccordionSection icon={<StarIcon className="w-4 h-4" />} title="Quick Facts"
          summary={firstSentence(species.quick_facts_en)}>
          <p className="font-sans text-base text-ink leading-relaxed">{species.quick_facts_en}</p>
        </AccordionSection>
      )}

      {species.light_en && (
        <AccordionSection icon={<SunIcon className="w-4 h-4" />} title="Light"
          summary={firstSentence(species.light_en)}>
          <p className="font-sans text-base text-ink leading-relaxed">{species.light_en}</p>
        </AccordionSection>
      )}

      {wateringParas.length > 0 && (
        <AccordionSection icon={<WaterIcon className="w-4 h-4" />} title="Watering"
          summary={wateringSummary} highlighted>
          <div className="space-y-3">
            {wateringParas.map((para, i) => (
              <p key={i} className="font-sans text-base text-ink leading-relaxed">{para}</p>
            ))}
          </div>
        </AccordionSection>
      )}

      {species.fertilizer_en && (
        <AccordionSection icon={<LeafIcon className="w-4 h-4" />} title="Fertilizer"
          summary={firstSentence(species.fertilizer_en)}>
          <p className="font-sans text-base text-ink leading-relaxed">{species.fertilizer_en}</p>
        </AccordionSection>
      )}

      {species.pruning_en && (
        <AccordionSection icon={<ScissorsIcon className="w-4 h-4" />} title="Pruning"
          summary={firstSentence(species.pruning_en)}>
          <p className="font-sans text-base text-ink leading-relaxed">{species.pruning_en}</p>
        </AccordionSection>
      )}

      {species.repotting_en && (
        <AccordionSection icon={<PlantPotIcon className="w-4 h-4" />} title="Repotting"
          summary={firstSentence(species.repotting_en)}>
          <p className="font-sans text-base text-ink leading-relaxed">{species.repotting_en}</p>
        </AccordionSection>
      )}

      {species.watch_for_en && (
        <AccordionSection icon={<AlertIcon className="w-4 h-4" />} title="Watch For"
          summary={firstSentence(species.watch_for_en)}>
          <p className="font-sans text-base text-ink leading-relaxed">{species.watch_for_en}</p>
        </AccordionSection>
      )}

      {species.florida_tips_en && (
        <AccordionSection icon={<PalmIcon className="w-4 h-4" />} title="Florida Tips"
          summary={firstSentence(species.florida_tips_en)}>
          <p className="font-sans text-base text-ink leading-relaxed">{species.florida_tips_en}</p>
        </AccordionSection>
      )}

      {checklistItems.length > 0 && (
        <AccordionSection icon={<CheckboxIcon className="w-4 h-4" />} title="Weekly Checklist"
          summary={checklistItems[0] ?? null}>
          <ul className="space-y-3">
            {checklistItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded border-2 border-forest/30 flex-shrink-0 bg-white" />
                <span className="font-sans text-base text-ink leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </AccordionSection>
      )}
    </div>
  )
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditModal({ tree, onClose, onSaved }: {
  tree: DbTree
  onClose: () => void
  onSaved: (updated: Partial<DbTree>) => void
}) {
  const [form, setForm] = useState({
    name: tree.name,
    price: tree.price,
    level: tree.level,
    status: (tree as DbTree).status ?? 'active',
    sun: tree.sun,
    water: tree.water,
    notes: tree.notes ?? '',
    species: tree.species ?? '',
    species_id: tree.species_id ?? '',
  })
  const [allSpecies, setAllSpecies] = useState<DbSpecies[]>([])

  useEffect(() => {
    fetch('/api/admin/species').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAllSpecies(data)
    }).catch(() => {})
  }, [])
  // Image state — track current URLs separately from newly added files
  const [imageUrl, setImageUrl] = useState<string | null>(tree.image_url ?? null)
  const [imageUrls, setImageUrls] = useState<string[]>(tree.image_urls ?? [])
  const [newMainFile, setNewMainFile] = useState<File | null>(null)
  const [newMainPreview, setNewMainPreview] = useState('')
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const mainFileRef = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)

  function setF(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function pickMainFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    if (!f) return
    setNewMainFile(f)
    setNewMainPreview(URL.createObjectURL(f))
    e.target.value = ''
  }

  function pickGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return
    setNewGalleryFiles(prev => [...prev, ...picked])
    setNewGalleryPreviews(prev => [...prev, ...picked.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeCurrentMain() { setImageUrl(null); setNewMainFile(null); setNewMainPreview('') }
  function removeCurrentGallery(i: number) { setImageUrls(prev => prev.filter((_, idx) => idx !== i)) }
  function removeNewGallery(i: number) {
    setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== i))
    setNewGalleryPreviews(prev => prev.filter((_, idx) => idx !== i))
  }
  function setCurrentGalleryAsCover(i: number) {
    const url = imageUrls[i]
    setImageUrls(prev => prev.filter((_, idx) => idx !== i))
    if (imageUrl) setImageUrls(prev => [imageUrl, ...prev])
    setImageUrl(url)
    setNewMainFile(null)
    setNewMainPreview('')
  }
  function setNewGalleryAsCover(i: number) {
    const file = newGalleryFiles[i]
    const preview = newGalleryPreviews[i]
    setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== i))
    setNewGalleryPreviews(prev => prev.filter((_, idx) => idx !== i))
    if (newMainFile) {
      setNewGalleryFiles(prev => [newMainFile, ...prev])
      setNewGalleryPreviews(prev => [newMainPreview, ...prev])
    } else if (imageUrl) {
      setNewGalleryFiles(prev => prev)
    }
    setNewMainFile(file)
    setNewMainPreview(preview)
    setImageUrl(null)
  }

  async function uploadFile(file: File, slug: string, prefix: string, idx: number): Promise<string> {
    const result = await optimizeTreeImage(file)
    const ext = result.file.name.split('.').pop() ?? 'jpg'
    const path = `${prefix}${Date.now()}-${idx}-${slug}.${ext}`
    const fd = new FormData()
    fd.append('file', result.file)
    fd.append('path', path)
    const up = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (!up.ok) {
      const err = await up.json().catch(() => ({}))
      throw new Error(up.status === 401 ? 'Session expired — log out and log back in.' : `Upload failed: ${err.error ?? up.status}`)
    }
    const { url } = await up.json()
    return url as string
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setUploading(true)
    setError('')
    try {
      const slug = form.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'bonsai'

      let finalMainUrl = imageUrl
      if (newMainFile) {
        finalMainUrl = await uploadFile(newMainFile, slug, '', 0)
      }

      const newGalleryUrls = await Promise.all(
        newGalleryFiles.map((file, i) => uploadFile(file, slug, 'gallery-', i))
      )

      const finalGalleryUrls = [...imageUrls, ...newGalleryUrls]

      setUploading(false)

      const res = await fetch(`/api/admin/trees/${tree.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          species_id: form.species_id || null,
          image_url: finalMainUrl,
          image_urls: finalGalleryUrls,
        }),
      })
      if (res.ok) {
        onSaved({ ...form, species_id: form.species_id || null, image_url: finalMainUrl, image_urls: finalGalleryUrls })
        onClose()
      } else {
        setError('Save failed — are you still logged in?')
      }
    } catch {
      setError('Upload failed. Check your connection and try again.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const currentMainDisplay = newMainPreview || imageUrl
  const allCurrentGallery = imageUrls
  const allNewGallery = newGalleryPreviews

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-cream-light rounded-3xl shadow-card-lg overflow-hidden">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl text-forest">Edit Tree</h2>
            <button type="button" onClick={onClose} className="text-ink-light hover:text-ink text-xl">✕</button>
          </div>

          {/* ── Image management ── */}
          <div className="space-y-3">
            <p className="font-sans text-sm font-semibold text-forest">Photos</p>

            {/* Main / cover image */}
            <div>
              <p className="font-sans text-xs text-ink-light mb-2">Cover image</p>
              {currentMainDisplay ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentMainDisplay} alt="Cover" className="w-full aspect-[4/3] object-cover rounded-2xl border border-forest/20" />
                  <span className="absolute top-2 left-2 bg-forest text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</span>
                  <button type="button" onClick={removeCurrentMain}
                    className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-black/80">✕</button>
                  <button type="button" onClick={() => mainFileRef.current?.click()}
                    className="absolute bottom-2 left-2 bg-forest/80 text-white font-sans text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-forest transition-colors">
                    Replace
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => mainFileRef.current?.click()}
                  className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex flex-col items-center justify-center gap-2 hover:border-forest transition-colors">
                  <span className="text-3xl">📷</span>
                  <span className="font-sans text-sm font-semibold text-forest">Add Cover Photo</span>
                </button>
              )}
              <input ref={mainFileRef} type="file" accept="image/*" onChange={pickMainFile} className="hidden" />
            </div>

            {/* Gallery */}
            {(allCurrentGallery.length > 0 || allNewGallery.length > 0) && (
              <div>
                <p className="font-sans text-xs text-ink-light mb-2">Gallery photos</p>
                <div className="grid grid-cols-4 gap-2">
                  {allCurrentGallery.map((url, i) => (
                    <div key={`cur-${i}`} className="relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover rounded-xl border border-forest/20" />
                      <button type="button" onClick={() => setCurrentGalleryAsCover(i)}
                        className="absolute bottom-1 left-1 bg-forest/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">Cover</button>
                      <button type="button" onClick={() => removeCurrentGallery(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-black/80">✕</button>
                    </div>
                  ))}
                  {allNewGallery.map((preview, i) => (
                    <div key={`new-${i}`} className="relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt={`New ${i + 1}`} className="w-full h-full object-cover rounded-xl border-2 border-forest/40" />
                      <button type="button" onClick={() => setNewGalleryAsCover(i)}
                        className="absolute bottom-1 left-1 bg-forest/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">Cover</button>
                      <button type="button" onClick={() => removeNewGallery(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-black/80">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => galleryFileRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-forest/30 bg-sage-pale/50 flex items-center justify-center text-2xl hover:border-forest transition-colors">+</button>
                </div>
              </div>
            )}
            {allCurrentGallery.length === 0 && allNewGallery.length === 0 && (
              <button type="button" onClick={() => galleryFileRef.current?.click()}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-forest/30 bg-sage-pale/50 font-sans text-sm font-semibold text-forest hover:border-forest transition-colors">
                + Add More Photos
              </button>
            )}
            <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={pickGalleryFiles} className="hidden" />
          </div>

          {/* ── Text fields ── */}
          {[
            { label: 'Name', key: 'name' as const },
            { label: 'Price', key: 'price' as const },
            { label: 'Sun', key: 'sun' as const },
            { label: 'Water', key: 'water' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block font-sans text-sm font-semibold text-forest mb-1">{label}</label>
              <input type="text" value={form[key]} onChange={e => setF(key, e.target.value)} className={inputCls} />
            </div>
          ))}

          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Level</label>
            <select value={form.level} onChange={e => setF('level', e.target.value)} className={inputCls}>
              <option value="Beginner Friendly">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
            </select>
          </div>

          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Status</label>
            <select value={form.status} onChange={e => setF('status', e.target.value)} className={inputCls}>
              <option value="active">Active — available for sale</option>
              <option value="reserved">Reserved</option>
              <option value="in_training">In Training</option>
              <option value="in_work">In Work</option>
            </select>
          </div>

          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2} className={inputCls + ' resize-none'} />
          </div>

          <div>
            <label className="block font-sans text-sm font-semibold text-forest mb-1">Species (links care guide)</label>
            <SpeciesCombobox
              allSpecies={allSpecies}
              locale="en"
              onSelect={(s, customName) => {
                if (s) {
                  setForm(p => ({ ...p, species: customName || s.name_en, species_id: s.id }))
                } else {
                  setForm(p => ({ ...p, species: '', species_id: '' }))
                }
              }}
            />
            {form.species_id && (
              <p className="font-sans text-xs text-forest mt-1">Linked: {form.species}</p>
            )}
          </div>

          {uploading && <p className="font-sans text-sm text-forest text-center">Compressing &amp; uploading photos…</p>}
          {error && <p className="text-bonsai-pink text-sm text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center text-sm py-3">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm py-3 disabled:opacity-60">
              {saving ? (uploading ? 'Uploading…' : 'Saving…') : 'Save Changes'}
            </button>
          </div>
        </form>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TreePageClient({ tree: initialTree, isStaff, species }: {
  tree: DbTree
  isStaff: boolean
  species?: DbSpecies | null
}) {
  const [tree, setTree] = useState<DbTree>(initialTree)
  const [editing, setEditing] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const router = useRouter()
  const photos = getTreeImageUrls(tree)

  function handleSaved(updated: Partial<DbTree>) {
    setTree(p => ({ ...p, ...updated }))
  }

  return (
    <>
      <div className="min-h-screen bg-cream">
        {!isStaff && <Navbar />}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

        {/* Staff banner */}
        {isStaff && (
          <div className="bg-forest text-white px-4 py-3 flex items-center justify-between">
            <span className="font-sans text-sm font-semibold">🌸 Staff View — {tree.tree_code}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-white text-forest font-sans text-xs font-bold px-4 py-2 rounded-full hover:bg-cream transition-colors"
              >
                ✏️ Edit Tree
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="border border-white/40 text-white font-sans text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        <div className="max-w-lg mx-auto px-4 pt-4">
          {/* Back link */}
          <a href={isStaff ? '/admin' : '/trees'}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-ink-light hover:text-forest transition-colors mb-3">
            ← {isStaff ? 'Inventory' : 'Collection'}
          </a>

          {/* Hero photo — portrait, taller, with rounded corners */}
          <div className="relative rounded-3xl overflow-hidden bg-black h-[440px]">
            <PhotoCarousel urls={photos} name={tree.name} onTap={photos.length > 0 ? (i) => setLightboxIdx(i) : undefined} />
            {/* Status badge */}
            {tree.status && STATUS_CONFIG[tree.status] && (
              <div className="absolute top-4 left-4 font-sans text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none"
                style={{ backgroundColor: STATUS_CONFIG[tree.status].bg, color: STATUS_CONFIG[tree.status].color }}>
                {STATUS_CONFIG[tree.status].label}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4">
          {/* Main info card */}
          <div className="card p-6 mt-4 mb-4 shadow-card-lg">
            {/* Price */}
            <p className="font-serif text-3xl font-bold text-forest mb-1">${tree.price}</p>

            {/* Name */}
            <h1 className="font-serif text-4xl text-forest leading-tight">{tree.name}</h1>
            {tree.species && <p className="font-sans text-sm italic text-ink-light mt-1">{tree.species}</p>}

            {/* Level badge */}
            <span className={`inline-block mt-3 font-sans text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
              tree.level === 'Beginner Friendly'
                ? 'bg-bonsai-pink-pale text-bonsai-pink'
                : 'bg-sage-pale text-forest'
            }`}>
              {tree.level}
            </span>

            <div className="w-full h-px bg-forest/8 my-4" />

            {/* Quick care summary */}
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <SunIcon className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-ink-light"><strong className="text-forest-dark">Sun:</strong> {tree.sun}</span>
              </li>
              <li className="flex items-start gap-3">
                <WaterIcon className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-ink-light"><strong className="text-forest-dark">Water:</strong> {tree.water}</span>
              </li>
            </ul>

            {/* Share button — near top */}
            <div className="flex gap-3 mt-5">
              <SharePanel tree={tree} species={species} />
            </div>
          </div>

          {/* Staff notes — only visible to authenticated staff */}
          {isStaff && tree.notes && (
            <div className="card p-5 mb-4">
              <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-2">Staff Notes</p>
              <p className="font-sans text-sm italic text-ink-light leading-relaxed">{tree.notes}</p>
            </div>
          )}

          {isStaff && <SocialPostGenerator tree={tree} species={species} />}

          {/* Species care guide */}
          {species
            ? <SpeciesCareGuide species={species} />
            : (
              <div className="card p-6 mb-4">
                <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-2">Care Guide</p>
                <p className="font-sans text-base text-ink-light leading-relaxed">Care guide not linked yet. Please ask Bonsai Florida.</p>
              </div>
            )
          }

          {/* Bottom CTA */}
          <div className="card p-6 text-center mb-8">
            <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-2">Interested in this tree?</p>
            <h2 className="font-serif text-xl text-forest mb-5">Contact Bonsai Florida</h2>
            <p className="font-sans text-sm leading-6 text-ink-light mb-5">
              Bonsai Florida is located in {siteConfig.publicArea} near ZIP code {siteConfig.publicZip}. Garden visits are by appointment only. The exact address and Google Maps link are sent after we confirm your visit by text.
            </p>
            <div className="flex flex-col gap-3">
              <BookGardenVisitButton />
            </div>
          </div>

          <p className="text-center font-sans text-xs text-ink-light mb-6 tracking-widest uppercase">
            Bonsai Florida · Palm Beach, Florida
          </p>
        </div>

        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>

      {editing && <EditModal tree={tree} onClose={() => setEditing(false)} onSaved={handleSaved} />}
      {lightboxIdx !== null && photos.length > 0 && (
        <Lightbox urls={photos} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  )
}
