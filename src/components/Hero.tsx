'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CONTACT } from '@/config/contact'
import { supabase } from '@/lib/supabase'
import type { DbTree } from '@/lib/supabase'
import { getPrimaryTreeImageUrl } from '@/lib/tree-images'
import { useMessages } from '@/lib/i18n'
import {
  PhoneIcon, MessageIcon,
  InstagramIcon, TikTokIcon, FacebookIcon, YouTubeIcon, EmailIcon,
} from '@/components/Icons'

// ─── Swipeable tree card stack ────────────────────────────────────────────────

function SwipeStack({ trees }: { trees: DbTree[] }) {
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const [drag, setDrag] = useState(0)
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null)
  const startX = useRef<number | null>(null)

  const current = trees[idx]
  const next = trees[(idx + 1) % trees.length]
  const total = trees.length

  function advance(dir: 'left' | 'right') {
    setLeaving(dir)
    setTimeout(() => {
      setIdx(i => (i + 1) % total)
      setLeaving(null)
      setDrag(0)
    }, 300)
  }

  function onTouchStart(e: React.TouchEvent) { startX.current = e.touches[0].clientX }
  function onTouchMove(e: React.TouchEvent) {
    if (startX.current === null) return
    setDrag(e.touches[0].clientX - startX.current)
  }
  function onTouchEnd() {
    if (Math.abs(drag) > 60) advance(drag < 0 ? 'left' : 'right')
    else setDrag(0)
    startX.current = null
  }

  function onMouseDown(e: React.MouseEvent) { startX.current = e.clientX }
  function onMouseMove(e: React.MouseEvent) {
    if (startX.current === null || !(e.buttons & 1)) return
    setDrag(e.clientX - startX.current)
  }
  function onMouseUp() {
    if (Math.abs(drag) > 60) advance(drag < 0 ? 'left' : 'right')
    else setDrag(0)
    startX.current = null
  }

  if (!current) return null

  const rotation = drag * 0.06
  const leaveX = leaving === 'left' ? -120 : leaving === 'right' ? 120 : drag
  const leaveRot = leaving ? (leaving === 'left' ? -15 : 15) : rotation
  const opacity = leaving ? 0 : 1

  const photo = getPrimaryTreeImageUrl(current)
  const nextPhoto = next ? getPrimaryTreeImageUrl(next) : null

  return (
    <div className="relative w-full max-w-sm mx-auto select-none" style={{ height: '480px' }}>
      {/* Back card (next tree) */}
      {next && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden bg-forest shadow-card"
          style={{ transform: `scale(0.93) translateY(16px)`, zIndex: 1, transition: 'transform 0.3s' }}>
          {nextPhoto
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={nextPhoto} alt={next.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-b from-forest to-forest-light" />}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Front card (current tree) */}
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden shadow-card-lg cursor-grab active:cursor-grabbing"
        style={{
          zIndex: 2,
          transform: `translateX(${leaveX}px) rotate(${leaveRot}deg)`,
          opacity,
          transition: leaving ? 'transform 0.3s ease-out, opacity 0.3s' : drag ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      >
        {photo
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={photo} alt={current.name} className="w-full h-full object-cover pointer-events-none" draggable={false} />
          : <div className="w-full h-full bg-gradient-to-b from-forest to-forest-light flex items-center justify-center text-8xl opacity-30">🌿</div>}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

        {/* Corner marks */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white/40 pointer-events-none" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white/40 pointer-events-none" />

        {/* Level badge */}
        <div className="absolute top-4 left-4 pt-6">
          <span className={`font-sans text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
            current.level === 'Beginner Friendly' ? 'bg-bonsai-pink-pale text-bonsai-pink' : 'bg-sage-pale text-forest'
          }`}>{current.level}</span>
        </div>

        {/* Swipe hint overlays */}
        {drag > 30 && <div className="absolute inset-0 bg-green-500/15 flex items-center justify-center pointer-events-none"><span className="text-5xl">👍</span></div>}
        {drag < -30 && <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none"><span className="text-5xl">👋</span></div>}

        {/* Tree info at bottom */}
        <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pointer-events-none">
          <h3 className="font-serif text-2xl text-white leading-tight">{current.name}</h3>
          {current.species && <p className="font-sans text-sm text-white/60 italic">{current.species}</p>}
          <p className="font-serif text-xl font-bold text-bonsai-pink mt-1">{current.price}</p>
        </div>
      </div>

      {/* Counter + arrows */}
      <div className="absolute -bottom-12 inset-x-0 flex items-center justify-between px-2">
        <button onClick={() => advance('right')}
          className="w-10 h-10 rounded-full border border-forest/20 bg-white text-forest hover:bg-forest hover:text-white transition-colors flex items-center justify-center text-lg shadow-soft">
          ‹
        </button>
        <div className="flex items-center gap-2">
          {trees.map((_, i) => (
            <div key={i} className={`rounded-full transition-all ${i === idx ? 'w-4 h-1.5 bg-forest' : 'w-1.5 h-1.5 bg-forest/20'}`} />
          ))}
        </div>
        <button onClick={() => advance('left')}
          className="w-10 h-10 rounded-full border border-forest/20 bg-white text-forest hover:bg-forest hover:text-white transition-colors flex items-center justify-center text-lg shadow-soft">
          ›
        </button>
      </div>

      {/* Tap to view */}
      <button
        onClick={() => current.tree_code && router.push(`/tree/${current.tree_code}`)}
        className="absolute bottom-16 right-4 bg-white/90 backdrop-blur text-forest font-sans text-xs font-bold px-4 py-2 rounded-full shadow-soft hover:bg-white transition-colors z-10"
        style={{ zIndex: 3 }}
      >
        View →
      </button>
    </div>
  )
}

// ─── Static placeholder card ──────────────────────────────────────────────────

function StaticCard({ t }: { t: ReturnType<typeof useMessages>['hero'] }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="absolute inset-0 border-2 border-forest/20 rounded-4xl translate-x-3 translate-y-3" />
      <div className="relative card p-6 sm:p-8 shadow-card-lg overflow-hidden">
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-forest/40 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-forest/40 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-forest/40 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-forest/40 rounded-br-lg" />
        <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-forest to-forest-light flex flex-col items-center justify-end pb-10 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-20 rounded-full bg-white/10 blur-md absolute -top-2 left-1/2 -translate-x-1/2" />
              <div className="w-20 h-14 rounded-full bg-white/15 relative" />
            </div>
            <div className="w-2.5 h-10 bg-white/20 rounded-full mx-auto" />
            <div className="w-14 h-5 bg-white/15 rounded-b-lg rounded-t-sm" />
          </div>
          <div className="absolute top-8 left-8 text-2xl opacity-60">🌸</div>
          <div className="absolute top-12 right-10 text-lg opacity-50">🌸</div>
          <div className="absolute top-20 left-16 text-sm opacity-40">🌸</div>
        </div>
        <div className="text-center">
          <div className="pink-divider mb-4" />
          <h2 className="font-serif text-2xl text-forest tracking-wide mb-1">Bonsai Florida</h2>
          <p className="font-sans text-xs text-ink-light tracking-[0.18em] uppercase">{t.cardSpecies}</p>
          <div className="pink-divider mt-4" />
        </div>
      </div>
    </div>
  )
}

// ─── Main hero ────────────────────────────────────────────────────────────────

export default function Hero() {
  const m = useMessages()
  const t = m.hero
  const router = useRouter()
  const [trees, setTrees] = useState<DbTree[] | null>(null)

  useEffect(() => {
    supabase.from('bonsai_trees').select('*').eq('is_active', true)
      .order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => setTrees(data ?? []))
  }, [])

  return (
    <section id="top" className="relative overflow-hidden bg-cream" aria-label="Welcome to Bonsai Florida">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-sage-pale/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-bonsai-pink-pale/30 blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-wrap relative py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: text */}
          <div>
            <p className="section-label mb-4">{t.location}</p>
            <h1 className="font-serif text-forest leading-none mb-2">
              <span className="block text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-tight">Bonsai</span>
              <span className="block text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-tight text-forest-light">Florida</span>
            </h1>
            <div className="w-16 h-0.5 bg-bonsai-pink mt-4 mb-6" />
            <p className="font-serif italic text-bonsai-pink text-xl sm:text-2xl mb-3">{t.tagline}</p>
            <p className="font-sans text-ink-light text-lg sm:text-xl leading-relaxed max-w-lg mb-10">{t.description}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a href={CONTACT.phone.tel} className="btn-primary" aria-label={`Call Bonsai Florida at ${CONTACT.phone.display}`}>
                <PhoneIcon className="w-5 h-5" />{t.callNow}
              </a>
              <a href={CONTACT.phone.sms} className="btn-secondary"><MessageIcon className="w-5 h-5" />{t.textUs}</a>
              <button onClick={() => router.push('/trees')} className="btn-secondary">{t.viewTrees}</button>
            </div>
            <div>
              <p className="font-sans text-xs text-ink-light tracking-widest uppercase mb-3">{t.alsoOn}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Facebook', url: CONTACT.social.facebook.url, icon: <FacebookIcon className="w-4 h-4" /> },
                  { label: 'Instagram', url: CONTACT.social.instagram.url, icon: <InstagramIcon className="w-4 h-4" /> },
                  { label: 'TikTok', url: CONTACT.social.tiktok.url, icon: <TikTokIcon className="w-4 h-4" /> },
                  { label: 'YouTube', url: CONTACT.social.youtube.url, icon: <YouTubeIcon className="w-4 h-4" /> },
                  { label: 'Email', url: CONTACT.email.href, icon: <EmailIcon className="w-4 h-4" /> },
                ].map(({ label, url, icon }) => (
                  <a key={label} href={url} className="btn-social"
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}>
                    {icon}<span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: swipeable card stack */}
          <div className="relative flex justify-center lg:justify-end pb-16">
            {trees === null && (
              <div className="w-full max-w-sm h-[480px] rounded-3xl bg-sage-pale animate-pulse" />
            )}
            {trees !== null && trees.length > 0 && (
              <div className="w-full">
                <SwipeStack trees={trees} />
                <div className="text-center mt-16">
                  <button onClick={() => router.push('/trees')}
                    className="font-sans text-sm font-semibold text-forest hover:text-bonsai-pink transition-colors underline underline-offset-4">
                    View full collection →
                  </button>
                </div>
              </div>
            )}
            {trees !== null && trees.length === 0 && (
              <div className="relative w-full max-w-sm sm:max-w-md">
                <StaticCard t={t} />
              </div>
            )}
          </div>

        </div>
      </div>
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink-lt to-transparent" />
    </section>
  )
}
