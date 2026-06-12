'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

const TAGS_PER_PAGE = 50  // 10 cols × 5 rows on letter

interface TagTree {
  id: string
  name: string
  tree_code: string | null
  image_url: string | null
  species?: string | null
}

const G = '#2A4538'
const P = '#C0426A'

// ─── Single tag: 0.7in × 2in portrait ────────────────────────────────────────
function Tag({ tree, logoUrl, origin }: { tree: TagTree | null; logoUrl: string | null; origin: string }) {
  if (!tree || !tree.tree_code) {
    return (
      <div style={{
        width: '0.7in', height: '2in',
        border: '0.5px dashed #CCC',
        backgroundColor: 'white',
        boxSizing: 'border-box',
      }} />
    )
  }

  const qrUrl = `${origin}/tree/${tree.tree_code}`
  const logoSrc = logoUrl ?? '/logo.png'
  const nameFontSize = tree.name.length > 14 ? '5.5px' : tree.name.length > 10 ? '7px' : '8.5px'

  return (
    <div style={{
      width: '0.7in', height: '2in',
      border: '0.5px dashed #999',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '5px 3px 5px',
      overflow: 'hidden',
    }}>

      {/* Top: logo + ornament */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', width: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="Bonsai Florida"
          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg' }}
          style={{ width: '80%', height: '20px', objectFit: 'contain', display: 'block' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '85%' }}>
          <div style={{ flex: 1, height: '0.5px', backgroundColor: P }} />
          <span style={{ color: P, fontSize: '7px', lineHeight: 1 }}>✿</span>
          <div style={{ flex: 1, height: '0.5px', backgroundColor: P }} />
        </div>
      </div>

      {/* Middle: QR code */}
      <QRCodeSVG value={qrUrl} size={58} level="M" bgColor="transparent" fgColor={G} />

      {/* Bottom: tree info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '85%' }}>
          <div style={{ flex: 1, height: '0.5px', backgroundColor: P }} />
          <span style={{ color: P, fontSize: '7px', lineHeight: 1 }}>✿</span>
          <div style={{ flex: 1, height: '0.5px', backgroundColor: P }} />
        </div>

        <p style={{
          fontFamily: 'Georgia,"Times New Roman",serif',
          fontSize: nameFontSize,
          fontWeight: 'bold',
          color: G,
          letterSpacing: '0.04em',
          margin: 0,
          textAlign: 'center',
          textTransform: 'uppercase',
          lineHeight: 1.2,
          wordBreak: 'break-word',
          width: '100%',
        }}>
          {tree.name}
        </p>

        <p style={{
          fontFamily: '"Courier New",Courier,monospace',
          fontSize: '6px',
          fontWeight: 'bold',
          color: `${G}90`,
          letterSpacing: '0.08em',
          margin: 0,
        }}>
          {tree.tree_code}
        </p>

        <p style={{
          fontFamily: 'system-ui,sans-serif',
          fontSize: '4.5px',
          color: `${G}55`,
          letterSpacing: '0.15em',
          margin: 0,
          textTransform: 'uppercase',
        }}>
          BONSAI FLORIDA
        </p>
      </div>

    </div>
  )
}

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_STYLES = `
  @media print {
    @page { size: letter portrait; margin: 0.5in; }
    body, body * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .preview-bg { background: white !important; padding: 0 !important; margin: 0 !important; }
    .tag-page {
      display: grid !important;
      grid-template-columns: repeat(10, 0.7in) !important;
      grid-template-rows: repeat(5, 2in) !important;
      gap: 0 !important;
      width: 7in !important;
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
      display: grid;
      grid-template-columns: repeat(10, 0.7in);
      grid-template-rows: repeat(5, 2in);
      gap: 0;
      margin: 0 auto 40px;
      background: white;
      box-shadow: 0 6px 32px rgba(0,0,0,0.12);
      border-radius: 4px;
      width: fit-content;
    }
  }
`

// ─── Main client ──────────────────────────────────────────────────────────────
export default function QrTagsClient({ trees, logoUrl }: { trees: TagTree[]; logoUrl: string | null }) {
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

  const pages = paginate(trees)
  const totalSheets = pages.length

  return (
    <>
      <style>{PRINT_STYLES}</style>

      {/* Toolbar */}
      <div className="no-print" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: G, color: 'white',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      }}>
        <div>
          <p style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>QR Tags</p>
          <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '3px 0 0' }}>
            {trees.length} tag{trees.length !== 1 ? 's' : ''} · {totalSheets} sheet{totalSheets !== 1 ? 's' : ''} · 0.7″ × 2″ · 50 per sheet
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{ fontFamily: 'system-ui,sans-serif', fontSize: '12px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', padding: '8px 16px', borderRadius: '999px', cursor: 'pointer' }}
          >
            ← Admin
          </button>
          <button
            onClick={() => window.print()}
            style={{ fontFamily: 'system-ui,sans-serif', fontSize: '13px', fontWeight: 'bold', background: P, border: 'none', color: 'white', padding: '8px 22px', borderRadius: '999px', cursor: 'pointer' }}
          >
            🖨 Print
          </button>
        </div>
      </div>

      {/* Instruction banner */}
      <div className="no-print" style={{ background: '#F5F3EE', borderBottom: `1px solid ${G}18`, padding: '10px 20px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'system-ui,sans-serif', fontSize: '11px', color: '#666', margin: 0 }}>
          Each tag is <strong>0.7″ × 2″</strong> — print, cut along the dashed lines, and stick onto your tree tags
        </p>
      </div>

      {/* Preview */}
      <div className="preview-bg" style={{ backgroundColor: '#DDD9D2', minHeight: '100vh', padding: '40px 20px' }}>
        {pages.map((page, pi) => (
          <div key={pi} className="tag-page">
            {page.map((tree, ti) => (
              <Tag key={ti} tree={tree} logoUrl={logoUrl} origin={origin} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
