'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

const TAGS_PER_PAGE = 8

interface TagTree {
  id: string
  name: string
  tree_code: string | null
  image_url: string | null
}

// ─── Individual tag ───────────────────────────────────────────────────────────

function Tag({ tree, origin }: { tree: TagTree; origin: string }) {
  const qrUrl = `${origin}/tree/${tree.tree_code}`

  return (
    <div style={{
      position: 'relative',
      border: '1.5px dashed rgba(45,74,62,0.35)',
      borderRadius: '10px',
      padding: '10px 12px 10px',
      backgroundColor: '#FEFDF8',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Punch-hole circle — top center */}
      <div style={{
        position: 'absolute',
        top: '7px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '11px',
        height: '11px',
        borderRadius: '50%',
        border: '1.5px solid rgba(45,74,62,0.4)',
        backgroundColor: 'white',
      }} />

      {/* Brand row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '18px', marginBottom: '5px' }}>
        <span style={{ fontSize: '13px', lineHeight: 1 }}>🌿</span>
        <div>
          <p style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '8px',
            fontWeight: 'bold',
            color: '#2D4A3E',
            letterSpacing: '0.08em',
            lineHeight: 1,
            margin: 0,
          }}>BONSAI FLORIDA</p>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '6.5px',
            color: '#8B9E97',
            letterSpacing: '0.06em',
            lineHeight: 1,
            marginTop: '2px',
          }}>PALM BEACH, FLORIDA</p>
        </div>
      </div>

      {/* Thin rule */}
      <div style={{ width: '100%', height: '0.75px', backgroundColor: 'rgba(45,74,62,0.2)', marginBottom: '7px' }} />

      {/* Main content: tree info + QR */}
      <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'flex-start' }}>
        {/* Left: tree name + code + features */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#2D4A3E',
            lineHeight: 1.2,
            marginBottom: '3px',
            wordBreak: 'break-word',
          }}>
            {tree.name}
          </p>
          <p style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '8.5px',
            color: '#8B9E97',
            letterSpacing: '0.12em',
            marginBottom: '8px',
          }}>
            {tree.tree_code}
          </p>
          {/* Feature list */}
          <div style={{ marginTop: 'auto' }}>
            {['View Price', 'Care Guide', 'Tree Details', 'More Photos'].map(item => (
              <p key={item} style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '7px',
                color: '#6B7B73',
                lineHeight: 1.7,
                margin: 0,
              }}>
                · {item}
              </p>
            ))}
          </div>
        </div>

        {/* Right: QR code */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <QRCodeSVG
            value={qrUrl}
            size={68}
            level="M"
            bgColor="transparent"
            fgColor="#2D4A3E"
          />
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '6px',
            color: '#9CA3AF',
            textAlign: 'center',
          }}>
            Scan to view
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptySlot() {
  return (
    <div style={{
      border: '1px dashed rgba(45,74,62,0.15)',
      borderRadius: '10px',
      backgroundColor: 'rgba(45,74,62,0.02)',
      boxSizing: 'border-box',
    }} />
  )
}

// ─── Print styles ─────────────────────────────────────────────────────────────

const PRINT_STYLES = `
  @media print {
    @page { size: letter; margin: 0.25in; }
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
      grid-template-rows: 1fr 1fr 1fr 1fr !important;
      gap: 0.1in !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .tag-page:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
  }
  @media screen {
    .tag-page {
      width: 8in;
      margin: 0 auto 0.6in;
      padding: 0.15in;
      background: white;
      box-shadow: 0 8px 40px rgba(0,0,0,0.12);
      border-radius: 8px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 2.45in);
      gap: 0.12in;
    }
  }
`

// ─── Client page ──────────────────────────────────────────────────────────────

export default function QrTagsClient({ trees }: { trees: TagTree[] }) {
  const router = useRouter()
  const [origin, setOrigin] = useState('')

  useEffect(() => { setOrigin(window.location.origin) }, [])

  // Split trees into pages of 8, padding each page with nulls
  const pages: (TagTree | null)[][] = []
  for (let i = 0; i < Math.max(trees.length, 1); i += TAGS_PER_PAGE) {
    const page: (TagTree | null)[] = [...trees.slice(i, i + TAGS_PER_PAGE)]
    while (page.length < TAGS_PER_PAGE) page.push(null)
    pages.push(page)
  }

  const totalPages = pages.length

  return (
    <>
      <style>{PRINT_STYLES}</style>

      {/* Controls bar — hidden when printing */}
      <div className="no-print sticky top-0 z-50 bg-forest text-white px-5 py-3.5 flex items-center justify-between shadow-lg">
        <div>
          <p className="font-serif text-lg font-bold leading-none">QR Tags</p>
          <p className="font-sans text-xs text-white/60 mt-0.5">
            {trees.length} tag{trees.length !== 1 ? 's' : ''} · {totalPages} page{totalPages !== 1 ? 's' : ''} · US Letter
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/admin')}
            className="font-sans text-xs border border-white/30 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            ← Admin
          </button>
          <button
            onClick={() => window.print()}
            className="font-sans text-sm font-bold bg-bonsai-pink text-white px-5 py-2 rounded-full hover:bg-bonsai-pink/80 transition-colors"
          >
            🖨 Print
          </button>
        </div>
      </div>

      {/* Info strip */}
      <div className="no-print bg-cream-light border-b border-forest/10 py-3 text-center">
        <p className="font-sans text-xs text-ink-light">
          2 columns × 4 rows per page · 8 tags per sheet · QR links to each tree&apos;s detail page
        </p>
      </div>

      {/* Preview area */}
      <div className="no-print:py-10 bg-gray-100 min-h-screen py-10">
        {pages.map((page, pi) => (
          <div key={pi} className="tag-page">
            {page.map((tree, ti) =>
              tree
                ? <Tag key={`${pi}-${ti}`} tree={tree} origin={origin} />
                : <EmptySlot key={`${pi}-${ti}`} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
