'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

// 2 trees per page → each tree gets 1 row (front left + back right)
const TREES_PER_PAGE = 2

interface TagTree {
  id: string
  name: string
  tree_code: string | null
  image_url: string | null
  species?: string | null
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const G = '#2D4A3E'   // forest green
const P = '#C4738A'   // bonsai pink
const C = '#FEFDF8'   // cream

// ─── SVG bonsai illustration ──────────────────────────────────────────────────
function BonsaiIllustration() {
  return (
    <svg viewBox="0 0 120 100" width="72" height="60" aria-hidden="true">
      {/* Pot */}
      <path d="M44 88 h32 l-4 10 H48 Z" fill={G} opacity="0.85" />
      <ellipse cx="60" cy="88" rx="16" ry="4" fill={G} opacity="0.5" />
      {/* Trunk */}
      <path d="M56 62 Q54 74 57 88 Q60 90 63 88 Q66 74 64 62 Z" fill={G} opacity="0.7" />
      {/* Branch left */}
      <path d="M58 70 Q46 64 38 58" stroke={G} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Branch right */}
      <path d="M62 68 Q74 62 82 56" stroke={G} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Canopy blossoms */}
      <circle cx="60" cy="44" r="14" fill={G} opacity="0.08" />
      <circle cx="48" cy="38" r="9"  fill={P} opacity="0.75" />
      <circle cx="64" cy="32" r="11" fill={P} opacity="0.80" />
      <circle cx="76" cy="44" r="8"  fill={P} opacity="0.70" />
      <circle cx="55" cy="52" r="7"  fill={P} opacity="0.65" />
      <circle cx="40" cy="50" r="7"  fill={P} opacity="0.60" />
      <circle cx="69" cy="55" r="6"  fill={P} opacity="0.60" />
      {/* Highlight petals */}
      <circle cx="48" cy="36" r="3"  fill="white" opacity="0.25" />
      <circle cx="65" cy="30" r="4"  fill="white" opacity="0.20" />
    </svg>
  )
}

// ─── Punch hole ───────────────────────────────────────────────────────────────
function PunchHole() {
  return (
    <div style={{
      position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
      width: '16px', height: '16px', borderRadius: '50%',
      border: `1.5px solid ${G}50`, backgroundColor: 'white',
    }} />
  )
}

// ─── Corner marks ─────────────────────────────────────────────────────────────
function Corners() {
  const s: React.CSSProperties = { position: 'absolute', width: '14px', height: '14px' }
  const b = `1px solid ${G}55`
  return (
    <>
      <div style={{ ...s, top: 6, left: 6,   borderTop: b, borderLeft: b  }} />
      <div style={{ ...s, top: 6, right: 6,  borderTop: b, borderRight: b }} />
      <div style={{ ...s, bottom: 6, left: 6,  borderBottom: b, borderLeft: b  }} />
      <div style={{ ...s, bottom: 6, right: 6, borderBottom: b, borderRight: b }} />
    </>
  )
}

// ─── Tag FRONT ────────────────────────────────────────────────────────────────
function TagFront({ tree }: { tree: TagTree | null }) {
  if (!tree) {
    return (
      <div style={{
        backgroundColor: C, border: `1px solid ${G}15`, borderRadius: '12px',
        boxSizing: 'border-box', minHeight: '280px',
      }} />
    )
  }

  const isLongName = tree.name.length > 14

  return (
    <div style={{
      position: 'relative', backgroundColor: C,
      border: `1.5px solid ${G}`, borderRadius: '12px',
      boxSizing: 'border-box', padding: '28px 16px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '6px', minHeight: '280px',
    }}>
      <PunchHole />
      <Corners />

      {/* Bonsai illustration */}
      <BonsaiIllustration />

      {/* Brand */}
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: '20px', fontWeight: 'bold', color: G, letterSpacing: '0.18em', margin: 0 }}>
          BONSAI
        </p>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: '11px', color: G, letterSpacing: '0.5em', margin: '2px 0 0' }}>
          FLORIDA
        </p>
      </div>

      {/* Pink ornament rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '75%' }}>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
        <span style={{ color: P, fontSize: '11px', lineHeight: 1 }}>✿</span>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
      </div>

      {/* Location */}
      <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '7px', color: G, letterSpacing: '0.16em', margin: 0 }}>
        PALM BEACH, FLORIDA
      </p>

      {/* Thin rule */}
      <div style={{ width: '80%', height: '0.5px', backgroundColor: `${G}25`, margin: '2px 0' }} />

      {/* Tree name */}
      <p style={{
        fontFamily: 'Georgia,serif', fontSize: isLongName ? '14px' : '17px',
        fontWeight: 'bold', color: G, letterSpacing: '0.07em',
        margin: 0, textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.15,
      }}>
        {tree.name}
      </p>

      {/* Latin name */}
      {tree.species && (
        <p style={{
          fontFamily: 'Georgia,serif', fontSize: '8px', fontStyle: 'italic',
          color: `${G}80`, margin: 0, textAlign: 'center',
        }}>
          ({tree.species})
        </p>
      )}

      {/* Leaf rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '2px 0' }}>
        <div style={{ width: '14px', height: '0.5px', backgroundColor: `${G}50` }} />
        <span style={{ color: G, fontSize: '9px', lineHeight: 1 }}>✦</span>
        <div style={{ width: '14px', height: '0.5px', backgroundColor: `${G}50` }} />
      </div>

      {/* Tagline */}
      <p style={{
        fontFamily: 'system-ui,sans-serif', fontSize: '6.5px', color: `${G}70`,
        letterSpacing: '0.13em', margin: 0,
      }}>
        TROPICAL BEAUTY. TIMELESS ART.
      </p>
    </div>
  )
}

