'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/siteConfig'
import { useVisitList } from '@/hooks/useVisitList'
import VisitListDrawer from '@/components/VisitListDrawer'

export default function StickyMobileCTA() {
  const { count } = useVisitList()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-forest/10 px-4 py-3 flex gap-2.5 safe-area-bottom">
        <a
          href={siteConfig.bookingUrl}
          className="btn-primary flex-1 justify-center text-sm py-3 min-h-[48px]"
        >
          Text to Book
        </a>
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative btn-secondary px-4 py-3 min-h-[48px] min-w-[48px] justify-center flex-shrink-0"
          aria-label={`View visit list (${count} saved)`}
        >
          <span className="text-base">♡</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-bonsai-pink text-white font-sans text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      <VisitListDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
