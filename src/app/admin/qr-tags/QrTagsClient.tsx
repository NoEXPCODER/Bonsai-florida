'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

const TAGS_PER_PAGE = 8  // 2 cols × 4 rows

interface TagTree {
  id: string
  name: string
  tree_code: string | null
  image_url: string | null
  species?: string | null
}

const G = '#2A4538'
const P = '#C0426A'

// ─── Bonsai SVG illustration ──────────────────────────────────────────────────
function BonsaiSVG({ size = 80 }: { size?: number }) {
  const h = Math.round(size * 124 / 140)
  return (
    <svg viewBox="0 0 140 124" width={size} height={h} aria-hidden="true">
      <defs>
        <radialGradient id="b1" cx="38%" cy="30%" r="62%">
          <stop offset="0%" stopColor="#E05080" />
          <stop offset="100%" stopColor="#A02050" />
        </radialGradient>
        <radialGradient id="b2" cx="45%" cy="35%" r="58%">
          <stop offset="0%" stopColor="#D84070" />
          <stop offset="100%" stopColor="#901840" />
        </radialGradient>
      </defs>
      <path d="M55 106 L58 116 Q70 122 82 116 L85 106 Z" fill="#7A5220" />
      <rect x="52" y="99" width="36" height="9" rx="3" fill="#9A6828" />
      <rect x="55" y="101" width="30" height="2.5" rx="1" fill="#C8902A" opacity="0.35" />
      <ellipse cx="70" cy="99" rx="18" ry="3.5" fill="#7A5220" />
      <ellipse cx="70" cy="98" rx="14" ry="2.5" fill="#3A2008" />
      <path d="M65 98 Q59 95 54 97" stroke="#6A4018" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M74 98 Q80 95 86 97" stroke="#6A4018" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M67 98 Q64 84 66 70 Q69 55 68 42 Q68 30 71 18" stroke="#5A3810" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M68 98 Q66 84 68 70 Q71 55 70 42 Q70 30 73 18" stroke="#8A5A20" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.38" />
      <path d="M67 74 Q54 68 42 58" stroke="#5A3810" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M68 58 Q56 50 46 40" stroke="#5A3810" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M69 68 Q84 62 96 52" stroke="#5A3810" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M70 54 Q84 46 94 36" stroke="#5A3810" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="40" cy="54" r="13" fill="#8A1840" opacity="0.60"/>
      <circle cx="98" cy="48" r="13" fill="#8A1840" opacity="0.60"/>
      <circle cx="70" cy="20" r="14" fill="#8A1840" opacity="0.65"/>
      <circle cx="54" cy="30" r="11" fill="#8A1840" opacity="0.55"/>
      <circle cx="86" cy="28" r="11" fill="#8A1840" opacity="0.55"/>
      <circle cx="44" cy="46" r="13" fill="url(#b1)" opacity="0.85"/>
      <circle cx="92" cy="42" r="13" fill="url(#b1)" opacity="0.85"/>
      <circle cx="68" cy="26" r="14" fill="url(#b1)" opacity="0.88"/>
      <circle cx="56" cy="38" r="12" fill="url(#b2)" opacity="0.82"/>
      <circle cx="84" cy="34" r="12" fill="url(#b2)" opacity="0.82"/>
      <circle cx="36" cy="42" r="10" fill="url(#b2)" opacity="0.75"/>
      <circle cx="100" cy="36" r="10" fill="url(#b2)" opacity="0.75"/>
      <circle cx="60" cy="30" r="12" fill="#C83468" opacity="0.92"/>
      <circle cx="80" cy="26" r="11" fill="#D03C72" opacity="0.92"/>
      <circle cx="70" cy="40" r="11" fill="#C83468" opacity="0.88"/>
      <circle cx="50" cy="42" r="10" fill="#D03C72" opacity="0.86"/>
      <circle cx="90" cy="36" r="10" fill="#C83468" opacity="0.86"/>
      <circle cx="68" cy="26" r="5" fill="white" opacity="0.22"/>
      <circle cx="58" cy="34" r="3.5" fill="white" opacity="0.18"/>
      <circle cx="88" cy="30" r="3.5" fill="white" opacity="0.18"/>
      <circle cx="42" cy="42" r="3" fill="white" opacity="0.15"/>
      <circle cx="96" cy="40" r="3" fill="white" opacity="0.15"/>
    </svg>
  )
}