// ─── Tag BACK ─────────────────────────────────────────────────────────────────
function TagBack({ tree, origin }: { tree: TagTree | null; origin: string }) {
  if (!tree || !tree.tree_code) {
    return (
      <div style={{
        backgroundColor: C, border: `1px solid ${G}15`, borderRadius: '12px',
        boxSizing: 'border-box', minHeight: '280px',
      }} />
    )
  }

  const qrUrl = `${origin}/tree/${tree.tree_code}`
  const features: [string, string][] = [
    ['🏷', 'VIEW PRICE'],
    ['🌿', 'CARE GUIDE'],
    ['📄', 'TREE DETAILS'],
    ['📷', 'MORE PHOTOS'],
  ]

  return (
    <div style={{
      position: 'relative', backgroundColor: C,
      border: `1.5px solid ${G}`, borderRadius: '12px',
      boxSizing: 'border-box', padding: '28px 16px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '7px', minHeight: '280px',
    }}>
      <PunchHole />
      <Corners />

      {/* Header ornament */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '70%' }}>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
        <span style={{ color: P, fontSize: '11px' }}>✿</span>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
      </div>

      {/* Scan heading */}
      <p style={{
        fontFamily: 'system-ui,sans-serif', fontSize: '7.5px', fontWeight: 'bold',
        color: G, letterSpacing: '0.14em', margin: 0, textAlign: 'center',
      }}>
        SCAN TO VIEW THIS TREE
      </p>

      {/* QR code + features */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'center' }}>
        <QRCodeSVG value={qrUrl} size={84} level="M" bgColor="transparent" fgColor={G} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {features.map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', lineHeight: 1 }}>{icon}</span>
              <p style={{
                fontFamily: 'system-ui,sans-serif', fontSize: '7px', fontWeight: 'bold',
                color: G, letterSpacing: '0.09em', margin: 0,
              }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pink divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: `${P}70` }} />
        <span style={{ color: P, fontSize: '11px' }}>✿</span>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: `${P}70` }} />
      </div>

      {/* Tree code label */}
      <p style={{
        fontFamily: 'system-ui,sans-serif', fontSize: '6.5px', color: `${G}70`,
        letterSpacing: '0.15em', margin: 0, textAlign: 'center',
      }}>
        ── TREE CODE ──
      </p>

      {/* Code box */}
      <div style={{
        border: `1.75px solid ${G}`, borderRadius: '5px',
        padding: '5px 18px', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: '"Courier New",Courier,monospace', fontSize: '15px',
          fontWeight: 'bold', color: G, letterSpacing: '0.08em', margin: 0,
        }}>
          {tree.tree_code}
        </p>
      </div>

      {/* Thank you */}
      <p style={{
        fontFamily: 'system-ui,sans-serif', fontSize: '6px', color: `${G}65`,
        letterSpacing: '0.08em', margin: 0, textAlign: 'center',
      }}>
        🌿 THANK YOU FOR SUPPORTING OUR PASSION 🌿
      </p>
    </div>
  )
}

