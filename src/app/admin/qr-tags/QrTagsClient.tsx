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
function TagFront({ tree, logoUrl, logoSize }: { tree: TagTree | null; logoUrl: string | null; logoSize: number }) {
  if (!tree) {
    return <div style={{ border: '1px dashed #CCC', backgroundColor: 'white', boxSizing: 'border-box', height: '2.2in' }} />
  }
  const rightPct = 100 - logoSize
  const isNarrow = rightPct < 45
  const nameFontSize = isNarrow
    ? (tree.name.length > 10 ? '11px' : tree.name.length > 6 ? '14px' : '18px')
    : (tree.name.length > 20 ? '13px' : tree.name.length > 14 ? '17px' : '22px')
  const speciesFontSize = isNarrow ? '7.5px' : '9px'
  const subFontSize     = isNarrow ? '6px'   : '7.5px'
  const taglineFontSize = isNarrow ? '5px'   : '6.5px'
  const rightPad        = isNarrow ? '10px 6px 6px' : '14px 14px 8px'
  const logoSrc = logoUrl ?? '/logo.png'

  return (
    <div style={{
      position: 'relative', backgroundColor: 'white',
      border: '1px dashed #999',
      boxSizing: 'border-box', padding: '0',
      display: 'flex', flexDirection: 'row', alignItems: 'stretch',
      overflow: 'hidden', width: '100%', height: '2.2in',
    }}>
      <PunchHole />

      {/* Left: brand logo panel — width controlled by logoSize slider */}
      <div style={{
        flexShrink: 0, width: `${logoSize}%`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRight: `0.75px solid ${G}18`,
        padding: '12px 8px',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="Bonsai Florida"
          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg' }}
          style={{ width: '100%', height: 'auto', maxHeight: 'calc(2.625in - 24px)', objectFit: 'contain', display: 'block' }} />
      </div>

      {/* Right: tree info */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', flex: 1, minWidth: 0, gap: '5px',
        padding: rightPad, overflow: 'hidden',
      }}>
        {/* Pink ornament */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '90%' }}>
          <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
          <span style={{ color: P, fontSize: '12px', lineHeight: 1 }}>✿</span>
          <div style={{ flex: 1, height: '0.75px', backgroundColor: P }} />
        </div>

        {/* Tree name */}
        <p style={{ fontFamily: 'Georgia,"Times New Roman",serif', fontSize: nameFontSize, fontWeight: 'bold', color: G, letterSpacing: '0.06em', margin: 0, textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.2, wordBreak: 'break-word', width: '100%' }}>
          {tree.name}
        </p>

        {/* Latin name */}
        {tree.species && (
          <p style={{ fontFamily: 'Georgia,"Times New Roman",serif', fontSize: speciesFontSize, fontStyle: 'italic', color: `${G}80`, margin: 0, textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tree.species}
          </p>
        )}

        <div style={{ width: '80%', height: '0.5px', backgroundColor: `${G}18`, margin: '2px 0' }} />

        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: subFontSize, color: `${G}60`, letterSpacing: '0.16em', margin: 0 }}>PALM BEACH, FLORIDA</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '14px', height: '0.5px', backgroundColor: `${G}40` }} />
          <span style={{ fontSize: '10px', color: G, lineHeight: 1 }}>✦</span>
          <div style={{ width: '14px', height: '0.5px', backgroundColor: `${G}40` }} />
        </div>

        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: taglineFontSize, color: `${G}60`, letterSpacing: '0.12em', margin: 0 }}>TROPICAL BEAUTY. TIMELESS ART.</p>
      </div>
    </div>
  )
}

// ─── Tag BACK (landscape) — matches reference ─────────────────────────────────
function TagBack({ tree, origin }: { tree: TagTree | null; origin: string }) {
  if (!tree || !tree.tree_code) {
    return <div style={{ border: '1px dashed #CCC', backgroundColor: 'white', boxSizing: 'border-box', height: '2.2in' }} />
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
      boxSizing: 'border-box', padding: '14px 16px 6px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '3px', overflow: 'hidden', width: '100%', height: '2.2in',
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
    @page { size: letter portrait; margin: 0.5in 0.5in 0.75in 0.5in; }
    body, body * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .preview-bg { background: white !important; padding: 0 !important; margin: 0 !important; }
    .tag-page {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      grid-template-rows: repeat(4, 2.2in) !important;
      gap: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      background: white !important;
      overflow: hidden !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .tag-page:last-child { page-break-after: auto !important; break-after: auto !important; }
    .tag-page > * { overflow: hidden !important; box-sizing: border-box !important; }
  }
  @media screen {
    .tag-page {
      width: 7.5in;
      margin: 0 auto 0.5in;
      background: white;
      box-shadow: 0 6px 32px rgba(0,0,0,0.12);
      border-radius: 4px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 2.2in);
      gap: 0;
    }
    .tag-page > * {
      height: 3.2in;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
`

// ─── Main client ──────────────────────────────────────────────────────────────
export default function QrTagsClient({ trees, logoUrl }: { trees: TagTree[]; logoUrl: string | null }) {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  const [logoSize, setLogoSize] = useState(42)
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

  // Mirror left↔right columns so backs align with fronts after long-edge duplex flip
  function mirrorColumns(page: (TagTree | null)[]): (TagTree | null)[] {
    const out: (TagTree | null)[] = []
    for (let i = 0; i < page.length; i += 2) {
      out.push(page[i + 1] ?? null, page[i] ?? null)
    }
    return out
  }

  const frontPages = paginate(trees)
  const backPages  = paginate(trees).map(mirrorColumns)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo size slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>Logo</span>
            <input
              type="range" min={20} max={65} value={logoSize}
              onChange={e => setLogoSize(Number(e.target.value))}
              style={{ width: '90px', accentColor: P, cursor: 'pointer' }}
            />
            <span style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.5)', width: '30px' }}>{logoSize}%</span>
          </div>
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
      <div className="preview-bg" style={{ backgroundColor: '#DDD9D2', minHeight: '100vh', padding: '40px 20px' }}>

        <p className="no-print" style={{ fontFamily: 'system-ui,sans-serif', fontSize: '10px', letterSpacing: '0.16em', color: '#888', textAlign: 'center', marginBottom: '16px' }}>
          FRONTS — PAGES 1–{totalSheets}
        </p>
        {frontPages.map((page, pi) => (
          <div key={`f-${pi}`} className="tag-page">
            {page.map((tree, ti) => <TagFront key={ti} tree={tree} logoUrl={logoUrl} logoSize={logoSize} />)}
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