// ─── Feature icons ────────────────────────────────────────────────────────────
function PriceTagIcon() {
  return (
    <svg viewBox="0 0 18 18" width="11" height="11" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2 L2 9.5 L9.5 17 L16 10.5 L8.5 3 Z" />
      <circle cx="6" cy="6" r="1.2" fill={G} stroke="none" />
    </svg>
  )
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 18 18" width="11" height="11" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round">
      <path d="M9 16 C9 16 2 11 2 5.5 C2 2.5 5 1 9 1 C13 1 16 2.5 16 5.5 C16 11 9 16 9 16Z" />
      <line x1="9" y1="16" x2="9" y2="6" />
    </svg>
  )
}
function DocIcon() {
  return (
    <svg viewBox="0 0 18 18" width="11" height="11" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="1" width="12" height="16" rx="1.5" />
      <line x1="6" y1="6" x2="12" y2="6" />
      <line x1="6" y1="9" x2="12" y2="9" />
      <line x1="6" y1="12" x2="10" y2="12" />
    </svg>
  )
}
function CameraIcon() {
  return (
    <svg viewBox="0 0 18 18" width="11" height="11" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6 L1 15 L17 15 L17 6 L13 6 L11.5 3 L6.5 3 L5 6 Z" />
      <circle cx="9" cy="10.5" r="2.8" />
    </svg>
  )
}

// ─── Punch hole ───────────────────────────────────────────────────────────────
function PunchHole() {
  return (
    <div style={{
      position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
      width: '14px', height: '14px', borderRadius: '50%',
      border: '1px solid #AAA', backgroundColor: 'white',
    }} />
  )
}