// ─── Scissor cut-line label ───────────────────────────────────────────────────
function CutLine() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      width: '100%', margin: '4px 0',
    }}>
      <div style={{ flex: 1, borderTop: `1.5px dashed ${G}35` }} />
      <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: '7px', color: `${G}55`, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
        ✂ CUT ALONG THE DASHED LINES ✂
      </span>
      <div style={{ flex: 1, borderTop: `1.5px dashed ${G}35` }} />
    </div>
  )
}

// ─── Print styles ─────────────────────────────────────────────────────────────
const PRINT_STYLES = `
  @media print {
    @page { size: letter; margin: 0.4in; }
    body * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .tag-page { page-break-after: always; break-after: page; margin: 0 !important; }
    .tag-page:last-child { page-break-after: auto; break-after: auto; }
    .page-header { display: none !important; }
  }
  @media screen {
    .tag-page {
      width: 7.6in;
      background: white;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10);
      border-radius: 6px;
      margin: 0 auto 0.7in;
      padding: 0.25in 0.3in;
    }
  }
`

// ─── Page component ───────────────────────────────────────────────────────────
function TagPage({
  treePairs, origin,
}: {
  treePairs: [TagTree | null, TagTree | null][]
  origin: string
}) {
  return (
    <div className="tag-page">
      {/* On-screen header */}
      <p className="page-header no-print" style={{
        fontFamily: 'system-ui,sans-serif', fontSize: '9px', color: '#888',
        letterSpacing: '0.14em', textAlign: 'center', marginBottom: '8px',
      }}>
        PRINT &amp; CUT (US LETTER) — SQUARE TAG
      </p>

      <CutLine />

      {treePairs.map(([t1, t2], i) => (
        <div key={i}>
          {/* Row: [Front] [Back] */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.22in',
            borderLeft: `1.5px dashed ${G}35`,
            borderRight: `1.5px dashed ${G}35`,
            padding: '0 0',
          }}>
            <TagFront tree={t1} />
            <TagBack tree={t1} origin={origin} />
          </div>

          {/* Row 2 — same page */}
          {t2 !== undefined && (
            <>
              <CutLine />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.22in',
                borderLeft: `1.5px dashed ${G}35`,
                borderRight: `1.5px dashed ${G}35`,
              }}>
                <TagFront tree={t2} />
                <TagBack tree={t2} origin={origin} />
              </div>
            </>
          )}
        </div>
      ))}

      <CutLine />
    </div>
  )
}

// ─── Main client ──────────────────────────────────────────────────────────────
export default function QrTagsClient({ trees }: { trees: TagTree[] }) {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  // Group into pages of TREES_PER_PAGE, pad with nulls
  type Pair = [TagTree | null, TagTree | null]
  const pages: Pair[][] = []
  for (let i = 0; i < Math.max(trees.length, 1); i += TREES_PER_PAGE) {
    const a = trees[i] ?? null
    const b = trees[i + 1] ?? null
    pages.push([[a, b]])
  }

  const totalPages = pages.length

  return (
    <>
      <style>{PRINT_STYLES}</style>

      {/* Controls — hidden on print */}
      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{
          backgroundColor: G, color: 'white',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
              QR Tags
            </p>
            <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '3px 0 0' }}>
              {trees.length} tag{trees.length !== 1 ? 's' : ''} · {totalPages} page{totalPages !== 1 ? 's' : ''} · US Letter · 2 per page
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => router.push('/admin')}
              style={{
                fontFamily: 'system-ui,sans-serif', fontSize: '12px',
                border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
                color: 'white', padding: '8px 16px', borderRadius: '999px', cursor: 'pointer',
              }}
            >
              ← Admin
            </button>
            <button
              onClick={() => window.print()}
              style={{
                fontFamily: 'system-ui,sans-serif', fontSize: '13px', fontWeight: 'bold',
                background: P, border: 'none', color: 'white',
                padding: '8px 22px', borderRadius: '999px', cursor: 'pointer',
              }}
            >
              🖨 Print
            </button>
          </div>
        </div>
        <div style={{
          backgroundColor: '#F5F3EE', borderBottom: '1px solid rgba(45,74,62,0.1)',
          padding: '8px 20px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: '#888', margin: 0 }}>
            Left column = tag front · Right column = tag back · Cut along dashed lines
          </p>
        </div>
      </div>

      {/* Tag pages */}
      <div style={{ backgroundColor: '#E8E5DF', minHeight: '100vh', padding: '40px 20px' }}>
        {pages.map((pairs, pi) => (
          <TagPage key={pi} treePairs={pairs} origin={origin} />
        ))}
      </div>
    </>
  )
}