// ─── Tag FRONT (landscape) ────────────────────────────────────────────────────
function TagFront({ tree }: { tree: TagTree | null }) {
  if (!tree) {
    return <div style={{ border: '1px dashed #CCC', backgroundColor: 'white', boxSizing: 'border-box' }} />
  }
  const nameFontSize = tree.name.length > 20 ? '9px' : tree.name.length > 14 ? '11px' : '13px'

  return (
    <div style={{
      position: 'relative', backgroundColor: 'white',
      border: '1px dashed #999',
      boxSizing: 'border-box', padding: '22px 18px 12px',
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      gap: '16px', overflow: 'hidden', width: '100%', height: '100%',
    }}>
      <PunchHole />

      {/* Left: bonsai illustration */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <BonsaiSVG size={74} />
      </div>

      {/* Vertical divider */}
      <div style={{ width: '0.75px', alignSelf: 'stretch', backgroundColor: `${G}18`, margin: '8px 0' }} />

      {/* Right: branding + tree info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '3px' }}>
        {/* BONSAI FLORIDA */}
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <p style={{ fontFamily: 'Georgia,"Times New Roman",serif', fontSize: '20px', fontWeight: 'bold', color: G, letterSpacing: '0.16em', margin: 0, lineHeight: 1 }}>BONSAI</p>
          <p style={{ fontFamily: 'Georgia,"Times New Roman",serif', fontSize: '8.5px', color: G, letterSpacing: '0.5em', margin: '1px 0 0', lineHeight: 1 }}>FLORIDA</p>
        </div>

        {/* Pink ornament */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '85%', margin: '3px 0' }}>
          <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
          <span style={{ color: P, fontSize: '9px', lineHeight: 1 }}>✿</span>
          <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
        </div>

        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '5.5px', color: G, letterSpacing: '0.16em', margin: 0 }}>PALM BEACH, FLORIDA</p>

        <div style={{ width: '80%', height: '0.5px', backgroundColor: `${G}18`, margin: '3px 0' }} />

        {/* Tree name */}
        <p style={{ fontFamily: 'Georgia,"Times New Roman",serif', fontSize: nameFontSize, fontWeight: 'bold', color: G, letterSpacing: '0.06em', margin: 0, textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.25 }}>
          {tree.name}
        </p>

        {/* Latin name */}
        {tree.species && (
          <p style={{ fontFamily: 'Georgia,"Times New Roman",serif', fontSize: '6px', fontStyle: 'italic', color: `${G}80`, margin: 0, textAlign: 'center' }}>
            ({tree.species})
          </p>
        )}

        {/* ✦ divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '3px 0' }}>
          <div style={{ width: '14px', height: '0.5px', backgroundColor: `${G}40` }} />
          <span style={{ fontSize: '8px', color: G, lineHeight: 1 }}>✦</span>
          <div style={{ width: '14px', height: '0.5px', backgroundColor: `${G}40` }} />
        </div>

        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '5px', color: `${G}60`, letterSpacing: '0.12em', margin: 0 }}>TROPICAL BEAUTY. TIMELESS ART.</p>
      </div>
    </div>
  )
}

// ─── Tag BACK (landscape) — matches reference ─────────────────────────────────
function TagBack({ tree, origin }: { tree: TagTree | null; origin: string }) {
  if (!tree || !tree.tree_code) {
    return <div style={{ border: '1px dashed #CCC', backgroundColor: 'white', boxSizing: 'border-box' }} />
  }
  const qrUrl = `${origin}/tree/${tree.tree_code}`

  const features: { icon: React.ReactNode; label: string }[] = [
    { icon: <PriceTagIcon />, label: 'VIEW PRICE' },
    { icon: <LeafIcon />,     label: 'CARE GUIDE' },
    { icon: <DocIcon />,      label: 'TREE DETAILS' },
    { icon: <CameraIcon />,   label: 'MORE PHOTOS' },
  ]

  return (
    <div style={{
      position: 'relative', backgroundColor: 'white',
      border: '1px dashed #999',
      boxSizing: 'border-box', padding: '22px 16px 10px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '5px', overflow: 'hidden', width: '100%', height: '100%',
    }}>
      <PunchHole />

      {/* Pink ornament rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '45%' }}>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
        <span style={{ color: P, fontSize: '10px', lineHeight: 1 }}>✿</span>
        <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
      </div>

      {/* Header */}
      <p style={{
        fontFamily: 'Georgia,"Times New Roman",serif',
        fontSize: '10.5px', fontWeight: 'bold', color: G,
        letterSpacing: '0.13em', margin: 0, textAlign: 'center',
      }}>SCAN TO VIEW THIS TREE</p>

      {/* QR + Features */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', justifyContent: 'center', flex: 1 }}>
        {/* QR code */}
        <div style={{ flexShrink: 0 }}>
          <QRCodeSVG value={qrUrl} size={82} level="M" bgColor="transparent" fgColor={G} />
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {features.map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                border: `1.25px solid ${G}`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0, backgroundColor: 'white',
              }}>
                {icon}
              </div>
              <p style={{
                fontFamily: 'system-ui,sans-serif', fontSize: '7.5px', fontWeight: 'bold',
                color: G, letterSpacing: '0.1em', margin: 0, whiteSpace: 'nowrap',
              }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tree code */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '88%' }}>
        <div style={{ flex: 1, height: '0.5px', backgroundColor: `${G}45` }} />
        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '5.5px', color: `${G}70`, letterSpacing: '0.2em', margin: 0 }}>TREE CODE</p>
        <div style={{ flex: 1, height: '0.5px', backgroundColor: `${G}45` }} />
      </div>

      <div style={{ border: `1.75px solid ${G}`, borderRadius: '6px', padding: '4px 20px' }}>
        <p style={{
          fontFamily: '"Courier New",Courier,monospace', fontSize: '15px',
          fontWeight: 'bold', color: G, letterSpacing: '0.08em', margin: 0,
        }}>{tree.tree_code}</p>
      </div>

      <p style={{
        fontFamily: 'system-ui,sans-serif', fontSize: '5.5px', color: `${G}60`,
        letterSpacing: '0.06em', margin: 0, textAlign: 'center',
      }}>✿ THANK YOU FOR SUPPORTING OUR PASSION ✿</p>
    </div>
  )
}

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_STYLES = `
  @media print {
    @page { size: letter portrait; margin: 0.25in; }
    body * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .tag-page {
      width: 100% !important;
      height: 10.5in !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      background: white !important;
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      grid-template-rows: repeat(4, 1fr) !important;
      gap: 0 !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .tag-page:last-child { page-break-after: auto !important; break-after: auto !important; }
    .tag-page > * { width: 100% !important; height: 100% !important; }
  }
  @media screen {
    .tag-page {
      width: 8in;
      margin: 0 auto 0.5in;
      background: white;
      box-shadow: 0 6px 32px rgba(0,0,0,0.12);
      border-radius: 4px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 2.625in);
      gap: 0;
    }
  }
`

// ─── Main client ──────────────────────────────────────────────────────────────
export default function QrTagsClient({ trees }: { trees: TagTree[] }) {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  function paginate(items: TagTree[]): (TagTree | null)[][] {
    const pages: (TagTree | null)[][] = []
    for (let i = 0; i < Math.max(items.length, 1); i += TAGS_PER_PAGE) {
      const page: (TagTree | null)[] = [...items.slice(i, i + TAGS_PER_PAGE)]
      while (page.length < TAGS_PER_PAGE) page.push(null)
      pages.push(page)
    }
    return pages
  }

  const frontPages = paginate(trees)
  const backPages  = paginate(trees)
  const totalSheets = frontPages.length

  return (
    <>
      <style>{PRINT_STYLES}</style>

      {/* Controls */}
      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 50, background: G, color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
        <div>
          <p style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>QR Tags</p>
          <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '3px 0 0' }}>
            {trees.length} tag{trees.length !== 1 ? 's' : ''} · {totalSheets} sheet{totalSheets !== 1 ? 's' : ''} · Print fronts → flip paper → print backs
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/admin')} style={{ fontFamily: 'system-ui,sans-serif', fontSize: '12px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', padding: '8px 16px', borderRadius: '999px', cursor: 'pointer' }}>
            ← Admin
          </button>
          <button onClick={() => window.print()} style={{ fontFamily: 'system-ui,sans-serif', fontSize: '13px', fontWeight: 'bold', background: P, border: 'none', color: 'white', padding: '8px 22px', borderRadius: '999px', cursor: 'pointer' }}>
            🖨 Print
          </button>
        </div>
      </div>

      {/* Duplex instructions */}
      <div className="no-print" style={{ background: '#F5F3EE', borderBottom: `1px solid ${G}18`, padding: '10px 20px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: '#666', margin: 0 }}>
          <strong>For double-sided tags:</strong> Print fronts (pages 1–{totalSheets}), flip paper on long edge, then print backs (pages {totalSheets + 1}–{totalSheets * 2})
        </p>
      </div>

      {/* Preview wrapper */}
      <div style={{ backgroundColor: '#DDD9D2', minHeight: '100vh', padding: '40px 20px' }}>

        <p className="no-print" style={{ fontFamily: 'system-ui,sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#888', textAlign: 'center', marginBottom: '16px' }}>
          FRONTS — PAGES 1–{totalSheets}
        </p>
        {frontPages.map((page, pi) => (
          <div key={`f-${pi}`} className="tag-page">
            {page.map((tree, ti) => <TagFront key={ti} tree={tree} />)}
          </div>
        ))}

        <p className="no-print" style={{ fontFamily: 'system-ui,sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#888', textAlign: 'center', margin: '32px 0 16px' }}>
          BACKS — PAGES {totalSheets + 1}–{totalSheets * 2}
        </p>
        {backPages.map((page, pi) => (
          <div key={`b-${pi}`} className="tag-page">
            {page.map((tree, ti) => <TagBack key={ti} tree={tree} origin={origin} />)}
          </div>
        ))}

      </div>
    </>
  )
}
